import { supabase } from '../lib/supabase';

export interface Party {
  id: string;
  full_name: string;
  abbreviation: string;
  color: string;
  founded: string | null;
  headquarters: string | null;
  history: string | null;
  president: string | null;
  wikipedia_url: string | null;
  symbol_url: string | null;
}

export async function fetchParties(): Promise<Party[]> {
  const { data, error } = await supabase
    .from('parties')
    .select('*')
    .order('full_name');

  if (error) {
    console.error('Error fetching parties:', error);
    throw error;
  }
  return data || [];
}

export async function fetchPartyById(id: string): Promise<Party | null> {
  const { data, error } = await supabase
    .from('parties')
    .select('*')
    .eq('id', id.toLowerCase())
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error fetching party:', error);
    throw error;
  }
  return data;
}

export async function fetchPartyMPCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from('mps').select('political_party');

  if (error) {
    console.error('Error fetching party counts:', error);
    throw error;
  }

  const counts: Record<string, number> = {};
  data?.forEach((mp) => {
    counts[mp.political_party] = (counts[mp.political_party] || 0) + 1;
  });
  return counts;
}

export async function searchParties(query: string): Promise<Party[]> {
  const { data, error } = await supabase
    .from('parties')
    .select('*')
    .or(`full_name.ilike.%${query}%,abbreviation.ilike.%${query}%`)
    .order('full_name');

  if (error) throw error;
  return data || [];
}
