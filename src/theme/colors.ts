export const colors = {
  dark: {
    background: '#171717',
    surface: '#1f1f1f',
    surfaceElevated: '#262626',
    surfaceOverlay: '#2a2a2a',
    border: 'rgba(255, 255, 255, 0.1)',
    borderLight: 'rgba(255, 255, 255, 0.05)',
    borderBright: 'rgba(255, 255, 255, 0.2)',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.05)',
    backgroundHover: 'rgba(255, 255, 255, 0.08)',
    backgroundActive: 'rgba(255, 255, 255, 0.12)',
    border: 'rgba(255, 255, 255, 0.1)',
    borderLight: 'rgba(255, 255, 255, 0.05)',
    borderBright: 'rgba(255, 255, 255, 0.15)',
    highlight: 'rgba(255, 255, 255, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.5)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.7)',
    tertiary: 'rgba(255, 255, 255, 0.5)',
    muted: 'rgba(255, 255, 255, 0.35)',
    inverse: '#171717',
  },
  primary: {
    50: '#312E81',
    100: '#3730A3',
    200: '#4338CA',
    300: '#4F46E5',
    400: '#6366F1',
    500: '#818CF8',
    600: '#A5B4FC',
    700: '#C7D2FE',
    800: '#E0E7FF',
    900: '#EEF2FF',
  },
  accent: {
    cyan: '#22D3EE',
    purple: '#A855F7',
    pink: '#EC4899',
    emerald: '#34D399',
    amber: '#FBBF24',
  },
  semantic: {
    success: '#34D399',
    successMuted: 'rgba(52, 211, 153, 0.15)',
    warning: '#FBBF24',
    warningMuted: 'rgba(251, 191, 36, 0.15)',
    danger: '#F87171',
    dangerMuted: 'rgba(248, 113, 113, 0.15)',
    info: '#60A5FA',
    infoMuted: 'rgba(96, 165, 250, 0.15)',
  },
  neutral: {
    50: '#171717',
    100: '#1f1f1f',
    200: '#262626',
    300: '#333333',
    400: '#525252',
    500: '#737373',
    600: '#a3a3a3',
    700: '#d4d4d4',
    800: '#e5e5e5',
    900: '#f5f5f5',
  },
  parties: {
    BJP: '#FF9933',
    INC: '#00BFFF',
    AAP: '#3B82F6',
    BSP: '#60A5FA',
    NPP: '#A855F7',
    NCP: '#3B82F6',

    DMK: '#EF4444',
    AIADMK: '#22C55E',
    TMC: '#34D399',
    TDP: '#FACC15',
    YSRCP: '#38BDF8',
    JDS: '#22C55E',
    'Janata Dal (Secular)': '#22C55E',
    BRS: '#EC4899',
    TRS: '#EC4899',
    KCM: '#F97316',

    SP: '#F87171',
    RLD: '#10B981',
    JDU: '#4ADE80',
    RJD: '#4ADE80',
    LJPRV: '#38BDF8',
    HAM: '#818CF8',
    VIP: '#FBBF24',
    RLSP: '#14B8A6',
    JMM: '#22D3EE',
    AJSU: '#F59E0B',

    SS: '#FB923C',
    SHS: '#FB923C',
    SHSUBT: '#F97316',
    'SS-UBT': '#F97316',
    NCPSP: '#2563EB',
    'NCP-SP': '#2563EB',
    MGP: '#22C55E',

    BJD: '#34D399',
    AGP: '#4ADE80',
    AITC: '#34D399',
    UPPL: '#A78BFA',

    NDPP: '#F472B6',
    NPF: '#06B6D4',
    SKM: '#84CC16',
    MNF: '#6366F1',
    UDP: '#78716C',
    IPFT: '#E879F9',
    ZPM: '#FB7185',

    CPI: '#DC2626',
    'CPI(M)': '#B91C1C',
    CPIM: '#B91C1C',
    'CPI(ML)(L)': '#991B1B',
    RSP: '#EF4444',
    AIFB: '#C62828',

    SAD: '#FBBF24',

    IUML: '#059669',
    KC: '#22D3EE',
    'KC(M)': '#06B6D4',
    'KC(J)': '#0EA5E9',

    TIPRA: '#F472B6',

    INDIA: '#00BFFF',
    NDA: '#FF9933',
    IND: '#6B7280',
    INDEPENDENT: '#6B7280',
    OTHER: '#737373',
  },
} as const;

// party name patterns -> color key mapping
// ordered by priority (more specific patterns first)
const partyPatterns: [string[], keyof typeof colors.parties][] = [
  // NCP-SP must come before NCP
  [['NCP', 'SHARAD'], 'NCPSP'],
  [['UBT', 'UDDHAV'], 'SHSUBT'],

  // major national parties
  [['BJP', 'BHARATIYA JANATA'], 'BJP'],
  [['INC', 'INDIAN NATIONAL CONGRESS'], 'INC'],
  [['AAP', 'AAM AADMI'], 'AAP'],
  [['BSP', 'BAHUJAN SAMAJ'], 'BSP'],

  // south indian
  [['DMK', 'DRAVIDA MUNNETRA'], 'DMK'],
  [['AIADMK', 'ANNA DRAVIDA'], 'AIADMK'],
  [['TMC', 'TRINAMOOL', 'AITC'], 'TMC'],
  [['TDP', 'TELUGU DESAM'], 'TDP'],
  [['YSRCP', 'YSR CONGRESS'], 'YSRCP'],
  [['JDS', 'JANATA DAL (SECULAR)', 'JANATA DAL (S)'], 'JDS'],
  [['BRS', 'BHARAT RASHTRA SAMITHI'], 'BRS'],
  [['TRS', 'TELANGANA RASHTRA'], 'TRS'],

  // north indian regional
  [['SAMAJWADI'], 'SP'],
  [['RLD', 'RASHTRIYA LOK DAL'], 'RLD'],
  [['JDU', 'JANATA DAL (UNITED)', 'JANATA DAL (U)'], 'JDU'],
  [['RJD', 'RASHTRIYA JANATA DAL'], 'RJD'],
  [['LJPRV', 'LOK JANSHAKTI'], 'LJPRV'],
  [['JMM', 'JHARKHAND MUKTI'], 'JMM'],
  [['AJSU'], 'AJSU'],

  // maharashtra
  [['SHIV SENA', 'SHS'], 'SS'],
  [['NCP', 'NATIONALIST CONGRESS'], 'NCP'],

  // east & northeast
  [['BJD', 'BIJU JANATA'], 'BJD'],
  [['AGP', 'ASOM GANA PARISHAD'], 'AGP'],
  [['NDPP'], 'NDPP'],
  [['NPF', 'NAGA PEOPLE'], 'NPF'],
  [['SKM', 'SIKKIM'], 'SKM'],
  [['MNF', 'MIZO'], 'MNF'],
  [['NPP', 'NATIONAL PEOPLE'], 'NPP'],
  [['ZPM', 'ZORAM'], 'ZPM'],

  // communist parties (order matters - CPI(M) before CPI)
  [['CPI(M)', 'CPIM', 'COMMUNIST PARTY OF INDIA (MARXIST)'], 'CPIM'],
  [['CPI(ML)'], 'CPI'],  // maps to CPI color
  [['CPI', 'COMMUNIST PARTY OF INDIA'], 'CPI'],
  [['RSP', 'REVOLUTIONARY SOCIALIST'], 'RSP'],

  // others
  [['SAD', 'SHIROMANI AKALI'], 'SAD'],
  [['IUML', 'INDIAN UNION MUSLIM'], 'IUML'],
  [['KERALA CONGRESS', 'KC'], 'KC'],
  [['INDEPENDENT'], 'INDEPENDENT'],
];

// cache for perf - we call this a lot
const colorCache = new Map<string, string>();

export function getPartyColor(party: string): string {
  if (colorCache.has(party)) return colorCache.get(party)!;

  const upper = party.toUpperCase();

  // direct match first
  if (upper in colors.parties) {
    const c = colors.parties[upper as keyof typeof colors.parties];
    colorCache.set(party, c);
    return c;
  }

  // check for SS exact match
  if (upper === 'SP') {
    colorCache.set(party, colors.parties.SP);
    return colors.parties.SP;
  }
  if (upper === 'SS') {
    colorCache.set(party, colors.parties.SS);
    return colors.parties.SS;
  }
  if (upper === 'IND') {
    colorCache.set(party, colors.parties.INDEPENDENT);
    return colors.parties.INDEPENDENT;
  }

  // congress but not TMC or YSR
  if (upper.includes('CONGRESS') && !upper.includes('TRINAMOOL') && !upper.includes('YSR')) {
    colorCache.set(party, colors.parties.INC);
    return colors.parties.INC;
  }

  // pattern matching
  for (const [patterns, colorKey] of partyPatterns) {
    if (patterns.some(p => upper.includes(p))) {
      const c = colors.parties[colorKey];
      colorCache.set(party, c);
      return c;
    }
  }

  colorCache.set(party, colors.parties.OTHER);
  return colors.parties.OTHER;
}

export const glassStyle = {
  card: {
    backgroundColor: colors.glass.background,
    borderWidth: 1,
    borderColor: colors.glass.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardElevated: {
    backgroundColor: colors.glass.backgroundActive,
    borderWidth: 1,
    borderColor: colors.glass.borderBright,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
};
