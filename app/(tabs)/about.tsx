import React from 'react';
import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../src/components/ui/Card';

export default function AboutScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* App Info */}
        <View className="items-center mb-6">
          <View className="w-20 h-20 rounded-2xl bg-brand-500 items-center justify-center mb-3">
            <Text className="text-3xl font-bold text-white">KYN</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900">Know Your Neta</Text>
          <Text className="text-sm text-gray-500 mt-1">Version 1.0.0</Text>
        </View>

        {/* Mission */}
        <Card className="p-4 mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-2">Our Mission</Text>
          <Text className="text-sm text-gray-600 leading-relaxed">
            KYN (Know Your Neta) empowers Indian citizens with transparent, accessible
            information about their elected Members of Parliament. We believe informed
            voters make better decisions.
          </Text>
        </Card>

        {/* Data Sources */}
        <Card className="p-4 mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-3">Data Sources</Text>

          <Pressable
            onPress={() => openLink('https://affidavit.eci.gov.in/')}
            className="flex-row items-center py-3 border-b border-gray-100"
          >
            <Ionicons name="globe-outline" size={20} color="#6366F1" />
            <View className="flex-1 ml-3">
              <Text className="text-sm font-medium text-gray-900">Election Commission of India</Text>
              <Text className="text-xs text-gray-500">affidavit.eci.gov.in</Text>
            </View>
            <Ionicons name="open-outline" size={16} color="#A1A1AA" />
          </Pressable>

          <Pressable
            onPress={() => openLink('https://adrindia.org/')}
            className="flex-row items-center py-3 border-b border-gray-100"
          >
            <Ionicons name="globe-outline" size={20} color="#6366F1" />
            <View className="flex-1 ml-3">
              <Text className="text-sm font-medium text-gray-900">Association for Democratic Reforms</Text>
              <Text className="text-xs text-gray-500">adrindia.org</Text>
            </View>
            <Ionicons name="open-outline" size={16} color="#A1A1AA" />
          </Pressable>

          <Pressable
            onPress={() => openLink('https://myneta.info/')}
            className="flex-row items-center py-3"
          >
            <Ionicons name="globe-outline" size={20} color="#6366F1" />
            <View className="flex-1 ml-3">
              <Text className="text-sm font-medium text-gray-900">MyNeta</Text>
              <Text className="text-xs text-gray-500">myneta.info</Text>
            </View>
            <Ionicons name="open-outline" size={16} color="#A1A1AA" />
          </Pressable>
        </Card>

        {/* Disclaimer */}
        <Card className="p-4 mb-4 bg-amber-50 border-amber-200">
          <View className="flex-row items-start">
            <Ionicons name="warning" size={20} color="#D97706" />
            <View className="flex-1 ml-3">
              <Text className="text-sm font-semibold text-amber-800 mb-1">Disclaimer</Text>
              <Text className="text-xs text-amber-700 leading-relaxed">
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

        {/* Features */}
        <Card className="p-4 mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-3">Features</Text>

          <View className="gap-3">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-brand-100 items-center justify-center">
                <Ionicons name="search" size={16} color="#6366F1" />
              </View>
              <Text className="flex-1 ml-3 text-sm text-gray-700">
                Search MPs by name or constituency
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-brand-100 items-center justify-center">
                <Ionicons name="filter" size={16} color="#6366F1" />
              </View>
              <Text className="flex-1 ml-3 text-sm text-gray-700">
                Filter by state, party, or criminal record
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-brand-100 items-center justify-center">
                <Ionicons name="cash" size={16} color="#6366F1" />
              </View>
              <Text className="flex-1 ml-3 text-sm text-gray-700">
                View detailed financial declarations
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-brand-100 items-center justify-center">
                <Ionicons name="trending-up" size={16} color="#6366F1" />
              </View>
              <Text className="flex-1 ml-3 text-sm text-gray-700">
                Compare asset growth for re-elected MPs
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-brand-100 items-center justify-center">
                <Ionicons name="cloud-offline" size={16} color="#6366F1" />
              </View>
              <Text className="flex-1 ml-3 text-sm text-gray-700">
                Works offline - no internet required
              </Text>
            </View>
          </View>
        </Card>

        {/* Footer */}
        <View className="items-center py-6">
          <Text className="text-sm text-gray-500">Made with</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="heart" size={16} color="#EF4444" />
            <Text className="text-sm text-gray-500 ml-1">for Indian Democracy</Text>
          </View>
          <Text className="text-xs text-gray-400 mt-2">
            Lok Sabha Elections 2024
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
