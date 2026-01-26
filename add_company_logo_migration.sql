-- Migration: Add company_logo_url column to business_club_customers table
-- This column stores the URL to the company logo image

-- Add company_logo_url column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'business_club_customers' 
    AND column_name = 'company_logo_url'
  ) THEN
    ALTER TABLE public.business_club_customers 
    ADD COLUMN company_logo_url TEXT NULL;
    
    -- Add comment for documentation
    COMMENT ON COLUMN public.business_club_customers.company_logo_url IS 'URL naar het bedrijfslogo';
  END IF;
END $$;

