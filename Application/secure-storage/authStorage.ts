// src/utils/secureStorage.ts
import { AuthType } from '@/api-calls/auth';
import * as SecureStore from 'expo-secure-store';

// Store token object securely

export const storeAuthData = async (auth: AuthType) => {
  await SecureStore.setItemAsync('auth', JSON.stringify(auth));
};

// Retrieve the stored token object
export const getAuthData : () => Promise<AuthType> = async () => {
  const auth = await SecureStore.getItemAsync('auth');
  return auth ? JSON.parse(auth) : null;
};

// Remove the stored token object
export const removeAuthData = async () => {
  await SecureStore.deleteItemAsync('auth');
};
