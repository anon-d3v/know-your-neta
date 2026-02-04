import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  compact?: boolean;
}

// color mapping for variants
const variantColors: Record<Variant, string> = {
  default: colors.text.primary,
  success: colors.semantic.success,
  warning: colors.semantic.warning,
  danger: colors.semantic.danger,
  info: colors.semantic.info,
};

export function StatCard({ label, value, subValue, variant = 'default', icon, compact }: StatCardProps) {
  const clr = variantColors[variant];
  const labelClr = variant === 'default' ? colors.text.tertiary : clr;
  const pad = compact ? 'px-2.5 py-2' : 'px-3 py-2.5';

  return (
    <View className={`${pad} flex-1`}>
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-bold flex-1" style={{ color: clr }} numberOfLines={1}>
          {value}
        </Text>
        {icon && <Ionicons name={icon} size={16} color={labelClr} style={{ marginLeft: 4 }} />}
      </View>
      {subValue && (
        <Text className="text-xs font-medium mt-0.5" style={{ color: labelClr, opacity: 0.8 }} numberOfLines={1}>
          {subValue}
        </Text>
      )}
      <Text className="text-xs mt-1" style={{ color: labelClr, opacity: 0.6 }} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}
