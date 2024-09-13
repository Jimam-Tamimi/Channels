// /src/components/AuthForm.tsx
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { View, TextInput, Text, Pressable } from "react-native";
import Input from "../utils/Input";
import { Feather, FontAwesome6, Fontisto } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Button from "../utils/Button";

interface AuthFormProps {
  onSubmit: (data: any) => void;
  isSignIn?: boolean;
  isLoading?: boolean;
}

export default function AuthForm({ onSubmit, isSignIn = false, isLoading=false }: AuthFormProps) {
  const { control, handleSubmit, watch } = useForm();
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

  return (
    <>
      <Controller
        name="username"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
            <Input
            onChangeText={onChange}
            value={value}
              placeholderTextColor={"white"}
              placeholder={isSignIn? `Username / Email` : "@Username"}
              inputMode="text"
              rightElement={<Feather name="at-sign" size={21} color="white" 
              />}
            />

        )}
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
              placeholderTextColor={"white"}
              placeholder="Email"
              keyboardType="email-address"
              rightElement={<Fontisto name="email" size={20} color={"white"} />}
            />
          )}
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
            onChangeText={onChange}
            value={value}
            rightElement={
              <>
                <Pressable
                  className="relative items-end justify-center"
                  onPress={handlePress}
                >
                  {/* <View className='absolute'>
                    <MaterialCommunityIcons name="form-textbox-password" size={21} color="white" />
                  </View> */}
                  <Animated.View
                    style={[eyeAnimatedStyle, { position: "absolute" }]}
                  >
                    <FontAwesome6 name="eye" size={20} color="white" />
                  </Animated.View>

                  <Animated.View
                    style={[
                      eyeLowVisionAnimatedStyle,
                      { position: "absolute" },
                    ]}
                  >
                    <FontAwesome6
                      name="eye-low-vision"
                      size={20}
                      color="white"
                    />
                  </Animated.View>
                </Pressable>
              </>
            }
          />
        )}
      />
      <Button
        title={isSignIn ? "Sign In" : "Sign Up"}
        disabled={watch('username') && watch('password') ? false : true}
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
      />
    </>
  );
}
