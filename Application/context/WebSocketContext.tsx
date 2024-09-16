import { RootState } from "@/redux/store";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSelector } from "react-redux";

interface WebSocketContextType {
  socket: WebSocket | null;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const myProfileId = useSelector(
    (state: RootState) => state.auth.auth?.profile?.id
  );

  useEffect(() => {
    if (myProfileId) {
      const ws = new WebSocket(`ws://10.0.2.2:8000/ws/${myProfileId}/`); // Replace with your WebSocket URL
      // const wsUrl = `ws://localhost:8000/ws/${profileId}/`;

      setSocket(ws);
      return () => {
        ws.close();
      };
    }
    return () => {};
  }, [myProfileId]);

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
