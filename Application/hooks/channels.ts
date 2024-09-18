import {
  fetchConversationById,
  fetchConversations,
  fetchMessageById,
  fetchMessagesForConversation,
  MessageType,
} from "@/api-calls/channels";
import { InfiniteData, useInfiniteQuery, useQuery } from "react-query";

export const useConversations = (searchQuery: string) => {
  return useInfiniteQuery(
    ["conversations", searchQuery],
    ({ pageParam = 1 }) => fetchConversations(pageParam, searchQuery), // Fetch conversations based on pageParam (pagination)
    {
      getNextPageParam: (lastPage) =>
        lastPage.next ? lastPage.next : undefined, // Determine the next page
    }
  );
};

export const useConversation = (id: number) => {
  return useQuery(["conversation", id], () => fetchConversationById(id));
};

export const useMessage = (id: number | null) => {
  return useQuery(["message", id], () => fetchMessageById(id));
};

// Custom hook for fetching messages by conversation ID
export const useMessagesByConversation = (
  conversationId: number,
  onSuccess: (data: InfiniteData<MessageType[]>) => void
) => {
  console.log({conversationId})
  return useInfiniteQuery(
    ["messages-for-conversation", conversationId],
    ({ pageParam = 1 }) =>
      fetchMessagesForConversation(conversationId, pageParam), // Fetch conversations based on pageParam (pagination)
    {
      getNextPageParam: (lastPage) =>
        lastPage.next ? lastPage.next : undefined, // Determine the next page
      enabled: !!conversationId, // Only run the query if a conversationId is provided
      onSuccess: onSuccess,
      refetchOnMount: false,
    }
  );
};
