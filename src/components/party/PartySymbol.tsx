import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { getPartyColor } from '../../theme/colors';
import { getPartyAbbr } from '../../constants/parties';
import { getPartySymbolUrl } from '../../lib/supabase';

type Size = 'sm' | 'md' | 'lg' | 'xl';

interface PartySymbolProps {
  partyId: string;
  size?: Size;
  showBorder?: boolean;
  variant?: 'squircle' | 'circle';
}

const dims: Record<Size, number> = { sm: 48, md: 72, lg: 88, xl: 128 };
const fonts: Record<Size, number> = { sm: 14, md: 20, lg: 24, xl: 32 };
const BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

export function PartySymbol({ partyId, size = 'md', showBorder = true, variant = 'squircle' }: PartySymbolProps) {
  const [imgErr, setImgErr] = useState(false);
  const dim = dims[size];
  const clr = getPartyColor(partyId);
  const abbr = getPartyAbbr(partyId);

  const symbolUrl = getPartySymbolUrl(partyId);
  const hasSymbol = symbolUrl && !imgErr;

  const radius = variant === 'circle' ? dim / 2 : dim / 6;
  const imgSz = variant === 'circle' ? dim - 4 : dim * 0.75;
  const imgRad = variant === 'circle' ? (dim - 4) / 2 : 0;

  const containerStyle = [styles.box, {
    width: dim,
    height: dim,
    borderRadius: radius,
    backgroundColor: `${clr}15`,
    borderColor: showBorder ? `${clr}40` : 'transparent',
  }];

  if (hasSymbol) {
    return (
      <View style={containerStyle}>
        <Image
          source={{ uri: symbolUrl }}
          style={{ width: imgSz, height: imgSz, borderRadius: imgRad }}
          placeholder={BLURHASH}
          contentFit="cover"
          transition={200}
          cachePolicy="disk"
          onError={() => setImgErr(true)}
        />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Text style={[styles.txt, { fontSize: fonts[size], color: clr }]}>{abbr}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    overflow: 'hidden',
  },
  txt: { fontWeight: '700', textAlign: 'center' },
});
