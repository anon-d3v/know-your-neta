import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// No-op storage for SSR (server-side rendering) where window is not available
const noopStorage = {
  getItem: (_key: string) => Promise.resolve(null),
  setItem: (_key: string, _value: string) => Promise.resolve(),
  removeItem: (_key: string) => Promise.resolve(),
};

// Use AsyncStorage on native/client, no-op during SSR
const isSSR = Platform.OS === 'web' && typeof window === 'undefined';
const storage = isSSR ? noopStorage : AsyncStorage;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: !isSSR,
    detectSessionInUrl: false,
  },
});

export const getStorageUrl = (bucket: string, path: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;

export const getMPPhotoUrl = (mpId: string) => {
  if (!mpId) return null;
  return getStorageUrl('mp-photos', `${mpId}.jpg`);
};

export const getPartySymbolUrl = (partyId: string) => {
  if (!partyId) return null;
  const id = partyId.toLowerCase().replace(/[()\s]/g, '');
  return getStorageUrl('party-symbols', `${id}.jpg`);
};

export const getSupabaseUrl = () => SUPABASE_URL;
