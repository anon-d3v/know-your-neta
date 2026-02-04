// Types for MP data from election affidavits
// Data scraped from ECI/ADR/MyNeta sources

export interface BasicInfo {
  fullName: string;
  constituency: string;
  stateUT: string;  // state or union territory
  politicalParty: string;
  age: number;
  panCardStatus: 'Provided' | 'Not Provided';
}

export interface EducationInfo {
  qualification: string;  // e.g. "Post Graduate", "Doctorate"
  details: string;
}

export interface FinancialInfo {
  year: number;
  movableAssets: number;   // cash, vehicles, jewellery, etc
  immovableAssets: number; // land, buildings
  totalAssets: number;
  totalAssetsFormatted: string;  // pre-formatted for display, prob should remove this
}

export interface Charge {
  count: number;
  description: string;
  ipcSection?: string;
}

export interface CriminalInfo {
  hasCases: boolean;
  totalCases: number;
  seriousIPCSections: number;
  otherIPCSections: number;
  charges: Charge[];
}

export interface ElectionHistoryItem {
  year: number;
  party: string;
  constituency: string;
}

// for re-elected MPs we track asset growth between terms
export interface AssetGrowth {
  assets2019: number;
  assets2019Formatted: string;
  assets2024: number;
  assets2024Formatted: string;
  assetChange: number;  // absolute change
  assetChangeFormatted: string;
  growthPercentage: number;  // can be negative I guess? havent seen one tho
}

export interface IncomeSource {
  self: string;
  spouse: string;
}

export interface ReElectionInfo {
  electionHistory: ElectionHistoryItem[];
  assetGrowth: AssetGrowth;
  incomeSource: IncomeSource;
}

export interface MPProfile {
  id: string;
  slug: string;
  basic: BasicInfo;
  education: EducationInfo;
  financial: FinancialInfo;
  criminal: CriminalInfo;
  reElection: ReElectionInfo | null;
}

export interface IndexMeta {
  totalMPs: number;
  generatedAt: string;
  version: string;
}

export interface IndexStats {
  totalAssets: number;
  totalAssetsFormatted: string;
  avgAge: number;
  totalCriminalCases: number;
  partyDistribution: Record<string, number>;
  stateDistribution: Record<string, number>;
}

export interface IndexData {
  meta: IndexMeta;
  indexes: {
    byState: Record<string, string[]>;
    byParty: Record<string, string[]>;
    withCriminalCases: string[];
    noCriminalCases: string[];
    reElected: string[];
    firstTime: string[];
  };
  stats: IndexStats;
}

export type CriminalFilter = 'all' | 'with_cases' | 'no_cases';
export type ElectionFilter = 'all' | 're_elected' | 'first_time';

// TODO: maybe add 'education' filter too?
export interface FilterState {
  search: string;
  state: string | null;
  party: string | null;
  criminalFilter: CriminalFilter;
  electionFilter: ElectionFilter;
}

// for filter dropdown counts
export interface MPIndex {
  states: { name: string; count: number }[];
  parties: { name: string; count: number }[];
}
