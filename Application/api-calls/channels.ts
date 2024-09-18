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
  uuid?: string;  

  conversation: number;
  timestamp: string;
  seen_by: number[];
  delivered_to: number[];
  status: "PENDING" | "SENT" | "DELIVERED" | "SEEN";
}


export interface MessageResponseDataType {
  message: MessageType; // Ensure message type exists in data
  pages: { results: MessageType[] }[]; // Each page has a results array with MessageType[]
}

export const fetchConversationById = async (
  id: number
): Promise<ConversationType> => {
  const response = await api.get(`/channels/conversations/${id}`); // Adjust the endpoint as necessary
  return response.data;
};

export const fetchMessageById = async (
  id: number | null
): Promise<MessageResponseDataType | null> => {
  if (id) {
    const response = await api.get(`/channels/messages/${id}/`);
    return response.data;
  } else {
    return null;
  }
};


export const fetchConversations = async (pageParam: number, searchQuery?:string): Promise<ConversationType[]> => {
  const response = await api.get(`/channels/conversations/?page=${pageParam}&search=${searchQuery?searchQuery:''}`);
  return response.data;
};
export const fetchMessagesForConversation = async (
  id: number | null,
  pageParam: number,
): Promise<MessageType[] | null> => {
  if (id) {
    const response = await api.get(`/channels/messages/messages-for-conversation/${id}/?page=${pageParam}`);
    return response.data;
  } else {
    return null;
  }
};
