 
import { router, Stack } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import "react-native-reanimated"; 
import { useWebSocket, WebSocketProvider } from "@/context/WebSocketContext"; 
import useWebSocketHandler from "@/hooks/webSocketHandler";

 

export default function Layout() {
 
  const { socket } = useWebSocket();
  const handleDeliverMessage = useCallback((data: any) => {
    // console.log(socket)
    if (socket) {
      socket.send(
        JSON.stringify({
          type: "message_delivered",
          message_id: data?.message?.id,
        })
      );
    }
  }, [socket]);

  useWebSocketHandler("deliver_message", handleDeliverMessage, false);
 
  
  

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(drawer)"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="conversations" options={{ headerShown: false }} />
    </Stack>
  );
}
