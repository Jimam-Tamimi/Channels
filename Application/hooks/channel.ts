import { fetchChannelById, fetchChannels } from '@/api-calls/channel';
import { useQuery } from 'react-query';

export const useChannels = () => {
  return useQuery('channels', fetchChannels);
};


    
export const useChannel = (id: number) => {
    return useQuery(['channel', id], () => fetchChannelById(id));
  };