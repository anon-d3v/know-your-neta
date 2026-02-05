import React from 'react';
import { Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: 'sm' | 'md';
}

export function Chip({ label, selected, onPress, onRemove, icon, size = 'md' }: ChipProps) {
  const sm = size === 'sm';
  const iconClr = selected ? colors.primary[500] : colors.text.tertiary;

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center rounded-xl active:opacity-70 ${selected ? 'bg-brand-500/20' : 'bg-white/5'} ${sm ? 'px-2.5 py-1' : 'px-3.5 py-2'}`}
    >
      {icon && <Ionicons name={icon} size={sm ? 12 : 14} color={iconClr} style={{ marginRight: 6 }} />}
      <Text className={`font-medium ${sm ? 'text-xs' : 'text-sm'} ${selected ? 'text-brand-500' : 'text-white/70'}`}>
        {label}
      </Text>
      {onRemove && (
        <Pressable onPress={onRemove} className="ml-1.5 -mr-0.5 p-0.5">
          <Ionicons name="close-circle" size={sm ? 14 : 16} color={iconClr} />
        </Pressable>
      )}
    </Pressable>
  );
}
