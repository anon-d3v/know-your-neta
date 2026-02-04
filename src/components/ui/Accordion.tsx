import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

type Variant = 'default' | 'danger' | 'warning' | 'success' | 'info';

interface AccordionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  titleClassName?: string;
  headerRight?: React.ReactNode;
  variant?: Variant;
}

// styling per variant - could probably simplify this but it works
const variantStyles: Record<Variant, { headerBg: string; activeBg: string; titleColor: string }> = {
  default: { headerBg: 'bg-white/[0.03]', activeBg: 'active:bg-white/10', titleColor: colors.text.primary },
  danger: { headerBg: 'bg-danger-muted/50', activeBg: 'active:bg-danger/20', titleColor: colors.semantic.danger },
  warning: { headerBg: 'bg-warning-muted/50', activeBg: 'active:bg-warning/20', titleColor: colors.semantic.warning },
  success: { headerBg: 'bg-success-muted/50', activeBg: 'active:bg-success/20', titleColor: colors.semantic.success },
  info: { headerBg: 'bg-info-muted/50', activeBg: 'active:bg-info/20', titleColor: colors.semantic.info },
};

export function Accordion({
  title, subtitle, children,
  defaultExpanded = false, titleClassName = '', headerRight, variant = 'default'
}: AccordionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const vstyle = variantStyles[variant];

  return (
    <View className={`${vstyle.headerBg} rounded-2xl overflow-hidden`}>
      <Pressable
        onPress={() => setExpanded(!expanded)}
        className={`flex-row items-center justify-between p-4 ${vstyle.activeBg}`}>
        <View className="flex-1 mr-3">
          <Text className={`text-base font-semibold ${titleClassName}`} style={{ color: vstyle.titleColor }}>
            {title}
          </Text>
          {subtitle && <Text className="text-sm mt-0.5" style={{ color: colors.text.tertiary }}>{subtitle}</Text>}
        </View>
        <View className="flex-row items-center gap-2">
          {headerRight}
          {/* rotate chevron when expanded */}
          <View style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}>
            <Ionicons name="chevron-down" size={20} color={colors.text.tertiary} />
          </View>
        </View>
      </Pressable>
      {expanded && <View className="px-4 pb-4">{children}</View>}
    </View>
  );
}
