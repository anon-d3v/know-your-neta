import { create } from 'zustand';
import type { CriminalFilter, ElectionFilter } from '../data/types';

interface FilterState {
  search: string;
  state: string | null;
  party: string | null;
  criminalFilter: CriminalFilter;
  electionFilter: ElectionFilter;

  // Actions
  setSearch: (search: string) => void;
  setState: (state: string | null) => void;
  setParty: (party: string | null) => void;
  setCriminalFilter: (filter: CriminalFilter) => void;
  setElectionFilter: (filter: ElectionFilter) => void;
  clearFilters: () => void;
  hasActiveFilters: () => boolean;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  search: '',
  state: null,
  party: null,
  criminalFilter: 'all',
  electionFilter: 'all',

  setSearch: (search) => set({ search }),
  setState: (state) => set({ state }),
  setParty: (party) => set({ party }),
  setCriminalFilter: (criminalFilter) => set({ criminalFilter }),
  setElectionFilter: (electionFilter) => set({ electionFilter }),

  clearFilters: () => set({
    search: '',
    state: null,
    party: null,
    criminalFilter: 'all',
    electionFilter: 'all',
  }),

  hasActiveFilters: () => {
    const { search, state, party, criminalFilter, electionFilter } = get();
    return !!(
      search ||
      state ||
      party ||
      criminalFilter !== 'all' ||
      electionFilter !== 'all'
    );
  },
}));
