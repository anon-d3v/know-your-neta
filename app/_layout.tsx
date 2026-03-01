import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { QueryProvider } from '../src/providers/QueryProvider';
import { useInitialSync } from '../src/hooks/useInitialSync';
import { useAuth } from '../src/hooks/useAuth';
import { SyncScreen } from '../src/components/ui/SyncScreen';
import '../global.css';

const BG = '#171717';
const SURFACE = '#1f1f1f';
const BRAND = '#818CF8';

function AppContent() {
  useAuth();
  const { status, progress, error, retry, isLoading } = useInitialSync();

  if (isLoading) {
    return <SyncScreen status={status} progress={progress} error={error} onRetry={retry} />;
  }
  if (status === 'error') {
    return <SyncScreen status={status} progress={0} error={error} onRetry={retry} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: BG },
          animation: 'slide_from_right',
          animationDuration: 200,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
        <Stack.Screen
          name="mp/[slug]"
          options={{
            headerShown: true,
            headerTitle: 'MP Profile',
            headerBackTitle: 'Back',
            headerTintColor: BRAND,
            headerStyle: { backgroundColor: SURFACE },
            headerTitleStyle: { color: '#FFF', fontWeight: '600' },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: BG },
          }}
        />
        <Stack.Screen name="(auth)" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen
          name="discussion/[slug]"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: BG },
            headerTintColor: '#fff',
            headerTitleStyle: { color: '#fff', fontFamily: 'monospace', fontWeight: '600', fontSize: 15 },
            headerShadowVisible: false,
            headerBackTitle: '',
            headerStatusBarHeight: 44,
            title: 'Discussion',
            contentStyle: { backgroundColor: BG },
          }}
        />
        <Stack.Screen
          name="chat/[roomId]"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: BG },
            headerTintColor: '#fff',
            headerTitleStyle: { color: '#fff', fontFamily: 'monospace', fontWeight: '600', fontSize: 15 },
            headerShadowVisible: false,
            headerBackTitle: '',
            headerStatusBarHeight: 44,
            title: 'Chat',
            contentStyle: { backgroundColor: BG },
          }}
        />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <QueryProvider>
      <AppContent />
    </QueryProvider>
  );
}
