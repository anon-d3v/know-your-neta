import React, { useRef, useEffect, useCallback, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useChatMessages, useDeleteMessage } from '@/hooks/useChat';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { usePresenceTrack } from '@/hooks/usePresence';
import { useAuthStore } from '@/store/authStore';
import { AuthGuard } from '@/components/auth';
import { ChatInput } from './ChatInput';
import { ChatMessageBubble } from './ChatMessage';
import type { ChatMessage } from '@/data/types';

interface ChatRoomProps {
  roomId: string;
  roomName?: string;
}

function isSameDay(a: string, b: string) {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

function formatDateLabel(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(dateString, now.toISOString())) return 'Today';
  if (isSameDay(dateString, yesterday.toISOString())) return 'Yesterday';

  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function ChatRoom({ roomId, roomName }: ChatRoomProps) {
  const { data: messages, isLoading, error } = useChatMessages(roomId);
  const { mutateAsync: deleteMsg } = useDeleteMessage();
  const user = useAuthStore((s) => s.user);
  const flatListRef = useRef<FlatList>(null);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);

  useRealtimeChat(roomId);
  usePresenceTrack(roomId);

  useEffect(() => {
    if (messages && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages?.length]);

  const handleDelete = useCallback(
    (messageId: string) => {
      Alert.alert('Delete Message', 'Delete this message?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMsg({ messageId, roomId }),
        },
      ]);
    },
    [roomId, deleteMsg]
  );

  const handleReply = useCallback((message: ChatMessage) => {
    setReplyTo(message);
  }, []);

  const shouldShowName = (index: number, msg: ChatMessage) => {
    if (!messages) return true;
    if (index === 0) return true;
    return messages[index - 1].user_id !== msg.user_id;
  };

  const shouldShowDateSeparator = (index: number, msg: ChatMessage) => {
    if (!messages) return false;
    if (index === 0) return true;
    return !isSameDay(messages[index - 1].created_at, msg.created_at);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#171717' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
      >
      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#818CF8" size="small" />
        </View>
      ) : error ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          <Text style={{ color: 'rgba(248,113,113,0.5)', fontSize: 13, fontFamily: 'monospace', textAlign: 'center' }}>
            Failed to load messages
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View>
              {shouldShowDateSeparator(index, item) && (
                <View style={{
                  alignItems: 'center',
                  paddingVertical: 16,
                }}>
                  <View style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    paddingHorizontal: 14,
                    paddingVertical: 5,
                    borderRadius: 12,
                  }}>
                    <Text style={{
                      color: 'rgba(255,255,255,0.35)',
                      fontSize: 11,
                      fontWeight: '500',
                    }}>
                      {formatDateLabel(item.created_at)}
                    </Text>
                  </View>
                </View>
              )}
              <ChatMessageBubble
                message={item}
                onDelete={user?.id === item.user_id ? handleDelete : undefined}
                onReply={handleReply}
                showName={shouldShowName(index, item)}
                allMessages={messages}
              />
            </View>
          )}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 4 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 80 }}>
              <Text style={{ color: 'rgba(255,255,255,0.1)', fontSize: 13, fontFamily: 'monospace', textAlign: 'center', lineHeight: 20 }}>
                no messages yet{'\n'}start the conversation
              </Text>
            </View>
          }
        />
      )}

      <AuthGuard message="Sign in to join the chat">
        <ChatInput
          roomId={roomId}
          replyTo={replyTo}
          onClearReply={() => setReplyTo(null)}
        />
      </AuthGuard>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}
