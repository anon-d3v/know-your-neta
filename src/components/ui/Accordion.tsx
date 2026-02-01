import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  titleClassName?: string;
  headerRight?: React.ReactNode;
}

export function Accordion({
  title,
  subtitle,
  children,
  defaultExpanded = false,
  titleClassName = '',
  headerRight,
}: AccordionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const rotateAnim = useRef(new Animated.Value(defaultExpanded ? 1 : 0)).current;

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    Animated.timing(rotateAnim, {
      toValue: expanded ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setExpanded(!expanded);
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <Pressable
        onPress={toggleExpanded}
        className="flex-row items-center justify-between p-4 active:bg-gray-50"
      >
        <View className="flex-1 mr-3">
          <Text className={`text-base font-semibold text-gray-900 ${titleClassName}`}>
            {title}
          </Text>
          {subtitle && (
            <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text>
          )}
        </View>
        <View className="flex-row items-center gap-2">
          {headerRight}
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Ionicons name="chevron-down" size={20} color="#71717A" />
          </Animated.View>
        </View>
      </Pressable>

      {expanded && (
        <View className="px-4 pb-4">
          {children}
        </View>
      )}
    </View>
  );
}
