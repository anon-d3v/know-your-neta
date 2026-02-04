import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getPartySymbol } from '../../data/party-images';
import { getPartyColor } from '../../theme/colors';
import { getPartyAbbr } from '../../constants/parties';

type Size = 'sm' | 'md' | 'lg' | 'xl';

interface PartySymbolProps {
  partyId: string;
  size?: Size;
  showBorder?: boolean;
  variant?: 'squircle' | 'circle';
}

// size configs
const dims: Record<Size, number> = { sm: 48, md: 72, lg: 88, xl: 128 };
const fonts: Record<Size, number> = { sm: 14, md: 20, lg: 24, xl: 32 };

export function PartySymbol({ partyId, size = 'md', showBorder = true, variant = 'squircle' }: PartySymbolProps) {
  const dim = dims[size];
  const clr = getPartyColor(partyId);
  const abbr = getPartyAbbr(partyId);
  const symbol = getPartySymbol(partyId);

  const radius = variant === 'circle' ? dim / 2 : dim / 6;
  const cStyle = [s.box, { width: dim, height: dim, borderRadius: radius, backgroundColor: `${clr}15`, borderColor: showBorder ? `${clr}40` : 'transparent' }];

  // show actual symbol image if we have one
  if (symbol) {
    const imgSz = variant === 'circle' ? dim - 4 : dim * 0.75;
    const imgRad = variant === 'circle' ? (dim - 4) / 2 : 0;
    return (
      <View style={cStyle}>
        <Image source={symbol} style={{ width: imgSz, height: imgSz, borderRadius: imgRad }} resizeMode="cover" />
      </View>
    );
  }

  // fallback to text abbreviation
  return (
    <View style={cStyle}>
      <Text style={[s.txt, { fontSize: fonts[size], color: clr }]}>{abbr}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  box: { justifyContent: 'center', alignItems: 'center', borderWidth: 2, overflow: 'hidden' },
  txt: { fontWeight: '700', textAlign: 'center' },
});
