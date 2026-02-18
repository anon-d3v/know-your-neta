import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'KYN_QUERY_CACHE';
const CACHE_TIMESTAMP_KEY = 'KYN_CACHE_TIMESTAMP';
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_DURATION, // 24 hours - data stays fresh for 24 hours
      gcTime: CACHE_DURATION, // 24 hours - keep in cache for 24 hours
      retry: 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      refetchOnReconnect: false, // Don't refetch on reconnect - rely on 24h cache
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

export async function isCacheExpired(): Promise<boolean> {
  try {
    const timestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestamp) return true;
    
    const cacheAge = Date.now() - parseInt(timestamp, 10);
    return cacheAge > CACHE_DURATION;
  } catch {
    return true;
  }
}

export async function setCacheTimestamp() {
  try {
    await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (e) {
    console.error('Error setting cache timestamp:', e);
  }
}

export async function clearCache() {
  try {
    await AsyncStorage.removeItem(CACHE_KEY);
    await AsyncStorage.removeItem(CACHE_TIMESTAMP_KEY);
    queryClient.clear();
  } catch (e) {
    console.error('Error clearing cache:', e);
  }
}
