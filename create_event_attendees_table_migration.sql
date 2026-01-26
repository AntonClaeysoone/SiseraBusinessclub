-- Migration: Create event_attendees table
-- This table stores which users are attending which events

-- Create event_attendees table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.event_attendees (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT event_attendees_pkey PRIMARY KEY (id),
  CONSTRAINT event_attendees_unique UNIQUE (event_id, user_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON public.event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user_id ON public.event_attendees(user_id);

-- Add comments for documentation
COMMENT ON TABLE public.event_attendees IS 'Tabel voor het bijhouden van welke gebruikers aanwezig zijn bij welke evenementen';
COMMENT ON COLUMN public.event_attendees.event_id IS 'ID van het evenement';
COMMENT ON COLUMN public.event_attendees.user_id IS 'ID van de gebruiker die aanwezig is';

-- Enable Row Level Security (RLS)
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

-- Create policy: Anyone can view attendees
CREATE POLICY "Anyone can view event attendees"
  ON public.event_attendees
  FOR SELECT
  USING (true);

-- Create policy: Authenticated users can add themselves as attendees
CREATE POLICY "Authenticated users can register for events"
  ON public.event_attendees
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can remove their own attendance
CREATE POLICY "Users can remove their own attendance"
  ON public.event_attendees
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

