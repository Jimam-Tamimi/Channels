import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Message from './Message';
import { MessageType } from '@/api-calls/channels';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface MessageListProps {
  messages: MessageType[];
}

const MessageList = ({ messages }: MessageListProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const auth = useSelector((state: RootState) => state.auth.auth);
  useEffect(() => {
    console.log({auth})
    console.log("jimam")
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollViewContainer}>
      {messages.map(message => (
        <Message key={message.uuid} message={message} myProfileId={ auth?.profile?.id as any} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    padding: 10,
  },
});

export default MessageList;
