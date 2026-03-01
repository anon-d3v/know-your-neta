import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import type { MPProfile } from '../../data/types';
import { MPAvatar } from './MPAvatar';
import { ExpandableBadge } from '../ui/ExpandableBadge';
import { StatCard } from '../ui/StatCard';
import { formatCroreShort } from '../../utils/format';
import { getPartyColor, colors } from '../../theme/colors';
import { getPartyAbbr, getPartyFullName } from '../../constants/parties';
import { useCompareStore } from '../../store/compareStore';

interface MPCardProps {
  mp: MPProfile;
  onShareImage?: (mp: MPProfile) => void;
  onShareChatroom?: (mp: MPProfile) => void;
}

export function MPCard({ mp, onShareImage, onShareChatroom }: MPCardProps) {
  const router = useRouter();
  const [showShareOpts, setShowShareOpts] = useState(false);

  const { basic, financial, criminal, reElection } = mp;
  const partyColor = getPartyColor(basic.politicalParty);
  const partyAbbr = getPartyAbbr(basic.politicalParty);

  const { addMP, removeMP, isSelected, canAddMore } = useCompareStore();
  const selected = isSelected(mp.id);

  const handlePress = () => router.push(`/mp/${mp.slug}`);

  const handleShareChatroom = () => {
    setShowShareOpts(false);
    onShareChatroom?.(mp);
  };

  const handleShareImage = () => {
    setShowShareOpts(false);
    onShareImage?.(mp);
  };

  const toggleCompare = () => selected ? removeMP(mp.id) : addMP(mp);

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white/[0.03] rounded-2xl p-4 active:opacity-80"
      style={{
        marginBottom: 12,
      }}
    >
      <View className="flex-row items-start mb-3">
        <MPAvatar name={basic.fullName} party={basic.politicalParty} mpId={mp.id} size="lg" />

        <View className="flex-1 ml-3">
          <Text
            className="text-lg font-semibold"
            style={{ color: colors.text.primary }}
          >
            {basic.fullName}
          </Text>
          <Text
            className="text-sm"
            style={{ color: colors.text.secondary }}
            numberOfLines={1}
          >
            {basic.constituency}, {basic.stateUT}
          </Text>
          <Text className="text-xs mt-0.5" style={{ color: colors.text.tertiary }}>
            Age: {basic.age} years
          </Text>
        </View>

        <ExpandableBadge
          abbreviation={partyAbbr}
          fullName={getPartyFullName(basic.politicalParty)}
          color={partyColor}
          autoCollapseMs={5000}
        />
      </View>

      <View className="flex-row gap-2">
        <StatCard
          label="Total Assets"
          value={`Rs.${formatCroreShort(financial.totalAssets)}`}
          variant="default"
          icon="wallet-outline"
        />

        {criminal.hasCases ? (
          <StatCard
            label="Criminal Cases"
            value={`${criminal.totalCases}`}
            variant="danger"
            icon="alert-circle-outline"
          />
        ) : (
          <StatCard
            label="Criminal Record"
            value="Clean"
            variant="success"
            icon="checkmark-circle-outline"
          />
        )}

        {reElection ? (
          <StatCard
            label="Re-Elected"
            value={`+${reElection.assetGrowth.growthPercentage}%`}
            subValue="Asset growth"
            variant={reElection.assetGrowth.growthPercentage > 50 ? 'warning' : 'default'}
            icon="trending-up-outline"
          />
        ) : (
          <StatCard
            label="First Term"
            value="New"
            subValue="2024 elected"
            variant="info"
            icon="star-outline"
          />
        )}
      </View>

      {showShareOpts && (
        <View className="flex-row items-center gap-2 mt-3 pt-2">
          {onShareChatroom && (
            <Pressable
              onPress={handleShareChatroom}
              className="flex-row items-center px-3 py-1.5 rounded-lg bg-white/5 active:opacity-70"
            >
              <Ionicons name="chatbubbles-outline" size={16} color={colors.text.secondary} />
              <Text className="text-sm font-medium ml-1.5" style={{ color: colors.text.secondary }}>
                Chatroom
              </Text>
            </Pressable>
          )}
          {onShareImage && (
            <Pressable
              onPress={handleShareImage}
              className="flex-row items-center px-3 py-1.5 rounded-lg bg-white/5 active:opacity-70"
            >
              <Ionicons name="image-outline" size={16} color={colors.text.secondary} />
              <Text className="text-sm font-medium ml-1.5" style={{ color: colors.text.secondary }}>
                Image
              </Text>
            </Pressable>
          )}
          <Pressable
            onPress={() => setShowShareOpts(false)}
            className="flex-row items-center px-2 py-1.5 rounded-lg active:opacity-70"
          >
            <Ionicons name="close" size={16} color={colors.text.muted} />
          </Pressable>
        </View>
      )}

      <View className="flex-row items-center justify-between mt-3 pt-3">
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={toggleCompare}
            disabled={!selected && !canAddMore()}
            className="flex-row items-center px-3 py-1.5 rounded-lg active:opacity-70"
            style={{
              backgroundColor: selected ? colors.primary[500] + '20' : 'rgba(255,255,255,0.05)',
              borderWidth: selected ? 1 : 0,
              borderColor: colors.primary[500] + '50',
              opacity: (!selected && !canAddMore()) ? 0.5 : 1,
            }}>
            <Ionicons
              name={selected ? 'checkmark-circle' : 'git-compare-outline'}
              size={16}
              color={selected ? colors.primary[500] : colors.text.secondary} />
            <Text
              className="text-sm font-medium ml-1.5"
              style={{ color: selected ? colors.primary[500] : colors.text.secondary }}>
              {selected ? 'Added' : 'Compare'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setShowShareOpts(!showShareOpts)}
            className="flex-row items-center px-3 py-1.5 rounded-lg active:opacity-70"
            style={{
              backgroundColor: showShareOpts ? colors.primary[500] + '20' : 'rgba(255,255,255,0.05)',
            }}
          >
            <Ionicons name="share-outline" size={16} color={showShareOpts ? colors.primary[500] : colors.text.secondary} />
            <Text className="text-sm font-medium ml-1.5" style={{ color: showShareOpts ? colors.primary[500] : colors.text.secondary }}>
              Share
            </Text>
          </Pressable>
        </View>
        <View className="flex-row items-center">
          <Text className="text-sm font-medium mr-1" style={{ color: colors.primary[500] }}>
            View Profile
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary[500]} />
        </View>
      </View>
    </Pressable>
  );
}
