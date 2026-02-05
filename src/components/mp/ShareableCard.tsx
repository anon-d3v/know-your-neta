import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { MPProfile } from '../../data/types';
import { MPAvatar } from './MPAvatar';
import { formatCroreShort } from '../../utils/format';
import { getPartyColor, colors } from '../../theme/colors';
import { getPartyAbbr } from '../../constants/parties';

interface ShareableCardProps { mp: MPProfile; }

export const ShareableCard = forwardRef<View, ShareableCardProps>(({ mp }, ref) => {
  const { basic, financial, criminal, reElection } = mp;
  const clr = getPartyColor(basic.politicalParty);
  const abbr = getPartyAbbr(basic.politicalParty);

  return (
    <View ref={ref} style={st.container} collapsable={false}>
      <LinearGradient colors={['#1a1a2e', '#16213e', '#1a1a2e']} style={st.gradient}>
        <View style={st.header}>
          <View style={st.brandContainer}>
            <Text style={st.brandText}>KYN</Text>
            <Text style={st.brandSubtext}>Know Your Neta</Text>
          </View>
          <View style={[st.partyBadge, { backgroundColor: clr + '30', borderColor: clr }]}>
            <Text style={[st.partyText, { color: clr }]}>{abbr}</Text>
          </View>
        </View>

        <View style={st.mpInfo}>
          <MPAvatar name={basic.fullName} party={basic.politicalParty} mpId={mp.id} size="xl" />
          <Text style={st.mpName}>{basic.fullName}</Text>
          <View style={st.constituencyRow}>
            <Ionicons name="location" size={14} color={colors.text.tertiary} />
            <Text style={st.constituency}>{basic.constituency}, {basic.stateUT}</Text>
          </View>
          <Text style={st.age}>Age: {basic.age} years</Text>
        </View>

        <View style={st.statsGrid}>
          <View style={st.statBox}>
            <View style={[st.statIcon, { backgroundColor: 'rgba(251, 191, 36, 0.15)' }]}>
              <Ionicons name="wallet" size={20} color={colors.accent.amber} />
            </View>
            <Text style={st.statValue}>₹{formatCroreShort(financial.totalAssets)}</Text>
            <Text style={st.statLabel}>Total Assets</Text>
          </View>
          <View style={st.statBox}>
            <View style={[st.statIcon, { backgroundColor: criminal.hasCases ? 'rgba(248, 113, 113, 0.15)' : 'rgba(52, 211, 153, 0.15)' }]}>
              <Ionicons name={criminal.hasCases ? 'alert-circle' : 'checkmark-circle'} size={20} color={criminal.hasCases ? colors.semantic.danger : colors.semantic.success} />
            </View>
            <Text style={[st.statValue, { color: criminal.hasCases ? colors.semantic.danger : colors.semantic.success }]}>
              {criminal.hasCases ? criminal.totalCases : 'Clean'}
            </Text>
            <Text style={st.statLabel}>{criminal.hasCases ? 'Criminal Cases' : 'No Cases'}</Text>
          </View>
          <View style={st.statBox}>
            <View style={[st.statIcon, { backgroundColor: reElection ? 'rgba(34, 211, 238, 0.15)' : 'rgba(129, 140, 248, 0.15)' }]}>
              <Ionicons name={reElection ? 'trending-up' : 'star'} size={20} color={reElection ? colors.accent.cyan : colors.primary[500]} />
            </View>
            <Text style={[st.statValue, { color: reElection ? colors.accent.cyan : colors.primary[500] }]}>
              {reElection ? `+${reElection.assetGrowth.growthPercentage}%` : 'New'}
            </Text>
            <Text style={st.statLabel}>{reElection ? 'Asset Growth' : 'First Term'}</Text>
          </View>
        </View>

        <View style={st.footer}>
          <Text style={st.footerText}>Data from Election Affidavits (ECI)</Text>
          <View style={st.footerBrand}><Text style={st.footerKYN}>KYN App</Text></View>
        </View>

        <View style={[st.decorCorner, st.decorTopLeft]} />
        <View style={[st.decorCorner, st.decorTopRight]} />
        <View style={[st.decorCorner, st.decorBottomLeft]} />
        <View style={[st.decorCorner, st.decorBottomRight]} />
      </LinearGradient>
    </View>
  );
});

ShareableCard.displayName = 'ShareableCard';

const st = StyleSheet.create({
  container: {
    width: 400,
    borderRadius: 24,
    overflow: 'hidden',
  },
  gradient: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  brandText: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primary[500],
  },
  brandSubtext: {
    fontSize: 10,
    color: colors.text.tertiary,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  partyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  partyText: {
    fontSize: 12,
    fontWeight: '700',
  },
  mpInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  mpName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 12,
    textAlign: 'center',
  },
  constituencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  constituency: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  age: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 10,
    color: colors.text.tertiary,
    marginTop: 4,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  footerText: {
    fontSize: 10,
    color: colors.text.muted,
  },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerKYN: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary[500],
  },
  decorCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: colors.primary[500],
    opacity: 0.3,
  },
  decorTopLeft: {
    top: 12,
    left: 12,
    borderLeftWidth: 2,
    borderTopWidth: 2,
  },
  decorTopRight: {
    top: 12,
    right: 12,
    borderRightWidth: 2,
    borderTopWidth: 2,
  },
  decorBottomLeft: {
    bottom: 12,
    left: 12,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
  },
  decorBottomRight: {
    bottom: 12,
    right: 12,
    borderRightWidth: 2,
    borderBottomWidth: 2,
  },
});
