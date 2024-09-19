import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { useMessagesByConversation } from "@/hooks/channels";
import { InfiniteData, useQueryClient } from "react-query";
import { useWebSocket } from "@/context/WebSocketContext";
import { useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  formatTimestamp,
  isDifferenceMoreThan15Minutes,
} from "@/helpers/channels";
import Avatar from "@/components/utils/Avater";
import MessageIcon from "./MessageStatus";

type MessageListPropTypes = { 
};

export default function MessageList({ 
}: MessageListPropTypes) {
  const queryClient = useQueryClient();
  const { socket } = useWebSocket();
  const local = useLocalSearchParams();

  const myProfileId = useSelector(
    (state: RootState) => state.auth.auth?.profile?.id
  );

  const {
    data: fetchedMessagesByConversation,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useMessagesByConversation(local?.id as any);
  const messages =
    fetchedMessagesByConversation?.pages.flatMap(
      (page) => page?.results ?? []
    ) ?? [];


 
    
 

  return (
    <>
      <FlatList
        onEndReached={({ distanceFromEnd }) => {
          if (hasNextPage) {
            console.log("has next page run");
            fetchNextPage();
          }
        }}
        inverted
        data={messages}
        contentContainerStyle={{ gap: 5, paddingVertical: 10 }}
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
                    message?.sender === myProfileId ? "#5660e762" : "#ff004c70",

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
    </>
  );
}
