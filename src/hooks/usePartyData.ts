import { useMemo, useState, useCallback } from 'react';
import { PARTY_DATABASE, PartyData } from '../data/party-data';
import mpData from '../data/mp-data.json';
import type { MPProfile } from '../data/types';

const allMPs = mpData as MPProfile[];

export interface PartyWithCount extends PartyData {
  mpCount: number;
}

function calculatePartyCounts(): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const mp of allMPs) {
    const party = mp.basic.politicalParty;
    counts[party] = (counts[party] || 0) + 1;
  }

  return counts;
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

  const partiesWithCounts = useMemo(() => {
    const counts = calculatePartyCounts();

    return PARTY_DATABASE.map((party) => ({
      ...party,
      mpCount: matchPartyToMPs(party, counts),
    }));
  }, []);

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

  const allParties = sortedParties;

  const totalMPs = useMemo(() => {
    return allMPs.length;
  }, []);

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
    allParties,
    partiesWithMPs,
    totalMPs,
    searchQuery,
    setSearchQuery,
    getPartyById,
    getPartyByAbbr,
  };
}

export function usePartyCounts(): Record<string, number> {
  return useMemo(() => calculatePartyCounts(), []);
}
