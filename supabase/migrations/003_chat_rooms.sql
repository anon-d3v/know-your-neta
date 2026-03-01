-- Create chat rooms table
CREATE TABLE public.chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('general', 'topic', 'mp')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;

-- Anyone can read active chat rooms
CREATE POLICY "Chat rooms are publicly readable"
  ON public.chat_rooms FOR SELECT
  USING (is_active = true);

-- Only service role can manage chat rooms (no insert/update/delete for users)

-- Seed default rooms
INSERT INTO public.chat_rooms (name, slug, description, type) VALUES
  ('General', 'general', 'General discussion about Indian politics', 'general'),
  ('Parliament Watch', 'parliament-watch', 'Discuss ongoing parliament sessions and bills', 'topic'),
  ('Accountability', 'accountability', 'Hold MPs accountable — discuss their performance', 'topic');
