/**
 * KYN Type Definitions
 * TypeScript interfaces for MP profile data
 */

export interface BasicInfo {
  fullName: string;
  constituency: string;
  stateUT: string;
  politicalParty: string;
  age: number;
  panCardStatus: 'Provided' | 'Not Provided';
}

export interface FinancialInfo {
  year: number;
  movableAssets: number;
  immovableAssets: number;
  totalAssets: number;
  totalAssetsFormatted: string;
}

export interface Charge {
  count: number;
  description: string;
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

export interface AssetGrowth {
  assets2019: number;
  assets2019Formatted: string;
  assets2024: number;
  assets2024Formatted: string;
  assetChange: number;
  assetChangeFormatted: string;
  growthPercentage: number;
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
  financial: FinancialInfo;
  criminal: CriminalInfo;
  reElection: ReElectionInfo | null;
  searchText: string;
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

// Filter Types
export type CriminalFilter = 'all' | 'with_cases' | 'no_cases';
export type ElectionFilter = 'all' | 're_elected' | 'first_time';

export interface FilterState {
  search: string;
  state: string | null;
  party: string | null;
  criminalFilter: CriminalFilter;
  electionFilter: ElectionFilter;
}
