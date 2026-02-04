import { create } from 'zustand';
import type { CriminalFilter, ElectionFilter } from '../data/types';

export type SortField = 'name' | 'assets' | 'criminal_cases' | 'age' | 'constituency';
export type SortDirection = 'asc' | 'desc';

// default filter values - extracted so we can reset to them
const defaults = {
  search: '',
  state: null as string | null,
  party: null as string | null,
  criminalFilter: 'all' as CriminalFilter,
  electionFilter: 'all' as ElectionFilter,
  sortField: 'name' as SortField,
  sortDirection: 'asc' as SortDirection,
};

interface FilterState {
  search: string;
  state: string | null;
  party: string | null;
  criminalFilter: CriminalFilter;
  electionFilter: ElectionFilter;
  sortField: SortField;
  sortDirection: SortDirection;
  // actions
  setSearch: (search: string) => void;
  setState: (state: string | null) => void;
  setParty: (party: string | null) => void;
  setCriminalFilter: (filter: CriminalFilter) => void;
  setElectionFilter: (filter: ElectionFilter) => void;
  setSortField: (field: SortField) => void;
  setSortDirection: (direction: SortDirection) => void;
  setSort: (field: SortField, direction: SortDirection) => void;
  clearFilters: () => void;
  hasActiveFilters: () => boolean;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  ...defaults,

  setSearch: (search) => set({ search }),
  setState: (state) => set({ state }),
  setParty: (party) => set({ party }),
  setCriminalFilter: (criminalFilter) => set({ criminalFilter }),
  setElectionFilter: (electionFilter) => set({ electionFilter }),
  setSortField: (sortField) => set({ sortField }),
  setSortDirection: (sortDirection) => set({ sortDirection }),
  setSort: (field, dir) => set({ sortField: field, sortDirection: dir }),

  clearFilters: () => set({ ...defaults }),

  hasActiveFilters: () => {
    const s = get();
    // just check if anything differs from defaults
    return s.search !== '' || s.state !== null || s.party !== null ||
           s.criminalFilter !== 'all' || s.electionFilter !== 'all' ||
           s.sortField !== 'name' || s.sortDirection !== 'asc';
  },
}));
