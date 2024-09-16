import React from 'react';
import { View, StyleSheet } from 'react-native';
import Avatar from '@/components/utils/Avater';
import MessageBubble from './MessageBubble';
import MessageStatus from './MessageStatus';
import { MessageType } from '@/api-calls/channels';

interface MessageProps {
  message: MessageType;
  myProfileId: number;
}

const Message = ({ message, myProfileId }: MessageProps) => {
  const isMyMessage = message.sender === myProfileId;

  return (
    <View style={styles.messageContainer}>
      {!isMyMessage && (
        <Avatar uri="https://randomuser.me/api/portraits/men/32.jpg" size={25} isActive />
      )}
      <MessageBubble
        text={message.text}
        timestamp={message.timestamp}
        isMyMessage={isMyMessage}
      />
      {message.status !== 'SEEN' && (
        <MessageStatus status={message.status} isMyMessage={isMyMessage} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
});

export default Message;
