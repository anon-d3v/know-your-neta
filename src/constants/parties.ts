export const PARTY_CONFIG: Record<string, { name: string; color: string; abbr: string }> = {
  BJP: { name: 'Bharatiya Janata Party', color: '#FF9933', abbr: 'BJP' },
  INC: { name: 'Indian National Congress', color: '#00BFFF', abbr: 'INC' },
  AAP: { name: 'Aam Aadmi Party', color: '#0066CC', abbr: 'AAP' },
  DMK: { name: 'Dravida Munnetra Kazhagam', color: '#FF0000', abbr: 'DMK' },
  TMC: { name: 'All India Trinamool Congress', color: '#20C997', abbr: 'TMC' },
  'Janata Dal (Secular)': { name: 'Janata Dal (Secular)', color: '#006400', abbr: 'JDS' },
  SP: { name: 'Samajwadi Party', color: '#E53935', abbr: 'SP' },
  BSP: { name: 'Bahujan Samaj Party', color: '#0000FF', abbr: 'BSP' },
  NCP: { name: 'Nationalist Congress Party', color: '#004080', abbr: 'NCP' },
  SS: { name: 'Shiv Sena', color: '#FF6600', abbr: 'SS' },
  TDP: { name: 'Telugu Desam Party', color: '#FFEB3B', abbr: 'TDP' },
  YSRCP: { name: 'YSR Congress Party', color: '#1E90FF', abbr: 'YSRCP' },
  JDU: { name: 'Janata Dal (United)', color: '#008000', abbr: 'JDU' },
  RJD: { name: 'Rashtriya Janata Dal', color: '#2E7D32', abbr: 'RJD' },
  BJD: { name: 'Biju Janata Dal', color: '#228B22', abbr: 'BJD' },
  AITC: { name: 'All India Trinamool Congress', color: '#20C997', abbr: 'AITC' },
  SHS: { name: 'Shiv Sena', color: '#FF6600', abbr: 'SHS' },
  NCPSP: { name: 'NCP (Sharadchandra Pawar)', color: '#004080', abbr: 'NCP-SP' },
  SHSUBT: { name: 'Shiv Sena (UBT)', color: '#FF6600', abbr: 'SS-UBT' },
  OTHER: { name: 'Other/Independent', color: '#808080', abbr: 'OTH' },
};

export function getPartyAbbr(party: string): string {
  if (party in PARTY_CONFIG) {
    return PARTY_CONFIG[party].abbr;
  }
  // Try to find a match
  const upperParty = party.toUpperCase();
  for (const [key, value] of Object.entries(PARTY_CONFIG)) {
    if (upperParty.includes(key) || upperParty.includes(value.abbr)) {
      return value.abbr;
    }
  }
  // Return first 3 letters as abbreviation
  return party.slice(0, 3).toUpperCase();
}

export function getPartyConfig(party: string) {
  if (party in PARTY_CONFIG) {
    return PARTY_CONFIG[party];
  }
  return PARTY_CONFIG.OTHER;
}
