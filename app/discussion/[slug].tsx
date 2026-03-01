import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { DiscussionThread } from '@/components/discussion';

export default function DiscussionScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  return (
    <View className="flex-1 bg-[#171717]">
      <DiscussionThread mpSlug={slug} />
    </View>
  );
}
