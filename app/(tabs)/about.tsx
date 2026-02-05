import React from 'react';
import { View, Text, ScrollView, Pressable, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../src/components/ui/Card';
import { UpdateBanner } from '../../src/components/ui/UpdateBanner';
import { useUpdateCheck } from '../../src/hooks/useUpdateCheck';
import { colors } from '../../src/theme/colors';

const APP_VERSION = '1.0.0';

export default function AboutScreen() {
  const { updateInfo, showBanner, dismissUpdate, checkForUpdate, loading } = useUpdateCheck();

  const openLink = (url: string) => Linking.openURL(url);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.dark.background }}
      edges={['bottom']}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-6">
          <View
            className="w-20 h-20 rounded-2xl items-center justify-center mb-3"
            style={{ backgroundColor: colors.primary[500] }}
          >
            <Text className="text-3xl font-bold text-white">KYN</Text>
          </View>
          <Text className="text-2xl font-bold" style={{ color: colors.text.primary }}>
            Know Your Neta
          </Text>
          <Pressable onPress={checkForUpdate} className="flex-row items-center mt-1">
            <Text className="text-sm" style={{ color: colors.text.tertiary }}>
              Version {APP_VERSION}
            </Text>
            {loading ? (
              <ActivityIndicator size="small" color={colors.text.muted} style={{ marginLeft: 6 }} />
            ) : updateInfo?.hasUpdate ? (
              <View className="ml-2 px-2 py-0.5 rounded" style={{ backgroundColor: colors.semantic.success + '20' }}>
                <Text style={{ fontSize: 10, color: colors.semantic.success, fontWeight: '600' }}>
                  NEW
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        {showBanner && updateInfo && (
          <UpdateBanner
            version={updateInfo.latestVersion}
            releaseUrl={updateInfo.releaseUrl}
            onDismiss={dismissUpdate}
          />
        )}

        <Card className="p-4 mb-4">
          <Text className="text-base font-semibold mb-2" style={{ color: colors.text.primary }}>
            Our Mission
          </Text>
          <Text className="text-sm leading-relaxed" style={{ color: colors.text.secondary }}>
            KYN (Know Your Neta) empowers Indian citizens with transparent, accessible
            information about their elected Members of Parliament. We believe informed
            voters make better decisions.
          </Text>
        </Card>

        <Card className="p-4 mb-4">
          <Text className="text-base font-semibold mb-3" style={{ color: colors.text.primary }}>
            Data Sources
          </Text>

          <Pressable
            onPress={() => openLink('https://affidavit.eci.gov.in')}
            className="flex-row items-center py-3"
          >
            <View className="w-8 h-8 rounded-lg bg-brand-500/20 items-center justify-center">
              <Ionicons name="globe-outline" size={18} color={colors.primary[500]} />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-sm font-medium" style={{ color: colors.text.primary }}>
                Election Commission of India
              </Text>
              <Text className="text-xs" style={{ color: colors.text.tertiary }}>
                affidavit.eci.gov.in
              </Text>
            </View>
            <Ionicons name="open-outline" size={16} color={colors.text.muted} />
          </Pressable>

          <Pressable
            onPress={() => openLink('https://adrindia.org')}
            className="flex-row items-center py-3"
          >
            <View className="w-8 h-8 rounded-lg bg-brand-500/20 items-center justify-center">
              <Ionicons name="globe-outline" size={18} color={colors.primary[500]} />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-sm font-medium" style={{ color: colors.text.primary }}>
                Association for Democratic Reforms
              </Text>
              <Text className="text-xs" style={{ color: colors.text.tertiary }}>
                adrindia.org
              </Text>
            </View>
            <Ionicons name="open-outline" size={16} color={colors.text.muted} />
          </Pressable>

          <Pressable
            onPress={() => openLink('https://myneta.info')}
            className="flex-row items-center py-3"
          >
            <View className="w-8 h-8 rounded-lg bg-brand-500/20 items-center justify-center">
              <Ionicons name="globe-outline" size={18} color={colors.primary[500]} />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-sm font-medium" style={{ color: colors.text.primary }}>
                MyNeta
              </Text>
              <Text className="text-xs" style={{ color: colors.text.tertiary }}>
                myneta.info
              </Text>
            </View>
            <Ionicons name="open-outline" size={16} color={colors.text.muted} />
          </Pressable>
        </Card>

        <Card className="p-4 mb-4" variant="glassBright">
          <View className="flex-row items-start">
            <View className="w-8 h-8 rounded-lg bg-warning-muted items-center justify-center">
              <Ionicons name="warning" size={18} color={colors.semantic.warning} />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-sm font-semibold mb-1" style={{ color: colors.semantic.warning }}>
                Disclaimer
              </Text>
              <Text className="text-xs leading-relaxed" style={{ color: colors.text.secondary }}>
                This data is presented in good faith with the intention to inform voters.
                The information is based on self-sworn affidavits submitted by candidates
                to the Election Commission of India for the Lok Sabha Elections 2024.
                {'\n\n'}
                Being charged with criminal cases does not imply guilt. All individuals
                are presumed innocent until proven guilty by a court of law.
              </Text>
            </View>
          </View>
        </Card>

        <Card className="p-4 mb-4">
          <Text className="text-base font-semibold mb-3" style={{ color: colors.text.primary }}>
            Features
          </Text>

          <View className="gap-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-brand-500/20 items-center justify-center">
                <Ionicons name="search" size={20} color={colors.primary[500]} />
              </View>
              <Text className="flex-1 ml-3 text-sm" style={{ color: colors.text.secondary }}>
                Search MPs by name or constituency
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-brand-500/20 items-center justify-center">
                <Ionicons name="filter" size={20} color={colors.primary[500]} />
              </View>
              <Text className="flex-1 ml-3 text-sm" style={{ color: colors.text.secondary }}>
                Filter by state, party, or criminal record
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-brand-500/20 items-center justify-center">
                <Ionicons name="wallet" size={20} color={colors.primary[500]} />
              </View>
              <Text className="flex-1 ml-3 text-sm" style={{ color: colors.text.secondary }}>
                View detailed financial declarations
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-brand-500/20 items-center justify-center">
                <Ionicons name="trending-up" size={20} color={colors.primary[500]} />
              </View>
              <Text className="flex-1 ml-3 text-sm" style={{ color: colors.text.secondary }}>
                Compare asset growth for re-elected MPs
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-brand-500/20 items-center justify-center">
                <Ionicons name="cloud-offline" size={20} color={colors.primary[500]} />
              </View>
              <Text className="flex-1 ml-3 text-sm" style={{ color: colors.text.secondary }}>
                Works offline after initial sync
              </Text>
            </View>
          </View>
        </Card>

        <View className="items-center py-6">
          <Text className="text-sm font-medium" style={{ color: colors.text.secondary }}>
            Empowering Voters
          </Text>
          <Text className="text-xs mt-2" style={{ color: colors.text.muted }}>
            Based on Lok Sabha Elections 2024
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
