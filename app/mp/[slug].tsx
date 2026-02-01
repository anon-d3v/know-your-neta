import React from 'react';
import { View, Text, ScrollView, Share } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMP } from '../../src/hooks/useMPData';
import { MPAvatar } from '../../src/components/mp/MPAvatar';
import { AssetSection } from '../../src/components/mp/AssetSection';
import { CriminalSection } from '../../src/components/mp/CriminalSection';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { getPartyColor } from '../../src/theme/colors';
import { getPartyAbbr, getPartyConfig } from '../../src/constants/parties';

export default function MPDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const mp = useMP(slug || '');

  if (!mp) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Ionicons name="alert-circle" size={48} color="#D4D4D8" />
        <Text className="text-lg font-medium text-gray-400 mt-4">MP not found</Text>
      </SafeAreaView>
    );
  }

  const { basic, financial, criminal, reElection } = mp;
  const partyColor = getPartyColor(basic.politicalParty);
  const partyConfig = getPartyConfig(basic.politicalParty);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${basic.fullName} - ${basic.constituency}, ${basic.stateUT}\n\nParty: ${basic.politicalParty}\nTotal Assets: Rs. ${financial.totalAssetsFormatted}\nCriminal Cases: ${criminal.hasCases ? criminal.totalCases : 'None'}\n\nSource: KYN - Know Your Neta`,
        title: `${basic.fullName} - MP Profile`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View
          className="px-4 pt-4 pb-6"
          style={{ backgroundColor: `${partyColor}10` }}
        >
          <View className="items-center">
            <MPAvatar name={basic.fullName} party={basic.politicalParty} size="xl" />

            <Text className="text-2xl font-bold text-gray-900 mt-4 text-center">
              {basic.fullName}
            </Text>

            <View className="flex-row items-center mt-2">
              <Ionicons name="location" size={16} color="#71717A" />
              <Text className="text-base text-gray-600 ml-1">
                {basic.constituency}, {basic.stateUT}
              </Text>
            </View>

            <View className="flex-row items-center gap-2 mt-3">
              <Badge label={getPartyAbbr(basic.politicalParty)} color={partyColor} size="md" />
              <Badge label={`Age ${basic.age}`} variant="default" size="md" />
              {reElection && (
                <Badge label="Re-elected" variant="info" size="md" />
              )}
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="px-4 -mt-2">
          {/* Quick Stats */}
          <Card className="p-4 mb-4">
            <View className="flex-row">
              <View className="flex-1 items-center border-r border-gray-100">
                <Text className="text-2xl font-bold text-brand-600">
                  Rs.{financial.totalAssetsFormatted.replace(' Crore+', '')}
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">Crore+ Assets</Text>
              </View>

              <View className="flex-1 items-center border-r border-gray-100">
                <Text
                  className={`text-2xl font-bold ${
                    criminal.hasCases ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {criminal.hasCases ? criminal.totalCases : '0'}
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">Criminal Cases</Text>
              </View>

              <View className="flex-1 items-center">
                <Text className="text-2xl font-bold text-gray-900">
                  {reElection ? `+${reElection.assetGrowth.growthPercentage}%` : 'New'}
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  {reElection ? 'Asset Growth' : 'First Term'}
                </Text>
              </View>
            </View>
          </Card>

          {/* Basic Info */}
          <Card className="p-4 mb-4">
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Basic Information
            </Text>

            <View className="gap-2">
              <View className="flex-row justify-between py-2 border-b border-gray-100">
                <Text className="text-sm text-gray-500">Full Name</Text>
                <Text className="text-sm font-medium text-gray-900">{basic.fullName}</Text>
              </View>

              <View className="flex-row justify-between py-2 border-b border-gray-100">
                <Text className="text-sm text-gray-500">Constituency</Text>
                <Text className="text-sm font-medium text-gray-900">{basic.constituency}</Text>
              </View>

              <View className="flex-row justify-between py-2 border-b border-gray-100">
                <Text className="text-sm text-gray-500">State/UT</Text>
                <Text className="text-sm font-medium text-gray-900">{basic.stateUT}</Text>
              </View>

              <View className="flex-row justify-between py-2 border-b border-gray-100">
                <Text className="text-sm text-gray-500">Political Party</Text>
                <Text className="text-sm font-medium" style={{ color: partyColor }}>
                  {basic.politicalParty}
                </Text>
              </View>

              <View className="flex-row justify-between py-2 border-b border-gray-100">
                <Text className="text-sm text-gray-500">Age</Text>
                <Text className="text-sm font-medium text-gray-900">{basic.age} years</Text>
              </View>

              <View className="flex-row justify-between py-2">
                <Text className="text-sm text-gray-500">PAN Card Status</Text>
                <Badge
                  label={basic.panCardStatus}
                  variant={basic.panCardStatus === 'Provided' ? 'success' : 'warning'}
                  size="sm"
                />
              </View>
            </View>
          </Card>

          {/* Criminal Record Section (Accordion) */}
          <View className="mb-4">
            <CriminalSection criminal={criminal} />
          </View>

          {/* Asset Section */}
          <AssetSection financial={financial} reElection={reElection} />

          {/* Election History (for re-elected MPs) */}
          {reElection && reElection.electionHistory.length > 0 && (
            <Card className="p-4 mt-4">
              <Text className="text-base font-semibold text-gray-900 mb-3">
                Election History
              </Text>

              <View className="bg-gray-50 rounded-lg overflow-hidden">
                <View className="flex-row bg-gray-100 px-3 py-2">
                  <Text className="flex-1 text-xs font-semibold text-gray-600">Year</Text>
                  <Text className="flex-1 text-xs font-semibold text-gray-600">Party</Text>
                  <Text className="flex-1 text-xs font-semibold text-gray-600">Constituency</Text>
                </View>

                {reElection.electionHistory.map((election, index) => (
                  <View
                    key={index}
                    className={`flex-row px-3 py-2.5 ${
                      index < reElection.electionHistory.length - 1
                        ? 'border-b border-gray-200'
                        : ''
                    }`}
                  >
                    <Text className="flex-1 text-sm font-medium text-gray-900">
                      {election.year}
                    </Text>
                    <Text className="flex-1 text-sm text-gray-700">{election.party}</Text>
                    <Text className="flex-1 text-sm text-gray-700" numberOfLines={1}>
                      {election.constituency}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          )}

          {/* Data Source */}
          <Card className="p-4 mt-4 bg-gray-50">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={18} color="#71717A" />
              <View className="flex-1 ml-2">
                <Text className="text-xs text-gray-500 leading-relaxed">
                  This information is compiled from official election affidavits filed
                  with the Election Commission of India for the Lok Sabha Elections 2024.
                </Text>
                <View className="flex-row flex-wrap gap-2 mt-2">
                  <Text className="text-xs text-brand-500">ECI</Text>
                  <Text className="text-xs text-gray-400">|</Text>
                  <Text className="text-xs text-brand-500">ADR India</Text>
                  <Text className="text-xs text-gray-400">|</Text>
                  <Text className="text-xs text-brand-500">MyNeta</Text>
                </View>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
