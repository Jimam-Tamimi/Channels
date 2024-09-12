import { Chat } from "@/components/conversations/Chat";
import { Link, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "nativewind";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import Avatar from "@/components/utils/Avater";
import { Ionicons } from "@expo/vector-icons";
import Input from "@/components/utils/Input";
import { Controller, useForm } from "react-hook-form";
import Animated from "react-native-reanimated";
import { Image } from "expo-image";

export interface MessageType {
  id: string | number;
  text: string;
  timestamp: Date | number | string;
  user: any;
  // image?: string
  // video?: string
  // audio?: string
  // system?: boolean
  status: "pending" | "sent" | "delivered" | "seen" | "failed";
}

export default function Conversation() {
  const local = useLocalSearchParams();
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "other",
      status: "pending",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "other",
      status: "pending",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "me",
      status: "seen",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "me",
      status: "seen",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "me",
      status: "seen",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "me",
      status: "delivered",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "other",
      status: "pending",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "other",
      status: "pending",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "me",
      status: "seen",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "me",
      status: "seen",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "me",
      status: "seen",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "me",
      status: "delivered",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "other",
      status: "pending",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "other",
      status: "pending",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "me",
      status: "seen",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "me",
      status: "seen",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "me",
      status: "seen",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "me",
      status: "delivered",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "other",
      status: "pending",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "other",
      status: "pending",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "other",
      status: "pending",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "other",
      status: "pending",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "me",
      status: "seen",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "me",
      status: "seen",
    },
    {
      id: 45,
      text: `Hi. How are you doing to day. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda deleniti nam magni repellat facere autem minus, quo sit asperiores delectus!`,
      timestamp: "Fri",
      user: "me",
      status: "seen",
    },
  ]);

  // for send message
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const onSend = (data: any) => {
    if (!data?.text) {
      return;
    }
    setMessages((prevState) => [
      ...prevState,
      {
        id: prevState.length + 1,
        text: data?.text,
        timestamp: "Fri",
        user: "me",
        status: "pending",
      },
    ]);
    reset();

    setTimeout(
      () => scrollViewRef.current?.scrollToEnd({ animated: true }),
      100
    ); // Small timeout to ensure new message is rendered
  };

  // Scroll to bottom when keyboard is shown
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    );
    scrollViewRef.current?.scrollToEnd({ animated: false });

    return () => {
      keyboardDidShowListener.remove(); // Cleanup the event listener
    };
  }, []);
  return (
    <>
      <View
        className="flex-1 "
        style={{ paddingTop: useHeaderHeight(), borderWidth: 4 }}
      >
        <Image
          contentFit="cover"
          source={require("../../assets/images/New folder/1.jpg")}
          // source={require("../../assets/images/New folder/4.jpg")}

          style={[
            {
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height,
              position: "absolute",
              overflow: "hidden",
            },
          ]}
        />
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: "black",
              opacity: 0.6,
              position: "absolute",
              overflow: "hidden",
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height,
            },
          ]}
        ></View>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ gap: 4, paddingVertical: 20 }}
        >
          {messages.map((message, i) => (
            <View
              style={{
                marginBottom:
                  messages[i]?.user !== "me" && messages[i + 1]?.user === "me"
                    ? 10
                    : 0,
                marginTop:
                  messages[i]?.user !== "me" && messages[i - 1]?.user === "me"
                    ? 10
                    : 0,
              }}
              key={i}
            >
              <View
                className={`flex-row items-end  
                ${
                  message?.user === "me"
                    ? "justify-end gap-0.5"
                    : "justify-start gap-2.5 "
                }
                `}
              >
                <View
                  className={`
                ${
                  messages[i]?.user !== "me" && messages[i + 1]?.user === "me"
                    ? "visible"
                    : "invisible"
                }
                `}
                >
                  <Avatar
                    uri="https://randomuser.me/api/portraits/men/32.jpg"
                    size={25}
                    isActive
                  />
                </View>
                <View
                  style={{
                    backgroundColor:
                      message?.user === "me" ? "#5660e762" : "#ff004c70",

                    borderBottomLeftRadius:
                      (messages[i]?.user !== "me" &&
                        messages[i + 1]?.user === "me") ||
                      messages[i]?.user === "me"
                        ? 10
                        : 0,
                    borderTopLeftRadius:
                      (messages[i]?.user !== "me" &&
                        (messages[i - 1]?.user === "me" || i == 0)) ||
                      messages[i]?.user === "me"
                        ? 10
                        : 0,
                    borderBottomRightRadius:
                      messages[i]?.user === "me" &&
                      messages[i + 1]?.user !== "me"
                        ? 10
                        : messages[i]?.user !== "me"
                        ? 10
                        : 0,
                    borderTopRightRadius:
                      messages[i]?.user === "me" &&
                      messages[i - 1]?.user !== "me"
                        ? 10
                        : messages[i]?.user !== "me"
                        ? 10
                        : 0,
                    maxWidth: "80%",
                  }}
                  className="px-3 py-2 "
                >
                  <Text
                    className={`   leading-6 tracking-wider text-white  
                    `}
                  >
                    {message?.text}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "400",
                      letterSpacing: 0.5,
                      textAlign: "right",
                    }}
                    className="text-white "
                  >
                    4 Sep 2024, 19:25
                  </Text>
                </View>
                {message?.status === "seen" ? (
                  <View
                    className={`${
                      messages[i + 1]?.status === "seen" && "invisible"
                    }`}
                  >
                    <Avatar
                      uri="https://randomuser.me/api/portraits/men/32.jpg"
                      size={14}
                      borderLess
                    />
                  </View>
                ) : (
                  <View style={{ width: 14, height: 14 }}>
                    <Ionicons
                      name={`${
                        message?.status === "sent"
                          ? "checkmark-done-circle-outline"
                          : message?.status === "delivered"
                          ? "checkmark-done-circle"
                          : message?.status === "pending"
                          ? "ellipsis-horizontal-circle-outline"
                          : "alert-circle-outline"
                      }`}
                      size={14}
                      color={`${
                        message?.status === "failed"
                          ? "red"
                          : message?.user === "me"
                          ? "white"
                          : "transparent"
                      }`}
                    />
                  </View>
                )}
              </View>
              {false && (
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "400",
                    marginVertical: 20,
                    letterSpacing: 0.5,
                  }}
                  className="text-center text-white "
                >
                  4 Sep 2024, 19:25
                </Text>
              )}
            </View>
          ))}
        </ScrollView>

        <View>
          <Controller
            control={control}
            name="text"
            rules={{ required: "" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Message..."
                containerStyle={{
                  borderRadius: 0,
                  paddingHorizontal: 15,
                  margin: 0,
                }}
                style={{ paddingRight: 10 }}
                multiline
                rightElement={
                  <Ionicons
                    onPress={handleSubmit(onSend as any)}
                    name="send-outline"
                    size={24}
                    color="white"
                  />
                }
              />
            )}
          />
        </View>
      </View>
    </>
  );
}
