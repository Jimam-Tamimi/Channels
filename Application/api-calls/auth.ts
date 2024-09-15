// /src/api/auth.ts

import api from "./api";


interface UserType {
    id: number;
    username: string;
    email: string;
}
export type AuthType = {
  access: string;
  refresh: string;
  user:UserType;
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
  const response = await api.get(`/profiles/${id}/`);
  return response.data;
};
