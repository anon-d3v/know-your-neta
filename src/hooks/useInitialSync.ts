import { useEffect, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { queryKeys } from '../lib/queryKeys';
import { isDataCached, isCacheExpired, setCacheTimestamp, clearCache } from '../lib/queryClient';
import { fetchAllMPs } from '../api/mps';
import { fetchParties } from '../api/parties';
import { fetchStats, fetchIndexes } from '../api/stats';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'error';

interface SyncState {
  status: SyncStatus;
  progress: number;
  error: Error | null;
}

const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

export function useInitialSync() {
  const queryClient = useQueryClient();
  const [state, setState] = useState<SyncState>({ status: 'idle', progress: 0, error: null });

  const sync = useCallback(async () => {
    try {
      const hasCached = await isDataCached();
      const cacheExpired = await isCacheExpired();
      const netInfo = await NetInfo.fetch();
      const online = netInfo.isConnected;

      // No internet and no cache = error
      if (!online && !hasCached) {
        setState({ status: 'error', progress: 0, error: new Error('No internet connection and no cached data') });
        return;
      }

      // Cache expired and online = force refresh
      if (online && cacheExpired) {
        console.log('Cache expired, forcing full refresh...');
        setState({ status: 'syncing', progress: 5, error: null });
        
        // Clear old cache
        await clearCache();
        
        // Force fresh download
        const results = await Promise.allSettled([
          queryClient.fetchQuery({
            queryKey: queryKeys.offline.mps(),
            queryFn: fetchAllMPs,
            staleTime: CACHE_DURATION
          }),
          queryClient.fetchQuery({
            queryKey: queryKeys.parties.list(),
            queryFn: fetchParties,
            staleTime: CACHE_DURATION
          }),
          queryClient.fetchQuery({
            queryKey: queryKeys.stats.summary(),
            queryFn: fetchStats,
            staleTime: CACHE_DURATION
          }),
          queryClient.fetchQuery({
            queryKey: queryKeys.stats.indexes(),
            queryFn: fetchIndexes,
            staleTime: CACHE_DURATION
          }),
        ]);

        const mpsFailed = results[0].status === 'rejected';
        if (mpsFailed) {
          const err = results[0].status === 'rejected' ? results[0].reason : new Error('Failed to fetch MPs');
          setState({ status: 'error', progress: 0, error: err });
          return;
        }

        // Update cache timestamp
        await setCacheTimestamp();
        setState({ status: 'synced', progress: 100, error: null });
        return;
      }

      // Offline with valid cache
      if (!online && hasCached) {
        setState({ status: 'offline', progress: 100, error: null });
        return;
      }

      // Check if data is already loaded in memory
      const cached = queryClient.getQueryData(queryKeys.offline.mps());
      if (cached && Array.isArray(cached) && cached.length > 0) {
        setState({ status: 'synced', progress: 100, error: null });
        return;
      }

      // Initial load - download all data
      setState({ status: 'syncing', progress: 5, error: null });

      const results = await Promise.allSettled([
        queryClient.fetchQuery({
          queryKey: queryKeys.offline.mps(),
          queryFn: fetchAllMPs,
          staleTime: CACHE_DURATION
        }),
        queryClient.fetchQuery({
          queryKey: queryKeys.parties.list(),
          queryFn: fetchParties,
          staleTime: CACHE_DURATION
        }),
        queryClient.fetchQuery({
          queryKey: queryKeys.stats.summary(),
          queryFn: fetchStats,
          staleTime: CACHE_DURATION
        }),
        queryClient.fetchQuery({
          queryKey: queryKeys.stats.indexes(),
          queryFn: fetchIndexes,
          staleTime: CACHE_DURATION
        }),
      ]);

      const mpsFailed = results[0].status === 'rejected';

      if (mpsFailed) {
        if (!hasCached) {
          const err = results[0].status === 'rejected' ? results[0].reason : new Error('Failed to fetch MPs');
          setState({ status: 'error', progress: 0, error: err });
          return;
        }
        setState({ status: 'offline', progress: 100, error: null });
        return;
      }

      // Set cache timestamp on successful initial load
      await setCacheTimestamp();
      setState({ status: 'synced', progress: 100, error: null });
    } catch (err) {
      console.error('Sync error:', err);
      if (await isDataCached()) {
        setState({ status: 'offline', progress: 100, error: null });
      } else {
        setState({ status: 'error', progress: 0, error: err as Error });
      }
    }
  }, [queryClient]);

  useEffect(() => { sync(); }, [sync]);

  const retry = useCallback(() => {
    setState({ status: 'idle', progress: 0, error: null });
    sync();
  }, [sync]);

  return {
    ...state,
    retry,
    isLoading: state.status === 'idle' || state.status === 'syncing',
    isReady: state.status === 'synced' || state.status === 'offline',
  };
}

export default useInitialSync;
