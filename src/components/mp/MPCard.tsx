import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { MPProfile } from '../../data/types';
import { MPAvatar } from './MPAvatar';
import { Badge } from '../ui/Badge';
import { StatCard } from '../ui/StatCard';
import { formatCroreShort } from '../../utils/format';
import { getPartyColor } from '../../theme/colors';
import { getPartyAbbr } from '../../constants/parties';

interface MPCardProps {
  mp: MPProfile;
}

export function MPCard({ mp }: MPCardProps) {
  const router = useRouter();
  const { basic, financial, criminal, reElection } = mp;
  const partyColor = getPartyColor(basic.politicalParty);
  const partyAbbr = getPartyAbbr(basic.politicalParty);

  const handlePress = () => {
    router.push(`/mp/${mp.slug}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:opacity-90 active:scale-[0.99]"
      style={{ marginBottom: 12 }}
    >
      {/* Header Row */}
      <View className="flex-row items-start mb-3">
        <MPAvatar name={basic.fullName} party={basic.politicalParty} size="lg" />

        <View className="flex-1 ml-3">
          <Text className="text-lg font-semibold text-gray-900" numberOfLines={1}>
            {basic.fullName}
          </Text>
          <Text className="text-sm text-gray-500" numberOfLines={1}>
            {basic.constituency}, {basic.stateUT}
          </Text>
          <Text className="text-xs text-gray-400 mt-0.5">
            Age: {basic.age} years
          </Text>
        </View>

        <Badge label={partyAbbr} color={partyColor} />
      </View>

      {/* Stats Row */}
      <View className="flex-row gap-2">
        <StatCard
          label="Total Assets"
          value={`Rs.${formatCroreShort(financial.totalAssets)}`}
          variant="default"
        />

        {criminal.hasCases ? (
          <StatCard
            label="Criminal Cases"
            value={`${criminal.totalCases}`}
            subValue={`${criminal.seriousIPCSections} serious`}
            variant="danger"
          />
        ) : (
          <StatCard
            label="Criminal Cases"
            value="None"
            subValue="Clean record"
            variant="success"
          />
        )}

        {reElection ? (
          <StatCard
            label="Re-Elected"
            value={`+${reElection.assetGrowth.growthPercentage}%`}
            subValue="Asset growth"
            variant={reElection.assetGrowth.growthPercentage > 50 ? 'warning' : 'default'}
          />
        ) : (
          <StatCard
            label="First Term"
            value="New"
            subValue="2024 elected"
            variant="info"
          />
        )}
      </View>

      {/* View Details Indicator */}
      <View className="flex-row items-center justify-end mt-3 pt-2 border-t border-gray-50">
        <Text className="text-sm text-brand-500 font-medium mr-1">View Details</Text>
        <Ionicons name="chevron-forward" size={16} color="#6366F1" />
      </View>
    </Pressable>
  );
}
