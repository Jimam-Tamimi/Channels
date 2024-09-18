// import { Chat } from "@/components/conversations/Chat";
import { Link, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "nativewind";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
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
import { Animated } from "react-native";

import { Image } from "expo-image";
import useWebSocketHandler from "@/hooks/webSocketHandler";
import {
  fetchMessagesForConversation,
  MessageType,
} from "@/api-calls/channels";
import { useMessagesByConversation } from "@/hooks/channels";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import moment from "moment";
import uuid from "react-native-uuid";
import { InfiniteData, useQueryClient } from "react-query";
import { useWebSocket } from "@/context/WebSocketContext";

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
  const index = array.findIndex(
    (item) =>
      (item?.uuid && newObject?.uuid && item?.uuid === newObject?.uuid) ||
      item.id === newObject.id
  );

  if (index !== -1) {
    // Replace the object at the found index
    array.splice(index, 1, newObject);
    console.log({arrayBefore: array})
    return array
  } else {    
    return [newObject, ...array];
  }
}

function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  // for send message

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const queryClient = useQueryClient();

  // Scroll to bottom when keyboard is shown
 
  function updatePaginatedDataWithMessage(
    oldData: InfiniteData<any> | undefined,
    newMessage: MessageType
  ): InfiniteData<any> | undefined {
    if (!oldData) return oldData; // If there's no old data, return it as is
    
    // Update the correct page where the message should be located
    console.log({newMessage})
    console.log({old: oldData.pages[0].results})
    const updatedPages = oldData.pages.map((page: any) => {
      // Check if the message belongs in this page (based on the message ID)
      const updatedMessages = replaceObjectById(page.results, newMessage);
      console.log({updatedMessages})
      return { ...page, results: updatedMessages };
    });

    // Return the updated structure
    console.log({new: updatedPages[0].results})
    return {
      ...oldData,
      pages: updatedPages,
    };
  }
  const handleDeliverMessage = useCallback(
    (data: any) => {
      setMessages((prevState) => {
        const newState = [...replaceObjectById(prevState, data?.message)];

        if (socket) {
          socket.send(
            JSON.stringify({
              type: "message_seen",
              message_id: data?.message?.id,
            })
          );
        }
        queryClient.setQueryData(
          ["messages-for-conversation"],
          (oldData: any) => {
            return updatePaginatedDataWithMessage(oldData, data?.message);
          }
        );

        return [...newState];
      });
    },
    [queryClient, local?.id, socket]
  );
  useWebSocketHandler("deliver_message", handleDeliverMessage, true);

  const updateMessageData = useCallback((data: any) => {
    setMessages((prevState) => {
      const newState = [...replaceObjectById(prevState, data?.message)];
      queryClient.setQueryData(
        ["messages-for-conversation"],
        (oldData: any) => {
          
          console.log("oldData")
          console.log(oldData.pages[0].results)
          console.log(updatePaginatedDataWithMessage(oldData, data?.message).pages[0].results)
          return updatePaginatedDataWithMessage(oldData, data?.message);
        }
      );
      return [...newState];
    });
  },
  [queryClient, local?.id, socket]
);
  useWebSocketHandler("message_delivered", updateMessageData, true);
  useWebSocketHandler("message_seen", updateMessageData, true);

  const bulk_messages_seen = useCallback((data: any) => {
    const newMessages = data?.pages.flatMap((page) => page.results) ?? [];

    setMessages((prevState) => {
      const newState = prevState.map((item1) => {
        const matchingItem = newMessages.find((item2) => item2.id === item1.id);
        return matchingItem ? matchingItem : item1;
      });
      queryClient.setQueryData(
        ["messages-for-conversation"],
        (oldData: any) => {
          return updatePaginatedDataWithMessage(oldData, data?.message);
        }
      );
      return [...newState];
    });
  },
  [queryClient, local?.id, socket]
  
);
  // useWebSocketHandler("bulk_messages_seen", bulk_messages_seen, true);

  // Handle WebSocket messages regardless of screen focus

  const { socket } = useWebSocket();
  const local = useLocalSearchParams();
  const {
    data: fetchedMessagesByConversation,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useMessagesByConversation(local?.id as any, (data) => {
    console.log('on success run')
  });


  useEffect(() => {
    console.log("local id changed")
  
    return () => {
      
    }
  }, [local?.id])
  
  

  useEffect(() => {
    if (fetchedMessagesByConversation) {
      const recentMessages = fetchedMessagesByConversation?.pages.flatMap((page) => page.results) ?? [];
      
      setMessages([...recentMessages]);
      if (
        socket &&
        recentMessages?.reverse().some((message) => message.status !== "SEEN")
      ) {
        console.log({ fetchedMessagesByConversation });
        socket.send(
          JSON.stringify({
            type: "all_messages_seen",
            conversation_id: local?.id,
          })
        );
      }
    }
    return () => {};
  }, [fetchedMessagesByConversation]);

  const myProfileId = useSelector(
    (state: RootState) => state.auth.auth?.profile?.id
  );

  const onSend = useCallback((data: any) => {
    try {
      if (!data?.text) {
        return;
      }

      const messageUuid = uuid.v4();
      data["uuid"] = messageUuid;
      data["conversation_id"] = local?.id;

      if (socket) {
        socket.send(
          JSON.stringify({
            type: "send_message",
            message_data: data,
          })
        );
        const newMessage = {
          uuid: messageUuid,
          text: data?.text,
          sender: myProfileId,
          conversation: data?.conversation_id,
          timestamp: new Date(),
          seen_by: [],
          delivered_to: [],
          status: "PENDING",
        } as any
        setMessages((prevState) => [
          newMessage,
          ...prevState,
        ]);
        queryClient.setQueryData(
          ["messages-for-conversation"],
          (oldData: any) => {
            return updatePaginatedDataWithMessage(oldData, newMessage);
          }
        );
        reset();
      } else {
      }
    } catch (error) {}
  }, []);

  return (
    <>
      <View
        style={{ paddingTop: useHeaderHeight(), borderWidth: 4, flex:1, height:Dimensions.get('window').height }}
      >
        <Image
          contentFit="cover"
          source={require("../../../assets/images/New folder/1.jpg")}
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

        <FlatList
          onEndReached={({distanceFromEnd }) => {
            if (hasNextPage  ) {
              console.log("has next page run")
              fetchNextPage();
            }
          }}
          inverted
          data={messages}
          contentContainerStyle={{gap:5,   paddingVertical: 10}}
          keyExtractor={(item, i) => i}
          initialNumToRender={messages?.length}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            isFetchingNextPage ? <ActivityIndicator size="large" /> : null
          }
          renderItem={({ item: message, index: i }) => (
            <View
              key={i}
              style={{
                marginBottom:
                  messages[i]?.sender !== myProfileId &&
                  messages[i + 1]?.sender === myProfileId
                    ? 10
                    : 0,
                marginTop:
                  messages[i]?.sender !== myProfileId &&
                  messages[i - 1]?.sender === myProfileId
                    ? 10
                    : 0,
              }}
              key={i}
            >
              <View
                className={`flex-row items-end
              ${
                message?.sender === myProfileId
                  ? "justify-end gap-0.5"
                  : "justify-start gap-2.5 "
              }
              `}
              >
                <View
                  className={`
              ${
                (messages[i]?.sender !== myProfileId &&
                  messages?.length === i + 1) ||
                (messages[i]?.sender !== myProfileId &&
                  messages[i + 1]?.sender === myProfileId)
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
                      message?.sender === myProfileId
                        ? "#5660e762"
                        : "#ff004c70",

                    borderBottomLeftRadius:
                      (messages[i]?.sender !== myProfileId &&
                        messages[i + 1]?.sender === myProfileId) ||
                      messages[i]?.sender === myProfileId
                        ? 10
                        : 0,
                    borderTopLeftRadius:
                      (messages[i]?.sender !== myProfileId &&
                        (messages[i - 1]?.sender === myProfileId || i == 0)) ||
                      messages[i]?.sender === myProfileId
                        ? 10
                        : 0,
                    borderBottomRightRadius:
                      messages[i]?.sender === myProfileId &&
                      messages[i + 1]?.sender !== myProfileId
                        ? 10
                        : messages[i]?.sender !== myProfileId
                        ? 10
                        : 0,
                    borderTopRightRadius:
                      messages[i]?.sender === myProfileId &&
                      messages[i - 1]?.sender !== myProfileId
                        ? 10
                        : messages[i]?.sender !== myProfileId
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
                <MessageIcon
                  i={i}
                  message={message}
                  messages={messages}
                  myProfileId={myProfileId}
                />

                {/* {message?.status === "SEEN" &&  message?.sender === myProfileId ? (
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
                        : message?.sender === myProfileId
                        ? "white"
                        : "transparent"
                    }`}
                  />
                </View>
              )} */}
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
          )}
        />
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
export default Chat;
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
      (message?.status !== "SEEN" && message?.sender === myProfileId) ||
      (message?.length !== i + 1 && messages[i + 1]?.status === "SEEN")
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
