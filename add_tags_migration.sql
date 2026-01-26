-- Migration: Add tags column to business_club_customers table
-- This column stores an array of tags that users can assign to themselves

-- Add tags column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'business_club_customers' 
    AND column_name = 'tags'
  ) THEN
    ALTER TABLE public.business_club_customers 
    ADD COLUMN tags TEXT[] DEFAULT ARRAY[]::TEXT[];
    
    -- Add comment for documentation
    COMMENT ON COLUMN public.business_club_customers.tags IS 'Array van tags die de gebruiker aan zichzelf kan toewijzen';
  END IF;
END $$;

