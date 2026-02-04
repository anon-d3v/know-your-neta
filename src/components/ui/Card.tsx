import React from 'react';
import { View, Pressable, ViewProps } from 'react-native';

// simple card with glass morphism variants
interface CardProps extends ViewProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'glass' | 'glassBright' | 'solid' | 'outlined';
}

const variantBg = {
  glass: 'bg-white/[0.03]',
  glassBright: 'bg-white/[0.06]',
  solid: 'bg-dark-elevated',
  outlined: 'bg-transparent',
};

export function Card({ children, onPress, variant = 'glass', className = '', ...props }: CardProps) {
  const cls = `rounded-2xl overflow-hidden ${variantBg[variant]} ${className}`;

  // pressable version if onPress provided
  if (onPress) {
    return (
      <Pressable onPress={onPress} className={`${cls} active:opacity-80 active:scale-[0.99]`} {...props}>
        {children}
      </Pressable>
    );
  }

  return <View className={cls} {...props}>{children}</View>;
}
