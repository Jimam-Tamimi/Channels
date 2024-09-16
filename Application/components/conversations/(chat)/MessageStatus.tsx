import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MessageStatusProps {
  status: string;
  isMyMessage: boolean;
}

const MessageStatus = ({ status, isMyMessage }: MessageStatusProps) => (
  <View style={styles.statusIconContainer}>
    <Ionicons
      name={getStatusIcon(status)}
      size={14}
      color={isMyMessage ? "white" : "transparent"}
    />
  </View>
);

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'SENT': return 'checkmark-done-circle-outline';
    case 'DELIVERED': return 'checkmark-done-circle';
    case 'PENDING': return 'ellipsis-horizontal-circle-outline';
    default: return 'alert-circle-outline';
  }
};

const styles = StyleSheet.create({
  statusIconContainer: {
    width: 14,
    height: 14,
  },
});

export default MessageStatus;
