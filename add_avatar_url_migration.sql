-- Migration: Add avatar_url column to business_club_customers table
-- This column stores the URL to the user's avatar/profile photo

-- Add avatar_url column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'business_club_customers' 
    AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE public.business_club_customers 
    ADD COLUMN avatar_url TEXT NULL;
    
    -- Add comment for documentation
    COMMENT ON COLUMN public.business_club_customers.avatar_url IS 'URL naar de profielfoto van de vertegenwoordiger';
  END IF;
END $$;

