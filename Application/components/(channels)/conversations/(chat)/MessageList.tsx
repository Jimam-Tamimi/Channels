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
import Message from "./Message";
import { MessageType } from "@/api-calls/channels";

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
  const messages : MessageType[] =
    fetchedMessagesByConversation?.pages.flatMap(
      (page) => page?.results ?? []
    ) ?? [];


 
    
 

  return (
    <>
      <FlatList
        onEndReached={({ distanceFromEnd }) => {
          if (hasNextPage) {
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
        renderItem={({ item: message, index: i }) =>  (
          
          <Message key={i} socket={socket} i={i} message={message} messages={messages} myProfileId={myProfileId}  />
 
        )}
      />
    </>
  );
}
