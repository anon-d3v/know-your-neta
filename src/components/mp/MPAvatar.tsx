import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import { getInitials } from '../../utils/format';
import { getPartyColor } from '../../theme/colors';
import { getMPImage, hasImage } from '../../data/mp-images';

interface MPAvatarProps {
  name: string;
  party: string;
  mpId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// size config - dimensions and border width
const sizes = {
  sm: { dim: 40, txt: 14, border: 1 },
  md: { dim: 56, txt: 16, border: 2 },
  lg: { dim: 64, txt: 18, border: 2 },
  xl: { dim: 96, txt: 24, border: 3 },
};

export function MPAvatar({ name, party, mpId, size = 'lg' }: MPAvatarProps) {
  const [imgErr, setImgErr] = useState(false);
  const initials = getInitials(name);
  const color = getPartyColor(party);
  const s = sizes[size];

  // check if we have an actual photo for this MP
  const hasPhoto = mpId && hasImage(mpId) && !imgErr;
  const imgSrc = mpId ? getMPImage(mpId) : null;

  const innerSize = s.dim - s.border * 2;

  return (
    <View style={[
      styles.container,
      {
        width: s.dim, height: s.dim,
        borderRadius: s.dim * 0.25,
        backgroundColor: `${color}20`,
        borderWidth: s.border,
        borderColor: `${color}40`,
      },
    ]}>
      {hasPhoto && imgSrc ? (
        <Image
          source={imgSrc}
          style={[styles.image, { width: innerSize, height: innerSize, borderRadius: innerSize * 0.22 }]}
          onError={() => setImgErr(true)}
          resizeMode="cover"
        />
      ) : (
        // fallback to initials
        <Text style={[styles.initials, { fontSize: s.txt, color }]}>{initials}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  image: { backgroundColor: 'transparent' },
  initials: { fontWeight: 'bold' },
});
