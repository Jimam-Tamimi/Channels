// /src/api/auth.ts

import api from "./api";


interface UserType {
    id: number;
    username: string;
    email: string;
}

interface ProfileType {
  id: number; // Assuming 'user' is a reference to the username or user ID
  user: string; // Assuming 'user' is a reference to the username or user ID
  firstName?: string; // Optional field
  lastName?: string; // Optional field
  profileImage?: string; // URL or path to the image
  dateOfBirth?: string; // Date in ISO format (e.g., "YYYY-MM-DD")
  activeChannelName?: string; // Optional field
  lastActive: string; // DateTime in ISO format
  timestamp: string; // DateTime in ISO format
  activeStatus: boolean; // Computed property
}

export type AuthType = {
  access: string;
  refresh: string;
  user:UserType;
  profile:ProfileType;
};

export const signIn = async (data: { username: string; password: string }) => {
  const response = await api.post("/account/token/", data);
  return response.data as AuthType;
};

export const signUp = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const response = await api.post("/account/users/", data);
  return response.data;
};

export const fetchProfileById = async (id: string) => {
  const response = await api.get(`/account/profiles/${id}/`);
  return response.data;
};
