import { View, Text, Pressable } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Avatar from "../../utils/Avater";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Href, router } from "expo-router";
import { ConversationType, MessageType } from "@/api-calls/channels";
import { useProfile } from "@/hooks/auth";
import { getAuthData } from "@/secure-storage/authStorage";
import { useMessage } from "@/hooks/channels";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import useWebSocketHandler from "@/hooks/webSocketHandler";
import useFormattedTimeAgo from "@/hooks/useFormattedTimeAgo";

const Conversation: React.FC<ConversationType> = (props: ConversationType) => {
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

  const [lastMessage, setLastMessage] = useState<MessageType | null>(null)
  

  // fetching profile data and last message data

  const myProfileId = useSelector((state: RootState) => state.auth.auth?.profile?.id);
  const {
    data: lastMessageFromHook,
    isLoading,
    isError,
    error,
  } = useMessage(props?.last_message || null);

  useEffect(() => {
    setLastMessage(lastMessageFromHook as any)
  
    return () => {
      
    }
  }, [lastMessageFromHook])
  

  const formatTimestamp = (timestamp: string) => {
    const duration = moment.duration(moment().diff(moment(timestamp)));
    if (duration.asYears() >= 1) return `${Math.floor(duration.asYears())}y`;
    if (duration.asWeeks() >= 1) return `${Math.floor(duration.asWeeks())}w`;
    if (duration.asDays() >= 1) return `${Math.floor(duration.asDays())}d`;
    if (duration.asHours() >= 1) return `${Math.floor(duration.asHours())}h`;
    if (duration.asMinutes() >= 1)
      return `${Math.floor(duration.asMinutes())}m`;
    return `${Math.floor(duration.asSeconds())}s`; // fallback to seconds
  };


  const handleChatMessage = useCallback((data: any) => { 
    if(props?.id==data?.message?.conversation){
      setLastMessage(data?.message);
    }
  }, []); 
  
  useWebSocketHandler("deliver_message", handleChatMessage, false);
 
  useWebSocketHandler("message_delivered", handleChatMessage, false);
 
  useWebSocketHandler("message_seen", handleChatMessage, true);


  const formattedTimeAgo = useFormattedTimeAgo(lastMessage?.timestamp as any); // Use the custom hook
  

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          flex: 1,
          gap: 13,
          borderRadius: 2,
          paddingVertical: 9,
          paddingHorizontal: 10,
        },
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
        onPress={() =>
          router.push(
            `/conversations/${props.id.toString()}/` as Href<`/conversations/${string}/`>
          )
        }
      >
        <Avatar
          uri={
            props?.image
              ? props?.image
              : require("../../../assets/images/blank profile.png")
          }
          size={53}
          isActive
        />
        <View className="justify-between flex-1 " style={{ gap: 5 }}>
          <View className="flex-row justify-between">
            <Text
              className="text-white "
              style={{ letterSpacing: 1.5, fontSize: 17, fontWeight: 600 }}
            >
              {props.name}
            </Text>

            {!props?.is_group ? (
              lastMessage?.status == "SEEN" ? (
                <Avatar
                  uri={
                    props?.image
                      ? props?.image
                      : require("../../../assets/images/blank profile.svg")
                  }
                  size={15}
                  borderLess
                />
              ) : (
                <Ionicons
                  name={`${
                    lastMessage?.status === "SENT"
                      ? "checkmark-done-circle-outline"
                      : lastMessage?.status === "DELIVERED"
                      ? "checkmark-done-circle"
                      : lastMessage?.status === "PENDING"
                      ? "ellipsis-horizontal-circle-outline"
                      : "alert-circle-outline"
                  }`}
                  size={14}
                  color={"white"}
                  style={{top:2}}
                  // color={`${
                  //   lastMessage?.status === "failed"
                  //     ? "red"
                  //     : lastMessage?.status === "me"
                  //     ? "white"
                  //     : "transparent"
                  // }`}
                />
              )
            ) : (
              ""
            )}
          </View>
          <View className="flex-row justify-between">
            <Text
              style={{ letterSpacing: 0.5, fontSize: 12, fontWeight: 300, color: lastMessage?.text?  "white": "#ffffff90" }}
              className="text-white "
            >
              {lastMessage?.sender == myProfileId ? "You: " : ""}
              {lastMessage?.text?lastMessage?.text: "No Message Yet" }
            </Text>
            <Text
              style={{ fontSize: 12 }}
              className="font-semibold tracking-wider text-white"
            >
              {/* {lastMessage?.timestamp ? moment(lastMessage?.timestamp).fromNow() : ''} */}
              {lastMessage?.timestamp ? formattedTimeAgo: ""}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};
export default Conversation;
