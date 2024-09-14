import { View, Text, Pressable } from "react-native";
import React from "react";
import Avatar from "../utils/Avater";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import { ChannelType } from "@/api-calls/channel";
 
const Channel: React.FC<ChannelType> = (props) => {
  const scale = useSharedValue(1);
  const progress = useSharedValue(0); // Use this to animate the color

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ["#32364537", "#32364557"]
    );

    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
    };
  });

  return (
    <Animated.View
      style={[
        animatedStyle,
        { flex: 1, gap: 13, borderRadius: 2, paddingVertical: 9, paddingHorizontal: 10 },
      ]}
    >
      <Pressable
        style={{ flex: 1, gap: 13 }}
        className="bg-[#32364517]  flex-row items-center   "
        onPressIn={() => {
          scale.value = withTiming(0.97, { duration: 200 });
          progress.value = withTiming(1, { duration: 200 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 200 });
          progress.value = withTiming(0, { duration: 200 });
        }}
        onPress={() => router.push("/conversations/55")}
      >
        <Avatar uri={props.image} size={53} isActive />
        <View className="justify-between flex-1 " style={{ gap: 5 }}>
          <View className="flex-row justify-between">
            <Text className="text-white " style={{ letterSpacing: 1.5, fontSize:17, fontWeight:600 }}>
              {props.name}
            </Text>
            <Avatar uri={props.image} size={15} borderLess />
          </View>
          <View className="flex-row justify-between">
            <Text style={{ letterSpacing: 0.5, fontSize:12, fontWeight:300 }} className="text-white ">
              {props.name}
            </Text>
            <Text style={{fontSize: 13, }} className="text-sm tracking-wider text-white">
              {/* {props.timestamp} */}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default Channel;
