import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, ActivityIndicator } from 'react-native';
import { useCreateDiscussion } from '@/hooks/useDiscussions';

interface CommentInputProps {
  mpSlug: string;
  parentId?: string;
  placeholder?: string;
  onSubmit?: () => void;
}

export function CommentInput({ mpSlug, parentId, placeholder = 'Share your thoughts...', onSubmit }: CommentInputProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const { mutateAsync, isPending } = useCreateDiscussion();

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    setError('');
    try {
      await mutateAsync({ mpSlug, content: trimmed, parentId });
      setContent('');
      onSubmit?.();
    } catch (e: any) {
      setError(e.message || 'Failed to post');
    }
  };

  return (
    <View>
      <View className="flex-row items-end gap-2">
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder={placeholder}
          placeholderTextColor="#ffffff30"
          multiline
          maxLength={2000}
          className="flex-1 bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-white text-sm min-h-[44px] max-h-[120px]"
          textAlignVertical="top"
        />
        <Pressable
          onPress={handleSubmit}
          disabled={isPending || !content.trim()}
          className="bg-[#818CF8] rounded-xl px-4 py-3 items-center justify-center active:opacity-80 disabled:opacity-40"
        >
          {isPending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-semibold text-sm">Post</Text>
          )}
        </Pressable>
      </View>
      {error ? (
        <Text className="text-red-400 text-xs mt-1 ml-1">{error}</Text>
      ) : null}
      {content.length > 1800 ? (
        <Text className="text-white/30 text-xs mt-1 ml-1 text-right">
          {content.length}/2000
        </Text>
      ) : null}
    </View>
  );
}
