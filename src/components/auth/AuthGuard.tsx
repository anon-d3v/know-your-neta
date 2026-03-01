import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  message?: string;
}

export function AuthGuard({
  children,
  fallback,
  message = 'Sign in to participate in discussions',
}: AuthGuardProps) {
  const session = useAuthStore((s) => s.session);
  const router = useRouter();

  if (session) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <View className="items-center justify-center p-6 rounded-2xl bg-[#1f1f1f] border border-white/10 mx-4">
      <Text className="text-white/60 text-center text-sm mb-4">{message}</Text>
      <View className="flex-row gap-3">
        <Pressable
          onPress={() => router.push('/(auth)/login')}
          className="bg-[#818CF8] px-6 py-3 rounded-xl active:opacity-80"
        >
          <Text className="text-white font-semibold text-sm">Sign In</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/(auth)/register')}
          className="border border-[#818CF8] px-6 py-3 rounded-xl active:opacity-80"
        >
          <Text className="text-[#818CF8] font-semibold text-sm">
            Register
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
