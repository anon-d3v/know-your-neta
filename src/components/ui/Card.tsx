import React from 'react';
import { View, Pressable, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'filled';
}

export function Card({ children, onPress, variant = 'elevated', className = '', ...props }: CardProps) {
  const baseClasses = 'rounded-xl overflow-hidden';

  const variantClasses = {
    elevated: 'bg-white shadow-sm border border-gray-100',
    outlined: 'bg-white border border-gray-200',
    filled: 'bg-gray-50',
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={`${combinedClasses} active:opacity-90`}
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={combinedClasses} {...props}>
      {children}
    </View>
  );
}
