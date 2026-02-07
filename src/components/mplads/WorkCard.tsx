import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { colors } from '../../theme/colors';
import type { MPWork } from '../../data/types';

interface WorkCardProps {
  work: MPWork;
  onPress?: () => void;
}

function formatAmount(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)} K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getStatusVariant(status: MPWork['status']): 'info' | 'warning' | 'success' {
  switch (status) {
    case 'Recommended':
      return 'info';
    case 'Sanctioned':
      return 'warning';
    case 'Completed':
      return 'success';
  }
}

function getStatusIcon(status: MPWork['status']): keyof typeof Ionicons.glyphMap {
  switch (status) {
    case 'Recommended':
      return 'document-text-outline';
    case 'Sanctioned':
      return 'checkmark-circle-outline';
    case 'Completed':
      return 'trophy-outline';
  }
}

export function WorkCard({ work, onPress }: WorkCardProps) {
  const statusVariant = getStatusVariant(work.status);
  const statusIcon = getStatusIcon(work.status);

  // Get the relevant amount based on status
  const displayAmount =
    work.status === 'Completed'
      ? work.finalAmount || work.sanctionedAmount || work.recommendedAmount
      : work.status === 'Sanctioned'
      ? work.sanctionedAmount || work.recommendedAmount
      : work.recommendedAmount;

  // Get the relevant date based on status
  const displayDate =
    work.status === 'Completed' ? work.completionDate : work.recommendationDate;

  return (
    <Card onPress={onPress} className="p-4 mb-3">
      {/* Header Row */}
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 mr-2">
          <Text
            className="text-sm font-medium"
            style={{ color: colors.text.primary }}
            numberOfLines={2}
          >
            {work.workType.replace(/^.*?-/, '').trim()}
          </Text>
        </View>
        <Badge label={work.status} variant={statusVariant} size="sm" />
      </View>

      {/* Description */}
      <Text
        className="text-xs mb-3"
        style={{ color: colors.text.secondary }}
        numberOfLines={2}
      >
        {work.description}
      </Text>

      {/* Work Details */}
      <View className="flex-row flex-wrap gap-2 mb-3">
        {/* Category */}
        <View className="flex-row items-center bg-white/[0.03] rounded-lg px-2 py-1">
          <Ionicons name="folder-outline" size={12} color={colors.text.tertiary} />
          <Text className="text-xs ml-1" style={{ color: colors.text.tertiary }}>
            {work.category === 'Normal/Others' ? 'Normal' : 'Repair'}
          </Text>
        </View>

        {/* District */}
        <View className="flex-row items-center bg-white/[0.03] rounded-lg px-2 py-1">
          <Ionicons name="location-outline" size={12} color={colors.text.tertiary} />
          <Text className="text-xs ml-1" style={{ color: colors.text.tertiary }} numberOfLines={1}>
            {work.district.split('(')[0].trim()}
          </Text>
        </View>

      </View>

      {/* Footer - Amount and Date */}
      <View className="flex-row items-center justify-between pt-2 border-t border-white/5">
        <View className="flex-row items-center">
          <Ionicons name="wallet-outline" size={14} color={colors.accent.emerald} />
          <Text className="text-sm font-semibold ml-1" style={{ color: colors.accent.emerald }}>
            {formatAmount(displayAmount)}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Ionicons name={statusIcon} size={14} color={colors.text.tertiary} />
          <Text className="text-xs ml-1" style={{ color: colors.text.tertiary }}>
            {formatDate(displayDate)}
          </Text>
        </View>
      </View>

      {/* Rating (if completed and rated) */}
      {work.status === 'Completed' && work.rating !== null && (
        <View className="flex-row items-center mt-2 pt-2 border-t border-white/5">
          <Ionicons name="star" size={14} color={colors.semantic.warning} />
          <Text className="text-xs ml-1" style={{ color: colors.semantic.warning }}>
            {work.rating.toFixed(1)} Rating
          </Text>
        </View>
      )}
    </Card>
  );
}
