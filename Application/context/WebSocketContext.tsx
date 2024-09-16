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
  const auth = useSelector(
    (state: RootState) => state.auth.auth
  );

  useEffect(() => {
    if (auth?.profile?.id) {
      const ws = new WebSocket(`ws://10.0.2.2:8000/ws/${auth?.profile?.id}/`); // Replace with your WebSocket URL
      // const wsUrl = `ws://localhost:8000/ws/${profileId}/`;

      setSocket(ws);
      return () => {
        ws.close();
      };
    }  
    return () => {};
  }, [auth]);

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
