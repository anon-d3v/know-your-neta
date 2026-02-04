import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, interpolate } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { PartySymbol } from './PartySymbol';
import { colors, getPartyColor } from '../../theme/colors';
import type { PartyData } from '../../data/party-data';

interface PartyCardProps {
  party: PartyData;
  mpCount: number;
}

export function PartyCard({ party, mpCount }: PartyCardProps) {
  const [open, setOpen] = useState(false);
  const clr = getPartyColor(party.abbreviation);

  // expand/collapse animation
  const prog = useSharedValue(0);
  const rot = useSharedValue(0);

  useEffect(() => {
    const cfg = { duration: 200, easing: Easing.out(Easing.cubic) };
    prog.value = withTiming(open ? 1 : 0, cfg);
    rot.value = withTiming(open ? 180 : 0, cfg);
  }, [open]);

  const contentAnim = useAnimatedStyle(() => ({
    opacity: prog.value,
    transform: [{ translateY: interpolate(prog.value, [0, 1], [-8, 0]) }],
  }));
  const chevAnim = useAnimatedStyle(() => ({ transform: [{ rotate: `${rot.value}deg` }] }));

  return (
    <Pressable onPress={() => setOpen(!open)} className="bg-white/[0.03] rounded-2xl active:opacity-80" style={{ marginBottom: 12 }}>
      <View className="flex-row items-center p-4">
        <PartySymbol partyId={party.id} size="md" variant="circle" />

        <View className="flex-1 ml-3">
          <View className="flex-row items-center">
            <View className="px-2 py-0.5 rounded mr-2" style={{ backgroundColor: `${clr}30` }}>
              <Text className="text-xs font-bold" style={{ color: clr }}>{party.abbreviation}</Text>
            </View>
            <Text className="flex-1 text-base font-semibold" style={{ color: colors.text.primary }}>
              {party.fullName.replace(/\s*\(([^)]+)\)/g, ' - $1')}
            </Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Ionicons name="people-outline" size={14} color={colors.text.tertiary} />
            <Text className="text-sm ml-1" style={{ color: colors.text.secondary }}>
              {mpCount} {mpCount === 1 ? 'MP' : 'MPs'} in Lok Sabha
            </Text>
          </View>
        </View>

        <Animated.View style={chevAnim}>
          <Ionicons name="chevron-down" size={20} color={colors.text.tertiary} />
        </Animated.View>
      </View>

      {open && (
        <Animated.View className="px-4 pb-4" style={contentAnim}>
          {/* president & HQ row */}
          {party.president !== 'N/A' && (
            <View className="flex-row items-center justify-between mt-2 p-3 rounded-xl" style={{ backgroundColor: `${clr}10` }}>
              <View>
                <Text className="text-xs" style={{ color: colors.text.tertiary }}>President</Text>
                <Text className="text-base font-bold" style={{ color: colors.text.primary }}>{party.president}</Text>
              </View>
              {party.headquarters !== 'N/A' && (
                <View className="items-end">
                  <Text className="text-xs" style={{ color: colors.text.tertiary }}>Headquarters</Text>
                  <Text className="text-sm font-medium" style={{ color: colors.text.secondary }}>{party.headquarters}</Text>
                </View>
              )}
            </View>
          )}

          {/* history blurb */}
          <View className="mt-3">
            <Text className="text-sm leading-5" style={{ color: colors.text.tertiary }}>{party.history}</Text>
          </View>

          {/* wiki link */}
          {party.wikipediaUrl && (
            <Pressable
              className="flex-row items-center justify-center mt-3 py-2 rounded-lg"
              style={{ backgroundColor: `${clr}15` }}
              onPress={() => Linking.openURL(party.wikipediaUrl)}
            >
              <Ionicons name="globe-outline" size={16} color={clr} />
              <Text className="text-sm font-medium ml-1" style={{ color: clr }}>Learn more on Wikipedia</Text>
            </Pressable>
          )}
        </Animated.View>
      )}
    </Pressable>
  );
}
