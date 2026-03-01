import { View } from 'react-native';
import { Stack } from 'expo-router';
import { RoomList } from '@/components/chat';

export default function ChatTabScreen() {
  return (
    <View className="flex-1 bg-[#171717]">
      <Stack.Screen options={{ headerShown: false }} />
      <RoomList />
    </View>
  );
}
