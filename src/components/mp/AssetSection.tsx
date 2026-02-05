import React from 'react';
import { View, Text } from 'react-native';

import type { FinancialInfo, ReElectionInfo } from '../../data/types';
import { formatCroreShort, formatRupeeCrore } from '../../utils/format';
import { Card } from '../ui/Card';
import { colors } from '../../theme/colors';

interface AssetSectionProps {
  financial: FinancialInfo;
  reElection: ReElectionInfo | null;
}

export function AssetSection({ financial, reElection }: AssetSectionProps) {
  return (
    <View className="gap-4">
      <Card className="p-4">
        <Text className="text-base font-semibold mb-3" style={{ color: colors.text.primary }}>Total Assets</Text>
        <View className="items-center py-4">
          <Text className="text-3xl font-bold" style={{ color: colors.primary[500] }}>
            {formatRupeeCrore(financial.totalAssets)}
          </Text>
        </View>
        <Row label="Movable" value={formatRupeeCrore(financial.movableAssets)} />
        <Row label="Immovable" value={formatRupeeCrore(financial.immovableAssets)} />
      </Card>

      {reElection && (
        <Card className="p-4">
          <Text className="text-base font-semibold mb-3" style={{ color: colors.text.primary }}>
            Asset Growth Comparison
          </Text>

          <View className="gap-3">
            <View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-sm" style={{ color: colors.text.tertiary }}>2019</Text>
                <Text className="text-sm font-medium" style={{ color: colors.text.secondary }}>
                  {formatCroreShort(reElection.assetGrowth.assets2019)}
                </Text>
              </View>
              <View className="h-3 bg-white/5 rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: colors.primary[300],
                    width: `${Math.min(
                      (reElection.assetGrowth.assets2019 / reElection.assetGrowth.assets2024) * 100,
                      100
                    )}%`,
                  }}
                />
              </View>
            </View>

            <View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-sm" style={{ color: colors.text.tertiary }}>2024</Text>
                <Text className="text-sm font-medium" style={{ color: colors.text.secondary }}>
                  {formatCroreShort(reElection.assetGrowth.assets2024)}
                </Text>
              </View>
              <View className="h-3 bg-white/5 rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full w-full"
                  style={{ backgroundColor: colors.primary[500] }}
                />
              </View>
            </View>

            <View className="flex-row justify-between items-center pt-3 mt-2">
              <View>
                <Text className="text-sm" style={{ color: colors.text.tertiary }}>Asset Change</Text>
                <Text className="text-base font-semibold" style={{ color: colors.text.primary }}>
                  {formatRupeeCrore(reElection.assetGrowth.assetChange)}
                </Text>
              </View>
              <View
                className="px-3 py-1.5 rounded-lg"
                style={{
                  backgroundColor:
                    reElection.assetGrowth.growthPercentage > 100
                      ? colors.semantic.dangerMuted
                      : reElection.assetGrowth.growthPercentage > 50
                      ? colors.semantic.warningMuted
                      : colors.semantic.successMuted,
                }}
              >
                <Text
                  className="text-sm font-bold"
                  style={{
                    color:
                      reElection.assetGrowth.growthPercentage > 100
                        ? colors.semantic.danger
                        : reElection.assetGrowth.growthPercentage > 50
                        ? colors.semantic.warning
                        : colors.semantic.success,
                  }}
                >
                  +{reElection.assetGrowth.growthPercentage}%
                </Text>
              </View>
            </View>
          </View>
        </Card>
      )}

      {reElection?.incomeSource && (
        <Card className="p-4">
          <Text className="text-base font-semibold mb-3" style={{ color: colors.text.primary }}>Source of Income</Text>
          <View className="gap-2">
            <IncomeRow label="Self" value={reElection.incomeSource.self} />
            {reElection.incomeSource.spouse && reElection.incomeSource.spouse !== 'NA' && (
              <IncomeRow label="Spouse" value={reElection.incomeSource.spouse} />
            )}
          </View>
        </Card>
      )}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-2">
      <Text className="text-sm" style={{ color: colors.text.tertiary }}>{label}</Text>
      <Text className="text-sm font-medium" style={{ color: colors.text.secondary }}>{value}</Text>
    </View>
  );
}

function IncomeRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="mt-2 pt-2 first:mt-0 first:pt-0">
      <Text className="text-xs uppercase tracking-wide" style={{ color: colors.text.muted }}>{label}</Text>
      <Text className="text-sm mt-1" style={{ color: colors.text.secondary }}>{value}</Text>
    </View>
  );
}
