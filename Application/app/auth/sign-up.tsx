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
import { Feather, FontAwesome } from "@expo/vector-icons";
import { Link, router } from "expo-router";
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
import { useSignIn, useSignUp } from "@/hooks/useAuth";
import { createNotifications } from "react-native-notificated";
import { AxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";
export default function SignUp() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const insets = useSafeAreaFrame();
  useEffect(() => {
    return () => {};
  }, []);

  // for view password animation
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const eyeScale = useSharedValue(1);
  const eyeLowVisionScale = useSharedValue(0);

  const handlePress = () => {
    // Toggle the state
    setIsPasswordHidden((prevState) => !prevState);

    // Animate the scales
    eyeScale.value = withTiming(isPasswordHidden ? 0 : 1, { duration: 300 });
    eyeLowVisionScale.value = withTiming(isPasswordHidden ? 1 : 0, {
      duration: 300,
    });
  };

  // Animated styles for the icons
  const eyeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: eyeScale.value }],
    };
  });

  const eyeLowVisionAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: eyeLowVisionScale.value }],
    };
  });

  const { useNotifications, ...events } = createNotifications();
  const { notify } = useNotifications();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm();
  const { mutate: signUp } = useSignUp();
  const { mutate: signIn,  isError } = useSignIn();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  const onSubmit = (data: any) => {
    setIsFormSubmitting(true)
    signUp(data, {
      onSuccess: () => {
        signIn(data, {
          onSuccess: () => {
            notify("success", {
              params: {
                title: "Success",
                description: "Successfully Signed In",
              },
            });
            router.replace("/(drawer)/");
          },
          onError: () => {
            notify("error", {
              params: {
                title: "Failed",
                description: "Unable To Sign In",
              },
            });
          },
        });
      },
      onError: (error: AxiosError) => {
        const handleErrors = (errorData: any) => {
          Object.keys(errorData).forEach((key) => {
            if (errorData[key]) {
              errorData[key].forEach((message: string) => {
                console.log(key, message);
                setError(key as any, { message });
              });
            }
          });
        };
        if (error.response && error.response.status === 400) {
          const errorData = error.response.data;
          handleErrors(errorData);
        }
      },
      onSettled: ()=> {
    setIsFormSubmitting(false)

      }
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
          source={require("../../assets/images/wallpaperflare.com_wallpaper.jpg")}
          style={[styles.image, StyleSheet.absoluteFill]}
        />
        <View className="absolute top-0 w-full h-full bg-black opacity-55 "></View>

        <View className="container w-full max-w-full gap-16">
          <View className="gap-3">
            <Text className="text-2xl font-bold tracking-widest text-[#fffafc] opacity-75">
              NEW HERE?
            </Text>
            <Text
              style={{ letterSpacing: 8 }}
              className="text-6xl font-bold leading-[1.30]   text-white"
            >
              Create An Account
            </Text>
            <Text className="font-semibold tracking-[2]  text-white">
              Already Have One?
              {/* Already Have An Account? */}
              <Link className="" href={"/auth/sign-in"}>
                <Text className="font-bold text-[rgba(235,37,96,0.91)]">
                  {" "}
                  Sign In
                </Text>
              </Link>
            </Text>
          </View>

          <View className="gap-2">
            <AuthForm
              control={control}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              watch={watch}
              errors={errors}
              isLoading={isFormSubmitting}
            />
            {/* <Pressable
                onPress={(e) => console.log(e)}
                className={`bg-[rgba(235,37,96,0.62)]   rounded duration-300 transition-all ease-in-out active:bg-[rgba(235,37,96,0.91)] py-2.5 w-full active:scale-95 `}
              >
                <Text
                  className={`  w-full text-center text-white text-lg m-auto font-bold `}
                >
                  Sign In
                </Text>
              </Pressable> */}
            <View className="mt-1">
              <Text className="self-center text-lg font-bold tracking-widest text-white active:text-[rgba(235,37,96,0.91)] duration-300 transition-all ease-in-out active:scale-95">
                Forgot Password?
              </Text>
            </View>
            <View
              className="flex-row items-center justify-between "
              style={{ marginTop: 10 }}
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
