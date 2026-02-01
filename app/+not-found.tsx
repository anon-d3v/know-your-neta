import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found' }} />
      <View className="flex-1 items-center justify-center bg-gray-50 p-4">
        <Ionicons name="alert-circle-outline" size={64} color="#D4D4D8" />
        <Text className="text-xl font-semibold text-gray-700 mt-4">Page Not Found</Text>
        <Text className="text-sm text-gray-500 mt-2 text-center">
          The page you're looking for doesn't exist.
        </Text>
        <Link href="/" className="mt-6">
          <View className="bg-brand-500 px-6 py-3 rounded-full">
            <Text className="text-white font-medium">Go to Home</Text>
          </View>
        </Link>
      </View>
    </>
  );
}
