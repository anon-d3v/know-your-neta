import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../theme/colors';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'glass';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  color?: string;
}

const variants: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: 'bg-white/10', text: 'text-white/70' },
  success: { bg: 'bg-success-muted', text: 'text-success' },
  warning: { bg: 'bg-warning-muted', text: 'text-warning' },
  danger: { bg: 'bg-danger-muted', text: 'text-danger' },
  info: { bg: 'bg-info-muted', text: 'text-info' },
  glass: { bg: 'bg-white/5', text: 'text-white/60' },
};

export function Badge({ label, variant = 'default', size = 'sm', color }: BadgeProps) {
  const v = variants[variant];
  const padCls = size === 'sm' ? 'px-2.5 py-1' : 'px-3 py-1.5';
  const txtCls = size === 'sm' ? 'text-xs' : 'text-sm';

  if (color) {
    return (
      <View className={`rounded-lg ${padCls}`} style={{ backgroundColor: `${color}20` }}>
        <Text className={`${txtCls} font-semibold`} style={{ color }}>{label}</Text>
      </View>
    );
  }

  return (
    <View className={`${v.bg} rounded-lg ${padCls}`}>
      <Text className={`${txtCls} font-semibold ${v.text}`}>{label}</Text>
    </View>
  );
}
