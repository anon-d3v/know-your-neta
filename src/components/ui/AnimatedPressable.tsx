import React, { useCallback } from 'react';
import { Pressable, PressableProps, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate } from 'react-native-reanimated';

const AnimPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedPressableProps extends PressableProps {
  scaleOnPress?: number;
  opacityOnPress?: number;
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  className?: string;
}

export function AnimatedPressable({
  scaleOnPress = 0.97, opacityOnPress = 0.8,
  children, onPressIn, onPressOut, style, className, ...props
}: AnimatedPressableProps) {
  const p = useSharedValue(0);
  const springCfg = { damping: 15, stiffness: 400 };

  const pressIn = useCallback((e: any) => {
    p.value = withSpring(1, springCfg);
    onPressIn?.(e);
  }, [onPressIn]);

  const pressOut = useCallback((e: any) => {
    p.value = withSpring(0, springCfg);
    onPressOut?.(e);
  }, [onPressOut]);

  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(p.value, [0, 1], [1, scaleOnPress]) }],
    opacity: interpolate(p.value, [0, 1], [1, opacityOnPress]),
  }));

  return (
    <AnimPressable onPressIn={pressIn} onPressOut={pressOut} style={[anim, style]} className={className} {...props}>
      {children}
    </AnimPressable>
  );
}
