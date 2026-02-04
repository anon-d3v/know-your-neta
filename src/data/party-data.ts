export interface PartyData {
  id: string;
  fullName: string;
  abbreviation: string;
  color: string;
  founded: string;
  headquarters: string;
  history: string;
  president: string;
  wikipediaUrl: string;
  mpCount?: number;
}

export const PARTY_DATABASE: PartyData[] = [
  {
    id: 'bjp',
    fullName: 'Bharatiya Janata Party',
    abbreviation: 'BJP',
    color: '#FF9933',
    founded: '1980',
    headquarters: 'New Delhi',
    history: 'Founded in 1980, the BJP emerged from the Bharatiya Jana Sangh. It has grown to become India\'s largest political party by membership and has led the central government since 2014.',
    president: 'J. P. Nadda',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'inc',
    fullName: 'Indian National Congress',
    abbreviation: 'INC',
    color: '#00BFFF',
    founded: '1885',
    headquarters: 'New Delhi',
    history: 'The Indian National Congress is India\'s oldest political party, founded in 1885. It played a central role in the Indian independence movement and has governed India for the longest cumulative period.',
    president: 'Mallikarjun Kharge',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'aap',
    fullName: 'Aam Aadmi Party',
    abbreviation: 'AAP',
    color: '#3B82F6',
    founded: '2012',
    headquarters: 'New Delhi',
    history: 'The Aam Aadmi Party was founded in 2012, emerging from the India Against Corruption movement. It has governed Delhi since 2015 and expanded its presence to Punjab.',
    president: 'Arvind Kejriwal',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'bsp',
    fullName: 'Bahujan Samaj Party',
    abbreviation: 'BSP',
    color: '#60A5FA',
    founded: '1984',
    headquarters: 'New Delhi',
    history: 'Founded by Kanshi Ram in 1984, the BSP aims to represent Dalits, OBCs, and religious minorities. It has governed Uttar Pradesh multiple times.',
    president: 'Mayawati',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'npp',
    fullName: 'National People\'s Party',
    abbreviation: 'NPP',
    color: '#A855F7',
    founded: '2013',
    headquarters: 'Meghalaya',
    history: 'The National People\'s Party was founded in 2013 and is based primarily in the northeastern states. It achieved national party status in 2019.',
    president: 'Conrad Sangma',
    wikipediaUrl: 'https://en.wikipedia.org'
  },

  {
    id: 'dmk',
    fullName: 'Dravida Munnetra Kazhagam',
    abbreviation: 'DMK',
    color: '#EF4444',
    founded: '1949',
    headquarters: 'Chennai',
    history: 'The DMK was founded in 1949 by C.N. Annadurai. It has been a major force in Tamil Nadu politics, advocating for Dravidian identity and social justice.',
    president: 'M. K. Stalin',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'aiadmk',
    fullName: 'All India Anna Dravida Munnetra Kazhagam',
    abbreviation: 'AIADMK',
    color: '#22C55E',
    founded: '1972',
    headquarters: 'Chennai',
    history: 'AIADMK was founded by M.G. Ramachandran in 1972 after splitting from DMK. It has alternated with DMK in governing Tamil Nadu.',
    president: 'Edappadi K. Palaniswami',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'tmc',
    fullName: 'All India Trinamool Congress',
    abbreviation: 'TMC',
    color: '#34D399',
    founded: '1998',
    headquarters: 'Kolkata',
    history: 'Founded by Mamata Banerjee in 1998 after breaking away from Congress, TMC has governed West Bengal since 2011, ending 34 years of Left Front rule.',
    president: 'Mamata Banerjee',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'tdp',
    fullName: 'Telugu Desam Party',
    abbreviation: 'TDP',
    color: '#FACC15',
    founded: '1982',
    headquarters: 'Amaravati',
    history: 'TDP was founded by N.T. Rama Rao in 1982. It has been a dominant force in Andhra Pradesh politics and played significant roles in national coalitions.',
    president: 'N. Chandrababu Naidu',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'ysrcp',
    fullName: 'YSR Congress Party',
    abbreviation: 'YSRCP',
    color: '#38BDF8',
    founded: '2011',
    headquarters: 'Tadepalli',
    history: 'YSRCP was founded by Y.S. Jagan Mohan Reddy in 2011. It won a landslide victory in Andhra Pradesh in 2019.',
    president: 'Y. S. Jagan Mohan Reddy',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'jds',
    fullName: 'Janata Dal (Secular)',
    abbreviation: 'JDS',
    color: '#22C55E',
    founded: '1999',
    headquarters: 'Bengaluru',
    history: 'JDS was formed in 1999 when the Janata Dal split. It has been influential in Karnataka politics under the Deve Gowda family leadership.',
    president: 'H. D. Deve Gowda',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'brs',
    fullName: 'Bharat Rashtra Samithi',
    abbreviation: 'BRS',
    color: '#EC4899',
    founded: '2001',
    headquarters: 'Hyderabad',
    history: 'Originally founded as Telangana Rashtra Samithi in 2001 to advocate for a separate Telangana state. Renamed to BRS in 2022 with national ambitions.',
    president: 'K. Chandrashekar Rao',
    wikipediaUrl: 'https://en.wikipedia.org'
  },

  {
    id: 'sp',
    fullName: 'Samajwadi Party',
    abbreviation: 'SP',
    color: '#F87171',
    founded: '1992',
    headquarters: 'Lucknow',
    history: 'The Samajwadi Party was founded by Mulayam Singh Yadav in 1992. It has governed Uttar Pradesh multiple times and advocates for socialist and OBC causes.',
    president: 'Akhilesh Yadav',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'rld',
    fullName: 'Rashtriya Lok Dal',
    abbreviation: 'RLD',
    color: '#10B981',
    founded: '1996',
    headquarters: 'New Delhi',
    history: 'RLD was formed in 1996 and primarily represents farming communities in western Uttar Pradesh. Led by Jayant Chaudhary, it focuses on agricultural issues.',
    president: 'Jayant Chaudhary',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'jdu',
    fullName: 'Janata Dal (United)',
    abbreviation: 'JDU',
    color: '#4ADE80',
    founded: '1999',
    headquarters: 'Patna',
    history: 'JDU was formed in 1999 from the merger of several parties. Under Nitish Kumar, it has governed Bihar and been a key NDA ally.',
    president: 'Nitish Kumar',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'rjd',
    fullName: 'Rashtriya Janata Dal',
    abbreviation: 'RJD',
    color: '#4ADE80',
    founded: '1997',
    headquarters: 'Patna',
    history: 'RJD was founded by Lalu Prasad Yadav in 1997. It has been a major force in Bihar politics, advocating for backward castes and minorities.',
    president: 'Lalu Prasad Yadav',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'ljp',
    fullName: 'Lok Janshakti Party (Ram Vilas)',
    abbreviation: 'LJP-RV',
    color: '#38BDF8',
    founded: '2000',
    headquarters: 'New Delhi',
    history: 'Originally founded as LJP by Ram Vilas Paswan in 2000. After his death, the party split and this faction is led by Chirag Paswan.',
    president: 'Chirag Paswan',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'jmm',
    fullName: 'Jharkhand Mukti Morcha',
    abbreviation: 'JMM',
    color: '#22D3EE',
    founded: '1972',
    headquarters: 'Ranchi',
    history: 'JMM was founded in 1972 to advocate for tribal rights and a separate Jharkhand state. It currently leads the Jharkhand government.',
    president: 'Shibu Soren',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'ajsu',
    fullName: 'All Jharkhand Students Union',
    abbreviation: 'AJSU',
    color: '#F59E0B',
    founded: '1986',
    headquarters: 'Ranchi',
    history: 'AJSU was formed in 1986 as a student organization advocating for Jharkhand statehood. It later became a political party.',
    president: 'Sudesh Mahto',
    wikipediaUrl: 'https://en.wikipedia.org'
  },

  {
    id: 'ss',
    fullName: 'Shiv Sena',
    abbreviation: 'SHS',
    color: '#FB923C',
    founded: '1966',
    headquarters: 'Mumbai',
    history: 'Shiv Sena was founded by Bal Thackeray in 1966. After a 2022 split, this faction is led by Eknath Shinde and is allied with BJP.',
    president: 'Eknath Shinde',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'ss-ubt',
    fullName: 'Shiv Sena (Uddhav Balasaheb Thackeray)',
    abbreviation: 'SS-UBT',
    color: '#F97316',
    founded: '2022',
    headquarters: 'Mumbai',
    history: 'Formed in 2022 after the Shiv Sena split, this faction is led by Uddhav Thackeray and is part of the INDIA alliance.',
    president: 'Uddhav Thackeray',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'ncp',
    fullName: 'Nationalist Congress Party',
    abbreviation: 'NCP',
    color: '#3B82F6',
    founded: '1999',
    headquarters: 'New Delhi',
    history: 'NCP was founded by Sharad Pawar in 1999. After a 2023 split, this faction is led by Ajit Pawar and allied with NDA.',
    president: 'Ajit Pawar',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'ncp-sp',
    fullName: 'NCP (Sharadchandra Pawar)',
    abbreviation: 'NCP-SP',
    color: '#2563EB',
    founded: '2023',
    headquarters: 'Mumbai',
    history: 'Formed after the 2023 NCP split, this faction is led by Sharad Pawar and is part of the INDIA alliance.',
    president: 'Sharad Pawar',
    wikipediaUrl: 'https://en.wikipedia.org'
  },

  {
    id: 'bjd',
    fullName: 'Biju Janata Dal',
    abbreviation: 'BJD',
    color: '#34D399',
    founded: '1997',
    headquarters: 'Bhubaneswar',
    history: 'BJD was founded by Naveen Patnaik in 1997 in memory of his father Biju Patnaik. It governed Odisha from 2000 to 2024.',
    president: 'Naveen Patnaik',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'agp',
    fullName: 'Asom Gana Parishad',
    abbreviation: 'AGP',
    color: '#4ADE80',
    founded: '1985',
    headquarters: 'Guwahati',
    history: 'AGP was formed in 1985 from the Assam Movement. It has governed Assam and represents Assamese regional interests.',
    president: 'Atul Bora',
    wikipediaUrl: 'https://en.wikipedia.org'
  },

  {
    id: 'ndpp',
    fullName: 'Nationalist Democratic Progressive Party',
    abbreviation: 'NDPP',
    color: '#F472B6',
    founded: '2017',
    headquarters: 'Kohima',
    history: 'NDPP was founded in 2017 and governs Nagaland in alliance with BJP. It advocates for Naga interests and development.',
    president: 'Chingwang Konyak',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'npf',
    fullName: 'Naga People\'s Front',
    abbreviation: 'NPF',
    color: '#06B6D4',
    founded: '2002',
    headquarters: 'Kohima',
    history: 'NPF was formed in 2002 and has been a significant political force in Nagaland, advocating for Naga rights and development.',
    president: 'Shürhozelie Liezietsu',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'skm',
    fullName: 'Sikkim Krantikari Morcha',
    abbreviation: 'SKM',
    color: '#84CC16',
    founded: '2013',
    headquarters: 'Gangtok',
    history: 'SKM was founded in 2013 and came to power in Sikkim in 2019, ending 25 years of SDF rule.',
    president: 'Prem Singh Tamang',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'mnf',
    fullName: 'Mizo National Front',
    abbreviation: 'MNF',
    color: '#6366F1',
    founded: '1961',
    headquarters: 'Aizawl',
    history: 'MNF was founded in 1961 and led the Mizo movement. After signing an accord in 1986, it became a mainstream party and has governed Mizoram.',
    president: 'Zoramthanga',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'zpm',
    fullName: 'Zoram People\'s Movement',
    abbreviation: 'ZPM',
    color: '#FB7185',
    founded: '2017',
    headquarters: 'Aizawl',
    history: 'ZPM was formed in 2017 as a political front by various civil society organizations in Mizoram.',
    president: 'Lalduhoma',
    wikipediaUrl: 'https://en.wikipedia.org'
  },

  {
    id: 'cpi',
    fullName: 'Communist Party of India',
    abbreviation: 'CPI',
    color: '#DC2626',
    founded: '1925',
    headquarters: 'New Delhi',
    history: 'CPI is India\'s oldest communist party, founded in 1925. It has been influential in Kerala, West Bengal, and Tripura politics.',
    president: 'D. Raja',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'cpim',
    fullName: 'Communist Party of India (Marxist)',
    abbreviation: 'CPI(M)',
    color: '#B91C1C',
    founded: '1964',
    headquarters: 'New Delhi',
    history: 'CPI(M) was formed in 1964 after splitting from CPI. It has governed West Bengal for 34 years and continues to govern Kerala.',
    president: 'Sitaram Yechury',
    wikipediaUrl: 'https://en.wikipedia.org'
  },

  {
    id: 'sad',
    fullName: 'Shiromani Akali Dal',
    abbreviation: 'SAD',
    color: '#FBBF24',
    founded: '1920',
    headquarters: 'Chandigarh',
    history: 'SAD was founded in 1920 and is closely associated with Sikh religious institutions. It has governed Punjab multiple times.',
    president: 'Sukhbir Singh Badal',
    wikipediaUrl: 'https://en.wikipedia.org'
  },

  {
    id: 'iuml',
    fullName: 'Indian Union Muslim League',
    abbreviation: 'IUML',
    color: '#059669',
    founded: '1948',
    headquarters: 'Kozhikode',
    history: 'IUML was formed in 1948 and is primarily based in Kerala. It has been part of UDF coalitions in Kerala.',
    president: 'Panakkad Sadiq Ali Shihab Thangal',
    wikipediaUrl: 'https://en.wikipedia.org'
  },

  {
    id: 'ind',
    fullName: 'Independent',
    abbreviation: 'IND',
    color: '#6B7280',
    founded: 'N/A',
    headquarters: 'N/A',
    history: 'Independent candidates contest elections without affiliation to any political party. They represent individual candidature in Indian democracy.',
    president: 'N/A',
    wikipediaUrl: 'https://en.wikipedia.org'
  },
];

export function getPartyById(id: string): PartyData | undefined {
  return PARTY_DATABASE.find((p) => p.id === id.toLowerCase());
}

export function getPartyByAbbr(abbr: string): PartyData | undefined {
  const normalizedAbbr = abbr.toUpperCase().replace(/[()]/g, '');
  return PARTY_DATABASE.find(
    (p) =>
      p.abbreviation.toUpperCase().replace(/[()]/g, '') === normalizedAbbr ||
      p.abbreviation.toUpperCase() === normalizedAbbr
  );
}

export function searchParties(query: string): PartyData[] {
  const lowerQuery = query.toLowerCase();
  return PARTY_DATABASE.filter(
    (p) =>
      p.fullName.toLowerCase().includes(lowerQuery) ||
      p.abbreviation.toLowerCase().includes(lowerQuery) ||
      p.id.includes(lowerQuery)
  );
}
