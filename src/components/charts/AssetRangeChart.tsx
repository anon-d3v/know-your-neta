import React, { useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { colors } from '../../theme/colors';
import type { MPProfile } from '../../data/types';

interface AssetRangeChartProps { mps: MPProfile[]; }

const ranges = [
  { label: '< 1Cr', min: 0, max: 1e7, color: '#34D399' },
  { label: '1-5Cr', min: 1e7, max: 5e7, color: '#4ADE80' },
  { label: '5-10Cr', min: 5e7, max: 1e8, color: '#FBBF24' },
  { label: '10-25Cr', min: 1e8, max: 2.5e8, color: '#F97316' },
  { label: '25-50Cr', min: 2.5e8, max: 5e8, color: '#FB923C' },
  { label: '50-100Cr', min: 5e8, max: 1e9, color: '#F87171' },
  { label: '> 100Cr', min: 1e9, max: Infinity, color: '#EF4444' },
];

export function AssetRangeChart({ mps }: AssetRangeChartProps) {
  const w = Dimensions.get('window').width - 80;

  const bars = useMemo(() => {
    return ranges.map(r => {
      const ct = mps.filter(m => m.financial.totalAssets >= r.min && m.financial.totalAssets < r.max).length;
      return {
        value: ct, label: r.label, frontColor: r.color,
        topLabelComponent: () => <Text className="text-xs font-medium" style={{ color: colors.text.secondary }}>{ct}</Text>,
      };
    });
  }, [mps]);

  const maxVal = Math.max(...bars.map(b => b.value));

  return (
    <View>
      <BarChart
        data={bars}
        width={w}
        height={180}
        barWidth={32}
        spacing={12}
        initialSpacing={8}
        endSpacing={8}
        barBorderRadius={4}
        noOfSections={4}
        maxValue={Math.ceil(maxVal * 1.15)}
        yAxisThickness={0}
        xAxisThickness={1}
        xAxisColor={colors.dark.border}
        yAxisTextStyle={{ color: colors.text.muted, fontSize: 10 }}
        xAxisLabelTextStyle={{ color: colors.text.secondary, fontSize: 8, fontWeight: '500' }}
        hideRules
      />
      <Text className="text-xs text-center mt-2" style={{ color: colors.text.muted }}>MPs by declared asset range</Text>
    </View>
  );
}
