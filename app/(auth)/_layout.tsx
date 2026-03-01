import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#171717' },
        headerTintColor: '#ffffff',
        headerShadowVisible: false,
        contentStyle: { backgroundColor: '#171717' },
      }}
    >
      <Stack.Screen
        name="login"
        options={{ title: 'Sign In', presentation: 'modal' }}
      />
      <Stack.Screen
        name="register"
        options={{ title: 'Register', presentation: 'modal' }}
      />
    </Stack>
  );
}
