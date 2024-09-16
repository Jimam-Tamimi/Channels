import {
  getAuthData,
  removeAuthData,
  storeAuthData,
} from "@/secure-storage/authStorage";
import axios, { AxiosError } from "axios";
import { router, usePathname } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { AuthType } from "./auth";
import { store } from "@/redux/store";
import { signInSuccess, signOut } from "@/redux/slices/authSlice";

const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api`, // Set this in your environment variables
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
// Add request interceptor to attach token dynamically from Redux state
api.interceptors.request.use(
  async (config) => {
    const state = store.getState(); // Access current Redux state
    const auth = state.auth.auth; // Get the auth data from Redux

    if (auth?.access) {
      config.headers.Authorization = `JWT ${auth.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for handling refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if token is expired or request is unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try refreshing the token
      const newAuth = await refreshAuth();
      if (newAuth?.access) {
        // Update Redux state with new tokens
        store.dispatch(signInSuccess(newAuth));

        // Retry the original request with the new access token
        originalRequest.headers["Authorization"] = `JWT ${newAuth.access}`;
        return api(originalRequest);
      } else {
        // Sign out the user and remove tokens if refresh fails
        store.dispatch(signOut());
        await removeAuthData();
        router.replace("/auth/sign-in");
      }
    }
    return Promise.reject(error);
  }
);


 

export const refreshAuth = async (): Promise<AuthType | null> => {
  const state = store.getState(); // Access Redux state
  const auth = state.auth.auth; // Get the auth data from Redux

  if (!auth?.refresh) return null; // If no refresh token, return null

  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}api/account/token/refresh/`,
      { refresh: auth?.refresh }
    );

    const newAuth: AuthType = response.data;

    // Store new tokens in Secure Storage
    await storeAuthData(newAuth);

    // Update Redux store with new tokens
    store.dispatch(signInSuccess(newAuth));

    return newAuth; // Return the new authentication data
  } catch (error) {
    // If refresh fails, sign the user out and clear data
    await removeAuthData();
    store.dispatch(signOut()); // Dispatch signOut action in Redux
    return null;
  }
};
export default api;
