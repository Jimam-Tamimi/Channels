import Avatar from "@/components/utils/Avater";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

const MessageIcon = ({ message, myProfileId, i, messages }: any) => {
  const [currentIcon, setCurrentIcon] = useState("");
  const iconScaleAnim = useRef(new Animated.Value(0)).current;
  const avatarScaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Trigger icon animation first
    Animated.timing(iconScaleAnim, {
      toValue: 0, // Scale down to 0 first (disappear)
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // After scaling down, change the icon
      setCurrentIcon(getIconName(message?.status));

      // Then, scale it up to 1 (appear)
      Animated.timing(iconScaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }, [message?.status]);

  useEffect(() => {
    // Trigger avatar animation only if the status is "SEEN"
    if (
      (message?.status !== "SEEN" && message?.sender === myProfileId) 
      ||      (messages?.length !== i + 1 && messages[i - 1]?.status === "SEEN")
    ) {
      Animated.timing(avatarScaleAnim, {
        toValue: 0, // Scale up to 1 (appear)
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(avatarScaleAnim, {
        toValue: 1, // Scale down to 0 (disappear)
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [messages]);

  const getIconName = (status: string) => {
    switch (status) {
      case "SENT":
        return "checkmark-done-circle-outline";
      case "DELIVERED":
        return "checkmark-done-circle";
      case "PENDING":
        return "ellipsis-horizontal-circle-outline";
      default:
        return "alert-circle-outline";
    }
  };

  return (
    <>
      {message?.status === "SEEN" && message?.sender === myProfileId ? (
        <Animated.View
          style={{
            transform: [{ scale: avatarScaleAnim }],
          }}
        >
          <Avatar
            uri="https://randomuser.me/api/portraits/men/32.jpg"
            size={14}
            borderLess
          />
        </Animated.View>
      ) : (
        <Animated.View
          style={{
            width: 14,
            height: 14,
            transform: [{ scale: iconScaleAnim }],
          }}
        >
          <Ionicons
            name={currentIcon as any}
            size={14}
            color={message?.sender === myProfileId ? "white" : "transparent"}
          />
        </Animated.View>
      )}
    </>
  );
};


export  default MessageIcon