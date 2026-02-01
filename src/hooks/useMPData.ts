import { useMemo } from 'react';
import mpData from '../data/mp-data.json';
import indexData from '../data/index.json';
import type { MPProfile, IndexData } from '../data/types';
import { useFilterStore } from '../store/filterStore';

// Type assertion for imported JSON
const allMPs = mpData as MPProfile[];
const indexes = indexData as IndexData;

export function useAllMPs(): MPProfile[] {
  return allMPs;
}

export function useIndexData(): IndexData {
  return indexes;
}

export function useMP(slug: string): MPProfile | undefined {
  return useMemo(() => {
    return allMPs.find(mp => mp.slug === slug || mp.id === slug);
  }, [slug]);
}

export function useFilteredMPs(): MPProfile[] {
  const { search, state, party, criminalFilter, electionFilter } = useFilterStore();

  return useMemo(() => {
    let filtered = [...allMPs];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(mp =>
        mp.searchText.includes(searchLower) ||
        mp.basic.fullName.toLowerCase().includes(searchLower) ||
        mp.basic.constituency.toLowerCase().includes(searchLower)
      );
    }

    // Apply state filter
    if (state) {
      filtered = filtered.filter(mp => mp.basic.stateUT === state);
    }

    // Apply party filter
    if (party) {
      filtered = filtered.filter(mp => mp.basic.politicalParty === party);
    }

    // Apply criminal filter
    if (criminalFilter === 'with_cases') {
      filtered = filtered.filter(mp => mp.criminal.hasCases);
    } else if (criminalFilter === 'no_cases') {
      filtered = filtered.filter(mp => !mp.criminal.hasCases);
    }

    // Apply election filter
    if (electionFilter === 're_elected') {
      filtered = filtered.filter(mp => mp.reElection !== null);
    } else if (electionFilter === 'first_time') {
      filtered = filtered.filter(mp => mp.reElection === null);
    }

    return filtered;
  }, [search, state, party, criminalFilter, electionFilter]);
}

export function useUniqueStates(): string[] {
  return useMemo(() => {
    return Object.keys(indexes.indexes.byState).sort();
  }, []);
}

export function useUniqueParties(): string[] {
  return useMemo(() => {
    return Object.keys(indexes.indexes.byParty).sort((a, b) => {
      // Sort by count descending
      const countA = indexes.indexes.byParty[a]?.length || 0;
      const countB = indexes.indexes.byParty[b]?.length || 0;
      return countB - countA;
    });
  }, []);
}

export function useStats() {
  return indexes.stats;
}
