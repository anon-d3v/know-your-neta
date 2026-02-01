import React from 'react';
import { View, Text } from 'react-native';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const variantStyles = {
  default: { bg: 'bg-gray-50', text: 'text-gray-900', label: 'text-gray-500' },
  success: { bg: 'bg-green-50', text: 'text-green-700', label: 'text-green-600' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'text-amber-600' },
  danger: { bg: 'bg-red-50', text: 'text-red-700', label: 'text-red-600' },
  info: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'text-blue-600' },
};

export function StatCard({ label, value, subValue, variant = 'default' }: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <View className={`${styles.bg} rounded-lg px-3 py-2 flex-1`}>
      <Text className={`text-base font-semibold ${styles.text}`} numberOfLines={1}>
        {value}
      </Text>
      {subValue && (
        <Text className={`text-xs ${styles.label}`} numberOfLines={1}>
          {subValue}
        </Text>
      )}
      <Text className={`text-xs ${styles.label} mt-0.5`} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}
