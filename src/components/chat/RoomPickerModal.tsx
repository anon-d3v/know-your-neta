import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, Modal, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useChatRooms } from '@/hooks/useChat';
import { sendChatMessage } from '@/api/chat';
import { colors } from '@/theme/colors';
import type { MPProfile } from '@/data/types';

const ROOM_ICONS: Record<string, string> = {
  general: '💬',
  'parliament-watch': '🏛️',
  accountability: '⚖️',
};

interface RoomPickerModalProps {
  visible: boolean;
  onClose: () => void;
  mp: MPProfile | null;
  shareContent?: string;
  shareLabel?: string;
}

export function RoomPickerModal({ visible, onClose, mp, shareContent, shareLabel }: RoomPickerModalProps) {
  const router = useRouter();
  const { data: rooms, isLoading } = useChatRooms();
  const [sendingRoomId, setSendingRoomId] = useState<string | null>(null);

  const handlePickRoom = async (roomId: string) => {
    if (sendingRoomId) return;
    const content = shareContent || (mp ? `[mp:${mp.slug}]` : null);
    if (!content) return;
    setSendingRoomId(roomId);
    try {
      await sendChatMessage(roomId, content);
      onClose();
      router.push(`/chat/${roomId}`);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to share');
    } finally {
      setSendingRoomId(null);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />

        <View style={{
          backgroundColor: '#1f1f1f',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingBottom: 40,
          maxHeight: '60%',
        }}>
          {/* Handle bar */}
          <View style={{ alignItems: 'center', paddingVertical: 12 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)' }} />
          </View>

          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16 }}>
            <View>
              <Text style={{ color: colors.text.primary, fontSize: 18, fontWeight: '700' }}>
                Share to Chatroom
              </Text>
              {(shareLabel || mp) && (
                <Text style={{ color: colors.text.tertiary, fontSize: 12, marginTop: 2 }}>
                  {shareLabel || `${mp?.basic.fullName}'s profile`}
                </Text>
              )}
            </View>
            <Pressable onPress={onClose} style={{ padding: 8 }}>
              <Ionicons name="close" size={22} color={colors.text.muted} />
            </Pressable>
          </View>

          {/* Room list */}
          {isLoading ? (
            <View style={{ alignItems: 'center', paddingVertical: 32 }}>
              <ActivityIndicator color={colors.primary[500]} />
            </View>
          ) : (
            <FlatList
              data={rooms}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              renderItem={({ item }) => {
                const icon = ROOM_ICONS[item.slug] || '💬';
                const isThisSending = sendingRoomId === item.id;
                const isDisabled = !!sendingRoomId;
                return (
                  <Pressable
                    onPress={() => handlePickRoom(item.id)}
                    disabled={isDisabled}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      borderRadius: 14,
                      padding: 14,
                      marginBottom: 12,
                      opacity: isDisabled && !isThisSending ? 0.4 : 1,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        backgroundColor: 'rgba(129,140,248,0.1)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Text style={{ fontSize: 20 }}>{icon}</Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={{ color: colors.text.primary, fontSize: 15, fontWeight: '600' }}>
                          {item.name}
                        </Text>
                        {item.description ? (
                          <Text style={{ color: colors.text.tertiary, fontSize: 12, marginTop: 2 }} numberOfLines={1}>
                            {item.description}
                          </Text>
                        ) : null}
                      </View>
                      {isThisSending ? (
                        <ActivityIndicator size="small" color={colors.primary[500]} />
                      ) : (
                        <Ionicons name="send" size={18} color={colors.primary[500]} />
                      )}
                    </View>
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                  <Text style={{ color: colors.text.muted, fontSize: 13 }}>No chatrooms available</Text>
                </View>
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
