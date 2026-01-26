-- Migration: Create events table
-- This table stores all event information for the agenda page

-- Create events table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  time_range TEXT, -- Alternative: store as string like "18:30-23:00"
  location TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT events_pkey PRIMARY KEY (id)
);

-- Create index on event_date for faster queries
CREATE INDEX IF NOT EXISTS idx_events_event_date ON public.events(event_date);

-- Create index on is_active for filtering active events
CREATE INDEX IF NOT EXISTS idx_events_is_active ON public.events(is_active);

-- Add comments for documentation
COMMENT ON TABLE public.events IS 'Tabel voor het opslaan van evenementen voor de agenda pagina';
COMMENT ON COLUMN public.events.title IS 'Titel van het evenement';
COMMENT ON COLUMN public.events.event_date IS 'Datum van het evenement';
COMMENT ON COLUMN public.events.start_time IS 'Starttijd van het evenement';
COMMENT ON COLUMN public.events.end_time IS 'Eindtijd van het evenement';
COMMENT ON COLUMN public.events.time_range IS 'Tijdsbereik als string (alternatief voor start_time/end_time)';
COMMENT ON COLUMN public.events.location IS 'Locatie van het evenement';
COMMENT ON COLUMN public.events.description IS 'Beschrijving van het evenement';
COMMENT ON COLUMN public.events.is_active IS 'Of het evenement actief is en getoond moet worden';

-- Enable Row Level Security (RLS)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policy: Everyone can read active events
CREATE POLICY "Anyone can view active events"
  ON public.events
  FOR SELECT
  USING (is_active = true);

-- Create policy: Authenticated users can view all events (including inactive)
CREATE POLICY "Authenticated users can view all events"
  ON public.events
  FOR SELECT
  TO authenticated
  USING (true);

