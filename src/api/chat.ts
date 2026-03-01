import { supabase } from '@/lib/supabase';
import type { ChatRoom, ChatMessage } from '@/data/types';

export async function fetchChatRooms(): Promise<ChatRoom[]> {
  const { data, error } = await supabase
    .from('chat_rooms')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return (data as ChatRoom[]) ?? [];
}

export async function fetchChatMessages(roomId: string, limit = 50): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select(`
      *,
      profiles:user_id (id, username, display_name, avatar_color)
    `)
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  // Reverse to get chronological order (oldest first)
  return ((data as ChatMessage[]) ?? []).reverse();
}

export async function fetchOlderMessages(roomId: string, beforeDate: string, limit = 30): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select(`
      *,
      profiles:user_id (id, username, display_name, avatar_color)
    `)
    .eq('room_id', roomId)
    .lt('created_at', beforeDate)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return ((data as ChatMessage[]) ?? []).reverse();
}

export async function sendChatMessage(roomId: string, content: string): Promise<ChatMessage> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in to send messages');

  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      room_id: roomId,
      user_id: user.id,
      content: content.trim(),
    })
    .select(`
      *,
      profiles:user_id (id, username, display_name, avatar_color)
    `)
    .single();

  if (error) {
    if (error.message.includes('Rate limit')) {
      throw new Error('Slow down! Wait 5 seconds between messages');
    }
    throw new Error(error.message);
  }
  return data as ChatMessage;
}

export async function deleteChatMessage(messageId: string): Promise<void> {
  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .eq('id', messageId);

  if (error) throw new Error(error.message);
}

export async function fetchTotalMembers(): Promise<number> {
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (error) return 0;
  return count ?? 0;
}

