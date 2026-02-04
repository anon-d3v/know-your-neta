import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, BackHandler, Dimensions, Platform, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useFilterStore, type SortField } from '../../store/filterStore';
import { colors } from '../../theme/colors';
import type { MPIndex } from '../../data/types';

// FIXME: this component is getting pretty big, should probably split filters into separate components
// but it works for now so ¯\_(ツ)_/¯
const H = Dimensions.get('window').height;

interface SortFilterModalProps {
  visible: boolean;
  onClose: () => void;
  index: MPIndex | null;
}

// sort by options
const sortOpts: { field: SortField; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { field: 'name', label: 'Name', icon: 'person-outline' },
  { field: 'assets', label: 'Total Assets', icon: 'wallet-outline' },
  { field: 'criminal_cases', label: 'Criminal Cases', icon: 'alert-circle-outline' },
  { field: 'age', label: 'Age', icon: 'calendar-outline' },
  { field: 'constituency', label: 'Constituency', icon: 'location-outline' },
];

// criminal filter chips
const crimOpts = [
  { value: 'all', label: 'All MPs', icon: 'people-outline' },
  { value: 'with_cases', label: 'With Cases', icon: 'alert-circle' },
  { value: 'no_cases', label: 'No Cases', icon: 'checkmark-circle' },
] as const;

// election status chips
const elecOpts = [
  { value: 'all', label: 'All MPs', icon: 'people-outline' },
  { value: 're_elected', label: 'Re-elected', icon: 'refresh-circle' },
  { value: 'first_time', label: 'First Time', icon: 'star-outline' },
] as const;

export function SortFilterModal({ visible, onClose, index }: SortFilterModalProps) {
  const [openSection, setOpenSection] = useState<'state' | 'party' | null>(null);
  const [show, setShow] = useState(false);

  const y = useSharedValue(H);
  const bgOp = useSharedValue(0);

  // grab filter state from store
  const selState = useFilterStore(s => s.state);
  const selParty = useFilterStore(s => s.party);
  const crimFilter = useFilterStore(s => s.criminalFilter);
  const elecFilter = useFilterStore(s => s.electionFilter);
  const sortFld = useFilterStore(s => s.sortField);
  const sortDir = useFilterStore(s => s.sortDirection);

  // actions
  const setStateF = useFilterStore(s => s.setState);
  const setPartyF = useFilterStore(s => s.setParty);
  const setCrim = useFilterStore(s => s.setCriminalFilter);
  const setElec = useFilterStore(s => s.setElectionFilter);
  const setSortF = useFilterStore(s => s.setSort);
  const clearAll = useFilterStore(s => s.clearFilters);

  // slide animation
  useEffect(() => {
    if (visible) {
      setShow(true);
      y.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.cubic) });
      bgOp.value = withTiming(1, { duration: 200 });
    } else {
      y.value = withTiming(H, { duration: 200, easing: Easing.in(Easing.cubic) });
      bgOp.value = withTiming(0, { duration: 150 }, () => runOnJS(setShow)(false));
    }
  }, [visible]);

  const sheetAnim = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  const bgAnim = useAnimatedStyle(() => ({ opacity: bgOp.value }));

  // handle android back
  useEffect(() => {
    if (Platform.OS === 'android' && visible) {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => { close(); return true; });
      return () => sub.remove();
    }
  }, [visible]);

  const toggleSort = useCallback((f: SortField) => {
    // if same field, toggle direction. otherwise reset to asc
    setSortF(f, sortFld === f ? (sortDir === 'asc' ? 'desc' : 'asc') : 'asc');
  }, [sortFld, sortDir, setSortF]);

  const close = useCallback(() => { setOpenSection(null); onClose(); }, [onClose]);

  const states = index?.states || [];
  const parties = index?.parties || [];

  // count active filters for badge
  const filterCt = useMemo(() => {
    let n = 0;
    if (selState) n++;
    if (selParty) n++;
    if (crimFilter !== 'all') n++;
    if (elecFilter !== 'all') n++;
    if (sortFld !== 'name' || sortDir !== 'asc') n++;
    return n;
  }, [selState, selParty, crimFilter, elecFilter, sortFld, sortDir]);

  if (!show) return null;

  return (
    <View style={st.overlay}>
      <Animated.View style={[st.backdrop, bgAnim]}>
        <Pressable style={st.backdropPressable} onPress={close} />
      </Animated.View>

      <Animated.View style={[st.sheet, sheetAnim]}>
        <View style={st.handleContainer}><View style={st.handle} /></View>

        {/* header */}
        <View style={st.header}>
          <View style={st.headerLeft}>
            <Text style={st.title}>Sort & Filter</Text>
            {filterCt > 0 && <View style={st.badge}><Text style={st.badgeText}>{filterCt}</Text></View>}
          </View>
          <View style={st.headerRight}>
            {filterCt > 0 && <Pressable onPress={clearAll} style={st.resetButton}><Text style={st.resetText}>Reset</Text></Pressable>}
            <Pressable onPress={close} style={st.closeButton}><Ionicons name="close" size={20} color="rgba(255,255,255,0.7)" /></Pressable>
          </View>
        </View>

        <ScrollView style={st.content} showsVerticalScrollIndicator={false}>
          {/* sort by */}
          <View style={st.sectionHeader}>
            <Ionicons name="swap-vertical-outline" size={18} color="rgba(255,255,255,0.6)" />
            <Text style={st.sectionTitle}>Sort By</Text>
          </View>
          {sortOpts.map(opt => {
            const sel = sortFld === opt.field;
            return (
              <Pressable key={opt.field} onPress={() => toggleSort(opt.field)} style={[st.sortItem, sel && st.sortItemSelected]}>
                <View style={st.sortItemLeft}>
                  <Ionicons name={opt.icon} size={20} color={sel ? colors.primary[500] : 'rgba(255,255,255,0.5)'} />
                  <Text style={[st.sortItemText, sel && st.sortItemTextSelected]}>{opt.label}</Text>
                </View>
                {sel && (
                  <View style={st.sortDirection}>
                    <Ionicons name={sortDir === 'asc' ? 'arrow-up' : 'arrow-down'} size={18} color={colors.primary[500]} />
                    <Text style={st.sortDirectionText}>{sortDir === 'asc' ? 'A-Z' : 'Z-A'}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}

          {/* criminal filter */}
          <View style={[st.sectionHeader, { marginTop: 16 }]}>
            <Ionicons name="shield-outline" size={18} color="rgba(255,255,255,0.6)" />
            <Text style={st.sectionTitle}>Criminal Record</Text>
          </View>
          <View style={st.chipContainer}>
            {crimOpts.map(opt => {
              const sel = crimFilter === opt.value;
              return (
                <Pressable key={opt.value} onPress={() => setCrim(opt.value)} style={[st.chip, sel && st.chipSelected]}>
                  <Ionicons name={opt.icon} size={16} color={sel ? colors.primary[500] : 'rgba(255,255,255,0.5)'} />
                  <Text style={[st.chipText, sel && st.chipTextSelected]}>{opt.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* election filter */}
          <View style={[st.sectionHeader, { marginTop: 16 }]}>
            <Ionicons name="flag-outline" size={18} color="rgba(255,255,255,0.6)" />
            <Text style={st.sectionTitle}>Election Status</Text>
          </View>
          <View style={st.chipContainer}>
            {elecOpts.map(opt => {
              const sel = elecFilter === opt.value;
              return (
                <Pressable key={opt.value} onPress={() => setElec(opt.value)} style={[st.chip, sel && st.chipSelected]}>
                  <Ionicons name={opt.icon} size={16} color={sel ? colors.primary[500] : 'rgba(255,255,255,0.5)'} />
                  <Text style={[st.chipText, sel && st.chipTextSelected]}>{opt.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* state dropdown */}
          <View style={[st.sectionHeader, { marginTop: 16 }]}>
            <Ionicons name="map-outline" size={18} color="rgba(255,255,255,0.6)" />
            <Text style={st.sectionTitle}>State/UT</Text>
          </View>
          <Pressable onPress={() => setOpenSection(openSection === 'state' ? null : 'state')} style={st.dropdown}>
            <Text style={st.dropdownText}>{selState || 'All States'}</Text>
            <Ionicons name={openSection === 'state' ? 'chevron-up' : 'chevron-down'} size={20} color="rgba(255,255,255,0.5)" />
          </Pressable>
          {openSection === 'state' && (
            <View style={st.selectorContainer}>
              <ScrollView nestedScrollEnabled showsVerticalScrollIndicator>
                <Pressable onPress={() => setStateF(null)} style={[st.selectorItem, !selState && st.selectorItemSelected]}>
                  <Text style={[st.selectorText, !selState && st.selectorTextSelected]}>All States</Text>
                  {!selState && <Ionicons name="checkmark" size={20} color={colors.primary[500]} />}
                </Pressable>
                {states.map(item => {
                  const sel = selState === item.name;
                  return (
                    <Pressable key={item.name} onPress={() => setStateF(item.name)} style={[st.selectorItem, sel && st.selectorItemSelected]}>
                      <Text style={[st.selectorText, sel && st.selectorTextSelected]}>{item.name}</Text>
                      {sel && <Ionicons name="checkmark" size={20} color={colors.primary[500]} />}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* party dropdown */}
          <View style={[st.sectionHeader, { marginTop: 16 }]}>
            <Ionicons name="flag-outline" size={18} color="rgba(255,255,255,0.6)" />
            <Text style={st.sectionTitle}>Political Party</Text>
          </View>
          <Pressable onPress={() => setOpenSection(openSection === 'party' ? null : 'party')} style={st.dropdown}>
            <Text style={st.dropdownText} numberOfLines={1}>{selParty || 'All Parties'}</Text>
            <Ionicons name={openSection === 'party' ? 'chevron-up' : 'chevron-down'} size={20} color="rgba(255,255,255,0.5)" />
          </Pressable>
          {openSection === 'party' && (
            <View style={st.selectorContainer}>
              <ScrollView nestedScrollEnabled showsVerticalScrollIndicator>
                <Pressable onPress={() => setPartyF(null)} style={[st.selectorItem, !selParty && st.selectorItemSelected]}>
                  <Text style={[st.selectorText, !selParty && st.selectorTextSelected]}>All Parties</Text>
                  {!selParty && <Ionicons name="checkmark" size={20} color={colors.primary[500]} />}
                </Pressable>
                {parties.map(item => {
                  const sel = selParty === item.name;
                  return (
                    <Pressable key={item.name} onPress={() => setPartyF(item.name)} style={[st.selectorItem, sel && st.selectorItemSelected]}>
                      <Text style={[st.selectorText, sel && st.selectorTextSelected]} numberOfLines={1}>{item.name}</Text>
                      {sel && <Ionicons name="checkmark" size={20} color={colors.primary[500]} />}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>

        <View style={st.footer}>
          <Pressable onPress={close} style={st.applyButton}><Text style={st.applyButtonText}>Apply Filters</Text></Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

// styles
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
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: H * 0.85,
    minHeight: 400,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  badge: {
    marginLeft: 8,
    backgroundColor: colors.primary[500],
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  resetText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  closeButton: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    marginLeft: 8,
  },
  sortItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  sortItemSelected: {
    backgroundColor: 'rgba(129,140,248,0.2)',
  },
  sortItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortItemText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
  },
  sortItemTextSelected: {
    color: colors.primary[500],
  },
  sortDirection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortDirectionText: {
    color: colors.primary[500],
    fontSize: 14,
    marginLeft: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: 'rgba(129,140,248,0.2)',
  },
  chipText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginLeft: 6,
  },
  chipTextSelected: {
    color: colors.primary[500],
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  dropdownText: {
    color: '#fff',
    fontSize: 16,
  },
  selectorContainer: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    maxHeight: 200,
  },
  selectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectorItemSelected: {
    backgroundColor: 'rgba(129,140,248,0.1)',
  },
  selectorText: {
    color: '#fff',
    fontSize: 16,
  },
  selectorTextSelected: {
    color: colors.primary[500],
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  applyButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
