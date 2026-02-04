import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// TODO: this was supposed to expand on tap to show fullName but we never finished it lol
// keeping the props for when we get around to it
interface ExpandableBadgeProps {
  abbreviation: string;
  fullName: string;  // unused for now
  color: string;
  autoCollapseMs?: number;  // unused
}

export function ExpandableBadge({ abbreviation, color }: ExpandableBadgeProps) {
  return (
    <View style={[s.badge, { backgroundColor: `${color}20` }]}>
      <Text style={[s.text, { color }]} numberOfLines={1}>{abbreviation}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 11, fontWeight: '700' },
});
