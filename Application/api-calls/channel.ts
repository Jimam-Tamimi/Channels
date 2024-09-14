import api from "./api";

export interface ChannelType {
  id: number;
  name: string;
  image: string;
  timestamp: string;
  is_group: boolean;
  active_profiles: number[]; // Assuming it's an array of profile IDs
  channel_profiles: number[]; // Array of profiles in the channel
}

export const fetchChannels = async (): Promise<ChannelType[]> => {
  const response = await api.get('/channels/');  // Adjust the endpoint as necessary
  return response.data;
};


export const fetchChannelById = async (id: number): Promise<ChannelType> => {
  const response = await api.get(`/channels/${id}`); // Adjust the endpoint as necessary
  return response.data;
};


