import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useIndexData, useAllMPs } from '../../src/hooks/useMPData';
import { Card } from '../../src/components/ui/Card';
import { colors } from '../../src/theme/colors';
import {
  CriminalStatsDonut,
  ElectionStatusDonut,
  PartyDistributionChart,
  StateDistributionChart,
  AssetRangeChart,
  AgeDistributionChart,
} from '../../src/components/charts';

function QuickStatCard({
  icon,
  iconColor,
  iconBgColor,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBgColor: string;
  value: string | number;
  label: string;
}) {
  return (
    <Card className="flex-1 min-w-[45%] p-4">
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mb-3"
        style={{ backgroundColor: iconBgColor }}
      >
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <Text className="text-2xl font-bold" style={{ color: colors.text.primary }}>
        {value}
      </Text>
      <Text className="text-sm" style={{ color: colors.text.tertiary }}>
        {label}
      </Text>
    </Card>
  );
}

function ChartSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-6">
      <View className="mb-3">
        <Text className="text-lg font-semibold" style={{ color: colors.text.primary }}>
          {title}
        </Text>
        {subtitle && (
          <Text className="text-xs mt-1" style={{ color: colors.text.muted }}>
            {subtitle}
          </Text>
        )}
      </View>
      <Card className="p-4">{children}</Card>
    </View>
  );
}

export default function StatsScreen() {
  const { stats, meta, indexes } = useIndexData();
  const allMPs = useAllMPs();

  const withCriminalCases = indexes.withCriminalCases.length;
  const noCriminalCases = indexes.noCriminalCases.length;
  const reElected = indexes.reElected.length;
  const firstTime = indexes.firstTime.length;

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.dark.background }}
      edges={['bottom']}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        
        <Text className="text-lg font-semibold mb-3" style={{ color: colors.text.primary }}>
          Overview
        </Text>
        <View className="flex-row flex-wrap gap-3 mb-6">
          <QuickStatCard
            icon="people"
            iconColor={colors.primary[500]}
            iconBgColor={`${colors.primary[500]}33`}
            value={meta.totalMPs}
            label="Total MPs"
          />
          <QuickStatCard
            icon="alert-circle"
            iconColor={colors.semantic.danger}
            iconBgColor={colors.semantic.dangerMuted}
            value={stats.totalCriminalCases.toLocaleString()}
            label="Criminal Cases"
          />
        </View>

        
        <ChartSection
          title="Criminal Records"
          subtitle="Based on declared criminal cases in affidavits"
        >
          <CriminalStatsDonut withCases={withCriminalCases} noCases={noCriminalCases} />
        </ChartSection>

        
        <ChartSection
          title="Election Status"
          subtitle="Re-elected vs first-time MPs"
        >
          <ElectionStatusDonut reElected={reElected} firstTime={firstTime} />
        </ChartSection>

        
        <ChartSection
          title="Party Distribution"
          subtitle="Top 10 parties by MPs"
        >
          <PartyDistributionChart
            partyDistribution={stats.partyDistribution}
            totalMPs={meta.totalMPs}
            limit={10}
          />
        </ChartSection>

        
        <ChartSection
          title="State Representation"
          subtitle="MPs by state/union territory"
        >
          <StateDistributionChart
            stateDistribution={stats.stateDistribution}
            limit={10}
          />
        </ChartSection>

        
        <ChartSection
          title="Asset Distribution"
          subtitle="Declared assets from election affidavits"
        >
          <AssetRangeChart mps={allMPs} />
        </ChartSection>

        
        <ChartSection
          title="Age Distribution"
          subtitle="Age demographics of current Lok Sabha"
        >
          <AgeDistributionChart mps={allMPs} />
        </ChartSection>

        
        <View className="bg-white/[0.03] rounded-xl p-3 mb-4">
          <Text className="text-xs text-center" style={{ color: colors.text.muted }}>
            Data from election affidavits (ECI) as of{' '}
            {new Date(meta.generatedAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
