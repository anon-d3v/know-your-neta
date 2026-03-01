import React, { useState, useEffect } from 'react';
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
import { checkUsernameAvailable } from '@/api/auth';

export function RegisterForm() {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<
    'idle' | 'checking' | 'available' | 'taken'
  >('idle');
  const { register, isLoading } = useAuth();
  const router = useRouter();

  // Check username availability with debounce
  useEffect(() => {
    if (username.length < 3) {
      setUsernameStatus('idle');
      return;
    }

    setUsernameStatus('checking');
    const timeout = setTimeout(async () => {
      const available = await checkUsernameAvailable(username);
      setUsernameStatus(available ? 'available' : 'taken');
    }, 500);

    return () => clearTimeout(timeout);
  }, [username]);

  const handleRegister = async () => {
    setError('');

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (usernameStatus === 'taken') {
      setError('Username is already taken');
      return;
    }

    try {
      await register({ username, password, displayName: displayName.trim() || undefined });
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      setError(e.message || 'Registration failed');
    }
  };

  const getUsernameStatusColor = () => {
    switch (usernameStatus) {
      case 'available':
        return 'text-green-400';
      case 'taken':
        return 'text-red-400';
      case 'checking':
        return 'text-white/40';
      default:
        return 'text-transparent';
    }
  };

  const getUsernameStatusText = () => {
    switch (usernameStatus) {
      case 'available':
        return '✓ Available';
      case 'taken':
        return '✗ Taken';
      case 'checking':
        return 'Checking...';
      default:
        return '';
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <View className="flex-1 justify-center px-6">
        <Text className="text-white text-3xl font-bold mb-2">
          Create account
        </Text>
        <Text className="text-white/50 text-base mb-1">
          Join the discussion. No email needed.
        </Text>
        <Text className="text-white/30 text-xs mb-8">
          Your privacy matters — we only need a username and password.
        </Text>

        {error ? (
          <View className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
            <Text className="text-red-400 text-sm">{error}</Text>
          </View>
        ) : null}

        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white/70 text-sm ml-1">Username</Text>
            <Text className={`text-xs mr-1 ${getUsernameStatusColor()}`}>
              {getUsernameStatusText()}
            </Text>
          </View>
          <TextInput
            value={username}
            onChangeText={(t) =>
              setUsername(t.toLowerCase().replace(/[^a-z0-9_]/g, ''))
            }
            placeholder="choose_a_username"
            placeholderTextColor="#ffffff30"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={20}
            className="bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3.5 text-white text-base"
          />
          <Text className="text-white/30 text-xs mt-1 ml-1">
            3-20 characters: lowercase letters, numbers, underscores
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-white/70 text-sm mb-2 ml-1">Display Name</Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="How others see you (optional)"
            placeholderTextColor="#ffffff30"
            maxLength={30}
            className="bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3.5 text-white text-base"
          />
          <Text className="text-white/30 text-xs mt-1 ml-1">
            Shown in chats. Defaults to username if empty.
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-white/70 text-sm mb-2 ml-1">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#ffffff30"
            secureTextEntry
            className="bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3.5 text-white text-base"
          />
          <Text className="text-white/30 text-xs mt-1 ml-1">
            Minimum 6 characters
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-white/70 text-sm mb-2 ml-1">
            Confirm Password
          </Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••"
            placeholderTextColor="#ffffff30"
            secureTextEntry
            className="bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3.5 text-white text-base"
          />
        </View>

        <Pressable
          onPress={handleRegister}
          disabled={isLoading || usernameStatus === 'taken'}
          className="bg-[#818CF8] rounded-xl py-4 items-center active:opacity-80 disabled:opacity-50"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">
              Create Account
            </Text>
          )}
        </Pressable>

        <View className="flex-row justify-center mt-6">
          <Text className="text-white/40 text-sm">
            Already have an account?{' '}
          </Text>
          <Pressable onPress={() => router.replace('/(auth)/login')}>
            <Text className="text-[#818CF8] text-sm font-semibold">
              Sign In
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
