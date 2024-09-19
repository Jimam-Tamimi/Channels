import moment from 'moment';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MessageBubbleProps {
  text: string;
  timestamp: string;
  isMyMessage: boolean;
}

const MessageBubble = ({ text, timestamp, isMyMessage }: MessageBubbleProps) => {
  const messageColor = isMyMessage ? "#5660e762" : "#ff004c70";
  const borderRadius = {
    borderBottomLeftRadius: isMyMessage ? 10 : 0,
    borderTopLeftRadius: isMyMessage || !isMyMessage ? 10 : 0,
    borderBottomRightRadius: isMyMessage ? 10 : 0,
    borderTopRightRadius: !isMyMessage ? 10 : 0,
  };

  return (
    <View style={[styles.messageBubble, borderRadius, { backgroundColor: messageColor }]}>
      <Text style={styles.messageText}>{text}</Text>
      <Text style={styles.timestamp}>{formatTimestamp(timestamp)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
  },
  messageText: {
    color: 'white',
    fontSize: 14,
  },
  timestamp: {
    fontSize: 11,
    color: 'white',
    textAlign: 'right',
    marginTop: 5,
  },
});

const formatTimestamp = (timestamp: string) => {
  const now = moment();
  const messageTime = moment(timestamp);
  if (now.diff(messageTime, 'hours') < 24) return messageTime.format('HH:mm');
  if (now.diff(messageTime, 'days') < 7) return messageTime.format('dddd HH:mm');
  return messageTime.format('D MMM YYYY, HH:mm');
};

export default MessageBubble;
