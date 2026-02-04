import React, { useState, useCallback, useMemo, useDeferredValue } from 'react';
import { View, Text, FlatList, Pressable, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFilteredMPs, useIndexData } from '../../src/hooks/useMPData';
import { useFilterStore, type SortField } from '../../src/store/filterStore';
import { useCompareStore } from '../../src/store/compareStore';
import type { MPProfile } from '../../src/data/types';
import { colors } from '../../src/theme/colors';

// components
import { SearchInput } from '../../src/components/ui/SearchInput';
import { Chip } from '../../src/components/ui/Chip';
import { MPCard } from '../../src/components/mp/MPCard';
import { ShareImageModal } from '../../src/components/mp/ShareImageModal';
import { SortFilterModal } from '../../src/components/ui/SortFilterModal';
import { CompareBar, CompareModal } from '../../src/components/compare';


interface ListHeaderProps {
  onFilterPress: () => void;
}

const SORT_LABELS: Record<SortField, string> = {
  name: 'Name',
  assets: 'Assets',
  criminal_cases: 'Cases',
  age: 'Age',
  constituency: 'Constituency',
};

// filter chips and sort button - scrolls with the list
const ListHeader = React.memo(function ListHeader({ onFilterPress }: ListHeaderProps) {
  const filteredMPs = useFilteredMPs();
  const mpCount = filteredMPs.length;

  const stateFilter = useFilterStore(s => s.state);
  const party = useFilterStore(s => s.party);
  const criminalFilter = useFilterStore(s => s.criminalFilter);
  const electionFilter = useFilterStore(s => s.electionFilter);
  const sortField = useFilterStore(s => s.sortField);
  const sortDirection = useFilterStore(s => s.sortDirection);

  const setState = useFilterStore(s => s.setState);
  const setParty = useFilterStore(s => s.setParty);
  const setCriminalFilter = useFilterStore(s => s.setCriminalFilter);
  const clearFilters = useFilterStore(s => s.clearFilters);
  const hasActiveFilters = useFilterStore(s => s.hasActiveFilters);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (stateFilter) count++;
    if (party) count++;
    if (criminalFilter !== 'all') count++;
    if (electionFilter !== 'all') count++;
    if (sortField !== 'name' || sortDirection !== 'asc') count++;
    return count;
  }, [stateFilter, party, criminalFilter, electionFilter, sortField, sortDirection]);

  return (
    <View className="pb-3">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row flex-1 flex-wrap gap-2">
          {stateFilter && (
            <Chip
              label={stateFilter}
              selected
              icon="location-outline"
              onRemove={() => setState(null)}
              size="sm"
            />
          )}
          {party && (
            <Chip
              label={party}
              selected
              icon="flag-outline"
              onRemove={() => setParty(null)}
              size="sm"
            />
          )}
          {criminalFilter !== 'all' && (
            <Chip
              label={criminalFilter === 'with_cases' ? 'With Cases' : 'No Cases'}
              selected
              icon="shield-outline"
              onRemove={() => setCriminalFilter('all')}
              size="sm"
            />
          )}
        </View>

        <Pressable
          onPress={onFilterPress}
          className="flex-row items-center bg-white/5 rounded-xl px-3 py-2 ml-2"
        >
          <Ionicons name="options-outline" size={18} color={colors.text.secondary} />
          <Text className="text-sm font-medium ml-1.5" style={{ color: colors.text.secondary }}>
            {SORT_LABELS[sortField] || 'Name'}
          </Text>
          <Ionicons
            name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
            size={14}
            color={colors.text.tertiary}
            style={{ marginLeft: 4 }}
          />
          {activeFilterCount > 0 && (
            <View className="bg-brand-500 rounded-full w-5 h-5 items-center justify-center ml-2">
              <Text className="text-white text-xs font-bold">{activeFilterCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="text-sm" style={{ color: colors.text.tertiary }}>
          {mpCount} {mpCount === 1 ? 'MP' : 'MPs'} found
        </Text>
        {hasActiveFilters() && (
          <Pressable
            onPress={clearFilters}
            className="flex-row items-center px-2 py-1 rounded-lg active:bg-white/5"
          >
            <Ionicons name="refresh" size={14} color={colors.primary[500]} />
            <Text className="text-sm font-medium ml-1" style={{ color: colors.primary[500] }}>
              Reset
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
});

export default function HomeScreen() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showShareImageModal, setShowShareImageModal] = useState(false);
  const [shareImageMP, setShareImageMP] = useState<MPProfile | null>(null);

  const filteredMPs = useFilteredMPs();
  const indexData = useIndexData();
  const compareCount = useCompareStore(state => state.selectedMPs.length);

  // search is handled separately so it can stay fixed at top
  const search = useFilterStore(s => s.search);
  const setSearch = useFilterStore(s => s.setSearch);

  const handleShareImage = useCallback((mp: MPProfile) => {
    setShareImageMP(mp);
    setShowShareImageModal(true);
  }, []);

  const handleFilterPress = useCallback(() => setShowFilterModal(true), []);

  const sortField = useFilterStore(s => s.sortField);
  const sortDirection = useFilterStore(s => s.sortDirection);
  const clearFilters = useFilterStore(s => s.clearFilters);

  // sort the filtered MPs based on current sort settings
  // using useMemo here bc sorting 500+ MPs on every render would be bad
  const sortedMPs = useMemo(() => {
    let sorted = [...filteredMPs];

    sorted.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name':
          cmp = (a.basic?.fullName || '').localeCompare(b.basic?.fullName || '');
          break;
        case 'assets':
          cmp = (a.financial?.totalAssets || 0) - (b.financial?.totalAssets || 0);
          break;
        case 'criminal_cases':
          cmp = (a.criminal?.totalCases || 0) - (b.criminal?.totalCases || 0);
          break;
        case 'age':
          cmp = (a.basic?.age || 0) - (b.basic?.age || 0);
          break;
        case 'constituency':
          cmp = (a.basic?.constituency || '').localeCompare(b.basic?.constituency || '');
          break;
      }
      return sortDirection === 'desc' ? -cmp : cmp;
    });
    return sorted;
  }, [filteredMPs, sortField, sortDirection]);

  // defer updates so typing in search doesn't feel laggy
  const deferredSortedMPs = useDeferredValue(sortedMPs);

  const renderItem = useCallback(({ item }: { item: MPProfile }) => (
    <MPCard mp={item} onShareImage={handleShareImage} />
  ), [handleShareImage]);

  const keyExtractor = useCallback((item: MPProfile) => item.id, []);

  const renderListHeader = useCallback(() => (
    <ListHeader onFilterPress={handleFilterPress} />
  ), [handleFilterPress]);

  const ListEmpty = useMemo(() => (
    <View className="flex-1 items-center justify-center py-20">
      <View className="w-20 h-20 rounded-full bg-white/5 items-center justify-center mb-4">
        <Ionicons name="search-outline" size={40} color={colors.text.muted} />
      </View>
      <Text className="text-lg font-semibold" style={{ color: colors.text.secondary }}>
        No MPs found
      </Text>
      <Text className="text-sm mt-1" style={{ color: colors.text.tertiary }}>
        Try adjusting your search or filters
      </Text>
      <Pressable
        onPress={clearFilters}
        className="mt-4 bg-brand-500/20 px-4 py-2 rounded-xl border border-brand-500/30"
      >
        <Text className="font-medium" style={{ color: colors.primary[500] }}>
          Clear all filters
        </Text>
      </Pressable>
    </View>
  ), [clearFilters]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark.background} />
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.dark.background }}
        edges={['top', 'bottom']}
      >
        {/* sticky search bar at top */}
        <View className="px-4 pt-2 pb-3" style={{ backgroundColor: colors.dark.background }}>
          <SearchInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name, constituency..."
          />
        </View>

        <FlatList
          data={deferredSortedMPs}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={ListEmpty}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: compareCount > 0 ? 180 : 20 }}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={false}
        />
        <CompareBar onCompare={() => setShowCompareModal(true)} />
      </SafeAreaView>

      {/* modals */}
      <SortFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        index={{
          states: indexData.indexes.byState
            ? Object.entries(indexData.indexes.byState).map(([name, ids]) => ({
                name,
                count: (ids as string[]).length,
              }))
            : [],
          parties: indexData.indexes.byParty
            ? Object.entries(indexData.indexes.byParty).map(([name, ids]) => ({
                name,
                count: (ids as string[]).length,
              }))
            : [],
        }}
      />

      <CompareModal
        visible={showCompareModal}
        onClose={() => setShowCompareModal(false)}
      />

      <ShareImageModal
        visible={showShareImageModal}
        onClose={() => {
          setShowShareImageModal(false);
          setShareImageMP(null);
        }}
        mp={shareImageMP}
      />
    </>
  );
}
