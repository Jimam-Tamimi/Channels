import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import Avatar from "@/components/utils/Avater";
import MessageIcon from "./MessageStatus";
import {
  formatTimestamp,
  isDifferenceMoreThan15Minutes,
} from "@/helpers/channels";

export default function Message({ messages, myProfileId, i, message, socket }) {
  useEffect(() => {
    if (
      myProfileId &&
      message?.sender !== myProfileId &&
      !message?.seen_by.includes(myProfileId)
    ) {
      if (socket) {
        socket.send(
          JSON.stringify({
            type: "message_seen",
            message_id: message?.id,
          })
        );
      }
    }

    return () => {};
  }, []);

  const isSenderMyProfile = message?.sender === myProfileId;
  const prevMessage = messages[i - 1];
  const nextMessage = messages[i + 1];

  return (
    <View
      style={[
        styles.messageContainer,
        {
          marginTop:
            !isSenderMyProfile && nextMessage?.sender === myProfileId ? 10 : 0,
          marginBottom:
            !isSenderMyProfile &&
            (prevMessage?.sender === myProfileId || i === 0)
              ? 10
              : 0,
        },
      ]}
    >
      <View
        style={[
          styles.messageWrapper,
          {
            justifyContent: isSenderMyProfile ? "flex-end" : "flex-start",
          },
        ]}
      >
        <View
          style={[
            styles.avatarContainer,
            {
              opacity:
                (!isSenderMyProfile && messages?.length === i + 1) ||
                (!isSenderMyProfile && nextMessage?.sender === myProfileId)
                  ? 1
                  : 0,
            },
          ]}
        >
          <Avatar
            uri="https://randomuser.me/api/portraits/men/32.jpg"
            size={25}
            isActive
          />
        </View>

        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isSenderMyProfile ? "#5660e762" : "#ff004c70",
              borderTopStartRadius:
                (!isSenderMyProfile && nextMessage?.sender === myProfileId) ||
                isSenderMyProfile
                  ? 10
                  : 0,
              borderBottomLeftRadius:
                (!isSenderMyProfile &&
                  (prevMessage?.sender === myProfileId || i === 0)) ||
                isSenderMyProfile
                  ? 10
                  : 0,
              borderTopEndRadius:
                isSenderMyProfile && nextMessage?.sender !== myProfileId
                  ? 10
                  : !isSenderMyProfile
                  ? 10
                  : 0,
              borderBottomRightRadius:
                isSenderMyProfile && prevMessage?.sender !== myProfileId
                  ? 10
                  : !isSenderMyProfile
                  ? 10
                  : 0,
            },
          ]}
        >
          <Text style={styles.messageText}>{message?.text}</Text>
          <Text style={styles.timestamp}>
            {formatTimestamp(message?.timestamp)}
          </Text>
        </View>
        <MessageIcon
          i={i}
          message={message}
          messages={messages}
          myProfileId={myProfileId}
        />
      </View>

      {i + 1 !== messages?.length &&
      isDifferenceMoreThan15Minutes(
        message?.timestamp,
        prevMessage?.timestamp
      ) ? (
        <Text style={styles.timestampSeparator}>
          {formatTimestamp(prevMessage?.timestamp)}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 0,
    marginTop: 0,
  },
  messageWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2.5,
  },
  avatarContainer: {
    // style for avatar container
  },
  messageBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: "80%",
  },
  messageText: {
    color: "white",
    lineHeight: 18,
    letterSpacing: 0.5,
  },
  timestamp: {
    fontSize: 11,
    fontWeight: "400",
    letterSpacing: 0.5,
    textAlign: "right",
    color: "white",
  },
  timestampSeparator: {
    fontSize: 12,
    fontWeight: "400",
    marginVertical: 20,
    letterSpacing: 0.5,
    textAlign: "center",
    color: "white",
  },
});
