import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'KYN_QUERY_CACHE';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24,
      retry: 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
  },
});

export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 1000,
  key: CACHE_KEY,
});

export async function isDataCached(): Promise<boolean> {
  try {
    const val = await AsyncStorage.getItem(CACHE_KEY);
    return val !== null;
  } catch {
    return false;
  }
}

export async function clearCache() {
  try {
    await AsyncStorage.removeItem(CACHE_KEY);
    queryClient.clear();
  } catch (e) {
    console.error('Error clearing cache:', e);
  }
}
