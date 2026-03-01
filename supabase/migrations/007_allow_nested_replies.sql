-- Remove the 1-level nesting restriction to allow Reddit-style threaded discussions
DROP TRIGGER IF EXISTS enforce_discussion_nesting ON public.discussions;
DROP FUNCTION IF EXISTS public.check_discussion_nesting();
