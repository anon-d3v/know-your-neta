import { supabase } from '../lib/supabase';

export interface AppStats {
  id: string;
  total_mps: number;
  total_assets: number;
  mps_with_cases: number;
  mps_without_cases: number;
  re_elected_count: number;
  first_time_count: number;
  party_distribution: Record<string, number>;
  state_distribution: Record<string, number>;
  updated_at: string;
}

export interface IndexData {
  byState: Record<string, string[]>;
  byParty: Record<string, string[]>;
  withCriminalCases: string[];
  noCriminalCases: string[];
  reElected: string[];
  firstTime: string[];
}

export async function fetchStats(): Promise<AppStats> {
  const { data, error } = await supabase
    .from('app_stats')
    .select('*')
    .eq('id', 'main')
    .single();

  if (error) {
    console.error('Error fetching stats:', error);
    return computeStatsFromMPs();
  }
  return data;
}

async function computeStatsFromMPs(): Promise<AppStats> {
  const { data: mps, error } = await supabase
    .from('mps')
    .select('id, political_party, state_ut, has_criminal_cases, is_re_elected, total_assets');

  if (error) throw error;

  const partyDist: Record<string, number> = {};
  const stateDist: Record<string, number> = {};
  let totalAssets = 0, withCases = 0, reElected = 0;

  mps?.forEach((mp) => {
    partyDist[mp.political_party] = (partyDist[mp.political_party] || 0) + 1;
    stateDist[mp.state_ut] = (stateDist[mp.state_ut] || 0) + 1;
    totalAssets += mp.total_assets || 0;
    if (mp.has_criminal_cases) withCases++;
    if (mp.is_re_elected) reElected++;
  });

  const total = mps?.length || 0;
  return {
    id: 'main',
    total_mps: total,
    total_assets: totalAssets,
    mps_with_cases: withCases,
    mps_without_cases: total - withCases,
    re_elected_count: reElected,
    first_time_count: total - reElected,
    party_distribution: partyDist,
    state_distribution: stateDist,
    updated_at: new Date().toISOString(),
  };
}

export async function fetchIndexes(): Promise<IndexData> {
  const { data, error } = await supabase
    .from('mps')
    .select('id, state_ut, political_party, has_criminal_cases, is_re_elected');

  if (error) {
    console.error('Error fetching indexes:', error);
    throw error;
  }

  const idx: IndexData = {
    byState: {},
    byParty: {},
    withCriminalCases: [],
    noCriminalCases: [],
    reElected: [],
    firstTime: [],
  };

  data?.forEach((mp) => {
    if (!idx.byState[mp.state_ut]) idx.byState[mp.state_ut] = [];
    idx.byState[mp.state_ut].push(mp.id);

    if (!idx.byParty[mp.political_party]) idx.byParty[mp.political_party] = [];
    idx.byParty[mp.political_party].push(mp.id);

    if (mp.has_criminal_cases) idx.withCriminalCases.push(mp.id);
    else idx.noCriminalCases.push(mp.id);

    if (mp.is_re_elected) idx.reElected.push(mp.id);
    else idx.firstTime.push(mp.id);
  });

  return idx;
}

export async function fetchUniqueStates(): Promise<string[]> {
  const { data, error } = await supabase.from('mps').select('state_ut').order('state_ut');
  if (error) throw error;
  return [...new Set(data?.map((m) => m.state_ut) || [])];
}

export async function fetchUniqueParties(): Promise<string[]> {
  const { data, error } = await supabase.from('mps').select('political_party').order('political_party');
  if (error) throw error;
  return [...new Set(data?.map((m) => m.political_party) || [])];
}
