import React from 'react';
import { View, Text } from 'react-native';
import type { FinancialInfo, ReElectionInfo } from '../../data/types';
import { formatFullIndianCurrency, formatCroreShort } from '../../utils/format';
import { Card } from '../ui/Card';

interface AssetSectionProps {
  financial: FinancialInfo;
  reElection: ReElectionInfo | null;
}

interface AssetRowProps {
  label: string;
  amount: number;
}

function AssetRow({ label, amount }: AssetRowProps) {
  return (
    <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
      <Text className="text-sm text-gray-600">{label}</Text>
      <Text className="text-sm font-semibold text-gray-900">
        {formatFullIndianCurrency(amount)}
      </Text>
    </View>
  );
}

export function AssetSection({ financial, reElection }: AssetSectionProps) {
  return (
    <View className="gap-4">
      {/* Current Assets */}
      <Card className="p-4">
        <Text className="text-base font-semibold text-gray-900 mb-3">
          Financial Declaration (2024)
        </Text>

        <AssetRow label="Movable Assets" amount={financial.movableAssets} />
        <AssetRow label="Immovable Assets" amount={financial.immovableAssets} />

        <View className="flex-row justify-between items-center py-3 mt-2 bg-brand-50 -mx-4 px-4 rounded-b-xl">
          <Text className="text-base font-semibold text-brand-700">Total Assets</Text>
          <Text className="text-lg font-bold text-brand-700">
            {formatFullIndianCurrency(financial.totalAssets)}
          </Text>
        </View>
      </Card>

      {/* Asset Growth (Re-elected MPs only) */}
      {reElection && (
        <Card className="p-4">
          <Text className="text-base font-semibold text-gray-900 mb-3">
            Asset Growth Comparison
          </Text>

          <View className="gap-3">
            {/* 2019 Bar */}
            <View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-sm text-gray-600">2019</Text>
                <Text className="text-sm font-medium text-gray-700">
                  {formatCroreShort(reElection.assetGrowth.assets2019)}
                </Text>
              </View>
              <View className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <View
                  className="h-full bg-brand-300 rounded-full"
                  style={{
                    width: `${Math.min(
                      (reElection.assetGrowth.assets2019 / reElection.assetGrowth.assets2024) * 100,
                      100
                    )}%`,
                  }}
                />
              </View>
            </View>

            {/* 2024 Bar */}
            <View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-sm text-gray-600">2024</Text>
                <Text className="text-sm font-medium text-gray-700">
                  {formatCroreShort(reElection.assetGrowth.assets2024)}
                </Text>
              </View>
              <View className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <View className="h-full bg-brand-600 rounded-full w-full" />
              </View>
            </View>

            {/* Growth Summary */}
            <View className="flex-row justify-between items-center pt-3 mt-2 border-t border-gray-100">
              <View>
                <Text className="text-sm text-gray-600">Asset Change</Text>
                <Text className="text-base font-semibold text-gray-900">
                  +{formatFullIndianCurrency(reElection.assetGrowth.assetChange)}
                </Text>
              </View>
              <View
                className={`px-3 py-1.5 rounded-full ${
                  reElection.assetGrowth.growthPercentage > 100
                    ? 'bg-red-100'
                    : reElection.assetGrowth.growthPercentage > 50
                    ? 'bg-amber-100'
                    : 'bg-green-100'
                }`}
              >
                <Text
                  className={`text-sm font-bold ${
                    reElection.assetGrowth.growthPercentage > 100
                      ? 'text-red-700'
                      : reElection.assetGrowth.growthPercentage > 50
                      ? 'text-amber-700'
                      : 'text-green-700'
                  }`}
                >
                  +{reElection.assetGrowth.growthPercentage}%
                </Text>
              </View>
            </View>
          </View>
        </Card>
      )}

      {/* Income Sources (Re-elected MPs only) */}
      {reElection && reElection.incomeSource && (
        <Card className="p-4">
          <Text className="text-base font-semibold text-gray-900 mb-3">
            Source of Income
          </Text>

          <View className="gap-2">
            <View>
              <Text className="text-xs text-gray-500 uppercase tracking-wide">Self</Text>
              <Text className="text-sm text-gray-700 mt-1">
                {reElection.incomeSource.self}
              </Text>
            </View>

            {reElection.incomeSource.spouse && reElection.incomeSource.spouse !== 'NA' && (
              <View className="mt-2 pt-2 border-t border-gray-100">
                <Text className="text-xs text-gray-500 uppercase tracking-wide">Spouse</Text>
                <Text className="text-sm text-gray-700 mt-1">
                  {reElection.incomeSource.spouse}
                </Text>
              </View>
            )}
          </View>
        </Card>
      )}
    </View>
  );
}
