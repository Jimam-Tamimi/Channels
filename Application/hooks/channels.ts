import {
  fetchConversationById,
  fetchConversations,
  fetchMessageById,
  fetchMessagesForConversation,
  MessageType,
} from "@/api-calls/channels";
import { useInfiniteQuery, useQuery } from "react-query";

export const useConversations = () => {
  return useInfiniteQuery(
    'conversations', 
    ({ pageParam = 1 }) => fetchConversations(pageParam), // Fetch conversations based on pageParam (pagination)
    {
      getNextPageParam: (lastPage) => lastPage.next ? lastPage.next : undefined, // Determine the next page
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
  onSuccess: (data: MessageType[]) => void
) => {
  return useQuery(
    ["messages-for-conversation", conversationId],
    () => fetchMessagesForConversation(conversationId),
    {
      enabled: !!conversationId, // Only run the query if a conversationId is provided
      onSuccess: onSuccess,

    }
  );
};
