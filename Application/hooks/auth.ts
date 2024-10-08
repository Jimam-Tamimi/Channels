// /src/hooks/useAuth.ts
import { AuthType, fetchProfileById, signIn, signUp,  } from "@/api-calls/auth";
import {
  getAuthData,
  removeAuthData,
  storeAuthData,
} from "@/secure-storage/authStorage";
import { AxiosError } from "axios";
import { router, useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import * as SecureStore from "expo-secure-store";
import { refreshAuth } from "@/api-calls/api";
import { setError, setLoading, signInSuccess, signOut } from '@/redux/slices/authSlice';
import { useAppDispatch } from "@/redux/store";

export const useSignIn = () => {
  const dispatch = useAppDispatch();

  return useMutation(signIn, {
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: async (data: AuthType) => {
      dispatch(signInSuccess(data)); // Dispatch sign-in success
      await storeAuthData(data); // Store JWT on success
    },
    onError: (error: AxiosError) => {
      dispatch(setError(error.message)); // Dispatch error
    },
    onSettled: () => {
      dispatch(setLoading(false));
    },
  });
};

export const useSignUp = () => {
  const dispatch = useAppDispatch();
  return useMutation(signUp, {
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: async (data: AuthType) => {
      dispatch(signInSuccess(data)); // Dispatch sign-in success
      await storeAuthData(data); // Store JWT on success
    },
    onError: (error: AxiosError) => {
      dispatch(setError(error.message)); // Dispatch error
    },
    onSettled: () => {
      dispatch(setLoading(false));
    },
  });
};

const checkTokenValidity = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    return expirationTime > Date.now();
  } catch {
    return false;
  }
};

export const useSignOut = () => {
  const dispatch = useAppDispatch();
  
  const signOutFn = async () => {
    dispatch(signOut()); // Dispatch sign-in success
    await removeAuthData();
    router.replace("/auth/sign-in"); // Redirect to sign-in page after logout
  };

  return signOutFn;
};

export const useAuthRedirect = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const auth = await getAuthData();
        if (!auth?.access || !checkTokenValidity(auth?.access)) {
          const newAuth = await refreshAuth();
          if (!newAuth?.access || !checkTokenValidity(newAuth?.access)) {
            await removeAuthData();
            router.replace("/auth/sign-in"); // Redirect to sign-in page
            return;
          }
        }
      } catch (error) {
        await removeAuthData();
        router.replace("/auth/sign-in");
      }  finally { 
          setIsLoading(false); // Set loading to false after handling redirect
      }
    };

    checkToken();
  }, [router]);
  return isLoading;

};

export const useProfile = (id: string) => {
  return useQuery(['profile', id], () => fetchProfileById(id));
};
