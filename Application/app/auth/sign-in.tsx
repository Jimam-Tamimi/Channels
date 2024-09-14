import {
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaFrame } from "react-native-safe-area-context";

import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { FontAwesome } from "@expo/vector-icons";
import { Link, router, useRouter } from "expo-router";
import { Image } from "expo-image";
import Input from "@/components/utils/Input";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import SocialLogin from "./components/SocialLogin";
import Button from "@/components/utils/Button";
import AuthForm from "@/components/auth/AuthForm";
import { useSignIn } from "@/hooks/auth";
import { createNotifications } from "react-native-notificated";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
export default function SignIn() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const insets = useSafeAreaFrame();
  useEffect(() => {
    return () => {};
  }, []);

  const router = useRouter();
  const { useNotifications, ...events } = createNotifications();

  const { notify } = useNotifications();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm();
  const { mutate: signIn, isLoading, isError } = useSignIn();

  const onSubmit = (data: { username: string; password: string }) => {
    signIn(data, {
      onSuccess: () => {
        notify("success", {
          params: {
            title: "Success",
            description: "Successfully Signed In",
          },
        });
        router.push("/(drawer)/");
      },
      onError: (error: any) => {
        if (error?.response?.status == 401 && error?.response?.data?.detail) {
          notify("error", {
            params: {
              title: "Sign In Failed",
              description: error?.response?.data?.detail,
            },
          });
        } else {
          notify("error", {
            params: {
              title: "Sign In Failed",
              description: "Something Went Wrong!",
            },
          });
        }
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-col items-center justify-center flex-1 w-full ">
        <Image
          contentFit="cover"
          source={require("../../assets/images/New folder/1.jpg")}
          // source={require("../../assets/images/New folder/4.jpg")}

          style={[styles.image, StyleSheet.absoluteFill]}
        />
        <View className="absolute top-0 w-full h-full bg-black opacity-55 "></View>

        <View className="container w-full max-w-full gap-24">
          <View className="gap-3">
            <Text className="text-2xl font-bold tracking-widest text-[#fffafc] opacity-75">
              WELCOME
            </Text>
            <Text
              style={{ letterSpacing: 8 }}
              className="text-6xl font-bold leading-[1.35]   text-white"
            >
              Sign In To Continue
            </Text>
            <Text className="font-semibold tracking-[2]  text-white">
              Don't Have An Account?
              <Link className="" href={"/auth/sign-up"}>
                <Text className="font-bold text-[rgba(235,37,96,0.91)]">
                  {" "}
                  Sign Up
                </Text>
              </Link>
            </Text>
          </View>

          <View className="gap-2">
            <AuthForm
              control={control}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              errors={errors}
              watch={watch}
              isLoading={isLoading}
              isSignIn
            />

            <View className="self-center mt-3">
              <Text
                onPress={(e) => router.push("/auth/sign-up")}
                className="text-lg font-bold tracking-widest text-white active:text-[rgba(235,37,96,0.91)] duration-300 transition-all ease-in-out  "
              >
                Forgot Password?
              </Text>
            </View>
            <View
              className="flex-row items-center justify-between "
              style={{ marginTop: 20 }}
            >
              <View
                className="rounded-full"
                style={{
                  width: (Dimensions.get("window").width / 100) * 40,
                  height: 2,
                  backgroundColor: "white",
                }}
              ></View>
              <Text className="font-bold text-white ">OR</Text>
              <View
                className="rounded-full"
                style={{
                  width: (Dimensions.get("window").width / 100) * 40,
                  height: 2,
                  backgroundColor: "white",
                }}
              ></View>
            </View>

            <SocialLogin />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    zIndex: -100,
  },
  socialLoginImage: {
    width: 40,
    height: 40,
  },
  text: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000a0",
  },
});
