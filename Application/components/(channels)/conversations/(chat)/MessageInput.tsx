import { View, Text } from "react-native";
import React, { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import Input from "@/components/utils/Input";
import { Ionicons } from "@expo/vector-icons";
import uuid from "react-native-uuid";
import { InfiniteData, useQueryClient } from "react-query";
import { useWebSocket } from "@/context/WebSocketContext";
import { useLocalSearchParams } from "expo-router";
import { MessageType, PaginatedMessagesDataType } from "@/api-calls/channels";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { updatePaginatedDataWithNewMessage } from "@/helpers/channels";

export default function MessageInput({
}: {
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const queryClient = useQueryClient();
  const { socket } = useWebSocket();
  const local = useLocalSearchParams();

  
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
        } as any;
        queryClient.setQueryData(
          ["messages-for-conversation", local?.id],
          (oldData: any) => {
            return  updatePaginatedDataWithNewMessage(oldData, newMessage)
          }
        );
        reset();
      } else {
      }
    } catch (error) {}
  }, []);

  return (
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
  );
}
