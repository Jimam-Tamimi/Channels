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
  PaginatedMessagesDataType,
} from "@/api-calls/channels";
import { useMessagesByConversation } from "@/hooks/channels";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import moment from "moment";
import uuid from "react-native-uuid";
import { InfiniteData, useQueryClient } from "react-query";
import { useWebSocket } from "@/context/WebSocketContext";
import MessageList from "@/components/(channels)/conversations/(chat)/MessageList";
import MessageInput from "@/components/(channels)/conversations/(chat)/MessageInput";
import { updatePaginatedDataWithNewMessage } from "@/helpers/channels";

function Chat() {
  const [paginatedMessagesData, setPaginatedMessagesData] =
    useState<InfiniteData<PaginatedMessagesDataType | null> | null>(null);
  // for send message

  const queryClient = useQueryClient();
  const { socket } = useWebSocket();
  const local = useLocalSearchParams();
  // Scroll to bottom when keyboard is shown

  const handleDeliverMessage = useCallback(
    (data: any) => {
      if (socket) {
        socket.send(
          JSON.stringify({
            type: "message_seen",
            message_id: data?.message?.id,
          })
        );
      } 
      updateMessagesForConversationCache(data)
    },
    [queryClient, local?.id, socket]
  );
  useWebSocketHandler("deliver_message", handleDeliverMessage, true);

  const  updateMessagesForConversationCache = useCallback(
    (data: any) => {
      queryClient.setQueryData(
        ["messages-for-conversation", local?.id],
        (oldData: any) => {
          const updatedPaginatedData = updatePaginatedDataWithNewMessage(
            oldData,
            data?.message
          );
          return updatedPaginatedData;
        }
      );
    },
    [queryClient, local?.id, socket]
  );
  useWebSocketHandler("message_delivered", updateMessagesForConversationCache, true);
  useWebSocketHandler("message_seen", updateMessagesForConversationCache, true);
 

  return (
    <>
      <View
        style={{
          paddingTop: useHeaderHeight(),
          borderWidth: 4,
          flex: 1,
          height: Dimensions.get("window").height,
        }}
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
        <MessageList
        //  paginatedMessages={paginatedMessages} setPaginatedMessages={setPaginatedMessages}
        />
        {/* <View>
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
        </View> */}

        <MessageInput
        />
      </View>
    </>
  );
}
export default Chat;
