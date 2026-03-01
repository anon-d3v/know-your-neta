import React from 'react';
import { View, Text, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useChatRooms, useTotalMembers } from '@/hooks/useChat';
import { usePresenceCount } from '@/hooks/usePresence';
import type { ChatRoom } from '@/data/types';

const ROOM_ICONS: Record<string, string> = {
  general: '💬',
  'parliament-watch': '🏛️',
  accountability: '⚖️',
};

export function RoomList() {
  const { data: rooms, isLoading, error, refetch } = useChatRooms();
  const { data: totalMembers } = useTotalMembers();
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#818CF8" size="small" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <Text style={{ color: 'rgba(248,113,113,0.5)', fontSize: 13, fontFamily: 'monospace', textAlign: 'center', marginBottom: 16 }}>
          Failed to load chat rooms
        </Text>
        <Pressable
          onPress={() => refetch()}
          style={{ backgroundColor: 'rgba(129,140,248,0.12)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 }}
        >
          <Text style={{ color: '#818CF8', fontSize: 13, fontFamily: 'monospace', fontWeight: '500' }}>retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={rooms}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      ListHeaderComponent={
        <View style={{ marginBottom: 16, paddingTop: 48 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700', fontFamily: 'monospace' }}>
              Chatrooms
            </Text>
            {totalMembers != null && totalMembers > 0 && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderRadius: 10,
                paddingHorizontal: 9,
                paddingVertical: 4,
                gap: 4,
              }}>
                <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>Members</Text>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '600' }}>{totalMembers}</Text>
              </View>
            )}
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'monospace', marginTop: 4 }}>
            discuss with fellow citizens
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <RoomCard
          room={item}
          onPress={() => router.push(`/chat/${item.id}` as any)}
        />
      )}
      ListEmptyComponent={
        <View style={{ alignItems: 'center', paddingVertical: 48 }}>
          <Text style={{ color: 'rgba(255,255,255,0.15)', fontSize: 13, fontFamily: 'monospace' }}>
            no rooms available
          </Text>
        </View>
      }
    />
  );
}

function RoomCard({ room, onPress }: { room: ChatRoom; onPress: () => void }) {
  const icon = ROOM_ICONS[room.slug] || '💬';
  const inChat = usePresenceCount(room.id);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: '#2d2d2d',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          backgroundColor: 'rgba(129,140,248,0.1)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={{ fontSize: 22 }}>{icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
            {room.name}
          </Text>
          {room.description ? (
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 4 }} numberOfLines={1}>
              {room.description}
            </Text>
          ) : null}
        </View>
        <Text style={{ color: 'rgba(129,140,248,0.4)', fontSize: 18 }}>›</Text>
      </View>

      {/* In Chat pill */}
      <View style={{ flexDirection: 'row', marginTop: 14 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: 10,
          paddingHorizontal: 10,
          paddingVertical: 5,
          gap: 5,
        }}>
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>In Chat</Text>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '600' }}>{inChat}</Text>
        </View>
      </View>
    </Pressable>
  );
}
