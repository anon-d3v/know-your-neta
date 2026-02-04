import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { colors } from '../../theme/colors';

// donut chart for re-elected vs first time MPs
interface ElectionStatusDonutProps { reElected: number; firstTime: number; }

// colors for the 2 segments
const PURPLE = '#A855F7';  // re-elected
const CYAN = '#22D3EE';    // first time

export function ElectionStatusDonut({ reElected, firstTime }: ElectionStatusDonutProps) {
  const total = reElected + firstTime;
  const rePct = Math.round((reElected / total) * 100);
  const ftPct = 100 - rePct;

  const data = [
    { value: reElected, color: PURPLE },
    { value: firstTime, color: CYAN, focused: true },
  ];

  const r = Math.min(Dimensions.get('window').width * 0.22, 90);

  return (
    <View className="items-center">
      <PieChart
        donut
        data={data}
        radius={r}
        innerRadius={r * 0.6}
        innerCircleColor={colors.dark.surface}
        centerLabelComponent={() => (
          <View className="items-center justify-center">
            <Text className="text-2xl font-bold" style={{ color: colors.text.primary }}>{ftPct}%</Text>
            <Text className="text-xs" style={{ color: colors.text.tertiary }}>first time</Text>
          </View>
        )}
      />
      {/* legend */}
      <View className="flex-row mt-4 gap-6">
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: PURPLE }} />
          <View>
            <Text className="text-sm font-medium" style={{ color: colors.text.primary }}>{reElected}</Text>
            <Text className="text-xs" style={{ color: colors.text.tertiary }}>Re-elected ({rePct}%)</Text>
          </View>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: CYAN }} />
          <View>
            <Text className="text-sm font-medium" style={{ color: colors.text.primary }}>{firstTime}</Text>
            <Text className="text-xs" style={{ color: colors.text.tertiary }}>First Time ({ftPct}%)</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
