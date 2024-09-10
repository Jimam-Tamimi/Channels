import { View, Text, Pressable } from "react-native";
import React from "react";
import Avatar from "../utils/Avater";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface AvatarProps {
  conversationImageUri: string;
  isActive?: boolean;
  conversationName: string;
  lastMessage: string;
  lastMessageTimestamp: string;
}

const Conversation: React.FC<AvatarProps> = (props) => {
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
    <Animated.View style={[animatedStyle, { flex: 1, gap: 13, borderRadius: 2 }]}>
      <Pressable
        style={{ flex: 1, gap: 13 }}
        className="bg-[#32364517] py-3 px-3 flex-row items-center   "
        onPressIn={() => {
          scale.value = withTiming(0.95, { duration: 200 });
          progress.value = withTiming(1, { duration: 200 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 200 });
          progress.value = withTiming(0, { duration: 200 });
        }}
      >
        <Avatar uri={props.conversationImageUri} size={53} isActive />
        <View className="justify-between flex-1 " style={{ gap: 5 }}>
          <View className="flex-row justify-between">
            <Text
              className="text-white text-[17px] font-semibold"
              style={{ letterSpacing: 1.5 }}
            >
              {props.conversationName}
            </Text>
            <Avatar uri={props.conversationImageUri} size={15} borderLess />
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm font-light tracking-wide text-white">
              {props.lastMessage}
            </Text>
            <Text className="text-sm tracking-wider text-white">
              {props.lastMessageTimestamp}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default Conversation;
