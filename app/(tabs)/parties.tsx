import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, RefreshControl, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SearchInput } from '../../src/components/ui/SearchInput';
import { PartyCard } from '../../src/components/party/PartyCard';
import { usePartyData, PartyWithCount } from '../../src/hooks/usePartyData';
import { colors } from '../../src/theme/colors';

type SortOption = 'mp_count' | 'name' | 'founded';

export default function PartiesScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('mp_count');
  const [showAllParties, setShowAllParties] = useState(false);

  const { allParties, partiesWithMPs, totalMPs, searchQuery, setSearchQuery } = usePartyData();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const displayParties = showAllParties ? allParties : partiesWithMPs;

  const sortedParties = useMemo(() => {
    const sorted = [...displayParties];

    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'mp_count':
          return b.mpCount - a.mpCount;
        case 'name':
          return a.fullName.localeCompare(b.fullName);
        case 'founded':
          const yearA = parseInt(a.founded) || 9999;
          const yearB = parseInt(b.founded) || 9999;
          return yearA - yearB;
        default:
          return 0;
      }
    });

    return sorted;
  }, [displayParties, sortBy]);

  const renderItem = useCallback(
    ({ item }: { item: PartyWithCount }) => (
      <PartyCard party={item} mpCount={item.mpCount} />
    ),
    []
  );

  const keyExtractor = useCallback((item: PartyWithCount) => item.id, []);

  const getSortLabel = () => {
    const labels: Record<SortOption, string> = {
      mp_count: 'MP Count',
      name: 'Name',
      founded: 'Founded',
    };
    return labels[sortBy];
  };

  const cycleSortOption = () => {
    const options: SortOption[] = ['mp_count', 'name', 'founded'];
    const currentIndex = options.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % options.length;
    setSortBy(options[nextIndex]);
  };

  const ListHeader = useMemo(
    () => (
      <View className="pb-3">
        <View className="mb-3">
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search parties..."
          />
        </View>

        <View className="flex-row items-center justify-between mb-3">
          <Pressable
            onPress={() => setShowAllParties(!showAllParties)}
            className="flex-row items-center bg-white/5 rounded-xl px-3 py-2"
          >
            <Ionicons
              name={showAllParties ? 'checkbox' : 'square-outline'}
              size={18}
              color={showAllParties ? colors.primary[500] : colors.text.tertiary}
            />
            <Text
              className="text-sm font-medium ml-2"
              style={{ color: showAllParties ? colors.primary[500] : colors.text.secondary }}
            >
              Show all parties
            </Text>
          </Pressable>

          <Pressable
            onPress={cycleSortOption}
            className="flex-row items-center bg-white/5 rounded-xl px-3 py-2"
          >
            <Ionicons name="swap-vertical-outline" size={18} color={colors.text.secondary} />
            <Text className="text-sm font-medium ml-1.5" style={{ color: colors.text.secondary }}>
              {getSortLabel()}
            </Text>
          </Pressable>
        </View>

        <Text className="text-sm" style={{ color: colors.text.tertiary }}>
          {sortedParties.length} {sortedParties.length === 1 ? 'party' : 'parties'}
          {searchQuery ? ' found' : ''}
        </Text>
      </View>
    ),
    [searchQuery, showAllParties, sortBy, sortedParties.length, partiesWithMPs.length, totalMPs]
  );

  const ListEmpty = useMemo(
    () => (
      <View className="flex-1 items-center justify-center py-20">
        <View className="w-20 h-20 rounded-full bg-white/5 items-center justify-center mb-4">
          <Ionicons name="flag-outline" size={40} color={colors.text.muted} />
        </View>
        <Text className="text-lg font-semibold" style={{ color: colors.text.secondary }}>
          No parties found
        </Text>
        <Text className="text-sm mt-1" style={{ color: colors.text.tertiary }}>
          Try adjusting your search
        </Text>
        {searchQuery && (
          <Pressable
            onPress={() => setSearchQuery('')}
            className="mt-4 bg-brand-500/20 px-4 py-2 rounded-xl border border-brand-500/30"
          >
            <Text className="font-medium" style={{ color: colors.primary[500] }}>
              Clear search
            </Text>
          </Pressable>
        )}
      </View>
    ),
    [searchQuery, setSearchQuery]
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark.background} />
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.dark.background }}
        edges={['top', 'bottom']}
      >
        <FlatList
          data={sortedParties}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListEmpty}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary[500]}
              colors={[colors.primary[500]]}
              progressBackgroundColor={colors.dark.surface}
            />
          }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      </SafeAreaView>
    </>
  );
}
