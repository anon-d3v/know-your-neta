import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, RefreshControl, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SearchInput } from '../../src/components/ui/SearchInput';
import { Chip } from '../../src/components/ui/Chip';
import { MPCard } from '../../src/components/mp/MPCard';
import { useFilteredMPs, useUniqueStates, useUniqueParties, useIndexData } from '../../src/hooks/useMPData';
import { useFilterStore } from '../../src/store/filterStore';
import type { MPProfile } from '../../src/data/types';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [showStateFilter, setShowStateFilter] = useState(false);
  const [showPartyFilter, setShowPartyFilter] = useState(false);

  const filteredMPs = useFilteredMPs();
  const states = useUniqueStates();
  const parties = useUniqueParties();
  const indexData = useIndexData();

  const {
    search,
    state,
    party,
    criminalFilter,
    setSearch,
    setState,
    setParty,
    setCriminalFilter,
    clearFilters,
    hasActiveFilters,
  } = useFilterStore();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const renderItem = useCallback(({ item }: { item: MPProfile }) => (
    <MPCard mp={item} />
  ), []);

  const keyExtractor = useCallback((item: MPProfile) => item.id, []);

  const ListHeader = useMemo(() => (
    <View className="px-4 pb-2">
      {/* Search */}
      <View className="mb-3">
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name, constituency..."
        />
      </View>

      {/* Filter Chips */}
      <View className="flex-row flex-wrap gap-2 mb-3">
        <Chip
          label={`All (${indexData.meta.totalMPs})`}
          selected={!hasActiveFilters()}
          onPress={clearFilters}
        />

        <Chip
          label={state || 'State'}
          selected={!!state}
          icon="location"
          onPress={() => setShowStateFilter(!showStateFilter)}
          onRemove={state ? () => setState(null) : undefined}
        />

        <Chip
          label={party || 'Party'}
          selected={!!party}
          icon="flag"
          onPress={() => setShowPartyFilter(!showPartyFilter)}
          onRemove={party ? () => setParty(null) : undefined}
        />

        <Chip
          label={
            criminalFilter === 'with_cases'
              ? 'With Cases'
              : criminalFilter === 'no_cases'
              ? 'No Cases'
              : 'Cases'
          }
          selected={criminalFilter !== 'all'}
          icon="alert-circle"
          onPress={() => {
            if (criminalFilter === 'all') setCriminalFilter('with_cases');
            else if (criminalFilter === 'with_cases') setCriminalFilter('no_cases');
            else setCriminalFilter('all');
          }}
        />
      </View>

      {/* State Filter Dropdown */}
      {showStateFilter && (
        <View className="bg-white rounded-xl border border-gray-200 p-2 mb-3 max-h-64">
          <FlatList
            data={states}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setState(item);
                  setShowStateFilter(false);
                }}
                className={`p-3 rounded-lg ${state === item ? 'bg-brand-50' : ''}`}
              >
                <Text className={`text-sm ${state === item ? 'text-brand-600 font-medium' : 'text-gray-700'}`}>
                  {item} ({indexData.indexes.byState[item]?.length || 0})
                </Text>
              </Pressable>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {/* Party Filter Dropdown */}
      {showPartyFilter && (
        <View className="bg-white rounded-xl border border-gray-200 p-2 mb-3 max-h-64">
          <FlatList
            data={parties}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setParty(item);
                  setShowPartyFilter(false);
                }}
                className={`p-3 rounded-lg ${party === item ? 'bg-brand-50' : ''}`}
              >
                <Text className={`text-sm ${party === item ? 'text-brand-600 font-medium' : 'text-gray-700'}`}>
                  {item} ({indexData.indexes.byParty[item]?.length || 0})
                </Text>
              </Pressable>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {/* Results Count */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm text-gray-500">
          {filteredMPs.length} MPs found
        </Text>
        {hasActiveFilters() && (
          <Pressable onPress={clearFilters} className="flex-row items-center">
            <Ionicons name="close-circle" size={16} color="#6366F1" />
            <Text className="text-sm text-brand-500 font-medium ml-1">Clear filters</Text>
          </Pressable>
        )}
      </View>
    </View>
  ), [
    search, state, party, criminalFilter, showStateFilter, showPartyFilter,
    states, parties, filteredMPs.length, indexData, hasActiveFilters,
  ]);

  const ListEmpty = useMemo(() => (
    <View className="flex-1 items-center justify-center py-20">
      <Ionicons name="search" size={48} color="#D4D4D8" />
      <Text className="text-lg font-medium text-gray-400 mt-4">No MPs found</Text>
      <Text className="text-sm text-gray-400 mt-1">Try adjusting your filters</Text>
      <Pressable onPress={clearFilters} className="mt-4">
        <Text className="text-brand-500 font-medium">Clear all filters</Text>
      </Pressable>
    </View>
  ), [clearFilters]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <FlatList
        data={filteredMPs}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: 180,
          offset: 180 * index,
          index,
        })}
      />
    </SafeAreaView>
  );
}
