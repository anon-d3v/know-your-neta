import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CriminalInfo } from '../../data/types';
import { Accordion } from '../ui/Accordion';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface CriminalSectionProps {
  criminal: CriminalInfo;
}

export function CriminalSection({ criminal }: CriminalSectionProps) {
  if (!criminal.hasCases) {
    return (
      <Card className="p-4">
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center mr-3">
            <Ionicons name="checkmark-circle" size={28} color="#10B981" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-green-700">
              No Criminal Cases
            </Text>
            <Text className="text-sm text-gray-500 mt-0.5">
              Clean record as per election affidavit
            </Text>
          </View>
        </View>
      </Card>
    );
  }

  const summaryText = `${criminal.totalCases} Cases | ${criminal.seriousIPCSections} Serious IPC | ${criminal.otherIPCSections} Other`;

  return (
    <Accordion
      title="Criminal Record"
      subtitle={summaryText}
      headerRight={
        <Badge
          label={`${criminal.totalCases}`}
          variant="danger"
        />
      }
    >
      <View className="gap-3">
        {/* Stats Summary */}
        <View className="flex-row gap-2 mb-2">
          <View className="flex-1 bg-red-50 rounded-lg p-3">
            <Text className="text-2xl font-bold text-red-700">{criminal.totalCases}</Text>
            <Text className="text-xs text-red-600">Total Cases</Text>
          </View>
          <View className="flex-1 bg-orange-50 rounded-lg p-3">
            <Text className="text-2xl font-bold text-orange-700">{criminal.seriousIPCSections}</Text>
            <Text className="text-xs text-orange-600">Serious IPC</Text>
          </View>
          <View className="flex-1 bg-amber-50 rounded-lg p-3">
            <Text className="text-2xl font-bold text-amber-700">{criminal.otherIPCSections}</Text>
            <Text className="text-xs text-amber-600">Other IPC</Text>
          </View>
        </View>

        {/* Charges List */}
        {criminal.charges.length > 0 && (
          <View className="bg-gray-50 rounded-lg overflow-hidden">
            <View className="flex-row bg-gray-100 px-3 py-2">
              <Text className="flex-1 text-xs font-semibold text-gray-600 uppercase">
                Charge Description
              </Text>
              <Text className="text-xs font-semibold text-gray-600 uppercase w-12 text-right">
                Count
              </Text>
            </View>

            {criminal.charges.map((charge, index) => (
              <View
                key={index}
                className={`flex-row px-3 py-2.5 ${
                  index < criminal.charges.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <Text className="flex-1 text-sm text-gray-700 pr-2" numberOfLines={2}>
                  {charge.description}
                </Text>
                <Text className="text-sm font-semibold text-gray-900 w-12 text-right">
                  {charge.count}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Disclaimer */}
        <View className="bg-amber-50 rounded-lg p-3 mt-2">
          <View className="flex-row items-start">
            <Ionicons name="information-circle" size={18} color="#D97706" style={{ marginTop: 2 }} />
            <Text className="flex-1 text-xs text-amber-700 ml-2">
              These are cases declared in the election affidavit. Being charged does not imply guilt;
              all individuals are presumed innocent until proven guilty.
            </Text>
          </View>
        </View>
      </View>
    </Accordion>
  );
}
