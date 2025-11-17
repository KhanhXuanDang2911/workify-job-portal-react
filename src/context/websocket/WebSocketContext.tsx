import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { NotificationResponse } from "@/types/notification.type";
import type { MessageResponse } from "@/types/chat.type";
import { userTokenUtils, employerTokenUtils } from "@/lib/token";
import { useLocation } from "react-router-dom";
import { employer_routes } from "@/routes/routes.const";
import { toast } from "react-toastify";
import { Bell, User, FileText } from "lucide-react";

interface WebSocketContextType {
  isConnected: boolean;
  notifications: NotificationResponse[];
  unreadCount: number;
  addNotification: (notification: NotificationResponse) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  // Chat functions
  sendChatMessage: (conversationId: number, content: string) => void;
  subscribeToMessages: (
    callback: (message: MessageResponse) => void
  ) => () => void; // Returns unsubscribe function
  getStompClient: () => Client | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

// eslint-disable-next-line react-refresh/only-export-components
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    []
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const stompClientRef = useRef<Client | null>(null);
  const messageCallbacksRef = useRef<Set<(message: MessageResponse) => void>>(
    new Set()
  );
  const location = useLocation();

  const BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/workify/api/v1";
  // Extract base URL without /api/v1
  const baseUrlWithoutApi = BASE_URL.replace("/api/v1", "");
  const WS_URL = `${baseUrlWithoutApi}/ws`;

  // Get appropriate token based on route
  const getToken = useCallback(() => {
    const isEmployerRoute = location.pathname.startsWith(employer_routes.BASE);
    if (isEmployerRoute) {
      return employerTokenUtils.getAccessToken();
    }
    return userTokenUtils.getAccessToken();
  }, [location.pathname]);

  // Add notification
  const addNotification = useCallback((notification: NotificationResponse) => {
    setNotifications((prev) => [notification, ...prev]);
    if (!notification.readFlag) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, readFlag: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, readFlag: true }))
    );
    setUnreadCount(0);
  }, []);

  // Track current route type to detect switches
  const isEmployerRouteRef = useRef(
    location.pathname.startsWith(employer_routes.BASE)
  );

  // Initialize WebSocket connection
  useEffect(() => {
    const token = getToken();
    const isEmployerRoute = location.pathname.startsWith(employer_routes.BASE);

    // Check if route type changed (user <-> employer)
    if (isEmployerRouteRef.current !== isEmployerRoute) {
      console.log("[WebSocket] Route type changed, clearing notifications");
      // Clear notifications when switching between user and employer
      setNotifications([]);
      setUnreadCount(0);
      isEmployerRouteRef.current = isEmployerRoute;

      // Disconnect old connection
      if (stompClientRef.current?.active) {
        stompClientRef.current.deactivate();
      }
    }

    if (!token) {
      // No token, disconnect if connected
      if (stompClientRef.current?.active) {
        stompClientRef.current.deactivate();
      }
      setIsConnected(false);
      return;
    }

    // Create SockJS socket
    const socket = new SockJS(WS_URL);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        console.log(
          `[WebSocket] Connected as ${isEmployerRoute ? "EMPLOYER" : "USER"}`
        );
        setIsConnected(true);

        // Subscribe to notifications
        client.subscribe("/user/queue/notifications", (message) => {
          try {
            const notification: NotificationResponse = JSON.parse(message.body);
            console.log(
              `[WebSocket] Received notification (${
                isEmployerRoute ? "EMPLOYER" : "USER"
              }):`,
              notification
            );
            addNotification(notification);

            // Show toast notification
            if (!notification.readFlag) {
              toast.info(
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {notification.type === "NEW_APPLICATION" ? (
                      <User className="w-5 h-5 text-blue-600" />
                    ) : notification.type === "APPLICATION_STATUS_UPDATE" ? (
                      <FileText className="w-5 h-5 text-green-600" />
                    ) : (
                      <Bell className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm mb-1">
                      {notification.title}
                    </p>
                    <p className="text-gray-700 text-sm">
                      {notification.content}
                    </p>
                  </div>
                </div>,
                {
                  position: "bottom-right",
                  autoClose: 6000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  className: "bg-white border-l-4 border-blue-500 shadow-lg",
                }
              );
            }
          } catch (error) {
            console.error("[WebSocket] Error parsing notification:", error);
          }
        });

        // Subscribe to chat messages
        client.subscribe("/user/queue/messages", (message) => {
          try {
            console.log(
              `[WebSocket] Raw message received (${
                isEmployerRoute ? "EMPLOYER" : "USER"
              }):`,
              message.body
            );
            const messageData: MessageResponse = JSON.parse(message.body);
            console.log(
              `[WebSocket] Parsed chat message (${
                isEmployerRoute ? "EMPLOYER" : "USER"
              }):`,
              messageData
            );
            console.log(
              `[WebSocket] Current callbacks count:`,
              messageCallbacksRef.current.size
            );
            // Notify all registered callbacks
            messageCallbacksRef.current.forEach((callback, index) => {
              console.log(`[WebSocket] Calling callback #${index + 1}`);
              callback(messageData);
            });
          } catch (error) {
            console.error("[WebSocket] Error parsing chat message:", error);
          }
        });
      },
      onStompError: (frame) => {
        console.error("[WebSocket] STOMP error:", frame);
        setIsConnected(false);
      },
      onDisconnect: () => {
        console.log("[WebSocket] Disconnected");
        setIsConnected(false);
      },
      onWebSocketError: (error) => {
        console.error("[WebSocket] WebSocket error:", error);
        setIsConnected(false);
      },
    });

    stompClientRef.current = client;
    client.activate();

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [getToken, WS_URL, addNotification, location.pathname]);

  // Send chat message via WebSocket
  const sendChatMessage = useCallback(
    (conversationId: number, content: string) => {
      const client = stompClientRef.current;
      // Check if client exists, is active, and we have connection state
      if (!client || !client.active || !isConnected) {
        console.error("[WebSocket] Cannot send message: not connected", {
          hasClient: !!client,
          active: client?.active,
          isConnected,
        });
        throw new Error("WebSocket not connected");
      }

      try {
        client.publish({
          destination: "/app/chat.sendMessage",
          body: JSON.stringify({
            conversationId,
            content,
          }),
        });
        console.log(
          `[WebSocket] Sent chat message to conversation ${conversationId}`
        );
      } catch (error) {
        console.error("[WebSocket] Error sending chat message:", error);
        throw error;
      }
    },
    [isConnected]
  );

  // Subscribe to messages with callback
  const subscribeToMessages = useCallback(
    (callback: (message: MessageResponse) => void) => {
      messageCallbacksRef.current.add(callback);
      console.log(
        "[WebSocket] Added message callback, total callbacks:",
        messageCallbacksRef.current.size
      );

      // Return unsubscribe function
      return () => {
        messageCallbacksRef.current.delete(callback);
        console.log(
          "[WebSocket] Removed message callback, remaining callbacks:",
          messageCallbacksRef.current.size
        );
      };
    },
    []
  );

  // Get stomp client
  const getStompClient = useCallback(() => {
    return stompClientRef.current;
  }, []);

  const value: WebSocketContextType = {
    isConnected,
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    sendChatMessage,
    subscribeToMessages,
    getStompClient,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
