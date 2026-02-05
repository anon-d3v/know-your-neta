import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { getInitials } from '../../utils/format';
import { getPartyColor } from '../../theme/colors';
import { getMPPhotoUrl } from '../../lib/supabase';

interface MPAvatarProps {
  name: string;
  party: string;
  mpId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizes = {
  sm: { dim: 40, txt: 14, border: 1 },
  md: { dim: 56, txt: 16, border: 2 },
  lg: { dim: 64, txt: 18, border: 2 },
  xl: { dim: 96, txt: 24, border: 3 },
};

const BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

export function MPAvatar({ name, party, mpId, size = 'lg' }: MPAvatarProps) {
  const [imgErr, setImgErr] = useState(false);
  const [loading, setLoading] = useState(true);
  const initials = getInitials(name);
  const color = getPartyColor(party);
  const s = sizes[size];

  const photoUrl = mpId ? getMPPhotoUrl(mpId) : null;
  const hasPhoto = photoUrl && !imgErr;
  const inner = s.dim - s.border * 2;

  return (
    <View style={[styles.container, {
      width: s.dim,
      height: s.dim,
      borderRadius: s.dim * 0.25,
      backgroundColor: `${color}20`,
      borderWidth: s.border,
      borderColor: `${color}40`,
    }]}>
      {hasPhoto ? (
        <>
          <Image
            source={{ uri: photoUrl }}
            style={[styles.image, { width: inner, height: inner, borderRadius: inner * 0.22 }]}
            placeholder={BLURHASH}
            contentFit="cover"
            transition={200}
            cachePolicy="disk"
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={() => { setImgErr(true); setLoading(false); }}
          />
          {loading && (
            <View style={[styles.loadingOverlay, { width: inner, height: inner }]}>
              <ActivityIndicator size="small" color={color} />
            </View>
          )}
        </>
      ) : (
        <Text style={[styles.initials, { fontSize: s.txt, color }]}>{initials}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { backgroundColor: 'transparent' },
  loadingOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
  },
  initials: { fontWeight: 'bold' },
});
