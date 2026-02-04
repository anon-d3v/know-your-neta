import { useMemo } from 'react';
import mpData from '../data/mp-data.json';
import indexData from '../data/index.json';
import type { MPProfile, IndexData } from '../data/types';
import { useFilterStore } from '../store/filterStore';

// cast the json imports
const allMPs = mpData as MPProfile[];
const indexes = indexData as IndexData;

// simple accessors - no memo needed since these are static
export const useAllMPs = () => allMPs;
export const useIndexData = () => indexes;
export const useStats = () => indexes.stats;

export function useMP(slug: string): MPProfile | undefined {
  // find by slug or id (id is fallback for old links)
  return useMemo(() => allMPs.find(mp => mp.slug === slug || mp.id === slug), [slug]);
}

export function useFilteredMPs(): MPProfile[] {
  const { search, state, party, criminalFilter, electionFilter } = useFilterStore();

  return useMemo(() => {
    let result = allMPs;

    // search filter - check multiple fields
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(mp => {
        const b = mp.basic;
        return b.fullName.toLowerCase().includes(q) ||
               b.constituency.toLowerCase().includes(q) ||
               b.stateUT.toLowerCase().includes(q) ||
               b.politicalParty.toLowerCase().includes(q);
      });
    }

    // state/party filters
    if (state) result = result.filter(mp => mp.basic.stateUT === state);
    if (party) result = result.filter(mp => mp.basic.politicalParty === party);

    // criminal record filter
    if (criminalFilter === 'with_cases') {
      result = result.filter(mp => mp.criminal.hasCases);
    } else if (criminalFilter === 'no_cases') {
      result = result.filter(mp => !mp.criminal.hasCases);
    }

    // election status
    if (electionFilter === 're_elected') {
      result = result.filter(mp => mp.reElection !== null);
    } else if (electionFilter === 'first_time') {
      result = result.filter(mp => mp.reElection === null);
    }

    return result;
  }, [search, state, party, criminalFilter, electionFilter]);
}

// these are used for the filter dropdowns
export const useUniqueStates = () =>
  useMemo(() => Object.keys(indexes.indexes.byState).sort(), []);

export const useUniqueParties = () =>
  useMemo(() => {
    // sort by MP count (descending) so popular parties show first
    return Object.keys(indexes.indexes.byParty).sort((a, b) => {
      return (indexes.indexes.byParty[b]?.length || 0) - (indexes.indexes.byParty[a]?.length || 0);
    });
  }, []);
