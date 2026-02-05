import { useEffect, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { queryKeys } from '../lib/queryKeys';
import { isDataCached } from '../lib/queryClient';
import { fetchAllMPs } from '../api/mps';
import { fetchParties } from '../api/parties';
import { fetchStats, fetchIndexes } from '../api/stats';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'error';

interface SyncState {
  status: SyncStatus;
  progress: number;
  error: Error | null;
}

export function useInitialSync() {
  const queryClient = useQueryClient();
  const [state, setState] = useState<SyncState>({ status: 'idle', progress: 0, error: null });

  const sync = useCallback(async () => {
    try {
      const hasCached = await isDataCached();
      const netInfo = await NetInfo.fetch();
      const online = netInfo.isConnected;

      if (!online && !hasCached) {
        setState({ status: 'error', progress: 0, error: new Error('No internet connection and no cached data') });
        return;
      }
      if (!online && hasCached) {
        setState({ status: 'offline', progress: 100, error: null });
        return;
      }

      const cached = queryClient.getQueryData(queryKeys.offline.mps());
      if (cached && Array.isArray(cached) && cached.length > 0) {
        setState({ status: 'synced', progress: 100, error: null });
        return;
      }

      setState({ status: 'syncing', progress: 5, error: null });

      const results = await Promise.allSettled([
        queryClient.prefetchQuery({ queryKey: queryKeys.offline.mps(), queryFn: fetchAllMPs, staleTime: 1000 * 60 * 30 }),
        queryClient.prefetchQuery({ queryKey: queryKeys.parties.list(), queryFn: fetchParties, staleTime: 1000 * 60 * 60 }),
        queryClient.prefetchQuery({ queryKey: queryKeys.stats.summary(), queryFn: fetchStats, staleTime: 1000 * 60 * 60 }),
        queryClient.prefetchQuery({ queryKey: queryKeys.stats.indexes(), queryFn: fetchIndexes, staleTime: 1000 * 60 * 30 }),
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
