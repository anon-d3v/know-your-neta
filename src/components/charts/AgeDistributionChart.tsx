import React, { useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { colors } from '../../theme/colors';
import type { MPProfile } from '../../data/types';

interface AgeDistributionChartProps { mps: MPProfile[]; }

const ranges = [
  { label: '25-35', min: 25, max: 36, color: '#22D3EE' },
  { label: '36-45', min: 36, max: 46, color: '#34D399' },
  { label: '46-55', min: 46, max: 56, color: '#4ADE80' },
  { label: '56-65', min: 56, max: 66, color: '#FBBF24' },
  { label: '66-75', min: 66, max: 76, color: '#F97316' },
  { label: '76+', min: 76, max: 150, color: '#F87171' },
];

export function AgeDistributionChart({ mps }: AgeDistributionChartProps) {
  const w = Dimensions.get('window').width - 80;

  const { bars, stats } = useMemo(() => {
    const counts = ranges.map(r => ({
      ...r,
      ct: mps.filter(m => m.basic.age >= r.min && m.basic.age < r.max).length,
    }));

    const ages = mps.map(m => m.basic.age).sort((a, b) => a - b);
    const youngest = Math.min(...ages);
    const oldest = Math.max(...ages);
    const median = ages[Math.floor(ages.length / 2)];

    return {
      bars: counts.map(({ label, ct, color }) => ({
        value: ct, label, frontColor: color,
        topLabelComponent: () => <Text className="text-xs font-medium" style={{ color: colors.text.secondary }}>{ct}</Text>,
      })),
      stats: { youngest, oldest, median },
    };
  }, [mps]);

  const maxVal = Math.max(...bars.map(b => b.value));

  return (
    <View>
      <BarChart
        data={bars}
        width={w}
        height={180}
        barWidth={36}
        spacing={16}
        initialSpacing={12}
        endSpacing={12}
        barBorderRadius={4}
        noOfSections={4}
        maxValue={Math.ceil(maxVal * 1.15)}
        yAxisThickness={0}
        xAxisThickness={1}
        xAxisColor={colors.dark.border}
        yAxisTextStyle={{ color: colors.text.muted, fontSize: 10 }}
        xAxisLabelTextStyle={{ color: colors.text.secondary, fontSize: 10, fontWeight: '500' }}
        hideRules
      />
      <View className="flex-row justify-around mt-4 pt-3 border-t border-white/10">
        <View className="items-center">
          <Text className="text-lg font-bold" style={{ color: colors.semantic.success }}>{stats.youngest}</Text>
          <Text className="text-xs" style={{ color: colors.text.muted }}>Youngest</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold" style={{ color: colors.primary[500] }}>{stats.median}</Text>
          <Text className="text-xs" style={{ color: colors.text.muted }}>Median Age</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold" style={{ color: colors.semantic.warning }}>{stats.oldest}</Text>
          <Text className="text-xs" style={{ color: colors.text.muted }}>Oldest</Text>
        </View>
      </View>
    </View>
  );
}
