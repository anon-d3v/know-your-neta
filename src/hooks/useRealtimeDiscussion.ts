import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { discussionKeys } from '@/lib/queryKeys';

export function useRealtimeDiscussion(mpSlug: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!mpSlug) return;

    const channel = supabase
      .channel(`discussions:${mpSlug}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'discussions',
          filter: `mp_slug=eq.${mpSlug}`,
        },
        (_payload) => {
          // Invalidate and refetch on any change
          queryClient.invalidateQueries({ queryKey: discussionKeys.byMp(mpSlug) });
          queryClient.invalidateQueries({ queryKey: discussionKeys.count(mpSlug) });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mpSlug, queryClient]);
}
