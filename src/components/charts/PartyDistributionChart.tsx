import React, { useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { colors, getPartyColor } from '../../theme/colors';

// bar chart showing MPs per party
interface PartyDistributionChartProps {
  partyDistribution: Record<string, number>;
  totalMPs: number;  // not actually used rn but might add percentage later
  limit?: number;
}

// short names for chart labels - some party names are way too long
const abbrs: Record<string, string> = {
  'BJP': 'BJP', 'INC': 'INC', 'SP': 'SP', 'AITC': 'TMC', 'DMK': 'DMK', 'TDP': 'TDP',
  'JD(U)': 'JDU', 'ShivSena (Uddhav Balasaheb Thackeray)': 'SHS-UBT',
  'Nationalist Congress Party – Sharadchandra Pawar': 'NCP-SP',
  'Shiv Sena': 'SHS', 'IND': 'IND', 'RJD': 'RJD', 'AAP': 'AAP',
  'CPI(M)': 'CPM', 'YSRCP': 'YSRCP', 'JMM': 'JMM',
};
const getAbbr = (p: string) => abbrs[p] || p.substring(0, 6);

export function PartyDistributionChart({ partyDistribution, totalMPs, limit = 10 }: PartyDistributionChartProps) {
  const w = Dimensions.get('window').width - 80;

  const bars = useMemo(() => {
    return Object.entries(partyDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([party, ct]) => ({
        value: ct,
        label: getAbbr(party),
        frontColor: getPartyColor(party),
        topLabelComponent: () => <Text className="text-xs font-medium" style={{ color: colors.text.secondary }}>{ct}</Text>,
      }));
  }, [partyDistribution, limit]);

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
      <Text className="text-xs text-center mt-2" style={{ color: colors.text.muted }}>Top {limit} parties by MPs</Text>
    </View>
  );
}
