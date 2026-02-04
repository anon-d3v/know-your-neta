import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withTiming, Easing } from 'react-native-reanimated';

// staggered list item animation - simple fade + slide up
interface AnimatedListItemProps {
  index: number;
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  className?: string;
  delay?: number;      // ms between each item
  maxDelay?: number;   // cap so items dont wait forever
}

export function AnimatedListItem({ index, children, style, className, delay = 30, maxDelay = 300 }: AnimatedListItemProps) {
  const op = useSharedValue(0);
  const y = useSharedValue(12);

  useEffect(() => {
    // cap delay so items far down the list dont wait too long
    const d = Math.min(index * delay, maxDelay);
    const cfg = { duration: 200, easing: Easing.out(Easing.quad) };
    op.value = withDelay(d, withTiming(1, cfg));
    y.value = withDelay(d, withTiming(0, cfg));
  }, [index, delay, maxDelay]);

  const anim = useAnimatedStyle(() => ({ opacity: op.value, transform: [{ translateY: y.value }] }));

  return <Animated.View style={[anim, style]} className={className}>{children}</Animated.View>;
}
