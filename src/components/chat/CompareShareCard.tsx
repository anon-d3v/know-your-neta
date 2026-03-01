import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMP } from '@/hooks/useMPData';
import { useCompareStore } from '@/store/compareStore';
import { getPartyColor } from '@/theme/colors';
import { getPartyAbbr } from '@/constants/parties';
import { formatCroreShort } from '@/utils/format';
import { getMPPhotoUrl } from '@/lib/supabase';
import type { MPProfile } from '@/data/types';

interface CompareShareCardProps {
  slugs: string[];
}

export function CompareShareCard({ slugs }: CompareShareCardProps) {
  const router = useRouter();
  const setMPs = useCompareStore((s) => s.setMPs);

  const slug0 = slugs[0] || '';
  const slug1 = slugs[1] || '';
  const slug2 = slugs[2] || '';
  const mp0 = useMP(slug0);
  const mp1 = useMP(slug1);
  const mp2 = useMP(slug2);

  const loadedMPs = [mp0, mp1, mp2].filter((mp): mp is MPProfile => !!mp);
  const allLoaded = slugs.length === loadedMPs.length;

  if (!allLoaded) {
    return (
      <View style={{
        backgroundColor: 'rgba(129,140,248,0.08)',
        borderRadius: 12,
        padding: 12,
        borderLeftWidth: 3,
        borderLeftColor: 'rgba(129,140,248,0.3)',
        width: 300,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="git-compare-outline" size={14} color="rgba(129,140,248,0.5)" />
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
            MP Comparison (loading...)
          </Text>
        </View>
      </View>
    );
  }

  const handlePress = () => {
    setMPs(loadedMPs);
    router.push('/(tabs)');
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{
        backgroundColor: 'rgba(129,140,248,0.06)',
        borderRadius: 14,
        padding: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#818CF8',
        width: 300,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Ionicons name="git-compare-outline" size={14} color="#818CF8" />
        <Text style={{ color: '#818CF8', fontSize: 10, fontWeight: '700', letterSpacing: 1, marginLeft: 6 }}>
          MP COMPARISON
        </Text>
      </View>

      {/* MP list */}
      {loadedMPs.map((mp) => {
        const partyColor = getPartyColor(mp.basic.politicalParty);
        const partyAbbr = getPartyAbbr(mp.basic.politicalParty);
        return (
          <View
            key={mp.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Image
              source={{ uri: getMPPhotoUrl(mp.id) ?? undefined }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                backgroundColor: partyColor + '25',
              }}
              cachePolicy="disk"
              transition={200}
            />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }} numberOfLines={1}>
                {mp.basic.fullName}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, marginTop: 1 }} numberOfLines={1}>
                {mp.basic.constituency} &middot; {formatCroreShort(mp.financial.totalAssets)}
              </Text>
              <Text style={{ color: partyColor, fontSize: 9, fontWeight: '600', marginTop: 1 }} numberOfLines={1}>
                {partyAbbr}
              </Text>
            </View>
          </View>
        );
      })}

      {/* Footer */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
        <Text style={{ color: 'rgba(129,140,248,0.5)', fontSize: 10 }}>KYN - Know Your Neta</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: 'rgba(129,140,248,0.6)', fontSize: 10, fontWeight: '500' }}>View Comparison</Text>
          <Ionicons name="chevron-forward" size={12} color="rgba(129,140,248,0.6)" />
        </View>
      </View>
    </Pressable>
  );
}
