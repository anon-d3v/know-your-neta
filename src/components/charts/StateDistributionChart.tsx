import React, { useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { colors } from '../../theme/colors';

interface StateDistributionChartProps {
  stateDistribution: Record<string, number>;
  limit?: number;
}

const stateAbbrs: Record<string, string> = {
  'Uttar Pradesh': 'UP', 'Maharashtra': 'MH', 'West Bengal': 'WB', 'Bihar': 'BR',
  'Tamil Nadu': 'TN', 'Madhya Pradesh': 'MP', 'Karnataka': 'KA', 'Gujarat': 'GJ',
  'Rajasthan': 'RJ', 'Andhra Pradesh': 'AP', 'Odisha': 'OD', 'Kerala': 'KL',
  'Telangana': 'TG', 'Assam': 'AS', 'Jharkhand': 'JH', 'Punjab': 'PB',
  'Chhattisgarh': 'CG', 'Haryana': 'HR', 'Delhi': 'DL', 'Jammu And Kashmir': 'JK',
  'Uttarakhand': 'UK', 'Himachal Pradesh': 'HP', 'Tripura': 'TR', 'Meghalaya': 'ML',
  'Manipur': 'MN', 'Nagaland': 'NL', 'Goa': 'GA', 'Arunachal Pradesh': 'AR',
  'Mizoram': 'MZ', 'Sikkim': 'SK', 'Andaman and Nicobar Islands': 'AN',
  'Chandigarh': 'CH', 'Dadra Nagar Haveli and Daman Diu': 'DD',
  'Lakshadweep': 'LD', 'Puducherry': 'PY', 'Ladakh': 'LA',
};
const getAbbr = (s: string) => stateAbbrs[s] || s.substring(0, 3).toUpperCase();

const barClrs = ['#818CF8', '#6366F1', '#4F46E5', '#4338CA', '#3730A3', '#312E81', '#4F46E5', '#6366F1', '#818CF8', '#A5B4FC'];

export function StateDistributionChart({ stateDistribution, limit = 10 }: StateDistributionChartProps) {
  const w = Dimensions.get('window').width - 80;

  const bars = useMemo(() => {
    return Object.entries(stateDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([state, ct], i) => ({
        value: ct,
        label: getAbbr(state),
        frontColor: barClrs[i % barClrs.length],
        topLabelComponent: () => <Text className="text-xs font-medium" style={{ color: colors.text.secondary }}>{ct}</Text>,
      }));
  }, [stateDistribution, limit]);

  const maxVal = Math.max(...bars.map(b => b.value));

  return (
    <View>
      <BarChart
        data={bars}
        width={w}
        height={180}
        barWidth={24}
        spacing={16}
        initialSpacing={8}
        endSpacing={8}
        barBorderRadius={4}
        noOfSections={4}
        maxValue={Math.ceil(maxVal * 1.1)}
        yAxisThickness={0}
        xAxisThickness={1}
        xAxisColor={colors.dark.border}
        yAxisTextStyle={{ color: colors.text.muted, fontSize: 10 }}
        xAxisLabelTextStyle={{ color: colors.text.secondary, fontSize: 9, fontWeight: '500' }}
        hideRules
      />
      <Text className="text-xs text-center mt-2" style={{ color: colors.text.muted }}>Top {limit} states/UTs by MPs</Text>
    </View>
  );
}
