import {  fetchConversationById, fetchConversations, fetchMessageById,  fetchMessagesForConversation } from "@/api-calls/channels";
import { useQuery } from "react-query";

export const useConversations = () => {
  return useQuery("conversations", fetchConversations);
};

export const useConversation = (id: number) => {
  return useQuery(["conversation", id], () => fetchConversationById(id));
};

export const useMessage = (id: number|null) => {
  return useQuery(["message", id], () => fetchMessageById(id));
};

// Custom hook for fetching messages by conversation ID
export const useMessagesByConversation = (conversationId: number) => {
  return useQuery(['messages-for-conversation', conversationId], () => fetchMessagesForConversation(conversationId), {
    enabled: !!conversationId, // Only run the query if a conversationId is provided
  });
};