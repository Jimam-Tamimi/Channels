import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Input from '@/components/utils/Input';
import uuid from 'react-native-uuid';
import { useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface MessageInputProps {
  socket: any;
  conversationId: string; 
  onSendMessage: (message: any) => void;
}

const MessageInput = ({ socket, conversationId,  onSendMessage }: MessageInputProps) => {
  const { control, handleSubmit, reset } = useForm();
  const local = useLocalSearchParams();
  const myProfileId = useSelector((state: RootState) => state.auth.auth?.profile?.id);

  const handleSend = (data: any) => {
    if (!data?.text) return;

    const messageUuid = uuid.v4();
    const messageData = { 
      ...data, 
      uuid: messageUuid, 
      conversation_id: conversationId 
    };

    if (socket) {
      onSendMessage({
        uuid: messageUuid,
        text: data.text,
        sender: myProfileId,
        conversation: conversationId,
        timestamp: new Date().toISOString(),
        seen_by: [],
        delivered_to: [],
        status: 'PENDING',
      });
      reset();
      socket.send(JSON.stringify(messageData));
    } else {
      console.error('Socket not initialized or message/channelId is empty');
    }
  };

  return (
    <View style={styles.inputContainer}>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Type your message here..."
            value={value}
            onChangeText={onChange}
            onSubmitEditing={handleSubmit(handleSend)}
            style={styles.input}
          />
        )}
        name="text"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  input: {
    borderRadius: 20,
    padding: 10,
  },
});

export default MessageInput;
