import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { MPShareCard } from './MPShareCard';
import { CompareShareCard } from './CompareShareCard';
import type { ChatMessage as ChatMessageType } from '@/data/types';

function parseMPShare(content: string): string | null {
  const match = content.match(/^\[mp:([\w-]+)\]$/);
  return match ? match[1] : null;
}

function parseCompareShare(content: string): string[] | null {
  const match = content.match(/^\[compare:([\w-]+(?:,[\w-]+){1,2})\]$/);
  return match ? match[1].split(',') : null;
}

interface ChatMessageProps {
  message: ChatMessageType;
  onDelete?: (messageId: string) => void;
  onReply?: (message: ChatMessageType) => void;
  showName?: boolean;
  allMessages?: ChatMessageType[];
}

function parseReply(content: string): { replyName: string; replyText: string; body: string } | null {
  if (!content.startsWith('> @')) return null;
  const blankIdx = content.indexOf('\n\n');
  if (blankIdx === -1) return null;
  const quoteLine = content.substring(3, blankIdx); // skip "> @"
  const colonIdx = quoteLine.indexOf(': ');
  if (colonIdx === -1) return null;
  const replyName = quoteLine.substring(0, colonIdx);
  let replyText = quoteLine.substring(colonIdx + 2);
  // Strip all nested reply prefixes from the preview text
  while (replyText.startsWith('> @')) {
    const innerColon = replyText.indexOf(': ', 3);
    if (innerColon === -1) break;
    replyText = replyText.substring(innerColon + 2);
  }
  replyText = replyText.replace(/\n/g, ' ').substring(0, 80);
  // Body: everything after the first \n\n
  // If body itself starts with leaked quoted text (old format), find the last \n\n and use text after it
  let body = content.substring(blankIdx + 2);
  const lastBlankIdx = body.lastIndexOf('\n\n');
  if (lastBlankIdx !== -1 && body.substring(0, lastBlankIdx).includes('> @')) {
    body = body.substring(lastBlankIdx + 2);
  }
  return { replyName, replyText, body };
}

export function ChatMessageBubble({ message, onDelete, onReply, showName = true }: ChatMessageProps) {
  const user = useAuthStore((s) => s.user);
  const isOwn = user?.id === message.user_id;
  const profile = message.profiles;
  const time = formatTime(message.created_at);
  const displayName = profile?.display_name || profile?.username || 'anon';
  const nameColor = profile?.avatar_color || '#818CF8';

  const mpShareSlug = parseMPShare(message.content);
  const compareShareSlugs = mpShareSlug ? null : parseCompareShare(message.content);
  const isShareCard = !!mpShareSlug || !!compareShareSlugs;
  const reply = isShareCard ? null : parseReply(message.content);
  const messageBody = reply ? reply.body : message.content;

  // Swipe to reply
  const translateX = useSharedValue(0);
  const replyOpacity = useSharedValue(0);
  const SWIPE_THRESHOLD = 60;

  const triggerReply = () => onReply?.(message);

  const panGesture = Gesture.Pan()
    .activeOffsetX([10, 10])
    .failOffsetY([-10, 10])
    .onUpdate((e) => {
      const tx = isOwn
        ? Math.max(e.translationX, -SWIPE_THRESHOLD)
        : Math.min(Math.max(e.translationX, 0), SWIPE_THRESHOLD);
      translateX.value = tx;
      replyOpacity.value = Math.min(Math.abs(tx) / SWIPE_THRESHOLD, 1);
    })
    .onEnd(() => {
      if (Math.abs(translateX.value) >= SWIPE_THRESHOLD * 0.8) {
        runOnJS(triggerReply)();
      }
      translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
      replyOpacity.value = withTiming(0, { duration: 200 });
    });

  const bubbleAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const replyIconStyle = useAnimatedStyle(() => ({
    opacity: replyOpacity.value,
    transform: [{ scale: 0.6 + replyOpacity.value * 0.4 }],
  }));

  const ReplyBlock = reply ? (
    <View style={{
      borderLeftWidth: 2,
      borderLeftColor: nameColor,
      backgroundColor: isOwn ? 'rgba(129,140,248,0.08)' : 'rgba(255,255,255,0.04)',
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 5,
      marginBottom: 6,
    }}>
      <Text style={{ color: nameColor, fontSize: 11, fontWeight: '600' }} numberOfLines={1}>
        {reply.replyName}
      </Text>
      <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 1 }} numberOfLines={1}>
        {reply.replyText}
      </Text>
    </View>
  ) : null;

  // --- OWN MESSAGE ---
  if (isOwn) {
    return (
      <View style={{ paddingHorizontal: 14, marginBottom: showName ? 10 : 2 }}>
        {/* Name pill - independent, above bubble */}
        {showName && (
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 4 }}>
            <View style={{
              backgroundColor: 'rgba(129,140,248,0.12)',
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}>
              <Text style={{ color: '#818CF8', fontSize: 11.5, fontWeight: '600' }}>You</Text>
            </View>
          </View>
        )}

        <GestureDetector gesture={panGesture}>
          <Animated.View style={[{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }, bubbleAnimStyle]}>
            <Animated.View style={[{ marginRight: 10 }, replyIconStyle]}>
              <Ionicons name="arrow-undo" size={18} color="rgba(129,140,248,0.5)" />
            </Animated.View>

            <Pressable
              onLongPress={() => onDelete?.(message.id)}
              style={{
                maxWidth: isShareCard ? '90%' : '80%',
                backgroundColor: isShareCard ? 'transparent' : 'rgba(129,140,248,0.12)',
                borderRadius: 16,
                borderBottomRightRadius: 4,
                paddingHorizontal: isShareCard ? 0 : 12,
                paddingTop: isShareCard ? 0 : 8,
                paddingBottom: isShareCard ? 0 : 8,
              }}
            >
              {mpShareSlug ? (
                <View>
                  <MPShareCard slug={mpShareSlug} />
                  <Text style={{ color: 'rgba(129,140,248,0.4)', fontSize: 10, textAlign: 'right', marginTop: 4 }}>
                    {time}
                  </Text>
                </View>
              ) : compareShareSlugs ? (
                <View>
                  <CompareShareCard slugs={compareShareSlugs} />
                  <Text style={{ color: 'rgba(129,140,248,0.4)', fontSize: 10, textAlign: 'right', marginTop: 4 }}>
                    {time}
                  </Text>
                </View>
              ) : (
                <>
                  {ReplyBlock}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                    <Text style={{ flexShrink: 1, color: 'rgba(255,255,255,0.9)', fontSize: 14, lineHeight: 20 }}>
                      {messageBody}
                    </Text>
                    <Text style={{
                      color: 'rgba(129,140,248,0.4)',
                      fontSize: 10,
                      marginLeft: 10,
                    }}>
                      {time}
                    </Text>
                  </View>
                </>
              )}
            </Pressable>
          </Animated.View>
        </GestureDetector>
      </View>
    );
  }

  // --- OTHER'S MESSAGE ---
  return (
    <View style={{ paddingHorizontal: 14, marginBottom: showName ? 10 : 2 }}>
      {/* Name pill - independent, above bubble */}
      {showName && (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 4 }}>
          <View style={{
            backgroundColor: nameColor + '18',
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 3,
          }}>
            <Text style={{ color: nameColor, fontSize: 11.5, fontWeight: '600' }}>{displayName}</Text>
          </View>
        </View>
      )}

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }, bubbleAnimStyle]}>
          <Pressable
            onLongPress={() => onDelete?.(message.id)}
            style={{
              maxWidth: isShareCard ? '90%' : '80%',
              backgroundColor: isShareCard ? 'transparent' : 'rgba(255,255,255,0.06)',
              borderRadius: 16,
              borderBottomLeftRadius: 4,
              paddingHorizontal: isShareCard ? 0 : 12,
              paddingTop: isShareCard ? 0 : 8,
              paddingBottom: isShareCard ? 0 : 8,
            }}
          >
            {mpShareSlug ? (
              <View>
                <MPShareCard slug={mpShareSlug} />
                <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, marginTop: 4 }}>
                  {time}
                </Text>
              </View>
            ) : compareShareSlugs ? (
              <View>
                <CompareShareCard slugs={compareShareSlugs} />
                <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, marginTop: 4 }}>
                  {time}
                </Text>
              </View>
            ) : (
              <>
                {ReplyBlock}
                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                  <Text style={{ flexShrink: 1, color: 'rgba(255,255,255,0.82)', fontSize: 14, lineHeight: 20 }}>
                    {messageBody}
                  </Text>
                  <Text style={{
                    color: 'rgba(255,255,255,0.2)',
                    fontSize: 10,
                    marginLeft: 10,
                  }}>
                    {time}
                  </Text>
                </View>
              </>
            )}
          </Pressable>

          <Animated.View style={[{ marginLeft: 10 }, replyIconStyle]}>
            <Ionicons name="arrow-undo" size={18} color="rgba(255,255,255,0.3)" />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${minutes} ${ampm}`;
}
