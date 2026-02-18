import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { fetchAllMPs, fetchMPDetail, type MPListItem, type MPDetailWithCharges } from '../api/mps';
import { fetchStats, fetchIndexes, type AppStats, type IndexData as ApiIndexData } from '../api/stats';
import type { MPProfile, IndexData, IndexStats, Charge } from '../data/types';
import { useFilterStore } from '../store/filterStore';

function transformToMPProfile(mp: MPListItem): MPProfile {
  return {
    id: mp.id,
    slug: mp.slug,
    basic: {
      fullName: mp.full_name,
      constituency: mp.constituency,
      stateUT: mp.state_ut,
      politicalParty: mp.political_party,
      age: mp.age,
      panCardStatus: 'Provided',
    },
    education: { qualification: '', details: '' },
    financial: {
      year: 2024,
      movableAssets: 0,
      immovableAssets: 0,
      totalAssets: mp.total_assets,
      totalAssetsFormatted: formatAssets(mp.total_assets),
    },
    criminal: {
      hasCases: mp.has_criminal_cases,
      totalCases: mp.total_criminal_cases,
      seriousIPCSections: 0,
      otherIPCSections: 0,
      charges: [],
    },
    reElection: mp.is_re_elected ? {
      electionHistory: [],
      assetGrowth: {
        assets2019: 0,
        assets2019Formatted: '',
        assets2024: mp.total_assets,
        assets2024Formatted: formatAssets(mp.total_assets),
        assetChange: 0,
        assetChangeFormatted: '',
        growthPercentage: mp.asset_growth_percentage || 0,
      },
      incomeSource: { self: '', spouse: '' },
    } : null,
  };
}

function transformDetailToMPProfile(data: MPDetailWithCharges): MPProfile {
  const { mp, charges } = data;
  return {
    id: mp.id,
    slug: mp.slug,
    basic: {
      fullName: mp.full_name,
      constituency: mp.constituency,
      stateUT: mp.state_ut,
      politicalParty: mp.political_party,
      age: mp.age,
      panCardStatus: (mp.pan_card_status as 'Provided' | 'Not Provided') || 'Provided',
    },
    education: {
      qualification: mp.education_qualification || '',
      details: mp.education_details || '',
    },
    financial: {
      year: mp.financial_year,
      movableAssets: mp.movable_assets,
      immovableAssets: mp.immovable_assets,
      totalAssets: mp.total_assets,
      totalAssetsFormatted: formatAssets(mp.total_assets),
    },
    criminal: {
      hasCases: mp.has_criminal_cases,
      totalCases: mp.total_criminal_cases,
      seriousIPCSections: mp.serious_ipc_sections,
      otherIPCSections: mp.other_ipc_sections,
      charges: charges.map((c): Charge => ({
        count: c.count,
        description: c.description,
        ipcSection: c.ipc_section || undefined,
      })),
    },
    reElection: mp.is_re_elected ? {
      electionHistory: [],
      assetGrowth: {
        assets2019: mp.assets_2019 || 0,
        assets2019Formatted: formatAssets(mp.assets_2019 || 0),
        assets2024: mp.total_assets,
        assets2024Formatted: formatAssets(mp.total_assets),
        assetChange: mp.total_assets - (mp.assets_2019 || 0),
        assetChangeFormatted: formatAssets(mp.total_assets - (mp.assets_2019 || 0)),
        growthPercentage: mp.asset_growth_percentage || 0,
      },
      incomeSource: { self: '', spouse: '' },
    } : null,
  };
}

function formatAssets(amount: number | null | undefined): string {
  if (amount == null) return '₹0';
  const cr = amount / 10000000;
  if (cr >= 1) return `${cr.toFixed(1)} Cr`;
  const lakh = amount / 100000;
  if (lakh >= 1) return `${lakh.toFixed(1)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

function transformToIndexData(stats: AppStats | null, indexes: ApiIndexData | null): IndexData {
  return {
    meta: {
      totalMPs: stats?.total_mps || 0,
      generatedAt: stats?.updated_at || new Date().toISOString(),
      version: '2.0.0',
    },
    indexes: {
      byState: indexes?.byState || {},
      byParty: indexes?.byParty || {},
      withCriminalCases: indexes?.withCriminalCases || [],
      noCriminalCases: indexes?.noCriminalCases || [],
      reElected: indexes?.reElected || [],
      firstTime: indexes?.firstTime || [],
    },
    stats: {
      totalAssets: stats?.total_assets || 0,
      totalAssetsFormatted: formatAssets(stats?.total_assets || 0),
      avgAge: 0,
      totalCriminalCases: 0,
      partyDistribution: stats?.party_distribution || {},
      stateDistribution: stats?.state_distribution || {},
    },
  };
}

const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours - consistent with queryClient

export function useAllMPs() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.offline.mps(),
    queryFn: fetchAllMPs,
    staleTime: CACHE_DURATION,
  });

  return useMemo(() => data ? data.map(transformToMPProfile) : [], [data]);
}

export function useAllMPsWithStatus() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.offline.mps(),
    queryFn: fetchAllMPs,
    staleTime: CACHE_DURATION,
  });

  const mps = useMemo(() => data ? data.map(transformToMPProfile) : [], [data]);
  return { mps, isLoading, error, refetch };
}

export function useIndexData(): IndexData {
  const { data: stats } = useQuery({
    queryKey: queryKeys.stats.summary(),
    queryFn: fetchStats,
    staleTime: CACHE_DURATION,
  });

  const { data: indexes } = useQuery({
    queryKey: queryKeys.stats.indexes(),
    queryFn: fetchIndexes,
    staleTime: CACHE_DURATION,
  });

  return useMemo(() => transformToIndexData(stats || null, indexes || null), [stats, indexes]);
}

export function useStats(): IndexStats {
  const idx = useIndexData();
  return idx.stats;
}

export function useMP(slug: string): MPProfile | undefined {
  const allMPs = useAllMPs();
  const cached = useMemo(() => allMPs.find((m) => m.slug === slug || m.id === slug), [allMPs, slug]);

  const { data } = useQuery({
    queryKey: queryKeys.mps.detail(slug),
    queryFn: () => fetchMPDetail(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });

  return useMemo(() => data ? transformDetailToMPProfile(data) : cached, [data, cached]);
}

export function useMPWithStatus(slug: string) {
  const allMPs = useAllMPs();
  const cached = useMemo(() => allMPs.find((m) => m.slug === slug || m.id === slug), [allMPs, slug]);

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.mps.detail(slug),
    queryFn: () => fetchMPDetail(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });

  const mp = useMemo(() => data ? transformDetailToMPProfile(data) : cached, [data, cached]);
  return { mp, isLoading: isLoading && !cached, error };
}

export function useFilteredMPs(): MPProfile[] {
  const allMPs = useAllMPs();
  const { search, state, party, criminalFilter, electionFilter, sortBy } = useFilterStore();

  return useMemo(() => {
    let result = [...allMPs];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((mp) => {
        const b = mp.basic;
        return b.fullName.toLowerCase().includes(q) ||
          b.constituency.toLowerCase().includes(q) ||
          b.stateUT.toLowerCase().includes(q) ||
          b.politicalParty.toLowerCase().includes(q);
      });
    }

    if (state) result = result.filter((mp) => mp.basic.stateUT === state);
    if (party) result = result.filter((mp) => mp.basic.politicalParty === party);

    if (criminalFilter === 'with_cases') result = result.filter((mp) => mp.criminal.hasCases);
    else if (criminalFilter === 'no_cases') result = result.filter((mp) => !mp.criminal.hasCases);

    if (electionFilter === 're_elected') result = result.filter((mp) => mp.reElection !== null);
    else if (electionFilter === 'first_time') result = result.filter((mp) => mp.reElection === null);

    if (sortBy) {
      result.sort((a, b) => {
        switch (sortBy) {
          case 'name': return a.basic.fullName.localeCompare(b.basic.fullName);
          case 'assets-high': return b.financial.totalAssets - a.financial.totalAssets;
          case 'assets-low': return a.financial.totalAssets - b.financial.totalAssets;
          case 'cases-high': return b.criminal.totalCases - a.criminal.totalCases;
          case 'cases-low': return a.criminal.totalCases - b.criminal.totalCases;
          case 'age-high': return b.basic.age - a.basic.age;
          case 'age-low': return a.basic.age - b.basic.age;
          default: return 0;
        }
      });
    }

    return result;
  }, [allMPs, search, state, party, criminalFilter, electionFilter, sortBy]);
}

export function useFilteredMPsWithStatus() {
  const { mps: allMPs, isLoading, error } = useAllMPsWithStatus();
  const { search, state, party, criminalFilter, electionFilter, sortBy } = useFilterStore();

  const filtered = useMemo(() => {
    let result = [...allMPs];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((mp) => {
        const b = mp.basic;
        return b.fullName.toLowerCase().includes(q) ||
          b.constituency.toLowerCase().includes(q) ||
          b.stateUT.toLowerCase().includes(q) ||
          b.politicalParty.toLowerCase().includes(q);
      });
    }

    if (state) result = result.filter((mp) => mp.basic.stateUT === state);
    if (party) result = result.filter((mp) => mp.basic.politicalParty === party);

    if (criminalFilter === 'with_cases') result = result.filter((mp) => mp.criminal.hasCases);
    else if (criminalFilter === 'no_cases') result = result.filter((mp) => !mp.criminal.hasCases);

    if (electionFilter === 're_elected') result = result.filter((mp) => mp.reElection !== null);
    else if (electionFilter === 'first_time') result = result.filter((mp) => mp.reElection === null);

    if (sortBy) {
      result.sort((a, b) => {
        switch (sortBy) {
          case 'name': return a.basic.fullName.localeCompare(b.basic.fullName);
          case 'assets-high': return b.financial.totalAssets - a.financial.totalAssets;
          case 'assets-low': return a.financial.totalAssets - b.financial.totalAssets;
          case 'cases-high': return b.criminal.totalCases - a.criminal.totalCases;
          case 'cases-low': return a.criminal.totalCases - b.criminal.totalCases;
          case 'age-high': return b.basic.age - a.basic.age;
          case 'age-low': return a.basic.age - b.basic.age;
          default: return 0;
        }
      });
    }

    return result;
  }, [allMPs, search, state, party, criminalFilter, electionFilter, sortBy]);

  return { mps: filtered, isLoading, error };
}

export function useUniqueStates(): string[] {
  const allMPs = useAllMPs();
  return useMemo(() => {
    const states = [...new Set(allMPs.map((mp) => mp.basic.stateUT))];
    return states.sort();
  }, [allMPs]);
}

export function useUniqueParties(): string[] {
  const allMPs = useAllMPs();
  return useMemo(() => {
    const counts: Record<string, number> = {};
    allMPs.forEach((mp) => {
      counts[mp.basic.politicalParty] = (counts[mp.basic.politicalParty] || 0) + 1;
    });
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  }, [allMPs]);
}

export function usePrefetchMP() {
  const queryClient = useQueryClient();
  return (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.mps.detail(slug),
      queryFn: () => fetchMPDetail(slug),
      staleTime: 1000 * 60 * 5,
    });
  };
}
