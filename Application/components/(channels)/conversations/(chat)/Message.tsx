import { View, Text } from "react-native";
import React from "react";

export default function Message() {
  return (
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
                (messages[i]?.sender !== myProfileId && messages?.length === i + 1) ||
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
  );
}
