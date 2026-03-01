import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMP } from '@/hooks/useMPData';
import { getPartyColor } from '@/theme/colors';
import { getPartyAbbr } from '@/constants/parties';
import { formatCroreShort } from '@/utils/format';
import { getMPPhotoUrl } from '@/lib/supabase';

interface MPShareCardProps {
  slug: string;
}

export function MPShareCard({ slug }: MPShareCardProps) {
  const mp = useMP(slug);
  const router = useRouter();

  if (!mp) {
    return (
      <View style={{
        backgroundColor: 'rgba(129,140,248,0.08)',
        borderRadius: 12,
        padding: 12,
        borderLeftWidth: 3,
        borderLeftColor: 'rgba(129,140,248,0.3)',
      }}>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
          MP Profile (loading...)
        </Text>
      </View>
    );
  }

  const { basic, financial, criminal } = mp;
  const partyColor = getPartyColor(basic.politicalParty);
  const partyAbbr = getPartyAbbr(basic.politicalParty);

  return (
    <Pressable
      onPress={() => router.push(`/mp/${slug}`)}
      style={{
        backgroundColor: 'rgba(129,140,248,0.06)',
        borderRadius: 14,
        padding: 12,
        borderLeftWidth: 3,
        borderLeftColor: partyColor,
        width: 300,
      }}
    >
      {/* Header row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Image
          source={{ uri: getMPPhotoUrl(mp.id) ?? undefined }}
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            backgroundColor: partyColor + '25',
          }}
          cachePolicy="disk"
          transition={200}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }} numberOfLines={1}>
            {basic.fullName}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }} numberOfLines={1}>
            {basic.constituency}, {basic.stateUT}
          </Text>
          <Text style={{ color: partyColor, fontSize: 10, fontWeight: '600', marginTop: 2 }} numberOfLines={1}>
            {partyAbbr}
          </Text>
        </View>
      </View>

      {/* Stats row */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: 8,
          paddingVertical: 6,
          alignItems: 'center',
        }}>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '700' }}>
            {formatCroreShort(financial.totalAssets)}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, marginTop: 1 }}>Assets</Text>
        </View>

        <View style={{
          flex: 1,
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: 8,
          paddingVertical: 6,
          alignItems: 'center',
        }}>
          <Text style={{
            color: criminal.hasCases ? '#F87171' : '#34D399',
            fontSize: 12,
            fontWeight: '700',
          }}>
            {criminal.hasCases ? `${criminal.totalCases} Cases` : 'Clean'}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, marginTop: 1 }}>Record</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
        <Text style={{ color: 'rgba(129,140,248,0.5)', fontSize: 10 }}>KYN - Know Your Neta</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: 'rgba(129,140,248,0.6)', fontSize: 10, fontWeight: '500' }}>View Profile</Text>
          <Ionicons name="chevron-forward" size={12} color="rgba(129,140,248,0.6)" />
        </View>
      </View>
    </Pressable>
  );
}
