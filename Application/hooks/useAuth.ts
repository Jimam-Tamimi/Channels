// /src/hooks/useAuth.ts
import { signIn, signUp } from "@/api-calls/auth";
import {
  getAuthData,
  removeAuthData,
  storeAuthData,
} from "@/secure-storage/authStorage";
import { AxiosError } from "axios";
import { router, useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import * as SecureStore from "expo-secure-store";
import { refreshAuth } from "@/api-calls/api";

export const useSignIn = () => {
  return useMutation(signIn, {
    onSuccess: async (data) => {
      // console.log(data)
      await storeAuthData(data); // Store JWT on success
    },
    onError: (error: AxiosError) => {
    },
  });
};

export const useSignUp = () => {
  return useMutation(signUp, {
    onSuccess: async (data) => {
      await storeAuthData(data); // Store JWT on success
    },
    onError: (error) => {
      // console.error("Sign-up error:", error);
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
  const signOut = async () => {
    await removeAuthData();
    router.replace("/auth/sign-in"); // Redirect to sign-in page after logout
  };

  return signOut;
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
