import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { useCompareStore } from '../../store/compareStore';
import { colors } from '../../theme/colors';

interface CompareBarProps {
  onCompare: () => void;
}

export function CompareBar({ onCompare }: CompareBarProps) {
  const { selectedMPs, removeMP, clearAll, maxCompare } = useCompareStore();
  const [isVisible, setIsVisible] = useState(false);

  const translateY = useSharedValue(150);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (selectedMPs.length > 0) {
      setIsVisible(true);
      translateY.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.cubic) });
      opacity.value = withTiming(1, { duration: 150 });
    } else {
      translateY.value = withTiming(150, { duration: 180, easing: Easing.in(Easing.cubic) });
      opacity.value = withTiming(0, { duration: 120 }, () => {
        runOnJS(setIsVisible)(false);
      });
    }
  }, [selectedMPs.length]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!isVisible) return null;

  return (
    <Animated.View
      className="absolute bottom-0 left-0 right-0 mx-4 mb-4 rounded-2xl overflow-hidden"
      style={[animatedStyle, {
        backgroundColor: colors.dark.surfaceElevated,
        borderWidth: 1,
        borderColor: colors.primary[500] + '40',
        shadowColor: colors.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      }]}
    >
      <View className="p-4">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Ionicons name="git-compare-outline" size={18} color={colors.primary[500]} />
            <Text className="text-sm font-medium ml-2" style={{ color: colors.text.primary }}>
              Compare MPs
            </Text>
            <View
              className="ml-2 px-2 py-0.5 rounded-full"
              style={{ backgroundColor: colors.primary[500] + '20' }}
            >
              <Text className="text-xs font-medium" style={{ color: colors.primary[500] }}>
                {selectedMPs.length}/{maxCompare}
              </Text>
            </View>
          </View>
          <Pressable onPress={clearAll} className="p-1">
            <Text className="text-xs" style={{ color: colors.text.tertiary }}>
              Clear
            </Text>
          </Pressable>
        </View>

        <View className="flex-row gap-2 mb-3">
          {selectedMPs.map(mp => (
            <View
              key={mp.id}
              className="flex-1 flex-row items-center rounded-xl p-2"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <View
                className="w-8 h-8 rounded-full items-center justify-center mr-2"
                style={{ backgroundColor: colors.primary[500] + '20' }}
              >
                <Text className="text-xs font-semibold" style={{ color: colors.primary[500] }}>
                  {mp.basic.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </Text>
              </View>
              <Text
                className="flex-1 text-xs"
                style={{ color: colors.text.secondary }}
                numberOfLines={1}
              >
                {mp.basic.fullName.split(' ')[0]}
              </Text>
              <Pressable
                onPress={() => removeMP(mp.id)}
                className="w-5 h-5 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <Ionicons name="close" size={12} color={colors.text.tertiary} />
              </Pressable>
            </View>
          ))}
          {Array.from({ length: maxCompare - selectedMPs.length }).map((_, i) => (
            <View
              key={`empty-${i}`}
              className="flex-1 rounded-xl p-2 items-center justify-center"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.05)',
                borderStyle: 'dashed',
                minHeight: 44,
              }}
            >
              <Ionicons name="add" size={16} color={colors.text.muted} />
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => {
            if (selectedMPs.length >= 2) {
              onCompare();
            }
          }}
          disabled={selectedMPs.length < 2}
          className="rounded-xl py-3 items-center"
          style={{
            backgroundColor: selectedMPs.length >= 2 ? colors.primary[500] : 'rgba(255, 255, 255, 0.05)',
          }}
        >
          <Text
            className="font-semibold"
            style={{
              color: selectedMPs.length >= 2 ? 'white' : colors.text.muted,
            }}
          >
            {selectedMPs.length < 2
              ? `Select ${2 - selectedMPs.length} more to compare`
              : 'Compare Now'}
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
