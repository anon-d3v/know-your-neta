import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { colors } from '../../theme/colors';

interface CriminalStatsDonutProps {
  withCases: number;
  noCases: number;
}

export function CriminalStatsDonut({ withCases, noCases }: CriminalStatsDonutProps) {
  const total = withCases + noCases;
  const withPct = Math.round((withCases / total) * 100);
  const noPct = 100 - withPct;

  const pieData = [
    { value: noCases, color: colors.semantic.success, focused: true },
    { value: withCases, color: colors.semantic.danger },
  ];

  const screenW = Dimensions.get('window').width;
  const radius = Math.min(screenW * 0.22, 90);

  return (
    <View className="items-center">
      <PieChart
        donut
        data={pieData}
        radius={radius}
        innerRadius={radius * 0.6}
        innerCircleColor={colors.dark.surface}
        centerLabelComponent={() => (
          <View className="items-center justify-center">
            <Text className="text-2xl font-bold" style={{ color: colors.text.primary }}>{withPct}%</Text>
            <Text className="text-xs" style={{ color: colors.text.tertiary }}>with cases</Text>
          </View>
        )}
      />
      <View className="flex-row mt-4 gap-6">
        <LegendItem color={colors.semantic.success} count={noCases} label="Clean" pct={noPct} />
        <LegendItem color={colors.semantic.danger} count={withCases} label="With Cases" pct={withPct} />
      </View>
    </View>
  );
}

function LegendItem({ color, count, label, pct }: { color: string; count: number; label: string; pct: number }) {
  return (
    <View className="flex-row items-center">
      <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }} />
      <View>
        <Text className="text-sm font-medium" style={{ color: colors.text.primary }}>{count}</Text>
        <Text className="text-xs" style={{ color: colors.text.tertiary }}>{label} ({pct}%)</Text>
      </View>
    </View>
  );
}
