-- Function to check username availability (can be called via RPC)
CREATE OR REPLACE FUNCTION public.is_username_available(desired_username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE username = lower(desired_username)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get discussion count for an MP
CREATE OR REPLACE FUNCTION public.get_discussion_count(slug TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) FROM public.discussions
    WHERE mp_slug = slug AND is_deleted = false AND parent_id IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get online user count in a chat room (approximate via recent messages)
CREATE OR REPLACE FUNCTION public.get_room_active_users(target_room_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(DISTINCT user_id) FROM public.chat_messages
    WHERE room_id = target_room_id
    AND created_at > NOW() - INTERVAL '5 minutes'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
