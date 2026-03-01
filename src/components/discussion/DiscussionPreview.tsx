import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useDiscussionCount } from '@/hooks/useDiscussions';

interface DiscussionPreviewProps {
  mpSlug: string;
  mpName: string;
}

export function DiscussionPreview({ mpSlug, mpName }: DiscussionPreviewProps) {
  const { data: count = 0 } = useDiscussionCount(mpSlug);
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/discussion/${mpSlug}` as any)}
      className="bg-[#1f1f1f] rounded-2xl p-4 border border-white/5 active:opacity-80"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg">💬</Text>
          <View>
            <Text className="text-white font-semibold text-sm">Discussion</Text>
            <Text className="text-white/40 text-xs">
              {count === 0
                ? 'Start the conversation'
                : `${count} ${count === 1 ? 'comment' : 'comments'}`}
            </Text>
          </View>
        </View>
        <Text className="text-[#818CF8] text-sm font-medium">View →</Text>
      </View>
    </Pressable>
  );
}
