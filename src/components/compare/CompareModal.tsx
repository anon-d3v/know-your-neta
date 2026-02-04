import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Dimensions, BackHandler, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCompareStore } from '../../store/compareStore';
import { MPAvatar } from '../mp/MPAvatar';
import { getPartyColor, colors } from '../../theme/colors';
import { getPartyFullName } from '../../constants/parties';
import { formatIndianCurrency } from '../../utils/format';
import type { MPProfile } from '../../data/types';

// FIXME: maybe should use a portal for this but it works fine for now
const H = Dimensions.get('window').height;

interface CompareModalProps { visible: boolean; onClose: () => void; }

interface CompareRowProps {
  label: string;
  values: (string | number)[];
  format?: 'currency' | 'number' | 'text';
  icon?: keyof typeof Ionicons.glyphMap;
}

// single comparison row - shows label + values for each MP side by side
function CompareRow({ label, values, format = 'text', icon }: CompareRowProps) {
  const fmt = (v: string | number) => {
    if (format === 'currency' && typeof v === 'number') return formatIndianCurrency(v);
    if (format === 'number' && typeof v === 'number') return v.toLocaleString('en-IN');
    return String(v);
  };

  return (
    <View style={st.row}>
      <View style={st.rowHeader}>
        {icon && <Ionicons name={icon} size={14} color={colors.text.muted} style={{ marginRight: 6 }} />}
        <Text style={st.rowLabel}>{label}</Text>
      </View>
      <View style={st.rowValues}>
        {values.map((v, i) => (
          <View key={i} style={st.rowValueItem}>
            <Text style={st.rowValueText} numberOfLines={2}>{fmt(v)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// party row gets its own component cuz it needs colored text
function PartyRow({ mps }: { mps: MPProfile[] }) {
  return (
    <View style={st.row}>
      <View style={st.rowHeader}>
        <Ionicons name="flag-outline" size={14} color={colors.text.muted} style={{ marginRight: 6 }} />
        <Text style={st.rowLabel}>Party</Text>
      </View>
      <View style={st.rowValues}>
        {mps.map((mp, i) => {
          const clr = getPartyColor(mp.basic.politicalParty);
          return (
            <View key={i} style={st.rowValueItem}>
              <Text style={[st.rowValueText, { color: clr }]} numberOfLines={2}>{getPartyFullName(mp.basic.politicalParty)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// header with avatar + remove btn for each MP column
function MPHeader({ mp, onRemove }: { mp: MPProfile; onRemove: () => void }) {
  return (
    <View style={st.mpHeader}>
      <Pressable onPress={onRemove} style={st.mpRemoveBtn}>
        <Ionicons name="close" size={14} color={colors.text.tertiary} />
      </Pressable>
      <View style={{ marginBottom: 8 }}>
        <MPAvatar name={mp.basic.fullName} party={mp.basic.politicalParty} mpId={mp.id} size="lg" />
      </View>
      <Text style={st.mpName} numberOfLines={2}>{mp.basic.fullName}</Text>
    </View>
  );
}

interface CriminalRowProps {
  label: string;
  mps: MPProfile[];
  valueKey: 'totalCases' | 'seriousIPCSections' | 'otherIPCSections';
  icon: keyof typeof Ionicons.glyphMap;
  onMPPress: (mp: MPProfile) => void;
}

// criminal record row - tappable if has cases (navigates to MP detail)
function CriminalRow({ label, mps, valueKey, icon, onMPPress }: CriminalRowProps) {
  return (
    <View style={st.row}>
      <View style={st.rowHeader}>
        <Ionicons name={icon} size={14} color={colors.text.muted} style={{ marginRight: 6 }} />
        <Text style={st.rowLabel}>{label}</Text>
      </View>
      <View style={st.rowValues}>
        {mps.map((mp, i) => {
          const val = mp.criminal[valueKey];
          const hasCases = mp.criminal.hasCases && val > 0;
          return (
            <View key={i} style={st.rowValueItem}>
              {hasCases ? (
                <Pressable onPress={() => onMPPress(mp)} style={st.dangerBadge}>
                  <Text style={st.dangerText}>{val}</Text>
                  <Ionicons name="chevron-forward" size={12} color={colors.semantic.danger} style={{ marginLeft: 2 }} />
                </Pressable>
              ) : (
                <Text style={st.rowValueText}>{val}</Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function CompareModal({ visible, onClose }: CompareModalProps) {
  const router = useRouter();
  const { selectedMPs, removeMP, clearAll } = useCompareStore();
  const [show, setShow] = useState(false);

  const y = useSharedValue(H);
  const bgOp = useSharedValue(0);

  // open/close animation
  useEffect(() => {
    if (visible && selectedMPs.length >= 2) {
      setShow(true);
      y.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.cubic) });
      bgOp.value = withTiming(1, { duration: 200 });
    } else {
      y.value = withTiming(H, { duration: 200, easing: Easing.in(Easing.cubic) });
      bgOp.value = withTiming(0, { duration: 150 }, () => runOnJS(setShow)(false));
    }
  }, [visible, selectedMPs.length]);

  const sheetAnim = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  const bgAnim = useAnimatedStyle(() => ({ opacity: bgOp.value }));

  // android back button
  useEffect(() => {
    if (Platform.OS === 'android' && visible) {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => { onClose(); return true; });
      return () => sub.remove();
    }
  }, [visible]);

  // auto close if we go below 2 MPs
  useEffect(() => {
    if (visible && selectedMPs.length < 2) onClose();
  }, [visible, selectedMPs.length, onClose]);

  const goToMP = (mp: MPProfile) => { onClose(); router.push(`/mp/${mp.slug}`); };

  if (!show || selectedMPs.length < 2) return null;

  const mps = selectedMPs;  // shorter

  return (
    <View style={st.overlay}>
      <Animated.View style={[st.backdrop, bgAnim]}>
        <Pressable style={st.backdropPressable} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[st.sheet, sheetAnim]}>
        {/* drag handle */}
        <View style={st.handleContainer}><View style={st.handle} /></View>

        {/* header */}
        <View style={st.header}>
          <Text style={st.title}>Compare MPs</Text>
          <View style={st.headerRight}>
            <Pressable onPress={clearAll} style={st.clearBtn}><Text style={st.clearBtnText}>Clear All</Text></Pressable>
            <Pressable onPress={onClose} style={st.closeBtn}><Ionicons name="close" size={20} color={colors.text.secondary} /></Pressable>
          </View>
        </View>

        <ScrollView style={st.content} showsVerticalScrollIndicator={false}>
          {/* mp avatars row */}
          <View style={st.mpHeadersContainer}>
            {mps.map(mp => <View key={mp.id} style={st.mpHeaderWrapper}><MPHeader mp={mp} onRemove={() => removeMP(mp.id)} /></View>)}
          </View>

          <View style={st.sectionsContainer}>
            {/* basic info */}
            <Text style={[st.sectionTitle, { color: colors.primary[500] }]}>Basic Information</Text>
            <View style={st.section}>
              <PartyRow mps={mps} />
              <CompareRow label="Constituency" values={mps.map(m => m.basic.constituency)} icon="location-outline" />
              <CompareRow label="State" values={mps.map(m => m.basic.stateUT)} icon="map-outline" />
              <CompareRow label="Age" values={mps.map(m => m.basic.age)} format="number" icon="calendar-outline" />
            </View>

            {/* financial */}
            <Text style={[st.sectionTitle, { color: colors.accent.amber, marginTop: 16 }]}>Financial Declaration</Text>
            <View style={st.section}>
              <CompareRow label="Total Assets" values={mps.map(m => m.financial.totalAssets)} format="currency" icon="wallet-outline" />
              <CompareRow label="Movable Assets" values={mps.map(m => m.financial.movableAssets)} format="currency" icon="car-outline" />
              <CompareRow label="Immovable Assets" values={mps.map(m => m.financial.immovableAssets)} format="currency" icon="home-outline" />
            </View>

            {/* criminal */}
            <Text style={[st.sectionTitle, { color: colors.semantic.danger, marginTop: 16 }]}>Criminal Record</Text>
            <View style={st.section}>
              <CriminalRow label="Total Cases" mps={mps} valueKey="totalCases" icon="alert-circle-outline" onMPPress={goToMP} />
              <CriminalRow label="Serious IPC" mps={mps} valueKey="seriousIPCSections" icon="warning-outline" onMPPress={goToMP} />
              <CriminalRow label="Other IPC" mps={mps} valueKey="otherIPCSections" icon="document-text-outline" onMPPress={goToMP} />
            </View>

            {/* asset growth for re-elected MPs */}
            {mps.some(m => m.reElection) && (
              <>
                <Text style={[st.sectionTitle, { color: colors.accent.cyan, marginTop: 16 }]}>Asset Growth (Re-elected)</Text>
                <View style={st.section}>
                  <CompareRow label="2019 Assets" values={mps.map(m => m.reElection?.assetGrowth.assets2019 || 'N/A')} format="currency" icon="time-outline" />
                  <CompareRow label="2024 Assets" values={mps.map(m => m.reElection?.assetGrowth.assets2024 || 'N/A')} format="currency" icon="trending-up-outline" />
                  <CompareRow label="Growth %" values={mps.map(m => m.reElection ? `${m.reElection.assetGrowth.growthPercentage}%` : 'N/A')} icon="analytics-outline" />
                </View>
              </>
            )}
          </View>
          <View style={{ height: 32 }} />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

// styles - kinda long but whatever
const st = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  backdropPressable: {
    flex: 1,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(23, 23, 23, 0.98)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: H * 0.85,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
  },
  clearBtnText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  closeBtn: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  mpHeadersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  mpHeaderWrapper: {
    flex: 1,
    paddingHorizontal: 4,
  },
  mpHeader: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
  },
  mpRemoveBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  mpName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  sectionsContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: colors.text.muted,
  },
  rowValues: {
    flexDirection: 'row',
  },
  rowValueItem: {
    flex: 1,
    alignItems: 'center',
  },
  rowValueText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'center',
  },
  dangerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(248, 113, 113, 0.15)',
  },
  dangerText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.semantic.danger,
  },
});
