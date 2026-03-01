import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatKeys } from '@/lib/queryKeys';
import {
  fetchChatRooms,
  fetchChatMessages,
  sendChatMessage,
  deleteChatMessage,
  fetchTotalMembers,
} from '@/api/chat';

export function useChatRooms() {
  return useQuery({
    queryKey: chatKeys.rooms,
    queryFn: fetchChatRooms,
    staleTime: 5 * 60_000, // 5 minutes
  });
}

export function useChatMessages(roomId: string) {
  return useQuery({
    queryKey: chatKeys.messages(roomId),
    queryFn: () => fetchChatMessages(roomId),
    staleTime: 10_000, // 10 seconds
    enabled: !!roomId,
  });
}


export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, content }: { roomId: string; content: string }) =>
      sendChatMessage(roomId, content),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(variables.roomId) });
    },
  });
}

export function useTotalMembers() {
  return useQuery({
    queryKey: chatKeys.rooms.concat('totalMembers'),
    queryFn: fetchTotalMembers,
    staleTime: 5 * 60_000,
  });
}


export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, roomId }: { messageId: string; roomId: string }) =>
      deleteChatMessage(messageId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(variables.roomId) });
    },
  });
}
