export const colors = {
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
  },
  neutral: {
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    400: '#A1A1AA',
    500: '#71717A',
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B',
  },
  parties: {
    BJP: '#FF9933',
    INC: '#00BFFF',
    AAP: '#0066CC',
    DMK: '#FF0000',
    TMC: '#20C997',
    'Janata Dal (Secular)': '#006400',
    SP: '#E53935',
    BSP: '#0000FF',
    NCP: '#004080',
    SS: '#FF6600',
    TDP: '#FFEB3B',
    YSRCP: '#1E90FF',
    JDU: '#008000',
    RJD: '#2E7D32',
    BJD: '#228B22',
    OTHER: '#808080',
  },
} as const;

export function getPartyColor(party: string): string {
  const normalizedParty = party.toUpperCase();
  if (normalizedParty in colors.parties) {
    return colors.parties[normalizedParty as keyof typeof colors.parties];
  }
  // Check for partial matches
  if (normalizedParty.includes('BJP')) return colors.parties.BJP;
  if (normalizedParty.includes('INC') || normalizedParty.includes('CONGRESS')) return colors.parties.INC;
  if (normalizedParty.includes('AAP')) return colors.parties.AAP;
  if (normalizedParty.includes('DMK')) return colors.parties.DMK;
  if (normalizedParty.includes('TMC') || normalizedParty.includes('TRINAMOOL')) return colors.parties.TMC;
  if (normalizedParty.includes('JDS') || normalizedParty.includes('JANATA DAL (SECULAR)')) return colors.parties['Janata Dal (Secular)'];
  if (normalizedParty.includes('SP') || normalizedParty.includes('SAMAJWADI')) return colors.parties.SP;
  if (normalizedParty.includes('TDP')) return colors.parties.TDP;
  if (normalizedParty.includes('YSRCP')) return colors.parties.YSRCP;
  if (normalizedParty.includes('JDU')) return colors.parties.JDU;
  if (normalizedParty.includes('BJD')) return colors.parties.BJD;
  return colors.parties.OTHER;
}
