import { supabase } from '../lib/supabase';

export interface MPListItem {
  id: string;
  slug: string;
  full_name: string;
  constituency: string;
  state_ut: string;
  political_party: string;
  age: number;
  total_assets: number;
  has_criminal_cases: boolean;
  total_criminal_cases: number;
  is_re_elected: boolean;
  asset_growth_percentage: number | null;
  photo_url: string | null;
}

export interface MPDetail {
  id: string;
  slug: string;
  full_name: string;
  constituency: string;
  state_ut: string;
  political_party: string;
  age: number;
  pan_card_status: string | null;
  education_qualification: string | null;
  education_details: string | null;
  financial_year: number;
  movable_assets: number;
  immovable_assets: number;
  total_assets: number;
  has_criminal_cases: boolean;
  total_criminal_cases: number;
  serious_ipc_sections: number;
  other_ipc_sections: number;
  is_re_elected: boolean;
  assets_2019: number | null;
  asset_growth_percentage: number | null;
  photo_url: string | null;
}

export interface MPCharge {
  id: number;
  mp_id: string;
  count: number;
  description: string;
  ipc_section: string | null;
}

export interface MPDetailWithCharges {
  mp: MPDetail;
  charges: MPCharge[];
}

const LIST_FIELDS = `id, slug, full_name, constituency, state_ut, political_party,
  age, total_assets, has_criminal_cases, total_criminal_cases,
  is_re_elected, asset_growth_percentage, photo_url`;

export async function fetchAllMPs(): Promise<MPListItem[]> {
  const { data, error } = await supabase
    .from('mps')
    .select(LIST_FIELDS)
    .order('full_name');

  if (error) {
    console.error('Error fetching MPs:', error);
    throw error;
  }
  return data || [];
}

export async function fetchMPDetail(slug: string): Promise<MPDetailWithCharges> {
  const { data: mp, error: mpErr } = await supabase
    .from('mps')
    .select('*')
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single();

  if (mpErr) {
    console.error('Error fetching MP detail:', mpErr);
    throw mpErr;
  }
  if (!mp) throw new Error(`MP not found: ${slug}`);

  const { data: charges, error: chargesErr } = await supabase
    .from('mp_charges')
    .select('*')
    .eq('mp_id', mp.id)
    .order('count', { ascending: false });

  if (chargesErr) console.error('Error fetching MP charges:', chargesErr);

  return { mp: mp as MPDetail, charges: (charges || []) as MPCharge[] };
}

export async function fetchMPsByState(state: string): Promise<MPListItem[]> {
  const { data, error } = await supabase
    .from('mps')
    .select(LIST_FIELDS)
    .eq('state_ut', state)
    .order('full_name');

  if (error) throw error;
  return data || [];
}

export async function fetchMPsByParty(party: string): Promise<MPListItem[]> {
  const { data, error } = await supabase
    .from('mps')
    .select(LIST_FIELDS)
    .eq('political_party', party)
    .order('full_name');

  if (error) throw error;
  return data || [];
}

export async function searchMPs(query: string): Promise<MPListItem[]> {
  const { data, error } = await supabase
    .from('mps')
    .select(LIST_FIELDS)
    .or(`full_name.ilike.%${query}%,constituency.ilike.%${query}%`)
    .order('full_name')
    .limit(50);

  if (error) throw error;
  return data || [];
}
