import { supabase } from '@/lib/supabase';
import type { Discussion } from '@/data/types';

export interface CreateDiscussionParams {
  mpSlug: string;
  content: string;
  parentId?: string;
}

export async function fetchDiscussions(mpSlug: string): Promise<Discussion[]> {
  const { data, error } = await supabase
    .from('discussions')
    .select(`
      *,
      profiles:user_id (id, username, display_name, avatar_color)
    `)
    .eq('mp_slug', mpSlug)
    .eq('is_deleted', false)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return (data as Discussion[]) ?? [];
}

export async function createDiscussion({ mpSlug, content, parentId }: CreateDiscussionParams) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in to post');

  const { data, error } = await supabase
    .from('discussions')
    .insert({
      mp_slug: mpSlug,
      user_id: user.id,
      content: content.trim(),
      parent_id: parentId || null,
    })
    .select(`
      *,
      profiles:user_id (id, username, display_name, avatar_color)
    `)
    .single();

  if (error) {
    if (error.message.includes('Rate limit')) {
      throw new Error('Please wait 30 seconds between posts');
    }
    throw new Error(error.message);
  }
  return data as Discussion;
}

export async function softDeleteDiscussion(discussionId: string) {
  const { error } = await supabase
    .from('discussions')
    .update({ is_deleted: true, content: '[deleted]' })
    .eq('id', discussionId);

  if (error) throw new Error(error.message);
}

export async function fetchDiscussionCount(mpSlug: string): Promise<number> {
  const { data, error } = await supabase
    .rpc('get_discussion_count', { target_mp_slug: mpSlug });

  if (error) return 0;
  return (data as number) ?? 0;
}
