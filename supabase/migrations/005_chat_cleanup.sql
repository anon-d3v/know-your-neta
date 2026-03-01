-- Function to clean up old chat messages (keep last 7 days)
-- This should be called via pg_cron or manually
CREATE OR REPLACE FUNCTION public.cleanup_old_chat_messages()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.chat_messages
  WHERE created_at < NOW() - INTERVAL '7 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- If pg_cron extension is available (Supabase free tier includes it),
-- schedule daily cleanup at 3:00 AM UTC
-- NOTE: Run this separately if pg_cron is enabled on your Supabase instance:
-- SELECT cron.schedule('cleanup-chat-messages', '0 3 * * *', 'SELECT public.cleanup_old_chat_messages()');
