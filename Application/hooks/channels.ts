import {  fetchConversationById, fetchConversations, fetchMessageById } from "@/api-calls/channels";
import { useQuery } from "react-query";

export const useConversations = () => {
  return useQuery("conversations", fetchConversations);
};

export const useConversation = (id: number) => {
  return useQuery(["conversation", id], () => fetchConversationById(id));
};

export const useMessage = (id: string) => {
  return useQuery(["message", id], () => fetchMessageById(id));
};
