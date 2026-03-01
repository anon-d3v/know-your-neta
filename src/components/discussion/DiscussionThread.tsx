import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDiscussions } from '@/hooks/useDiscussions';
import { useRealtimeDiscussion } from '@/hooks/useRealtimeDiscussion';
import { AuthGuard } from '@/components/auth';
import { CommentInput } from './CommentInput';
import { DiscussionComment } from './DiscussionComment';
import { colors } from '@/theme/colors';
import type { Discussion } from '@/data/types';

export interface CommentNode {
  comment: Discussion;
  replies: CommentNode[];
  replyCount: number;
}

type SortMode = 'newest' | 'oldest';

function buildTree(discussions: Discussion[], sort: SortMode): CommentNode[] {
  const byId = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  for (const d of discussions) {
    byId.set(d.id, { comment: d, replies: [], replyCount: 0 });
  }

  for (const d of discussions) {
    const node = byId.get(d.id)!;
    if (d.parent_id && byId.has(d.parent_id)) {
      byId.get(d.parent_id)!.replies.push(node);
    } else {
      roots.push(node);
    }
  }

  function countReplies(node: CommentNode): number {
    let count = node.replies.length;
    for (const r of node.replies) count += countReplies(r);
    node.replyCount = count;
    return count;
  }

  function sortReplies(node: CommentNode) {
    node.replies.sort((a, b) =>
      new Date(a.comment.created_at).getTime() - new Date(b.comment.created_at).getTime()
    );
    node.replies.forEach(sortReplies);
  }

  roots.forEach(countReplies);
  roots.forEach(sortReplies);

  roots.sort((a, b) => {
    const tA = new Date(a.comment.created_at).getTime();
    const tB = new Date(b.comment.created_at).getTime();
    return sort === 'newest' ? tB - tA : tA - tB;
  });

  return roots;
}

interface DiscussionThreadProps {
  mpSlug: string;
  mpName?: string;
}

export function DiscussionThread({ mpSlug, mpName }: DiscussionThreadProps) {
  const { data: discussions, isLoading, error } = useDiscussions(mpSlug);
  const [sort, setSort] = useState<SortMode>('newest');

  useRealtimeDiscussion(mpSlug);

  const threads = useMemo(() => {
    if (!discussions) return [];
    return buildTree(discussions, sort);
  }, [discussions, sort]);

  const totalComments = discussions?.length ?? 0;

  const renderThread = useCallback(({ item }: { item: CommentNode }) => (
    <DiscussionComment node={item} mpSlug={mpSlug} depth={0} />
  ), [mpSlug]);

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-white text-lg font-bold">Discussion</Text>
        {mpName && (
          <Text className="text-white/40 text-xs mt-0.5">
            About {mpName}
          </Text>
        )}
      </View>

      {/* Post input */}
      <View className="px-4 pb-3">
        <AuthGuard message="Sign in to share your views on this MP">
          <CommentInput mpSlug={mpSlug} placeholder={`What do you think about ${mpName || 'this MP'}?`} />
        </AuthGuard>
      </View>

      {/* Sort bar */}
      {totalComments > 1 && (
        <View className="flex-row items-center px-4 pb-2">
          <Text className="text-white/25 text-xs">
            {totalComments} comments
          </Text>
          <View className="flex-row ml-auto">
            {(['newest', 'oldest'] as const).map((key) => {
              const active = sort === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => setSort(key)}
                  className={`ml-1.5 px-3 py-1.5 rounded-lg ${active ? 'bg-brand-500/15' : ''}`}
                >
                  <Text
                    className={`text-xs font-semibold ${active ? 'text-brand-500' : 'text-white/25'}`}
                  >
                    {key === 'newest' ? 'New' : 'Old'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {/* Comments */}
      {isLoading ? (
        <View className="items-center py-8">
          <ActivityIndicator color={colors.primary[500]} />
        </View>
      ) : error ? (
        <View className="items-center py-8 px-4">
          <Text className="text-red-400/60 text-sm text-center">
            Failed to load discussions. Pull to retry.
          </Text>
        </View>
      ) : threads.length === 0 ? (
        <View className="items-center py-12 px-4">
          <View className="w-14 h-14 rounded-full bg-white/5 items-center justify-center mb-3">
            <Ionicons name="chatbubbles-outline" size={24} color={colors.text.muted} />
          </View>
          <Text className="text-white/40 text-sm text-center">
            No discussions yet.{'\n'}Be the first to share your thoughts!
          </Text>
        </View>
      ) : (
        <FlatList
          data={threads}
          keyExtractor={(item) => item.comment.id}
          renderItem={renderThread}
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
