import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ExpandableBadgeProps {
  abbreviation: string;
  fullName: string;
  color: string;
  autoCollapseMs?: number;
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
