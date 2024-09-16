import api from "./api";

export interface ConversationType {
  id: number;
  name: string | null;
  profiles: number[];
  timestamp: string;
  is_group: boolean;
  image: string | null;
  active_profiles: number[];
  last_message: number | null;
}

export interface MessageType {
  id?: number;
  text: string;
  sender: number;
  conversation: number;
  timestamp: string;
  seen_by: number[];
  delivered_to: number[];
  status: "PENDING" | "SENT" | "DELIVERED" | "SEEN";
}

export const fetchConversations = async (): Promise<ConversationType[]> => {
  const response = await api.get("/channels/conversations/"); // Adjust the endpoint as necessary
  return response.data;
};

export const fetchConversationById = async (
  id: number
): Promise<ConversationType> => {
  const response = await api.get(`/channels/conversations/${id}`); // Adjust the endpoint as necessary
  return response.data;
};

export const fetchMessageById = async (
  id: number | null
): Promise<MessageType | null> => {
  if (id) {
    const response = await api.get(`/channels/messages/${id}/`);
    return response.data;
  } else {
    return null;
  }
};
export const fetchMessagesForConversation = async (
  id: number | null
): Promise<MessageType[] | null> => {
  if (id) {
    const response = await api.get(`/channels/messages/messages-for-conversation/${id}/`);
    return response.data;
  } else {
    return null;
  }
};
