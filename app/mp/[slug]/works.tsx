import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, Pressable, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMPWorks, useMPLADSSummary } from '../../../src/hooks/useMPLADSData';
import { useMP } from '../../../src/hooks/useMPData';
import { WorkCard } from '../../../src/components/mplads/WorkCard';
import { Badge } from '../../../src/components/ui/Badge';
import { colors } from '../../../src/theme/colors';
import type { MPWork, WorkStatus } from '../../../src/data/types';

type FilterStatus = 'all' | WorkStatus;

const STATUS_FILTERS: { label: string; value: FilterStatus; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'All', value: 'all', icon: 'apps-outline' },
  { label: 'Completed', value: 'Completed', icon: 'checkmark-done-circle-outline' },
  { label: 'Sanctioned', value: 'Sanctioned', icon: 'checkmark-circle-outline' },
  { label: 'Recommended', value: 'Recommended', icon: 'document-text-outline' },
];

export default function MPWorksScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const mp = useMP(slug || '');
  const { data: works, isLoading: worksLoading } = useMPWorks(mp?.id || '');
  const { data: summary } = useMPLADSSummary(mp?.id || '');

  const filteredWorks = useMemo(() => {
    if (!works) return [];
    if (statusFilter === 'all') return works;
    return works.filter((w) => w.status === statusFilter);
  }, [works, statusFilter]);

  const getFilterCount = (status: FilterStatus): number => {
    if (!works) return 0;
    if (status === 'all') return works.length;
    return works.filter((w) => w.status === status).length;
  };

  const renderWork = ({ item }: { item: MPWork }) => (
    <WorkCard work={item} />
  );

  const renderHeader = () => (
    <View className="pb-4">
      {/* Back Button */}
      <Pressable
        onPress={() => router.back()}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: 'rgba(255,255,255,0.08)',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
      </Pressable>

      {/* Page Header */}
      <View className="mb-5">
        {/* MPLADS Title */}
        <View className="flex-row items-center mb-4">
          <View className="w-10 h-10 rounded-xl bg-emerald-500/20 items-center justify-center mr-3">
            <Ionicons name="briefcase" size={20} color={colors.accent.emerald} />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold" style={{ color: colors.text.primary }}>
              MPLADS Works
            </Text>
            <Text className="text-xs" style={{ color: colors.text.tertiary }}>
              Member of Parliament Local Area Development Scheme
            </Text>
          </View>
        </View>

        {/* MP Info */}
        {mp && (
          <View className="flex-row items-center bg-white/[0.05] rounded-xl px-3 py-2 mb-4">
            <Ionicons name="person" size={14} color={colors.text.secondary} />
            <Text className="text-sm ml-2" style={{ color: colors.text.secondary }}>
              {mp.basic.fullName}
            </Text>
            <Text className="text-xs ml-2" style={{ color: colors.text.muted }}>
              ({mp.basic.constituency})
            </Text>
          </View>
        )}

        {/* What is MPLADS - Info Box */}
        <View className="bg-white/[0.05] rounded-xl p-3">
          <View className="flex-row items-start">
            <Ionicons name="information-circle" size={16} color={colors.primary[400]} />
            <Text className="text-xs flex-1 ml-2" style={{ color: colors.text.secondary, lineHeight: 18 }}>
              MPLADS enables MPs to recommend developmental works in their constituency with an annual allocation of ~5 Crores.
            </Text>
          </View>
        </View>
      </View>

      {/* Fund Summary Card */}
      {summary && (
        <View className="mb-5">
          <Text className="text-sm font-semibold mb-3" style={{ color: colors.text.primary }}>
            Fund Overview
          </Text>

          <View className="bg-white/[0.03] rounded-2xl p-4">
            {/* Main Stats Row */}
            <View className="flex-row mb-4">
              <View className="flex-1 items-center border-r border-white/10">
                <Text className="text-xs mb-1" style={{ color: colors.text.tertiary }}>
                  Allocated
                </Text>
                <Text className="text-xl font-bold" style={{ color: colors.accent.emerald }}>
                  {summary.allocation.allocatedAmountFormatted}
                </Text>
              </View>
              <View className="flex-1 items-center border-r border-white/10">
                <Text className="text-xs mb-1" style={{ color: colors.text.tertiary }}>
                  Spent
                </Text>
                <Text className="text-xl font-bold" style={{ color: colors.primary[500] }}>
                  {formatAmount(summary.totalExpenditure)}
                </Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-xs mb-1" style={{ color: colors.text.tertiary }}>
                  Utilization
                </Text>
                <Text
                  className="text-xl font-bold"
                  style={{
                    color: summary.utilizationPercentage >= 70
                      ? colors.semantic.success
                      : summary.utilizationPercentage >= 40
                        ? colors.semantic.warning
                        : colors.semantic.danger
                  }}
                >
                  {summary.utilizationPercentage}%
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View className="mb-4">
              <View className="h-3 bg-white/5 rounded-full overflow-hidden">
                <LinearGradient
                  colors={
                    summary.utilizationPercentage >= 70
                      ? [colors.semantic.success, colors.accent.emerald]
                      : summary.utilizationPercentage >= 40
                        ? [colors.semantic.warning, '#F59E0B']
                        : [colors.semantic.danger, '#EF4444']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    width: `${Math.min(summary.utilizationPercentage, 100)}%`,
                    height: '100%',
                    borderRadius: 999,
                  }}
                />
              </View>
            </View>

            {/* Works Breakdown */}
            <View className="flex-row gap-2">
              <View className="flex-1 bg-blue-500/10 rounded-xl py-2 px-3 items-center">
                <Text className="text-lg font-bold" style={{ color: colors.semantic.info }}>
                  {summary.worksCount.recommended}
                </Text>
                <Text className="text-xs" style={{ color: colors.text.tertiary }}>
                  Recommended
                </Text>
              </View>
              <View className="flex-1 bg-amber-500/10 rounded-xl py-2 px-3 items-center">
                <Text className="text-lg font-bold" style={{ color: colors.semantic.warning }}>
                  {summary.worksCount.sanctioned}
                </Text>
                <Text className="text-xs" style={{ color: colors.text.tertiary }}>
                  Sanctioned
                </Text>
              </View>
              <View className="flex-1 bg-emerald-500/10 rounded-xl py-2 px-3 items-center">
                <Text className="text-lg font-bold" style={{ color: colors.semantic.success }}>
                  {summary.worksCount.completed}
                </Text>
                <Text className="text-xs" style={{ color: colors.text.tertiary }}>
                  Completed
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Section Title & Filter Button */}
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-semibold" style={{ color: colors.text.primary }}>
            Development Works
          </Text>
          <Text className="text-xs mt-0.5" style={{ color: colors.text.muted }}>
            {filteredWorks.length} {filteredWorks.length === 1 ? 'work' : 'works'}
          </Text>
        </View>

        {/* Filter Button */}
        <Pressable
          onPress={() => setShowFilterModal(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 12,
            backgroundColor: statusFilter !== 'all' ? colors.primary[500] : 'rgba(255,255,255,0.08)',
          }}
        >
          <Ionicons
            name="filter"
            size={16}
            color={statusFilter !== 'all' ? '#FFFFFF' : colors.text.secondary}
          />
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              marginLeft: 6,
              color: statusFilter !== 'all' ? '#FFFFFF' : colors.text.secondary,
            }}
          >
            {statusFilter === 'all' ? 'Filter' : STATUS_FILTERS.find(f => f.value === statusFilter)?.label}
          </Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color={statusFilter !== 'all' ? '#FFFFFF' : colors.text.tertiary}
            style={{ marginLeft: 4 }}
          />
        </Pressable>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center py-16">
      <View className="w-16 h-16 rounded-full bg-white/[0.05] items-center justify-center mb-4">
        <Ionicons name="folder-open-outline" size={32} color={colors.text.muted} />
      </View>
      <Text className="text-base font-medium mb-1" style={{ color: colors.text.secondary }}>
        {statusFilter === 'all' ? 'No works found' : `No ${statusFilter.toLowerCase()} works`}
      </Text>
      <Text className="text-sm" style={{ color: colors.text.muted }}>
        {statusFilter !== 'all' && 'Try selecting a different filter'}
      </Text>
    </View>
  );

  const renderFooter = () => (
    <View className="mt-4 pt-4 border-t border-white/5">
      <View className="flex-row items-center justify-center">
        <Ionicons name="globe-outline" size={12} color={colors.text.muted} />
        <Text className="text-xs ml-1" style={{ color: colors.text.muted }}>
          Data source: mplads.gov.in
        </Text>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={{ flex: 1, backgroundColor: colors.dark.background }}>
        <StatusBar style="light" />
        <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
          {worksLoading ? (
            <View className="flex-1 items-center justify-center">
              <View className="w-12 h-12 rounded-full bg-white/[0.05] items-center justify-center mb-3">
                <Ionicons name="hourglass-outline" size={24} color={colors.text.tertiary} />
              </View>
              <Text style={{ color: colors.text.secondary }}>Loading works...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredWorks}
              keyExtractor={(item) => item.id}
              renderItem={renderWork}
              ListHeaderComponent={renderHeader}
              ListEmptyComponent={renderEmpty}
              ListFooterComponent={filteredWorks.length > 0 ? renderFooter : null}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </SafeAreaView>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}
          onPress={() => setShowFilterModal(false)}
        >
          <Pressable
            style={{
              backgroundColor: colors.dark.surface,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-lg font-bold" style={{ color: colors.text.primary }}>
                Filter by Status
              </Text>
              <Pressable
                onPress={() => setShowFilterModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 items-center justify-center"
              >
                <Ionicons name="close" size={18} color={colors.text.secondary} />
              </Pressable>
            </View>

            {/* Filter Options */}
            <View style={{ gap: 8 }}>
              {STATUS_FILTERS.map((filter) => {
                const isActive = statusFilter === filter.value;
                const count = getFilterCount(filter.value);

                return (
                  <Pressable
                    key={filter.value}
                    onPress={() => {
                      setStatusFilter(filter.value);
                      setShowFilterModal(false);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      borderRadius: 14,
                      backgroundColor: isActive ? colors.primary[500] : 'rgba(255,255,255,0.05)',
                    }}
                  >
                    <Ionicons
                      name={filter.icon}
                      size={20}
                      color={isActive ? '#FFFFFF' : colors.text.secondary}
                    />
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 16,
                        fontWeight: '600',
                        marginLeft: 12,
                        color: isActive ? '#FFFFFF' : colors.text.primary,
                      }}
                    >
                      {filter.label}
                    </Text>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 8,
                        backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          color: isActive ? '#FFFFFF' : colors.text.secondary,
                        }}
                      >
                        {count}
                      </Text>
                    </View>
                    {isActive && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color="#FFFFFF"
                        style={{ marginLeft: 10 }}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>

            {/* Clear Filter Button */}
            {statusFilter !== 'all' && (
              <Pressable
                onPress={() => {
                  setStatusFilter('all');
                  setShowFilterModal(false);
                }}
                className="mt-4 py-3 items-center"
              >
                <Text style={{ color: colors.semantic.danger, fontWeight: '600' }}>
                  Clear Filter
                </Text>
              </Pressable>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function formatAmount(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${(amount / 1000).toFixed(0)} K`;
}
