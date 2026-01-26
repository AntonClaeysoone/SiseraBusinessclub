-- Migration: Add geboortedatum column to business_club_customers table
-- This column stores the user's birth date

-- Add geboortedatum column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'business_club_customers' 
    AND column_name = 'geboortedatum'
  ) THEN
    ALTER TABLE public.business_club_customers 
    ADD COLUMN geboortedatum DATE NULL;
    
    -- Add comment for documentation
    COMMENT ON COLUMN public.business_club_customers.geboortedatum IS 'Geboortedatum van de gebruiker';
  END IF;
END $$;

