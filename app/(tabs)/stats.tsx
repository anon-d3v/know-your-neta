import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useIndexData } from '../../src/hooks/useMPData';
import { Card } from '../../src/components/ui/Card';
import { formatCroreShort } from '../../src/utils/format';

export default function StatsScreen() {
  const { stats, meta, indexes } = useIndexData();

  // Get top 5 parties
  const topParties = Object.entries(stats.partyDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Get top 5 states
  const topStates = Object.entries(stats.stateDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview Stats */}
        <Text className="text-lg font-semibold text-gray-900 mb-3">Overview</Text>
        <View className="flex-row flex-wrap gap-3 mb-6">
          <Card className="flex-1 min-w-[45%] p-4">
            <Ionicons name="people" size={24} color="#6366F1" />
            <Text className="text-2xl font-bold text-gray-900 mt-2">{meta.totalMPs}</Text>
            <Text className="text-sm text-gray-500">Total MPs</Text>
          </Card>

          <Card className="flex-1 min-w-[45%] p-4">
            <Ionicons name="cash" size={24} color="#10B981" />
            <Text className="text-2xl font-bold text-gray-900 mt-2">
              {formatCroreShort(stats.totalAssets)}
            </Text>
            <Text className="text-sm text-gray-500">Total Assets</Text>
          </Card>

          <Card className="flex-1 min-w-[45%] p-4">
            <Ionicons name="calendar" size={24} color="#F59E0B" />
            <Text className="text-2xl font-bold text-gray-900 mt-2">{stats.avgAge}</Text>
            <Text className="text-sm text-gray-500">Average Age</Text>
          </Card>

          <Card className="flex-1 min-w-[45%] p-4">
            <Ionicons name="alert-circle" size={24} color="#EF4444" />
            <Text className="text-2xl font-bold text-gray-900 mt-2">{stats.totalCriminalCases}</Text>
            <Text className="text-sm text-gray-500">Criminal Cases</Text>
          </Card>
        </View>

        {/* Criminal Record Stats */}
        <Text className="text-lg font-semibold text-gray-900 mb-3">Criminal Records</Text>
        <Card className="p-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-1">
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                <Text className="text-sm text-gray-600">Clean Record</Text>
              </View>
              <Text className="text-xl font-bold text-gray-900 mt-1">
                {indexes.noCriminalCases.length}
              </Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                <Text className="text-sm text-gray-600">With Cases</Text>
              </View>
              <Text className="text-xl font-bold text-gray-900 mt-1">
                {indexes.withCriminalCases.length}
              </Text>
            </View>
          </View>
          <View className="h-4 bg-gray-100 rounded-full flex-row overflow-hidden">
            <View
              className="bg-green-500 h-full"
              style={{
                width: `${(indexes.noCriminalCases.length / meta.totalMPs) * 100}%`,
              }}
            />
            <View
              className="bg-red-500 h-full"
              style={{
                width: `${(indexes.withCriminalCases.length / meta.totalMPs) * 100}%`,
              }}
            />
          </View>
          <Text className="text-xs text-gray-500 text-center mt-2">
            {Math.round((indexes.withCriminalCases.length / meta.totalMPs) * 100)}% of MPs have declared criminal cases
          </Text>
        </Card>

        {/* Re-election Stats */}
        <Text className="text-lg font-semibold text-gray-900 mb-3">Election Status</Text>
        <Card className="p-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-1">
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-brand-500 mr-2" />
                <Text className="text-sm text-gray-600">Re-elected</Text>
              </View>
              <Text className="text-xl font-bold text-gray-900 mt-1">
                {indexes.reElected.length}
              </Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                <Text className="text-sm text-gray-600">First Time</Text>
              </View>
              <Text className="text-xl font-bold text-gray-900 mt-1">
                {indexes.firstTime.length}
              </Text>
            </View>
          </View>
          <View className="h-4 bg-gray-100 rounded-full flex-row overflow-hidden">
            <View
              className="bg-brand-500 h-full"
              style={{
                width: `${(indexes.reElected.length / meta.totalMPs) * 100}%`,
              }}
            />
            <View
              className="bg-blue-500 h-full"
              style={{
                width: `${(indexes.firstTime.length / meta.totalMPs) * 100}%`,
              }}
            />
          </View>
        </Card>

        {/* Party Distribution */}
        <Text className="text-lg font-semibold text-gray-900 mb-3">Top Parties</Text>
        <Card className="p-4 mb-6">
          {topParties.map(([partyName, count], index) => (
            <View key={partyName} className={index > 0 ? 'mt-3' : ''}>
              <View className="flex-row justify-between mb-1">
                <Text className="text-sm text-gray-700" numberOfLines={1}>
                  {partyName}
                </Text>
                <Text className="text-sm font-medium text-gray-900">{count}</Text>
              </View>
              <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <View
                  className="bg-brand-500 h-full rounded-full"
                  style={{ width: `${(count / meta.totalMPs) * 100}%` }}
                />
              </View>
            </View>
          ))}
        </Card>

        {/* State Distribution */}
        <Text className="text-lg font-semibold text-gray-900 mb-3">Top States</Text>
        <Card className="p-4 mb-6">
          {topStates.map(([stateName, count], index) => (
            <View key={stateName} className={index > 0 ? 'mt-3' : ''}>
              <View className="flex-row justify-between mb-1">
                <Text className="text-sm text-gray-700" numberOfLines={1}>
                  {stateName}
                </Text>
                <Text className="text-sm font-medium text-gray-900">{count}</Text>
              </View>
              <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <View
                  className="bg-green-500 h-full rounded-full"
                  style={{ width: `${(count / meta.totalMPs) * 100}%` }}
                />
              </View>
            </View>
          ))}
        </Card>

        {/* Data Info */}
        <View className="bg-gray-100 rounded-lg p-3 mb-4">
          <Text className="text-xs text-gray-500 text-center">
            Data generated: {new Date(meta.generatedAt).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
