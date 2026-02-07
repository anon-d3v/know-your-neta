import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import {
  fetchMPLADSAllocation,
  fetchAllMPLADSAllocations,
  fetchMPWorks,
  fetchWorkDetail,
  fetchWorkExpenditures,
  fetchMPLADSSummary,
  fetchMPLADSGlobalStats,
} from '../api/mplads';
import type { WorkStatus } from '../data/types';

/**
 * Fetch MPLADS allocation for a specific MP
 */
export function useMPLADSAllocation(mpId: string) {
  return useQuery({
    queryKey: queryKeys.mplads.allocation(mpId),
    queryFn: () => fetchMPLADSAllocation(mpId),
    enabled: !!mpId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Fetch all MPLADS allocations (for stats/comparison)
 */
export function useAllMPLADSAllocations() {
  return useQuery({
    queryKey: queryKeys.mplads.allocations(),
    queryFn: fetchAllMPLADSAllocations,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Fetch works for a specific MP
 */
export function useMPWorks(mpId: string, status?: WorkStatus) {
  return useQuery({
    queryKey: status
      ? queryKeys.mplads.worksByStatus(mpId, status)
      : queryKeys.mplads.works(mpId),
    queryFn: () => fetchMPWorks(mpId, status),
    enabled: !!mpId,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Fetch detail for a specific work
 */
export function useWorkDetail(workId: string) {
  return useQuery({
    queryKey: queryKeys.mplads.workDetail(workId),
    queryFn: () => fetchWorkDetail(workId),
    enabled: !!workId,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Fetch expenditures for a specific work
 */
export function useWorkExpenditures(workId: string) {
  return useQuery({
    queryKey: queryKeys.mplads.expenditures(workId),
    queryFn: () => fetchWorkExpenditures(workId),
    enabled: !!workId,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Fetch MPLADS summary for an MP (allocation + works counts + utilization)
 */
export function useMPLADSSummary(mpId: string) {
  return useQuery({
    queryKey: queryKeys.mplads.summary(mpId),
    queryFn: () => fetchMPLADSSummary(mpId),
    enabled: !!mpId,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Fetch global MPLADS statistics
 */
export function useMPLADSGlobalStats() {
  return useQuery({
    queryKey: queryKeys.mplads.globalStats(),
    queryFn: fetchMPLADSGlobalStats,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Helper hook to format MPLADS amounts
 */
export function useFormatMPLADSAmount() {
  return (amount: number): string => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(2)} K`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };
}
