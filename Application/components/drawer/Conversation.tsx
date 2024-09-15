import { View, Text, Pressable } from "react-native";
import React from "react";
import Avatar from "../utils/Avater";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Href, router } from "expo-router";
import { ConversationType } from "@/api-calls/channels";
import { useProfile } from "@/hooks/auth";
import { getAuthData } from "@/secure-storage/authStorage";
 
const Conversation: React.FC<ConversationType> = (props) => {
  // code for animation part
  const scale = useSharedValue(1);
  const progress = useSharedValue(0); 
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



  // fetching profile data and last message data


  
  if(props.is_group){
    // fetch profile data for group
  } else { 
    
    const { data: profile, isLoading, isError, error } = useProfile('1');
    
  }

  
  
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
        onPress={() => router.push(`/channels/${props.id.toString()}/` as  Href<`/channels/${string}/`>)}
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

export default Conversation;
