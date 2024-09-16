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
import useWebSocketHandler from "@/hooks/webSocketHandler";
import { useWebSocket } from "@/context/WebSocketContext";
import { MessageType } from "@/api-calls/channels";
import { useMessagesByConversation } from "@/hooks/channels";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import moment from "moment";
import uuid from "react-native-uuid";

const formatTimestamp = (timestamp: string) => {
  const now = moment();
  const messageTime = moment(timestamp);

  // Check if the timestamp is within the last 24 hours
  if (now.diff(messageTime, "hours") < 24) {
    // Show only the time (e.g., 22:45)
    return messageTime.format("HH:mm");
  }
  // Check if the timestamp is within the last 7 days
  else if (now.diff(messageTime, "days") < 7) {
    // Show the day of the week and time (e.g., Sunday 22:45)
    return messageTime.format("dddd HH:mm");
  }
  // Otherwise, show full date and time (e.g., 4 Sep 2024, 19:25)
  else {
    return messageTime.format("D MMM YYYY, HH:mm");
  }
};

function isDifferenceMoreThan15Minutes(timestamp1: string, timestamp2: string) {
  const date1 = moment(timestamp1);
  const date2 = moment(timestamp2);

  // Calculate the difference in minutes between the two timestamps
  const differenceInMinutes = Math.abs(date1.diff(date2, "minutes"));

  // Return true if the difference is more than 15 minutes, false otherwise
  return differenceInMinutes > 15;
}

function replaceObjectById(array: MessageType[], newObject: MessageType) {
  const index = array.findIndex((item) => 
    (item.uuid && newObject.uuid && item.uuid === newObject.uuid) || 
    (item.id === newObject.id)
  );

  if (index !== -1) {
    // Replace the object at the found index
    array.splice(index, 1, newObject);
  } else {
    // If the object with the same ID is not found, you can optionally push the new object
    array.push(newObject);
  }
  return array;
}

export default function Conversation() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  // for send message
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Scroll to bottom when keyboard is shown
  useEffect(() => {
    // scroll to bottom after messages are loaded
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    );

    return () => {
      keyboardDidShowListener.remove(); // Cleanup the event listener
    };
  }, []);

  const handleChatMessage = (data: any) => {
    console.log({ data });
    console.log({ websocketDataFromBackenduuid: data?.message?.uuid });
    console.log( messages[messages?.length-1]?.uuid);
    setMessages((prevState) => [
      ...replaceObjectById(prevState, data?.message),
    ]);
  };

  // Handle WebSocket messages regardless of screen focus
  useWebSocketHandler("send_message", handleChatMessage, true);

  const { socket } = useWebSocket();
  const local = useLocalSearchParams();
  console.log(local);
  const {
    data: fetchedMessagesByConversation,
    isLoading,
    isError,
    error,
  } = useMessagesByConversation(local?.id as any);
  const myUserId = useSelector((state: RootState) => state.auth.auth?.user?.id);

  useEffect(() => {
    if (fetchedMessagesByConversation) {
      console.log(fetchedMessagesByConversation[0]?.timestamp);
      setMessages([...fetchedMessagesByConversation]);
    }

    return () => {};
  }, [fetchedMessagesByConversation]);
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 1);

    return () => {};
  }, [messages]);


  const onSend = (data: any) => {
    try {
      if (!data?.text) {
        return;
      }
      const messageUuid = uuid.v4();
      data["uuid"] = messageUuid;
      data["conversation_id"] = local?.id;

      if (socket) {
        setMessages((prevState) => [
          ...prevState,
          {
            uuid: messageUuid,
            text: data?.text,
            sender: myUserId,
            conversation: data?.conversation_id,
            timestamp: new Date(),
            seen_by: [],
            delivered_to: [],
            status: "PENDING",
          } as any,
        ]);

        reset();

        setTimeout(
          () => scrollViewRef.current?.scrollToEnd({ animated: true }),
          1
        );

        socket.send(JSON.stringify(data));
      } else {
        console.error("Socket not initialized or message/channelId is empty");
      }
    } catch (error) {
      console.error("Error in onSend:", error);
    }
  };

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
                  messages[i]?.sender !== myUserId &&
                  messages[i + 1]?.sender === myUserId
                    ? 10
                    : 0,
                marginTop:
                  messages[i]?.sender !== myUserId &&
                  messages[i - 1]?.sender === myUserId
                    ? 10
                    : 0,
              }}
              key={i}
            >
              <View
                className={`flex-row items-end  
                ${
                  message?.sender === myUserId
                    ? "justify-end gap-0.5"
                    : "justify-start gap-2.5 "
                }
                `}
              >
                <View
                  className={`
                ${
                  messages[i]?.sender !== myUserId &&
                  messages[i + 1]?.sender === myUserId
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
                      message?.sender === myUserId ? "#5660e762" : "#ff004c70",

                    borderBottomLeftRadius:
                      (messages[i]?.sender !== myUserId &&
                        messages[i + 1]?.sender === myUserId) ||
                      messages[i]?.sender === myUserId
                        ? 10
                        : 0,
                    borderTopLeftRadius:
                      (messages[i]?.sender !== myUserId &&
                        (messages[i - 1]?.sender === myUserId || i == 0)) ||
                      messages[i]?.sender === myUserId
                        ? 10
                        : 0,
                    borderBottomRightRadius:
                      messages[i]?.sender === myUserId &&
                      messages[i + 1]?.sender !== myUserId
                        ? 10
                        : messages[i]?.sender !== myUserId
                        ? 10
                        : 0,
                    borderTopRightRadius:
                      messages[i]?.sender === myUserId &&
                      messages[i - 1]?.sender !== myUserId
                        ? 10
                        : messages[i]?.sender !== myUserId
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
                    {formatTimestamp(message?.timestamp)}
                  </Text>
                </View>
                {message?.status === "SEEN" ? (
                  <View
                    className={`${
                      messages[i + 1]?.status === "SEEN" && "invisible"
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
                        message?.status === "SENT"
                          ? "checkmark-done-circle-outline"
                          : message?.status === "DELIVERED"
                          ? "checkmark-done-circle"
                          : message?.status === "PENDING"
                          ? "ellipsis-horizontal-circle-outline"
                          : "alert-circle-outline"
                      }`}
                      size={14}
                      color={`${
                        // message?.status === "failed"
                        false
                          ? "red"
                          : message?.sender === myUserId
                          ? "white"
                          : "transparent"
                      }`}
                    />
                  </View>
                )}
              </View>

              {i + 1 != messages?.length &&
              isDifferenceMoreThan15Minutes(
                message?.timestamp,
                messages[i + 1]?.timestamp
              ) ? (
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "400",
                    marginVertical: 20,
                    letterSpacing: 0.5,
                  }}
                  className="text-center text-white "
                >
                  {formatTimestamp(messages[i + 1].timestamp)}
                </Text>
              ) : (
                ""
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
                noError={true}
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
