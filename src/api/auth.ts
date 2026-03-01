import { supabase } from '@/lib/supabase';

const toEmail = (username: string) => `${username.toLowerCase()}@kyn.local`;

const RESERVED_USERNAMES = [
  'admin', 'administrator', 'mod', 'moderator',
  'dev', 'developer', 'system', 'bot',
  'root', 'superuser', 'support', 'help',
  'kyn', 'official', 'staff', 'team',
  'null', 'undefined', 'test', 'tester',
  'anonymous', 'anon', 'user', 'guest',
];

export interface RegisterParams {
  username: string;
  password: string;
  displayName?: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export async function register({ username, password, displayName }: RegisterParams) {
  const normalizedUsername = username.toLowerCase().trim();

  // Block reserved usernames
  if (RESERVED_USERNAMES.includes(normalizedUsername)) {
    throw new Error('This username is not available');
  }

  // Check username availability first
  const { data: available, error: checkError } = await supabase.rpc(
    'is_username_available',
    { desired_username: normalizedUsername },
  );

  if (checkError) throw new Error('Failed to check username availability');
  if (!available) throw new Error('Username is already taken');

  // Sign up with fake email
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: toEmail(normalizedUsername),
    password,
  });

  if (authError) throw new Error(authError.message);
  if (!authData.user) throw new Error('Registration failed');

  // Create profile
  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    username: normalizedUsername,
    display_name: displayName || normalizedUsername,
    avatar_color: generateAvatarColor(normalizedUsername),
  });

  if (profileError) {
    // Clean up auth user if profile creation fails
    await supabase.auth.signOut();
    throw new Error('Failed to create profile: ' + profileError.message);
  }

  return authData;
}

export async function login({ username, password }: LoginParams) {
  const normalizedUsername = username.toLowerCase().trim();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: toEmail(normalizedUsername),
    password,
  });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('Invalid username or password');
    }
    throw new Error(error.message);
  }

  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateProfile(
  userId: string,
  updates: { display_name?: string; avatar_color?: string },
) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function checkUsernameAvailable(
  username: string,
): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_username_available', {
    desired_username: username.toLowerCase().trim(),
  });

  if (error) return false;
  return data as boolean;
}

// Deterministic avatar color from username
function generateAvatarColor(username: string): string {
  const colors = [
    '#818CF8',
    '#F472B6',
    '#34D399',
    '#FBBF24',
    '#FB923C',
    '#A78BFA',
    '#22D3EE',
    '#F87171',
    '#4ADE80',
    '#E879F9',
  ];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
