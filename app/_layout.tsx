import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../global.css';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FAFAFA' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="mp/[slug]"
          options={{
            headerShown: true,
            headerTitle: 'MP Profile',
            headerBackTitle: 'Back',
            headerTintColor: '#6366F1',
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTitleStyle: { color: '#18181B', fontWeight: '600' },
          }}
        />
      </Stack>
    </>
  );
}
