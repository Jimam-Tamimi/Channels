import React, { useState, useEffect } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { View, Pressable } from "react-native";
import Input from "../utils/Input";
import { Feather, FontAwesome6, Fontisto } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Button from "../utils/Button";

interface AuthFormProps {
  control: UseFormReturn<any>['control'];
  watch: UseFormReturn<any>['watch'];
  handleSubmit: (callback: (data: any) => void) => () => void;
  onSubmit: (data: any) => void;
  errors: any;
  isLoading?: boolean;
  isSignIn?: boolean;
}

export default function AuthForm({
  control,
  watch,
  handleSubmit,
  onSubmit,
  errors,
  isLoading = false,
  isSignIn = false
}: AuthFormProps) {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const eyeScale = useSharedValue(1);
  const eyeLowVisionScale = useSharedValue(0);

  const handlePress = () => {
    setIsPasswordHidden(prevState => !prevState);
    eyeScale.value = withTiming(isPasswordHidden ? 0 : 1, { duration: 300 });
    eyeLowVisionScale.value = withTiming(isPasswordHidden ? 1 : 0, { duration: 300 });
  };

  const eyeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: eyeScale.value }],
  }));

  const eyeLowVisionAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: eyeLowVisionScale.value }],
  }));

  const watchFields = watch(["username", "email", "password", "confirmPassword"]);

  // Update the button disabled state based on the form values
  const isButtonDisabled = isSignIn
    ? !watchFields[0] || !watchFields[2] // For sign-in, check username and password
    : !watchFields[0] || !watchFields[1] || !watchFields[2] || !watchFields[3]; // For sign-up, check all fields

  return (
    <>
      <Controller
        name="username"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <Input
            onChangeText={onChange}
            error={errors?.username}
            value={value}
            placeholderTextColor={"white"}
            placeholder={isSignIn ? "Username / Email" : "@Username"}
            inputMode="text"
            rightElement={<Feather name="at-sign" size={21} color="white" />}
          />
        )}
        rules={{
          required: `${isSignIn ? "Username or Email" : "@Username"} Is Required`,
          minLength: { value: 3, message: `${isSignIn ? '' :'Username '}Must Be At Least 3 Characters` },
          maxLength: { value: 25, message: "Username Must Be At Most 25 Characters" }
        }}
      />
      {!isSignIn && (
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <Input
              onChangeText={onChange}
              value={value}
              error={errors?.email}
              placeholderTextColor={"white"}
              placeholder="Email"
              keyboardType="email-address"
              rightElement={<Fontisto name="email" size={20} color={"white"} />}
            />
          )}
          rules={{
            required: "Email Is Required",
            maxLength: { value: 50, message: "Email Must Be At Most 50 Characters" },
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid Email Address" }
          }}
        />
      )}

      <Controller
        name="password"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <Input
            autoCapitalize={"none"}
            autoCorrect={false}
            placeholder="Password"
            secureTextEntry={isPasswordHidden}
            error={errors?.password}
            onChangeText={onChange}
            value={value}
            rightElement={
              <Pressable className="relative items-end justify-center" onPress={handlePress}>
                <Animated.View style={[eyeAnimatedStyle, { position: "absolute" }]}>
                  <FontAwesome6 name="eye" size={20} color="white" />
                </Animated.View>
                <Animated.View style={[eyeLowVisionAnimatedStyle, { position: "absolute" }]}>
                  <FontAwesome6 name="eye-low-vision" size={20} color="white" />
                </Animated.View>
              </Pressable>
            }
          />
        )}
        rules={{
          required: "Password Is Required",
          maxLength: { value: 50, message: "Password Must Be At Most 50 Characters" }
        }}
      />

      {!isSignIn && (
        <Controller
          name="confirmPassword"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <Input
              autoCapitalize={"none"}
              autoCorrect={false}
              placeholder="Confirm Password"
              error={errors?.confirmPassword}
              secureTextEntry={isPasswordHidden}
              onChangeText={onChange}
              value={value}
              rightElement={
                <Pressable className="relative items-end justify-center" onPress={handlePress}>
                  <Animated.View style={[eyeAnimatedStyle, { position: "absolute" }]}>
                    <FontAwesome6 name="eye" size={20} color="white" />
                  </Animated.View>
                  <Animated.View style={[eyeLowVisionAnimatedStyle, { position: "absolute" }]}>
                    <FontAwesome6 name="eye-low-vision" size={20} color="white" />
                  </Animated.View>
                </Pressable>
              }
            />
          )}
          rules={{
            required: "Confirm Password Is Required",
            validate: value => value === watch("password") || "Passwords Do Not Match",
            maxLength: { value: 50, message: "Confirm Password Must Be At Most 50 Characters" }
          }}
        />
      )}
      <Button
        title={isSignIn ? "Sign In" : "Sign Up"}
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
        disabled={isButtonDisabled}
      />
    </>
  );
}
