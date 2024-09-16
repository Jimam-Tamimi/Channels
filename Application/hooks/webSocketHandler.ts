import { useEffect } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { useIsFocused } from '@react-navigation/native';

interface WebSocketData {
  type: string;
  [key: string]: any; // To allow various types of data
}

const useWebSocketHandler = (
  messageType: string,
  handleMessage: (data: WebSocketData) => void,
  runOnFocusOnly: boolean = false
) => {
  const context = useWebSocket();
  const socket = context?.socket;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!socket) return;

    const handleWebSocketMessage = (event: MessageEvent) => {
      const data: WebSocketData = JSON.parse(event.data);
      // Only handle messages of the correct type
 
      if (data.type === messageType) {
        if (runOnFocusOnly && !isFocused) return;
        handleMessage(data);
      }
    };

    socket.addEventListener('message', handleWebSocketMessage);

    return () => {
      socket.removeEventListener('message', handleWebSocketMessage);
    };
  }, [socket, messageType, handleMessage, runOnFocusOnly, isFocused]);
};

export default useWebSocketHandler;
