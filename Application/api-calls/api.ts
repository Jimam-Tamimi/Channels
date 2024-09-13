import {
  AuthType,
  getAuthData,
  removeAuthData,
  storeAuthData,
} from "@/secure-storage/authStorage";
import axios from "axios";
import { router, usePathname } from "expo-router";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api`, // Set this in your environment variables
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  async (config) => {
    const auth = await getAuthData();
    if (auth?.access) {
      config.headers.Authorization = `JWT ${auth?.access}`;
    }
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      const newAuth = await refreshAuth();
      if (newAuth?.access) {
        originalRequest._retry = true;
        originalRequest.headers["Authorization"] = `JWT ${newAuth?.access}`;
        return api(originalRequest);
      } else {
        await removeAuthData();
        router.navigate("/auth/sign-in");
      }
    }
    return Promise.reject(error);
  }
);

export const refreshAuth: () => Promise<AuthType> | null = async () => {
  const auth = await getAuthData();

  if (!auth?.refresh) return null;

  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}api/account/token/refresh/`,
      { refresh: auth?.refresh }
    );
    await storeAuthData(response.data);
    return response.data;
  } catch (error) {
    return null;
  }
};

export default api;
