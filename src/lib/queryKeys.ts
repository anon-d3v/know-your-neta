export interface MPFilters {
  search?: string;
  state?: string | null;
  party?: string | null;
  criminalFilter?: 'all' | 'with' | 'without';
  electionFilter?: 'all' | 're-elected' | 'first-time';
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export const queryKeys = {
  mps: {
    all: ['mps'] as const,
    lists: () => [...queryKeys.mps.all, 'list'] as const,
    list: (filters: MPFilters) => [...queryKeys.mps.lists(), filters] as const,
    details: () => [...queryKeys.mps.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.mps.details(), slug] as const,
  },
  parties: {
    all: ['parties'] as const,
    list: () => [...queryKeys.parties.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.parties.all, 'detail', id] as const,
    counts: () => [...queryKeys.parties.all, 'counts'] as const,
  },
  stats: {
    all: ['stats'] as const,
    summary: () => [...queryKeys.stats.all, 'summary'] as const,
    indexes: () => [...queryKeys.stats.all, 'indexes'] as const,
  },
  offline: {
    all: ['offline'] as const,
    mps: () => [...queryKeys.offline.all, 'mps'] as const,
    parties: () => [...queryKeys.offline.all, 'parties'] as const,
    stats: () => [...queryKeys.offline.all, 'stats'] as const,
  },
} as const;

export type MPQueryKeys = typeof queryKeys.mps;
export type PartyQueryKeys = typeof queryKeys.parties;
export type StatsQueryKeys = typeof queryKeys.stats;
export type OfflineQueryKeys = typeof queryKeys.offline;
