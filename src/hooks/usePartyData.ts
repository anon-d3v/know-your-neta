import { useMemo, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { PARTY_DATABASE, PartyData } from '../data/party-data';
import { fetchParties, type Party } from '../api/parties';
import { useAllMPs } from './useMPData';

export interface PartyWithCount extends PartyData {
  mpCount: number;
}

function matchPartyToMPs(party: PartyData, partyCounts: Record<string, number>): number {
  if (partyCounts[party.abbreviation]) {
    return partyCounts[party.abbreviation];
  }

  if (partyCounts[party.fullName]) {
    return partyCounts[party.fullName];
  }

  const partyLower = party.abbreviation.toLowerCase();
  const fullNameLower = party.fullName.toLowerCase();

  for (const [partyName, count] of Object.entries(partyCounts)) {
    const nameLower = partyName.toLowerCase();
    if (
      nameLower.includes(partyLower) ||
      partyLower.includes(nameLower) ||
      nameLower.includes(fullNameLower) ||
      fullNameLower.includes(nameLower)
    ) {
      return count;
    }
  }

  return 0;
}

export function usePartyData() {
  const [searchQuery, setSearchQuery] = useState('');

  const allMPs = useAllMPs();

  const partyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const mp of allMPs) {
      const party = mp.basic.politicalParty;
      counts[party] = (counts[party] || 0) + 1;
    }
    return counts;
  }, [allMPs]);

  const partiesWithCounts = useMemo(() => {
    return PARTY_DATABASE.map((party) => ({
      ...party,
      mpCount: matchPartyToMPs(party, partyCounts),
    }));
  }, [partyCounts]);

  const filteredParties = useMemo(() => {
    if (!searchQuery) {
      return partiesWithCounts;
    }

    const query = searchQuery.toLowerCase();
    return partiesWithCounts.filter(
      (party) =>
        party.fullName.toLowerCase().includes(query) ||
        party.abbreviation.toLowerCase().includes(query) ||
        party.id.includes(query)
    );
  }, [partiesWithCounts, searchQuery]);

  const sortedParties = useMemo(() => {
    return [...filteredParties].sort((a, b) => b.mpCount - a.mpCount);
  }, [filteredParties]);

  const partiesWithMPs = useMemo(() => {
    return sortedParties.filter((p) => p.mpCount > 0);
  }, [sortedParties]);

  const totalMPs = allMPs.length;

  const getPartyById = useCallback(
    (id: string): PartyWithCount | undefined => {
      return partiesWithCounts.find((p) => p.id === id.toLowerCase());
    },
    [partiesWithCounts]
  );

  const getPartyByAbbr = useCallback(
    (abbr: string): PartyWithCount | undefined => {
      const normalizedAbbr = abbr.toUpperCase().replace(/[()]/g, '');
      return partiesWithCounts.find(
        (p) =>
          p.abbreviation.toUpperCase().replace(/[()]/g, '') === normalizedAbbr ||
          p.abbreviation.toUpperCase() === normalizedAbbr
      );
    },
    [partiesWithCounts]
  );

  return {
    allParties: sortedParties,
    partiesWithMPs,
    totalMPs,
    searchQuery,
    setSearchQuery,
    getPartyById,
    getPartyByAbbr,
    isLoading: allMPs.length === 0,
  };
}

export function usePartyCounts(): Record<string, number> {
  const allMPs = useAllMPs();

  return useMemo(() => {
    const counts: Record<string, number> = {};
    for (const mp of allMPs) {
      const party = mp.basic.politicalParty;
      counts[party] = (counts[party] || 0) + 1;
    }
    return counts;
  }, [allMPs]);
}

export function usePartyDataFromApi() {
  const { data: apiParties, isLoading, error } = useQuery({
    queryKey: queryKeys.parties.list(),
    queryFn: fetchParties,
    staleTime: 1000 * 60 * 60,
  });

  const allMPs = useAllMPs();

  const partyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const mp of allMPs) {
      counts[mp.basic.politicalParty] = (counts[mp.basic.politicalParty] || 0) + 1;
    }
    return counts;
  }, [allMPs]);

  const partiesWithCounts = useMemo(() => {
    if (!apiParties) return [];

    return apiParties.map((party) => ({
      ...party,
      mpCount: partyCounts[party.abbreviation] || partyCounts[party.full_name] || 0,
    }));
  }, [apiParties, partyCounts]);

  return {
    parties: partiesWithCounts,
    isLoading,
    error,
  };
}
