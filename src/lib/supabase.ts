import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
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
