import React, { useCallback, useRef } from 'react';
import { ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withTiming, Easing } from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';

type AnimType = 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'fadeSlideUp';

interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  animation?: AnimType;
  style?: ViewStyle | ViewStyle[];
  className?: string;
  replayOnFocus?: boolean;  // replay anim when screen comes back into focus
}

// initial offsets for each animation type
const initVals: Record<AnimType, { y: number; x: number; s: number }> = {
  slideUp: { y: 12, x: 0, s: 1 },
  fadeSlideUp: { y: 12, x: 0, s: 1 },
  slideDown: { y: -12, x: 0, s: 1 },
  slideLeft: { x: 12, y: 0, s: 1 },
  slideRight: { x: -12, y: 0, s: 1 },
  scale: { s: 0.97, x: 0, y: 0 },
  fade: { x: 0, y: 0, s: 1 },
};

export function FadeInView({ children, delay = 0, duration = 200, animation = 'fadeSlideUp', style, className, replayOnFocus = false }: FadeInViewProps) {
  const didAnim = useRef(false);
  const init = initVals[animation];

  const op = useSharedValue(1);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const sc = useSharedValue(1);

  const run = useCallback(() => {
    // reset to initial values then animate to final
    op.value = 0;
    y.value = init.y;
    x.value = init.x;
    sc.value = init.s;

    const cfg = { duration, easing: Easing.out(Easing.cubic) };
    op.value = withDelay(delay, withTiming(1, cfg));
    y.value = withDelay(delay, withTiming(0, cfg));
    x.value = withDelay(delay, withTiming(0, cfg));
    sc.value = withDelay(delay, withTiming(1, cfg));
  }, [animation, delay, duration, init]);

  useFocusEffect(useCallback(() => {
    if (!didAnim.current || replayOnFocus) {
      didAnim.current = true;
      run();
    }
  }, [replayOnFocus, run]));

  const anim = useAnimatedStyle(() => ({
    opacity: op.value,
    transform: [{ translateX: x.value }, { translateY: y.value }, { scale: sc.value }],
  }));

  return <Animated.View style={[anim, style]} className={className}>{children}</Animated.View>;
}
