import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Pressable, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSendMessage } from '@/hooks/useChat';
import type { ChatMessage } from '@/data/types';

interface ChatInputProps {
  roomId: string;
  replyTo?: ChatMessage | null;
  onClearReply?: () => void;
}

export function ChatInput({ roomId, replyTo, onClearReply }: ChatInputProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const { mutateAsync, isPending } = useSendMessage();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (replyTo) {
      inputRef.current?.focus();
    }
  }, [replyTo]);

  const handleSend = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    setError('');

    // Build message with reply context
    let finalContent = trimmed;
    if (replyTo) {
      const replyName = replyTo.profiles?.display_name || replyTo.profiles?.username || 'anon';
      // Strip any existing reply prefix — only quote the actual message body
      let rawBody = replyTo.content;
      if (rawBody.startsWith('> @')) {
        const splitIdx = rawBody.indexOf('\n\n');
        if (splitIdx !== -1) rawBody = rawBody.substring(splitIdx + 2);
      }
      const replyPreview = rawBody.replace(/\n/g, ' ').substring(0, 80);
      finalContent = `> @${replyName}: ${replyPreview}\n\n${trimmed}`;
    }

    try {
      await mutateAsync({ roomId, content: finalContent });
      setContent('');
      onClearReply?.();
    } catch (e: any) {
      setError(e.message || 'Failed to send');
    }
  };

  const canSend = content.trim().length > 0 && !isPending;
  const replyProfile = replyTo?.profiles;
  const replyName = replyProfile?.display_name || replyProfile?.username || 'anon';
  const replyColor = replyProfile?.avatar_color || '#818CF8';

  return (
    <View style={{ backgroundColor: '#171717' }}>
      {/* Reply preview bar */}
      {replyTo && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderRadius: 12,
          borderLeftWidth: 2,
          borderLeftColor: replyColor,
          marginBottom: 4,
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: replyColor, fontSize: 12, fontWeight: '600' }} numberOfLines={1}>
              {replyName}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 1 }} numberOfLines={1}>
              {replyTo.content}
            </Text>
          </View>
          <Pressable onPress={onClearReply} style={{ padding: 4, marginLeft: 8 }}>
            <Ionicons name="close" size={18} color="rgba(255,255,255,0.3)" />
          </Pressable>
        </View>
      )}

      {error ? (
        <Text style={{ color: 'rgba(248,113,113,0.7)', fontSize: 11, marginBottom: 4, marginLeft: 20 }}>
          {error}
        </Text>
      ) : null}

      <View style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 24,
        paddingLeft: 16,
        paddingRight: 4,
        paddingVertical: 4,
        marginHorizontal: 12,
        marginBottom: 14,
        marginTop: replyTo ? 4 : 8,
      }}>
        <TextInput
          ref={inputRef}
          value={content}
          onChangeText={setContent}
          placeholder="Message..."
          placeholderTextColor="rgba(255,255,255,0.2)"
          multiline
          maxLength={500}
          style={{
            flex: 1,
            color: '#fff',
            fontSize: 14,
            minHeight: 36,
            maxHeight: 100,
            paddingTop: 8,
            paddingBottom: 8,
          }}
          textAlignVertical="top"
          returnKeyType="default"
          autoCorrect
          // Emoji support: don't restrict keyboard type — default keyboard includes emoji
        />
        <Pressable
          onPress={handleSend}
          disabled={!canSend}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: canSend ? '#818CF8' : 'rgba(129,140,248,0.08)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 1,
          }}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={{ color: canSend ? '#fff' : 'rgba(255,255,255,0.15)', fontSize: 16, fontWeight: '600', marginTop: -1 }}>
              ↑
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
