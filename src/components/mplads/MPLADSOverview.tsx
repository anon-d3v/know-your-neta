import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Badge } from '../ui/Badge';
import { colors } from '../../theme/colors';
import type { MPLADSSummary } from '../../data/types';

interface MPLADSOverviewProps {
  summary: MPLADSSummary | null;
  isLoading?: boolean;
  mpSlug: string;
}

function formatAmount(amount: number): string {
  if (amount >= 10000000) {
    return `${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `${(amount / 100000).toFixed(2)} L`;
  }
  return `${(amount / 1000).toFixed(0)} K`;
}

export function MPLADSOverview({ summary, isLoading, mpSlug }: MPLADSOverviewProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <View className="bg-white/[0.03] rounded-2xl p-4">
        {/* Header */}
        <View className="flex-row items-center mb-4">
          <View className="w-9 h-9 rounded-xl bg-emerald-500/20 items-center justify-center mr-3">
            <Ionicons name="briefcase" size={18} color={colors.accent.emerald} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold" style={{ color: colors.text.primary }}>
              MPLADS Fund
            </Text>
            <Text className="text-xs" style={{ color: colors.text.tertiary }}>
              Local Area Development Scheme
            </Text>
          </View>
        </View>

        <View className="items-center py-6">
          <Ionicons name="hourglass-outline" size={24} color={colors.text.muted} />
          <Text className="text-sm mt-2" style={{ color: colors.text.tertiary }}>
            Loading fund details...
          </Text>
        </View>
      </View>
    );
  }

  if (!summary) {
    return (
      <View className="bg-white/[0.03] rounded-2xl p-4">
        {/* Header */}
        <View className="flex-row items-center mb-4">
          <View className="w-9 h-9 rounded-xl bg-emerald-500/20 items-center justify-center mr-3">
            <Ionicons name="briefcase" size={18} color={colors.accent.emerald} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold" style={{ color: colors.text.primary }}>
              MPLADS Fund
            </Text>
            <Text className="text-xs" style={{ color: colors.text.tertiary }}>
              Local Area Development Scheme
            </Text>
          </View>
        </View>

        <View className="items-center py-6 bg-white/[0.03] rounded-xl">
          <Ionicons name="document-outline" size={24} color={colors.text.muted} />
          <Text className="text-sm mt-2" style={{ color: colors.text.tertiary }}>
            MPLADS data not available
          </Text>
        </View>
      </View>
    );
  }

  const { allocation, utilizationPercentage, worksCount, totalExpenditure } = summary;
  const totalWorks = worksCount.recommended + worksCount.sanctioned + worksCount.completed;

  // Determine utilization color based on percentage
  const getUtilizationColor = () => {
    if (utilizationPercentage >= 70) return colors.semantic.success;
    if (utilizationPercentage >= 40) return colors.semantic.warning;
    return colors.semantic.danger;
  };

  const getUtilizationGradient = (): [string, string] => {
    if (utilizationPercentage >= 70) return [colors.semantic.success, colors.accent.emerald];
    if (utilizationPercentage >= 40) return [colors.semantic.warning, '#F59E0B'];
    return [colors.semantic.danger, '#EF4444'];
  };

  return (
    <View className="bg-white/[0.03] rounded-2xl p-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center flex-1">
          <View className="w-9 h-9 rounded-xl bg-emerald-500/20 items-center justify-center mr-3">
            <Ionicons name="briefcase" size={18} color={colors.accent.emerald} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold" style={{ color: colors.text.primary }}>
              MPLADS Fund
            </Text>
            <Text className="text-xs" style={{ color: colors.text.tertiary }}>
              Local Area Development Scheme
            </Text>
          </View>
        </View>
        <Badge label="FY 24-25" variant="glass" size="sm" />
      </View>

      {/* Main Stats */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1 bg-white/[0.05] rounded-xl p-3 items-center">
          <Text className="text-xs mb-1" style={{ color: colors.text.tertiary }}>
            Allocated
          </Text>
          <Text className="text-lg font-bold" style={{ color: colors.accent.emerald }}>
            ₹{formatAmount(allocation.allocatedAmount)}
          </Text>
        </View>

        <View className="flex-1 bg-white/[0.05] rounded-xl p-3 items-center">
          <Text className="text-xs mb-1" style={{ color: colors.text.tertiary }}>
            Utilized
          </Text>
          <Text className="text-lg font-bold" style={{ color: getUtilizationColor() }}>
            {utilizationPercentage}%
          </Text>
        </View>

        <View className="flex-1 bg-white/[0.05] rounded-xl p-3 items-center">
          <Text className="text-xs mb-1" style={{ color: colors.text.tertiary }}>
            Spent
          </Text>
          <Text className="text-lg font-bold" style={{ color: colors.primary[500] }}>
            ₹{formatAmount(totalExpenditure)}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="mb-4">
        <View className="flex-row justify-between mb-2">
          <Text className="text-xs font-medium" style={{ color: colors.text.secondary }}>
            Fund Utilization
          </Text>
          <Text className="text-xs font-medium" style={{ color: getUtilizationColor() }}>
            ₹{formatAmount(totalExpenditure)} / ₹{formatAmount(allocation.allocatedAmount)}
          </Text>
        </View>
        <View className="h-2.5 bg-white/10 rounded-full overflow-hidden">
          <LinearGradient
            colors={getUtilizationGradient()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: `${Math.min(utilizationPercentage, 100)}%`,
              height: '100%',
              borderRadius: 999,
            }}
          />
        </View>
      </View>

      {/* Works Count */}
      <View className="flex-row gap-2 mb-4">
        <View className="flex-1 flex-row items-center justify-center bg-blue-500/10 rounded-xl py-2.5">
          <View
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: colors.semantic.info }}
          />
          <Text className="text-xs font-medium" style={{ color: colors.text.secondary }}>
            <Text style={{ color: colors.semantic.info, fontWeight: 'bold' }}>
              {worksCount.recommended}
            </Text>{' '}
            Recommended
          </Text>
        </View>

        <View className="flex-1 flex-row items-center justify-center bg-amber-500/10 rounded-xl py-2.5">
          <View
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: colors.semantic.warning }}
          />
          <Text className="text-xs font-medium" style={{ color: colors.text.secondary }}>
            <Text style={{ color: colors.semantic.warning, fontWeight: 'bold' }}>
              {worksCount.sanctioned}
            </Text>{' '}
            Sanctioned
          </Text>
        </View>

        <View className="flex-1 flex-row items-center justify-center bg-emerald-500/10 rounded-xl py-2.5">
          <View
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: colors.semantic.success }}
          />
          <Text className="text-xs font-medium" style={{ color: colors.text.secondary }}>
            <Text style={{ color: colors.semantic.success, fontWeight: 'bold' }}>
              {worksCount.completed}
            </Text>{' '}
            Completed
          </Text>
        </View>
      </View>

      {/* View All Works Button */}
      {totalWorks > 0 && (
        <Pressable
          onPress={() => router.push(`/mp/${mpSlug}/works`)}
          className="flex-row items-center justify-center bg-emerald-500/20 rounded-xl py-3.5 active:opacity-70"
        >
          <Ionicons name="list-outline" size={16} color={colors.accent.emerald} />
          <Text className="text-sm font-semibold ml-2" style={{ color: colors.accent.emerald }}>
            View All {totalWorks} Works
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.accent.emerald} />
        </Pressable>
      )}

      {/* Data Source */}
      <View className="flex-row items-center justify-center mt-4 pt-3 border-t border-white/5">
        <Ionicons name="globe-outline" size={12} color={colors.text.muted} />
        <Text className="text-xs ml-1.5" style={{ color: colors.text.muted }}>
          Source: MPLADS Portal (mplads.gov.in)
        </Text>
      </View>
    </View>
  );
}
