-- Create discussions table for MP-specific threaded comments
CREATE TABLE public.discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mp_slug TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT content_length CHECK (char_length(content) BETWEEN 1 AND 2000)
);

-- Indexes for common queries
CREATE INDEX idx_discussions_mp_slug ON public.discussions(mp_slug, created_at DESC);
CREATE INDEX idx_discussions_parent ON public.discussions(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX idx_discussions_user ON public.discussions(user_id);

-- Enable RLS
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;

-- Anyone can read non-deleted discussions
CREATE POLICY "Discussions are publicly readable"
  ON public.discussions FOR SELECT
  USING (is_deleted = false);

-- Authenticated users can insert discussions
CREATE POLICY "Authenticated users can post discussions"
  ON public.discussions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND auth.uid() IS NOT NULL
  );

-- Users can soft-delete their own discussions
CREATE POLICY "Users can update own discussions"
  ON public.discussions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enforce max 1-level nesting (replies can't have replies)
CREATE OR REPLACE FUNCTION public.check_discussion_nesting()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_id IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.discussions 
      WHERE id = NEW.parent_id AND parent_id IS NOT NULL
    ) THEN
      RAISE EXCEPTION 'Replies to replies are not allowed (max 1-level nesting)';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_discussion_nesting
  BEFORE INSERT ON public.discussions
  FOR EACH ROW
  EXECUTE FUNCTION public.check_discussion_nesting();

-- Rate limiting: max 1 discussion per user per 30 seconds
CREATE OR REPLACE FUNCTION public.check_discussion_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.discussions
    WHERE user_id = NEW.user_id
    AND created_at > NOW() - INTERVAL '30 seconds'
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
  ) THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait 30 seconds between posts.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_discussion_rate_limit
  BEFORE INSERT ON public.discussions
  FOR EACH ROW
  EXECUTE FUNCTION public.check_discussion_rate_limit();

-- Apply updated_at trigger
CREATE TRIGGER on_discussions_updated
  BEFORE UPDATE ON public.discussions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable realtime for discussions
ALTER PUBLICATION supabase_realtime ADD TABLE public.discussions;
