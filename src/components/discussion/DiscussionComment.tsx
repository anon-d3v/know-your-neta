import React, { useState } from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { useDeleteDiscussion } from '@/hooks/useDiscussions';
import { CommentInput } from './CommentInput';
import type { CommentNode } from './DiscussionThread';

const THREAD_COLORS = [
  '#818CF8',
  '#34D399',
  '#FBBF24',
  '#F472B6',
  '#22D3EE',
];

const MAX_DEPTH = 5;

interface DiscussionCommentProps {
  node: CommentNode;
  mpSlug: string;
  depth: number;
}

export function DiscussionComment({ node, mpSlug, depth }: DiscussionCommentProps) {
  const { comment, replies, replyCount } = node;
  const [collapsed, setCollapsed] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const user = useAuthStore((s) => s.user);
  const { mutateAsync: deleteComment } = useDeleteDiscussion();
  const isOwner = user?.id === comment.user_id;
  const profile = comment.profiles;
  const timeAgo = getTimeAgo(comment.created_at);
  const threadColor = THREAD_COLORS[depth % THREAD_COLORS.length];

  const handleDelete = () => {
    Alert.alert('Delete Comment', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteComment({ discussionId: comment.id, mpSlug }),
      },
    ]);
  };

  const isRoot = depth === 0;

  return (
    <View style={[
      isRoot && s.rootCard,
      !isRoot && { marginTop: 2 },
    ]}>
      <View style={s.row}>
        {/* Thread line — only for nested comments */}
        {!isRoot && (
          <Pressable onPress={() => setCollapsed(!collapsed)} style={s.threadLineWrap}>
            <View style={[
              s.threadLine,
              { backgroundColor: collapsed ? 'rgba(255,255,255,0.06)' : threadColor + '30' },
            ]} />
          </Pressable>
        )}

        <View style={s.body}>
          {/* Header */}
          <Pressable onPress={() => setCollapsed(!collapsed)} style={s.header}>
            <View style={[s.avatar, { backgroundColor: profile?.avatar_color || '#818CF8' }]}>
              <Text style={s.avatarText}>
                {(profile?.username || '?')[0].toUpperCase()}
              </Text>
            </View>
            <Text style={s.username}>
              {profile?.display_name || profile?.username || 'Unknown'}
            </Text>
            <Text style={s.dot}>&middot;</Text>
            <Text style={s.time}>{timeAgo}</Text>
            {collapsed && replyCount > 0 && (
              <View style={s.collapsedBadge}>
                <Text style={s.collapsedText}>+{replyCount}</Text>
              </View>
            )}
            {collapsed && (
              <Ionicons name="chevron-down" size={12} color="rgba(255,255,255,0.2)" style={{ marginLeft: 4 }} />
            )}
          </Pressable>

          {!collapsed && (
            <>
              {/* Content */}
              <Text style={s.content}>{comment.content}</Text>

              {/* Actions */}
              <View style={s.actions}>
                {user && (
                  <Pressable onPress={() => setShowReplyInput(!showReplyInput)} style={s.actionBtn}>
                    <Ionicons
                      name="chatbubble-outline"
                      size={11}
                      color={showReplyInput ? '#818CF8' : 'rgba(255,255,255,0.2)'}
                    />
                    <Text style={[s.actionText, showReplyInput && { color: '#818CF8' }]}>Reply</Text>
                  </Pressable>
                )}
                {isOwner && (
                  <Pressable onPress={handleDelete} style={s.actionBtn}>
                    <Ionicons name="trash-outline" size={11} color="rgba(248,113,113,0.45)" />
                    <Text style={[s.actionText, { color: 'rgba(248,113,113,0.45)' }]}>Delete</Text>
                  </Pressable>
                )}
                {replies.length > 0 && (
                  <Pressable onPress={() => setCollapsed(true)} style={[s.actionBtn, { marginLeft: 'auto' }]}>
                    <Text style={s.replyCount}>
                      {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                    </Text>
                  </Pressable>
                )}
              </View>

              {/* Reply input */}
              {showReplyInput && (
                <View style={s.replyInputWrap}>
                  <CommentInput
                    mpSlug={mpSlug}
                    parentId={comment.id}
                    placeholder="Write a reply..."
                    onSubmit={() => setShowReplyInput(false)}
                  />
                </View>
              )}

              {/* Nested replies */}
              {replies.map((child) => (
                <DiscussionComment
                  key={child.comment.id}
                  node={child}
                  mpSlug={mpSlug}
                  depth={Math.min(depth + 1, MAX_DEPTH)}
                />
              ))}
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  rootCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
  },
  threadLineWrap: {
    width: 18,
    alignItems: 'center',
    paddingTop: 6,
  },
  threadLine: {
    width: 2,
    flex: 1,
    borderRadius: 1,
  },
  body: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  username: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  dot: {
    color: 'rgba(255,255,255,0.15)',
    fontSize: 10,
    marginHorizontal: 5,
  },
  time: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 11,
  },
  collapsedBadge: {
    backgroundColor: 'rgba(129,140,248,0.1)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 8,
  },
  collapsedText: {
    color: 'rgba(129,140,248,0.6)',
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingRight: 14,
  },
  actionText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 4,
  },
  replyCount: {
    color: 'rgba(255,255,255,0.12)',
    fontSize: 10,
  },
  replyInputWrap: {
    marginTop: 6,
    marginBottom: 4,
  },
});

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  return `${Math.floor(months / 12)}y`;
}
