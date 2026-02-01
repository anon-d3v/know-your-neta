import React from 'react';
import { Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function Chip({ label, selected = false, onPress, onRemove, icon }: ChipProps) {
  const bgClass = selected ? 'bg-brand-500' : 'bg-gray-100';
  const textClass = selected ? 'text-white' : 'text-gray-700';
  const iconColor = selected ? '#FFFFFF' : '#3F3F46';

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center ${bgClass} rounded-full px-3 py-1.5 active:opacity-80`}
    >
      {icon && (
        <Ionicons name={icon} size={14} color={iconColor} style={{ marginRight: 4 }} />
      )}
      <Text className={`text-sm font-medium ${textClass}`}>{label}</Text>
      {onRemove && (
        <Pressable onPress={onRemove} className="ml-1 -mr-1 p-0.5">
          <Ionicons name="close" size={14} color={iconColor} />
        </Pressable>
      )}
    </Pressable>
  );
}
