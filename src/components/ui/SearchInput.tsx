import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChangeText, placeholder = 'Search MPs...' }: SearchInputProps) {
  const clear = () => onChangeText('');

  return (
    <View className="flex-row items-center bg-white/5 rounded-2xl px-4 py-3">
      <Ionicons name="search" size={20} color={colors.text.tertiary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.muted}
        className="flex-1 ml-3 text-base"
        style={{ color: colors.text.primary }}
        autoCapitalize="none"
        autoCorrect={false}
        selectionColor={colors.primary[500]}
      />
      {value.length > 0 && (
        <Pressable onPress={clear} className="p-1 -mr-1 rounded-full active:bg-white/10">
          <Ionicons name="close-circle" size={20} color={colors.text.tertiary} />
        </Pressable>
      )}
    </View>
  );
}
