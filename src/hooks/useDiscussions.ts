import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { discussionKeys } from '@/lib/queryKeys';
import { fetchDiscussions, createDiscussion, softDeleteDiscussion, fetchDiscussionCount } from '@/api/discussions';
import type { CreateDiscussionParams } from '@/api/discussions';

export function useDiscussions(mpSlug: string) {
  return useQuery({
    queryKey: discussionKeys.byMp(mpSlug),
    queryFn: () => fetchDiscussions(mpSlug),
    staleTime: 30_000, // 30 seconds
    enabled: !!mpSlug,
  });
}

export function useDiscussionCount(mpSlug: string) {
  return useQuery({
    queryKey: discussionKeys.count(mpSlug),
    queryFn: () => fetchDiscussionCount(mpSlug),
    staleTime: 60_000, // 1 minute
    enabled: !!mpSlug,
  });
}

export function useCreateDiscussion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateDiscussionParams) => createDiscussion(params),
    onSuccess: (_data, variables) => {
      // Invalidate discussions for this MP
      queryClient.invalidateQueries({ queryKey: discussionKeys.byMp(variables.mpSlug) });
      queryClient.invalidateQueries({ queryKey: discussionKeys.count(variables.mpSlug) });
    },
  });
}

export function useDeleteDiscussion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { discussionId: string; mpSlug: string }) =>
      softDeleteDiscussion(params.discussionId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: discussionKeys.byMp(variables.mpSlug) });
      queryClient.invalidateQueries({ queryKey: discussionKeys.count(variables.mpSlug) });
    },
  });
}
