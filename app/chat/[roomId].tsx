import { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { ChatRoom } from '@/components/chat';
import { CivicPledgeModal } from '@/components/chat/CivicPledgeModal';
import { useChatRooms } from '@/hooks/useChat';

export default function ChatRoomScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { data: rooms } = useChatRooms();
  const room = rooms?.find((r) => r.id === roomId);
  const [pledgeAccepted, setPledgeAccepted] = useState(false);

  return (
    <View className="flex-1 bg-[#171717]">
      <Stack.Screen options={{ title: room?.name || 'Chat' }} />
      <CivicPledgeModal roomId={roomId} onAccepted={() => setPledgeAccepted(true)} />
      {pledgeAccepted && <ChatRoom roomId={roomId} roomName={room?.name} />}
    </View>
  );
}
