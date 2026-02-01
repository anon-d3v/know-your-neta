import React from 'react';
import { View, Text, ViewStyle } from 'react-native';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  color?: string;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: 'bg-gray-100', text: 'text-gray-700' },
  success: { bg: 'bg-green-100', text: 'text-green-700' },
  warning: { bg: 'bg-amber-100', text: 'text-amber-700' },
  danger: { bg: 'bg-red-100', text: 'text-red-700' },
  info: { bg: 'bg-blue-100', text: 'text-blue-700' },
};

export function Badge({ label, variant = 'default', size = 'sm', color }: BadgeProps) {
  const styles = variantStyles[variant];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  if (color) {
    return (
      <View
        className={`rounded-full ${sizeClasses}`}
        style={{ backgroundColor: `${color}20` }}
      >
        <Text className={`${textSize} font-medium`} style={{ color }}>
          {label}
        </Text>
      </View>
    );
  }

  return (
    <View className={`${styles.bg} rounded-full ${sizeClasses}`}>
      <Text className={`${textSize} font-medium ${styles.text}`}>{label}</Text>
    </View>
  );
}
