import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { chatKeys } from '@/lib/queryKeys';
import type { ChatMessage } from '@/data/types';

export function useRealtimeChat(roomId: string) {
  const queryClient = useQueryClient();

  const handleNewMessage = useCallback(
    (payload: { new: Record<string, unknown> }) => {
      // Fetch the full message with profile data by invalidating
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(roomId) });
    },
    [roomId, queryClient]
  );

  const handleDeletedMessage = useCallback(
    (payload: { old: Record<string, unknown> }) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(roomId) });
    },
    [roomId, queryClient]
  );

  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`chat:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        handleNewMessage
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        handleDeletedMessage
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, handleNewMessage, handleDeletedMessage]);
}
