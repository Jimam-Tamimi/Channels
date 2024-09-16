import { View, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";
import Avatar from "../utils/Avater";
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

  // fetching profile data and last message data

  const myUserId = useSelector((state: RootState) => state.auth.auth?.user?.id);
  const {
    data: lastMessage,
    isLoading,
    isError,
    error,
  } = useMessage(props?.last_message || null);

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
            `/channels/${props.id.toString()}/` as Href<`/channels/${string}/`>
          )
        }
      >
        <Avatar
          uri={
            props?.image
              ? props?.image
              : require("../../assets/images/blank profile.png")
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
                      : require("../../assets/images/blank profile.svg")
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
              {lastMessage?.sender == myUserId ? "You: " : ""}
              {lastMessage?.text?lastMessage?.text: "No Message Yet" }
            </Text>
            <Text
              style={{ fontSize: 12 }}
              className="font-semibold tracking-wider text-white"
            >
              {lastMessage?.timestamp
                ? formatTimestamp(lastMessage.timestamp)
                : ""}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};
export default Conversation;
