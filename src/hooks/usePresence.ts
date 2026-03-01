import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

/**
 * Observe the live presence count for a chat room.
 * Used in RoomCard to show how many users currently have the room open.
 */
export function usePresenceCount(roomId: string): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!roomId) return;

    const channel = supabase.channel(`presence:${roomId}`);

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setCount(Object.keys(state).length);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  return count;
}

/**
 * Track the current user's presence in a chat room.
 * Used in ChatRoom — marks the user as "in chat" while the room is open.
 * On unmount (user leaves room), presence is automatically removed.
 */
export function usePresenceTrack(roomId: string): void {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);

  useEffect(() => {
    if (!roomId || !user) return;

    const channel = supabase.channel(`presence:${roomId}`);
    const userData = {
      user_id: user.id,
      username: profile?.display_name || profile?.username || 'anon',
    };

    // If channel is already subscribed (by RoomList), just track directly.
    // Otherwise subscribe first, then track.
    const channelState = (channel as any).state;
    if (channelState === 'joined') {
      channel.track(userData);
    } else {
      channel
        .on('presence', { event: 'sync' }, () => {
          // Sync handled by RoomList's usePresenceCount
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track(userData);
          }
        });
    }

    return () => {
      channel.untrack();
      // Don't removeChannel here — RoomList may still be observing
    };
  }, [roomId, user?.id]);
}
