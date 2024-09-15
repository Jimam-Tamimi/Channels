// /src/slices/authSlice.ts
import { AuthType } from '@/api-calls/auth';
import { getAuthData } from '@/secure-storage/authStorage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  auth: AuthType | null;
  loading: boolean;
  error: string | null;
}

let authData = JSON.parse(SecureStore.getItem("auth") as any) as (AuthType | null)

console.log({authData})
const initialState: AuthState = {
  auth: authData? authData : null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signInSuccess(state, action: PayloadAction<AuthType>) {
      state.auth = action.payload;
      state.loading = false;
      state.error = null;
    },
    signOut(state) {
      state.auth = null;
      state.loading = false;
      state.error = null;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { signInSuccess, signOut, setError, setLoading } = authSlice.actions;

export default authSlice.reducer;
