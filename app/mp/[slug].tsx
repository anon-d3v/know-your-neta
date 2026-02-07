import React from 'react';
import { View, Text, ScrollView, Share, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMP } from '../../src/hooks/useMPData';
import { useMPLADSSummary } from '../../src/hooks/useMPLADSData';
import { MPAvatar } from '../../src/components/mp/MPAvatar';
import { AssetSection } from '../../src/components/mp/AssetSection';
import { CriminalSection } from '../../src/components/mp/CriminalSection';
import { MPLADSOverview } from '../../src/components/mplads/MPLADSOverview';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { getPartyColor, colors } from '../../src/theme/colors';
import { getPartyAbbr, getPartyFullName } from '../../src/constants/parties';
import { formatRupeeCrore, generateMPShareText } from '../../src/utils/format';


export default function MPDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const mp = useMP(slug || '');
  const { data: mpladsData, isLoading: mpladsLoading } = useMPLADSSummary(mp?.id || '');

  if (!mp) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.dark.background }}
      >
        <View className="w-20 h-20 rounded-full bg-white/5 items-center justify-center mb-4">
          <Ionicons name="alert-circle" size={40} color={colors.text.muted} />
        </View>
        <Text className="text-lg font-medium" style={{ color: colors.text.secondary }}>
          MP not found
        </Text>
      </SafeAreaView>
    );
  }

  const { basic, education, financial, criminal, reElection } = mp;
  const partyColor = getPartyColor(basic.politicalParty);

  const handleShare = async () => {
    try {
      await Share.share({
        message: generateMPShareText(mp),
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.dark.surface }}>
      <StatusBar style="light" backgroundColor={colors.dark.surface} />
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.dark.background }}
        edges={['bottom']}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            className="px-4 pt-4 pb-6"
            style={{ backgroundColor: colors.dark.surface }}
          >
            <View className="items-center">
              <MPAvatar name={basic.fullName} party={basic.politicalParty} mpId={mp.id} size="xl" />

              <Text
                className="text-2xl font-bold mt-4 text-center"
                style={{ color: colors.text.primary }}
              >
                {basic.fullName}
              </Text>

              <View className="flex-row items-center mt-2">
                <Ionicons name="location" size={16} color={colors.text.tertiary} />
                <Text className="text-base ml-1" style={{ color: colors.text.secondary }}>
                  {basic.constituency}, {basic.stateUT}
                </Text>
              </View>

              <View className="flex-row items-center gap-2 mt-3">
                <Badge label={getPartyAbbr(basic.politicalParty)} color={partyColor} size="md" />
                <Badge label={`Age ${basic.age}`} variant="glass" size="md" />
                {reElection && (
                  <Badge label="Re-elected" variant="info" size="md" />
                )}
              </View>

              <Pressable
                onPress={handleShare}
                className="flex-row items-center mt-4 px-4 py-2 rounded-xl bg-white/5 active:opacity-70"
              >
                <Ionicons name="share-outline" size={18} color={colors.primary[500]} />
                <Text className="text-sm font-medium ml-2" style={{ color: colors.primary[500] }}>
                  Share Profile
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="px-4 pt-4">
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1 bg-white/[0.03] rounded-2xl p-4 items-center">
                <Ionicons name="wallet-outline" size={20} color={colors.primary[500]} />
                <Text className="text-lg font-bold mt-2" style={{ color: colors.primary[500] }}>
                  {formatRupeeCrore(financial.totalAssets)}
                </Text>
                <Text className="text-xs mt-1" style={{ color: colors.text.tertiary }}>
                  Total Assets
                </Text>
              </View>

              <View className="flex-1 bg-white/[0.03] rounded-2xl p-4 items-center">
                <Ionicons
                  name={criminal.hasCases ? "alert-circle-outline" : "checkmark-circle-outline"}
                  size={20}
                  color={criminal.hasCases ? colors.semantic.danger : colors.semantic.success}
                />
                <Text
                  className="text-lg font-bold mt-2"
                  style={{
                    color: criminal.hasCases ? colors.semantic.danger : colors.semantic.success,
                  }}
                >
                  {criminal.hasCases ? `${criminal.totalCases} Cases` : 'Clean'}
                </Text>
                <Text className="text-xs mt-1" style={{ color: colors.text.tertiary }}>
                  Criminal Record
                </Text>
              </View>

              <View className="flex-1 bg-white/[0.03] rounded-2xl p-4 items-center">
                <Ionicons
                  name={reElection ? "trending-up-outline" : "star-outline"}
                  size={20}
                  color={reElection ? colors.semantic.warning : colors.semantic.info}
                />
                <Text
                  className="text-lg font-bold mt-2"
                  style={{ color: reElection ? colors.semantic.warning : colors.semantic.info }}
                >
                  {reElection ? `+${reElection.assetGrowth.growthPercentage}%` : 'First Term'}
                </Text>
                <Text className="text-xs mt-1" style={{ color: colors.text.tertiary }}>
                  {reElection ? 'Asset Growth' : '2024 Elected'}
                </Text>
              </View>
            </View>

                        <Card className="p-4 mb-4">
              <Text className="text-base font-semibold mb-3" style={{ color: colors.text.primary }}>
                Basic Information
              </Text>

              <View className="gap-2">
                <View className="flex-row justify-between py-2">
                  <Text className="text-sm" style={{ color: colors.text.tertiary }}>Full Name</Text>
                  <Text className="text-sm font-medium" style={{ color: colors.text.primary }}>
                    {basic.fullName}
                  </Text>
                </View>

                <View className="flex-row justify-between py-2">
                  <Text className="text-sm" style={{ color: colors.text.tertiary }}>Constituency</Text>
                  <Text className="text-sm font-medium" style={{ color: colors.text.primary }}>
                    {basic.constituency}
                  </Text>
                </View>

                <View className="flex-row justify-between py-2">
                  <Text className="text-sm" style={{ color: colors.text.tertiary }}>State/UT</Text>
                  <Text className="text-sm font-medium" style={{ color: colors.text.primary }}>
                    {basic.stateUT}
                  </Text>
                </View>

                <View className="flex-row justify-between py-2">
                  <Text className="text-sm" style={{ color: colors.text.tertiary }}>Political Party</Text>
                  <Text className="text-sm font-medium" style={{ color: partyColor }}>
                    {getPartyFullName(basic.politicalParty)}
                  </Text>
                </View>

                <View className="flex-row justify-between py-2">
                  <Text className="text-sm" style={{ color: colors.text.tertiary }}>Age</Text>
                  <Text className="text-sm font-medium" style={{ color: colors.text.primary }}>
                    {basic.age} years
                  </Text>
                </View>

                <View className="flex-row justify-between py-2">
                  <Text className="text-sm" style={{ color: colors.text.tertiary }}>PAN Card Status</Text>
                  <Badge
                    label={basic.panCardStatus}
                    variant={basic.panCardStatus === 'Provided' ? 'success' : 'warning'}
                    size="sm"
                  />
                </View>
              </View>
            </Card>

            <Card className="p-4 mb-4">
              <View className="flex-row items-center mb-3">
                <Ionicons name="school-outline" size={18} color={colors.primary[500]} />
                <Text className="text-base font-semibold ml-2" style={{ color: colors.text.primary }}>
                  Education
                </Text>
              </View>

              <View className="gap-2">
                <View className="flex-row justify-between py-2">
                  <Text className="text-sm" style={{ color: colors.text.tertiary }}>Qualification</Text>
                  <Badge
                    label={education?.qualification || 'Not Available'}
                    variant={
                      education?.qualification === 'Doctorate' ? 'success' :
                      education?.qualification === 'Post Graduate' ? 'info' :
                      education?.qualification?.includes('Graduate') ? 'info' :
                      education?.qualification === 'Not Available' ? 'warning' :
                      'glass'
                    }
                    size="sm"
                  />
                </View>

                {education?.details && education.details !== 'Not Available' && education.details !== education.qualification && (
                  <View className="py-2">
                    <Text className="text-sm mb-1" style={{ color: colors.text.tertiary }}>Details</Text>
                    <Text className="text-sm" style={{ color: colors.text.secondary }}>
                      {education.details}
                    </Text>
                  </View>
                )}
              </View>
            </Card>

                        <View className="mb-4">
              <CriminalSection criminal={criminal} />
            </View>

                        <AssetSection financial={financial} reElection={reElection} />

            {/* MPLADS Fund Section */}
            <View className="mt-4">
              <MPLADSOverview
                summary={mpladsData || null}
                isLoading={mpladsLoading}
                mpSlug={slug || ''}
              />
            </View>

            {reElection && reElection.electionHistory.length > 0 && (
              <Card className="p-4 mt-4">
                <Text className="text-base font-semibold mb-3" style={{ color: colors.text.primary }}>
                  Election History
                </Text>

                <View className="bg-white/[0.03] rounded-xl overflow-hidden">
                  <View className="flex-row bg-white/5 px-3 py-2">
                    <Text className="flex-1 text-xs font-semibold" style={{ color: colors.text.tertiary }}>
                      Year
                    </Text>
                    <Text className="flex-1 text-xs font-semibold" style={{ color: colors.text.tertiary }}>
                      Party
                    </Text>
                    <Text className="flex-1 text-xs font-semibold" style={{ color: colors.text.tertiary }}>
                      Constituency
                    </Text>
                  </View>

                  {reElection.electionHistory.map((election, index) => (
                    <View key={index} className="flex-row px-3 py-2.5">
                      <Text className="flex-1 text-sm font-medium" style={{ color: colors.text.primary }}>
                        {election.year}
                      </Text>
                      <Text className="flex-1 text-sm" style={{ color: colors.text.secondary }} numberOfLines={1}>
                        {getPartyFullName(election.party)}
                      </Text>
                      <Text className="flex-1 text-sm" style={{ color: colors.text.secondary }} numberOfLines={1}>
                        {election.constituency}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            )}

                        <Card className="p-4 mt-4" variant="glassBright">
              <View className="flex-row items-start">
                <Ionicons name="information-circle" size={18} color={colors.text.tertiary} />
                <View className="flex-1 ml-2">
                  <Text className="text-xs leading-relaxed" style={{ color: colors.text.tertiary }}>
                    This information is compiled from official election affidavits filed
                    with the Election Commission of India for the Lok Sabha Elections 2024.
                  </Text>
                  <View className="flex-row flex-wrap gap-2 mt-2">
                    <Text className="text-xs" style={{ color: colors.primary[500] }}>ECI</Text>
                    <Text className="text-xs" style={{ color: colors.text.muted }}>|</Text>
                    <Text className="text-xs" style={{ color: colors.primary[500] }}>ADR India</Text>
                    <Text className="text-xs" style={{ color: colors.text.muted }}>|</Text>
                    <Text className="text-xs" style={{ color: colors.primary[500] }}>MyNeta</Text>
                  </View>
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
