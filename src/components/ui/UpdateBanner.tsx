import React from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface UpdateBannerProps {
  version: string;
  releaseUrl: string;
  onDismiss: () => void;
}

export function UpdateBanner({ version, releaseUrl, onDismiss }: UpdateBannerProps) {
  const openUpdate = () => {
    if (releaseUrl) Linking.openURL(releaseUrl);
  };

  return (
    <View style={{
      backgroundColor: colors.primary[500] + '20',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.primary[500] + '40',
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <View style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: colors.primary[500] + '30',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Ionicons name="arrow-up-circle" size={20} color={colors.primary[400]} />
        </View>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text.primary }}>
            Update Available
          </Text>
          <Text style={{ fontSize: 12, color: colors.text.secondary, marginTop: 2 }}>
            Version {version} is now available
          </Text>
        </View>

        <Pressable onPress={onDismiss} hitSlop={8}>
          <Ionicons name="close" size={20} color={colors.text.muted} />
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
        <Pressable
          onPress={openUpdate}
          style={{
            flex: 1,
            backgroundColor: colors.primary[500],
            paddingVertical: 10,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Update Now</Text>
        </Pressable>

        <Pressable
          onPress={onDismiss}
          style={{
            flex: 1,
            backgroundColor: colors.dark.surface,
            paddingVertical: 10,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.text.secondary, fontSize: 13, fontWeight: '500' }}>Later</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default UpdateBanner;
