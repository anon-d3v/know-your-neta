import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    setError('');

    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      await login({ username: username.trim(), password });
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      setError(e.message || 'Login failed');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <View className="flex-1 justify-center px-6">
        <Text className="text-white text-3xl font-bold mb-2">
          Welcome back
        </Text>
        <Text className="text-white/50 text-base mb-8">
          Sign in to join the discussion
        </Text>

        {error ? (
          <View className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
            <Text className="text-red-400 text-sm">{error}</Text>
          </View>
        ) : null}

        <View className="mb-4">
          <Text className="text-white/70 text-sm mb-2 ml-1">Username</Text>
          <TextInput
            value={username}
            onChangeText={(t) =>
              setUsername(t.toLowerCase().replace(/[^a-z0-9_]/g, ''))
            }
            placeholder="your_username"
            placeholderTextColor="#ffffff30"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={20}
            className="bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3.5 text-white text-base"
          />
        </View>

        <View className="mb-6">
          <Text className="text-white/70 text-sm mb-2 ml-1">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#ffffff30"
            secureTextEntry
            className="bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3.5 text-white text-base"
          />
        </View>

        <Pressable
          onPress={handleLogin}
          disabled={isLoading}
          className="bg-[#818CF8] rounded-xl py-4 items-center active:opacity-80 disabled:opacity-50"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">Sign In</Text>
          )}
        </Pressable>

        <View className="flex-row justify-center mt-6">
          <Text className="text-white/40 text-sm">
            Don't have an account?{' '}
          </Text>
          <Pressable onPress={() => router.replace('/(auth)/register')}>
            <Text className="text-[#818CF8] text-sm font-semibold">
              Register
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
