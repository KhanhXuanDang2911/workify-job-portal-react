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
import { chatService } from "@/services/chat.service";

interface WebSocketContextType {
  isConnected: boolean;
  notifications: NotificationResponse[];
  unreadCount: number;
  addNotification: (notification: NotificationResponse) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  sendChatMessage: (conversationId: number, content: string) => void;
  subscribeToMessages: (callback: (payload: any) => void) => () => void;
  getStompClient: () => Client | null;
  conversationUnread: Record<number, number> | null;
  chatUnreadTotal: number;
  markConversationAsSeenLocally: (conversationId: number) => void;
  setCurrentUserId: (id: number | null, type?: "USER" | "EMPLOYER") => void;
  recordOwnSentMessage: (messageId: number) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

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
  const [chatUnreadTotal, setChatUnreadTotal] = useState(0);
  const [conversationUnread, setConversationUnread] = useState<
    Record<number, number>
  >({});
  const stompClientRef = useRef<Client | null>(null);
  const messageCallbacksRef = useRef<Set<(payload: any) => void>>(new Set());
  const currentUserIdRef = useRef<number | null>(null);
  const currentUserTypeRef = useRef<"USER" | "EMPLOYER" | null>(null);
  const ownSentMessageIdsRef = useRef<Set<number>>(new Set());
  const location = useLocation();

  const BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/workify/api/v1";
  const baseUrlWithoutApi = BASE_URL.replace("/api/v1", "");
  const WS_URL = `${baseUrlWithoutApi}/ws`;

  const getToken = useCallback(() => {
    const isEmployerRoute = location.pathname.startsWith(employer_routes.BASE);
    if (isEmployerRoute) {
      return employerTokenUtils.getAccessToken();
    }
    return userTokenUtils.getAccessToken();
  }, [location.pathname]);

  const addNotification = useCallback((notification: NotificationResponse) => {
    setNotifications((prev) => [notification, ...prev]);
    if (!notification.readFlag) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  const markAsRead = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, readFlag: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, readFlag: true }))
    );
    setUnreadCount(0);
  }, []);

  const isEmployerRouteRef = useRef(
    location.pathname.startsWith(employer_routes.BASE)
  );

  useEffect(() => {
    const token = getToken();
    const isEmployerRoute = location.pathname.startsWith(employer_routes.BASE);

    const decodeJwt = (tok: string | null) => {
      if (!tok) return null;
      try {
        const parts = tok.split(".");
        if (parts.length < 2) return null;
        const payload = JSON.parse(atob(parts[1]));
        return payload;
      } catch (e) {
        return null;
      }
    };
    try {
      const payload = decodeJwt(token);
      if (payload) {
        const id = payload.id ?? payload.userId ?? payload.sub ?? null;
        if (typeof id === "number") currentUserIdRef.current = id;
        else if (typeof id === "string" && !isNaN(Number(id)))
          currentUserIdRef.current = Number(id);
        else currentUserIdRef.current = null;
        currentUserTypeRef.current = isEmployerRoute ? "EMPLOYER" : "USER";
      } else {
        currentUserIdRef.current = null;
        currentUserTypeRef.current = isEmployerRoute ? "EMPLOYER" : "USER";
      }
    } catch (e) {
      currentUserIdRef.current = null;
      currentUserTypeRef.current = isEmployerRoute ? "EMPLOYER" : "USER";
    }

    if (isEmployerRouteRef.current !== isEmployerRoute) {
      setNotifications([]);
      setUnreadCount(0);
      isEmployerRouteRef.current = isEmployerRoute;

      if (stompClientRef.current?.active) {
        stompClientRef.current.deactivate();
      }
    }

    if (!token) {
      if (stompClientRef.current?.active) {
        stompClientRef.current.deactivate();
      }
      setIsConnected(false);
      return;
    }

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
        setIsConnected(true);

        client.subscribe("/user/queue/notifications", (message) => {
          try {
            const payload: any = JSON.parse(message.body);

            const senderId = payload?.senderId ?? payload?.createdBy ?? null;
            const messageId = payload?.messageId ?? payload?.id ?? null;
            const isOwn =
              (senderId &&
                currentUserIdRef.current &&
                senderId === currentUserIdRef.current) ||
              (messageId && ownSentMessageIdsRef.current.has(messageId));

            if (!isOwn) {
              const notification: NotificationResponse =
                payload as NotificationResponse;
              addNotification(notification);

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
            } else {
            }
          } catch (error) {}
        });

        (async () => {
          try {
            const map: Record<number, number> = {};
            if (isEmployerRoute) {
              const res = await chatService.getEmployerConversations();
              const list = res?.data || [];
              list.forEach((c: any) => {
                map[c.id] = c.hasUnread ? 1 : 0;
              });
            } else {
              const res = await chatService.getUserConversations();
              const list = res?.data || [];
              list.forEach((c: any) => {
                map[c.id] = c.hasUnread ? 1 : 0;
              });
            }
            setConversationUnread(map);

            const aggregate = Object.values(map).filter(
              (v) => (v ?? 0) > 0
            ).length;
            setChatUnreadTotal(aggregate);
          } catch (e) {}
        })();

        client.subscribe("/user/queue/messages", (message) => {
          try {
            const parsed: any = JSON.parse(message.body);

            const notifyPayload =
              parsed && parsed.type === "MESSAGE" ? parsed.message : parsed;

            messageCallbacksRef.current.forEach((callback) => {
              try {
                callback(notifyPayload);
              } catch (e) {}
            });

            try {
              const payload: any = parsed;

              if (payload && payload.type === "MESSAGE") {
                const msg: MessageResponse = payload.message;
                if (msg && msg.conversationId) {
                  const isOwnEcho =
                    msg.id && ownSentMessageIdsRef.current.has(msg.id);

                  if (
                    !isOwnEcho &&
                    !(
                      msg.senderId &&
                      currentUserIdRef.current &&
                      msg.senderId === currentUserIdRef.current &&
                      msg.senderType === currentUserTypeRef.current
                    )
                  ) {
                    setConversationUnread((prev) => {
                      const prevCount = prev[msg.conversationId] ?? 0;
                      const next = {
                        ...prev,
                        [msg.conversationId]: prevCount + 1,
                      };
                      if (prevCount === 0) setChatUnreadTotal((agg) => agg + 1);
                      return next;
                    });
                  }
                }
              } else if (payload && payload.type === "SEEN_UPDATE") {
                const convUnread = payload.unread;
                const convId = convUnread?.conversationId;
                const unreadValue = convUnread?.unread ?? null;
                if (convId && typeof unreadValue === "number") {
                  const nextValue = unreadValue > 0 ? 1 : 0;
                  setConversationUnread((prev) => {
                    const prevVal = prev[convId] ?? 0;
                    const next = { ...prev, [convId]: nextValue };
                    if (prevVal === 0 && nextValue === 1)
                      setChatUnreadTotal((agg) => agg + 1);
                    else if (prevVal === 1 && nextValue === 0)
                      setChatUnreadTotal((agg) => Math.max(0, agg - 1));
                    return next;
                  });
                }
              } else {
                const msg: MessageResponse = payload as MessageResponse;
                if (msg && msg.conversationId) {
                  const isOwnEcho =
                    msg.id && ownSentMessageIdsRef.current.has(msg.id);

                  if (
                    !isOwnEcho &&
                    !(
                      msg.senderId &&
                      currentUserIdRef.current &&
                      msg.senderId === currentUserIdRef.current &&
                      msg.senderType === currentUserTypeRef.current
                    )
                  ) {
                    setConversationUnread((prev) => {
                      const prevCount = prev[msg.conversationId] ?? 0;
                      const next = {
                        ...prev,
                        [msg.conversationId]: prevCount + 1,
                      };
                      if (prevCount === 0) setChatUnreadTotal((agg) => agg + 1);
                      return next;
                    });
                  }
                }
              }
            } catch (e) {}
          } catch (error) {}
        });

        client.subscribe("/user/queue/unread", (message) => {
          try {
            const payload: any = JSON.parse(message.body);

            if (
              payload?.type === "SEEN_UPDATE" ||
              payload?.type === "UNREAD_UPDATE"
            ) {
              const unread = payload.unread;
              const convId = unread?.conversationId ?? payload.conversationId;
              if (convId) {
                const unreadForJobSeeker =
                  unread?.unreadForJobSeeker ??
                  unread?.unreadForRecipient ??
                  null;
                const unreadForEmployer = unread?.unreadForEmployer ?? null;
                if (isEmployerRoute) {
                  const value =
                    typeof unreadForEmployer === "number"
                      ? unreadForEmployer
                      : (unread?.unreadForRecipient ?? 0);

                  const nextValue = (value ?? 0) > 0 ? 1 : 0;
                  setConversationUnread((prev) => {
                    const prevVal = prev[convId] ?? 0;
                    const next = { ...prev, [convId]: nextValue };
                    if (prevVal === 0 && nextValue === 1)
                      setChatUnreadTotal((agg) => agg + 1);
                    else if (prevVal === 1 && nextValue === 0)
                      setChatUnreadTotal((agg) => Math.max(0, agg - 1));
                    return next;
                  });
                } else {
                  const value =
                    typeof unreadForJobSeeker === "number"
                      ? unreadForJobSeeker
                      : (unread?.unreadForRecipient ?? 0);
                  const nextValue = (value ?? 0) > 0 ? 1 : 0;
                  setConversationUnread((prev) => {
                    const prevVal = prev[convId] ?? 0;
                    const next = { ...prev, [convId]: nextValue };
                    if (prevVal === 0 && nextValue === 1)
                      setChatUnreadTotal((agg) => agg + 1);
                    else if (prevVal === 1 && nextValue === 0)
                      setChatUnreadTotal((agg) => Math.max(0, agg - 1));
                    return next;
                  });
                }
              }

              const total = payload.totalUnreadConversations;
              if (total) {
                const val = isEmployerRoute
                  ? (total.employer ?? total.jobSeeker ?? 0)
                  : (total.jobSeeker ?? total.employer ?? 0);

                setChatUnreadTotal(val ?? 0);
              }
            }
          } catch (e) {}
        });
      },
      onStompError: (frame) => {
        setIsConnected(false);
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onWebSocketError: (error) => {
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

  const sendChatMessage = useCallback(
    (conversationId: number, content: string) => {
      const client = stompClientRef.current;

      if (!client || !client.active || !isConnected) {
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
      } catch (error) {
        throw error;
      }
    },
    [isConnected]
  );

  const subscribeToMessages = useCallback(
    (callback: (payload: any) => void) => {
      messageCallbacksRef.current.add(callback);

      return () => {
        messageCallbacksRef.current.delete(callback);
      };
    },
    []
  );

  const markConversationAsSeenLocally = useCallback(
    (conversationId: number) => {
      setConversationUnread((prev) => {
        const prevCount = prev[conversationId] ?? 0;
        if (prevCount === 0) return prev;
        const next = { ...prev, [conversationId]: 0 };
        setChatUnreadTotal((agg) => Math.max(0, agg - prevCount));
        return next;
      });
    },
    []
  );

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
    conversationUnread,
    chatUnreadTotal,
    markConversationAsSeenLocally,
    setCurrentUserId: (id: number | null, type?: "USER" | "EMPLOYER") => {
      currentUserIdRef.current = id ?? null;
      if (type) currentUserTypeRef.current = type;
      else
        currentUserTypeRef.current = location.pathname.startsWith(
          employer_routes.BASE
        )
          ? "EMPLOYER"
          : "USER";
    },
    recordOwnSentMessage: (messageId: number) => {
      try {
        if (!messageId) return;
        ownSentMessageIdsRef.current.add(messageId);

        setTimeout(
          () => {
            ownSentMessageIdsRef.current.delete(messageId);
          },
          2 * 60 * 1000
        );
      } catch (e) {}
    },
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
