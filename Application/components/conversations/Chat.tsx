import React, { useState, useCallback, useEffect } from "react";
import { Bubble, GiftedChat, IChatMessage } from "react-native-gifted-chat";
import { StatusBar, StyleSheet } from "react-native";

export function Chat() {
  const [messages, setMessages] = useState<IChatMessage[]>([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);

  const onSend = (messages: IChatMessage[]) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  };

  return <></>;
}
