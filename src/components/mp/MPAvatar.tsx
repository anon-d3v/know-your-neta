import React from 'react';
import { View, Text } from 'react-native';
import { getInitials } from '../../utils/format';
import { getPartyColor } from '../../theme/colors';

interface MPAvatarProps {
  name: string;
  party: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeStyles = {
  sm: { container: 'w-10 h-10', text: 'text-sm' },
  md: { container: 'w-14 h-14', text: 'text-base' },
  lg: { container: 'w-16 h-16', text: 'text-lg' },
  xl: { container: 'w-24 h-24', text: 'text-2xl' },
};

export function MPAvatar({ name, party, size = 'lg' }: MPAvatarProps) {
  const initials = getInitials(name);
  const partyColor = getPartyColor(party);
  const styles = sizeStyles[size];

  return (
    <View
      className={`${styles.container} rounded-full items-center justify-center`}
      style={{ backgroundColor: `${partyColor}20` }}
    >
      <Text className={`${styles.text} font-bold`} style={{ color: partyColor }}>
        {initials}
      </Text>
    </View>
  );
}
