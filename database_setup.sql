-- Migration script for business_club_customers table
-- Handles both new installations and existing tables

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own customer record" ON public.business_club_customers;
DROP POLICY IF EXISTS "Users can update own customer record" ON public.business_club_customers;
DROP POLICY IF EXISTS "System can insert customer records" ON public.business_club_customers;

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create or alter table
DO $$
BEGIN
  -- If table doesn't exist, create it
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'business_club_customers'
  ) THEN
    CREATE TABLE public.business_club_customers (
      id UUID NOT NULL DEFAULT gen_random_uuid(),
      auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
      name TEXT,
      email TEXT,
      phone TEXT,
      company TEXT,
      website TEXT,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT business_club_customers_pkey PRIMARY KEY (id)
    );
  ELSE
    -- Table exists, add missing columns
    -- Add auth_user_id if missing
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'business_club_customers' 
      AND column_name = 'auth_user_id'
    ) THEN
      ALTER TABLE public.business_club_customers 
      ADD COLUMN auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
      
      CREATE UNIQUE INDEX IF NOT EXISTS business_club_customers_auth_user_id_unique 
      ON public.business_club_customers(auth_user_id);
    END IF;
    
    -- Add email if missing
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'business_club_customers' 
      AND column_name = 'email'
    ) THEN
      ALTER TABLE public.business_club_customers 
      ADD COLUMN email TEXT;
    END IF;
    
    -- Add name if missing
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'business_club_customers' 
      AND column_name = 'name'
    ) THEN
      ALTER TABLE public.business_club_customers 
      ADD COLUMN name TEXT;
    END IF;
    
    -- Add phone if missing
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'business_club_customers' 
      AND column_name = 'phone'
    ) THEN
      ALTER TABLE public.business_club_customers 
      ADD COLUMN phone TEXT;
    END IF;
    
    -- Add company if missing
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'business_club_customers' 
      AND column_name = 'company'
    ) THEN
      ALTER TABLE public.business_club_customers 
      ADD COLUMN company TEXT;
    END IF;
    
    -- Add website if missing
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'business_club_customers' 
      AND column_name = 'website'
    ) THEN
      ALTER TABLE public.business_club_customers 
      ADD COLUMN website TEXT;
    END IF;
    
    -- Add description if missing
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'business_club_customers' 
      AND column_name = 'description'
    ) THEN
      ALTER TABLE public.business_club_customers 
      ADD COLUMN description TEXT;
    END IF;
    
    -- Add created_at if missing
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'business_club_customers' 
      AND column_name = 'created_at'
    ) THEN
      ALTER TABLE public.business_club_customers 
      ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add updated_at if missing
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'business_club_customers' 
      AND column_name = 'updated_at'
    ) THEN
      ALTER TABLE public.business_club_customers 
      ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_business_club_customers_auth_user_id 
ON public.business_club_customers USING btree (auth_user_id);

CREATE INDEX IF NOT EXISTS idx_business_club_customers_email 
ON public.business_club_customers USING btree (email);

-- Enable Row Level Security
ALTER TABLE public.business_club_customers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own customer record"
ON public.business_club_customers
FOR SELECT
USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own customer record"
ON public.business_club_customers
FOR UPDATE
USING (auth.uid() = auth_user_id);

CREATE POLICY "System can insert customer records"
ON public.business_club_customers
FOR INSERT
WITH CHECK (true);

-- Function to automatically create customer record when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.business_club_customers (
    auth_user_id,
    company_name,
    store,
    email,
    name,
    vertegenwoordiger,
    factuur,
    fa_ontv,
    tegoeden,
    saldo,
    opgebruikt
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'company_name',
      NEW.raw_user_meta_data->>'company',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    COALESCE(NEW.raw_user_meta_data->>'store', 'sisera'),
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      ''
    ),
    NEW.raw_user_meta_data->>'vertegenwoordiger',
    0.00,
    false,
    0.00,
    0.00,
    0.00
  )
  ON CONFLICT (auth_user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update business_club_transactions foreign key if needed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'business_club_transactions_customer_id_fkey'
  ) THEN
    ALTER TABLE public.business_club_transactions
    ADD CONSTRAINT business_club_transactions_customer_id_fkey 
    FOREIGN KEY (customer_id) 
    REFERENCES public.business_club_customers(id) 
    ON DELETE CASCADE;
  END IF;
END $$;

-- Create balance calculation function
CREATE OR REPLACE FUNCTION public.get_customer_balance(customer_uuid UUID)
RETURNS NUMERIC(10, 2) AS $$
DECLARE
  total_credit NUMERIC(10, 2) := 0;
BEGIN
  SELECT COALESCE(SUM(
    CASE 
      WHEN type = 'credit' THEN amount
      WHEN type = 'sale' THEN -amount
      WHEN type = 'refund' THEN amount
      WHEN type = 'invoice' THEN -amount
      ELSE 0
    END
  ), 0) INTO total_credit
  FROM public.business_club_transactions
  WHERE customer_id = customer_uuid;
  
  RETURN total_credit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create membership_requests table
CREATE TABLE IF NOT EXISTS public.membership_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT NOT NULL,
  website TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT membership_requests_pkey PRIMARY KEY (id)
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_membership_requests_email 
ON public.membership_requests USING btree (email);

-- Create index on status
CREATE INDEX IF NOT EXISTS idx_membership_requests_status 
ON public.membership_requests USING btree (status);

-- Enable Row Level Security
ALTER TABLE public.membership_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert membership requests
CREATE POLICY "Anyone can insert membership requests"
ON public.membership_requests
FOR INSERT
WITH CHECK (true);

-- Create policy to allow authenticated users to view all requests (for admin purposes)
CREATE POLICY "Authenticated users can view membership requests"
ON public.membership_requests
FOR SELECT
USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.business_club_customers TO authenticated;
GRANT SELECT ON public.business_club_transactions TO authenticated;
GRANT INSERT ON public.membership_requests TO anon, authenticated;
GRANT SELECT ON public.membership_requests TO authenticated;

