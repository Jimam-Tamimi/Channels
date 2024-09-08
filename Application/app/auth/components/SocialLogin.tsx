import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { Image } from "expo-image";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function SocialLogin() {


  return (
    <View className="flex-row items-center justify-center gap-16 ">
      <SocialMedia logo={require("../../../assets/images/Google Logo.svg")}/>
      <SocialMedia logo={require("../../../assets/images/facebook-logo.png")}/>
      <SocialMedia logo={require("../../../assets/images/apple logo.svg")}/>

    </View>
  );
}

const SocialMedia = ({logo}:{logo:any}) => {

  const scale = useSharedValue(1);
  const progress = useSharedValue(0); // Use this to animate the color

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ["#32010d44", "#32010d64"]
    );

    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.9, { duration: 200 });
    progress.value = withTiming(1, { duration: 200 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 200 });
    progress.value = withTiming(0, { duration: 200 });
  };
  return (
    <Animated.View style={[animatedStyle]}>
      <Pressable
        className="p-2 rounded-lg "
        onPressIn={() => handlePressIn()}
        onPressOut={() => handlePressOut()}
      >
        <Image
          source={logo}
          style={{ width: 35, height: 35 }}
        />
      </Pressable>
    </Animated.View>
  );
};
