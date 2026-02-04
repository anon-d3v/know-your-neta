import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import '../global.css';

// theme colors - should probably move to theme file but whatever
const BG = '#171717';
const SURFACE = '#1f1f1f';
const BRAND = '#818CF8';

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar style="light" />
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: BG },
        animation: 'slide_from_right',
        animationDuration: 200,
      }}>
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
        <Stack.Screen name="mp/[slug]" options={{
          headerShown: true,
          headerTitle: 'MP Profile',
          headerBackTitle: 'Back',
          headerTintColor: BRAND,
          headerStyle: { backgroundColor: SURFACE },
          headerTitleStyle: { color: '#FFF', fontWeight: '600' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: BG },
        }} />
      </Stack>
    </View>
  );
}
