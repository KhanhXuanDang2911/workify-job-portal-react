import { useEffect, useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatRelativeTime } from "@/lib/relativeTime";
import { useTranslation } from "@/hooks/useTranslation";
import { chatService } from "@/services/chat.service";
import type { ConversationResponse } from "@/types/chat.type";
import ChatWindow from "@/components/Chat/ChatWindow";
import { useEmployerAuth } from "@/context/EmployerAuth";
import { useWebSocket } from "@/context/WebSocket/WebSocketContext";
import type { MessageResponse } from "@/types/chat.type";

export default function EmployerMessagesPage() {
  const { state: employerState } = useEmployerAuth();

  const { data: conversationsData, isLoading } = useQuery({
    queryKey: ["conversations", "employer"],
    queryFn: async () => {
      const res = await chatService.getEmployerConversations();
      return res.data as ConversationResponse[];
    },
    enabled: true,
  });

  const conversations = conversationsData || [];

  const [selectedConversation, setSelectedConversation] =
    useState<ConversationResponse | null>(null);

  const queryClient = useQueryClient();
  const { subscribeToMessages, conversationUnread } = useWebSocket();
  const processedMessageIdsRef = useRef<Set<number>>(new Set());

  const currentUserId = employerState.employer?.id;
  const currentUserType = "EMPLOYER";
  const { t, currentLanguage } = useTranslation();

  useEffect(() => {
    const unsubscribe = subscribeToMessages((payload: any) => {
      try {
        if (payload?.type === "MESSAGE") {
          const msg: MessageResponse = payload.message;

          if (msg?.id && processedMessageIdsRef.current.has(msg.id)) return;
          if (msg?.id) processedMessageIdsRef.current.add(msg.id);
          const convId = msg.conversationId;

          queryClient.setQueryData(
            ["conversations", "employer"],
            (old: any) => {
              if (!old) return old;
              const list: ConversationResponse[] = Array.isArray(old)
                ? old
                : old.data || [];
              const idx = list.findIndex((c) => c.id === convId);
              const now = msg.createdAt;

              if (idx !== -1) {
                const updated = { ...list[idx] } as any;
                updated.lastMessage = msg.content;
                updated.lastMessageSenderId = msg.senderId;
                updated.lastMessageSenderType = msg.senderType;
                updated.updatedAt = now;

                return list.map((c) => (c.id === convId ? updated : c));
              }

              return list;
            }
          );
        } else if (payload?.type === "SEEN_UPDATE") {
          const convUnread = payload.unread;
          const convId = convUnread?.conversationId;
          if (convId) {
            queryClient.setQueryData(
              ["conversations", "employer"],
              (old: any) => {
                if (!old) return old;
                const list: ConversationResponse[] = Array.isArray(old)
                  ? old
                  : old.data || [];
                const idx = list.findIndex((c) => c.id === convId);
                if (idx !== -1) {
                  return list;
                }
                return list;
              }
            );
          }
        } else {
          const msg: MessageResponse = payload as MessageResponse;

          if (msg?.id && processedMessageIdsRef.current.has(msg.id)) return;
          if (msg?.id) processedMessageIdsRef.current.add(msg.id);
          const convId = msg.conversationId;
          queryClient.setQueryData(
            ["conversations", "employer"],
            (old: any) => {
              if (!old) return old;
              const list: ConversationResponse[] = Array.isArray(old)
                ? old
                : old.data || [];
              const idx = list.findIndex((c) => c.id === convId);
              const now = msg.createdAt;
              if (idx !== -1) {
                const updated = { ...list[idx] } as any;
                updated.lastMessage = msg.content;
                updated.lastMessageSenderId = msg.senderId;
                updated.lastMessageSenderType = msg.senderType;
                updated.updatedAt = now;

                return list.map((c) => (c.id === convId ? updated : c));
              }
              return list;
            }
          );
        }
      } catch (e) {}
    });

    return () => unsubscribe();
  }, [subscribeToMessages, queryClient, selectedConversation?.id]);

  return (
    <div className="main-layout py-8">
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="grid grid-cols-12">
          <div className="col-span-4 border-r min-h-[70vh]">
            <div className="px-4 py-4 border-b">
              <h2 className="font-semibold">{t("messages.employerTitle")}</h2>
            </div>
            <div className="divide-y">
              {isLoading ? (
                <div className="p-4">{t("messages.loading")}</div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-gray-500">
                  {t("messages.noConversations")}
                </div>
              ) : (
                conversations.map((c) => {
                  const relative = formatRelativeTime(c.updatedAt, t);
                  const isActive = selectedConversation?.id === c.id;
                  const unread =
                    c.unreadCount ?? conversationUnread?.[c.id] ?? 0;
                  const isOwnLastMessage =
                    c.lastMessageSenderId &&
                    c.lastMessageSenderType &&
                    c.lastMessageSenderId === currentUserId &&
                    c.lastMessageSenderType === currentUserType;
                  const shouldBold = !!unread && !isOwnLastMessage;
                  const prefix = isOwnLastMessage
                    ? currentLanguage === "en"
                      ? "You: "
                      : "Bạn: "
                    : "";
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedConversation(c);

                        queryClient.setQueryData(
                          ["activeConversation", "employer"],
                          c.id
                        );
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${isActive ? "bg-blue-50" : "hover:bg-gray-50"}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {c.jobSeekerAvatar ? (
                          <img src={c.jobSeekerAvatar} alt={c.jobSeekerName} />
                        ) : (
                          <span className="text-sm font-semibold text-gray-600">
                            {c.jobSeekerName?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="min-w-0">
                            <p
                              className={`text-sm ${shouldBold ? "font-semibold" : "font-medium"} truncate`}
                            >
                              {c.jobSeekerName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {c.jobTitle}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-400 ml-2">
                              {relative}
                            </p>
                            {/* unread badge removed by request */}
                          </div>
                        </div>
                        <p
                          className={`text-xs truncate mt-1 ${shouldBold ? "text-gray-900 font-semibold" : "text-gray-500"}`}
                        >
                          {prefix}
                          {c.lastMessage || "-"}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
          <div className="col-span-8 min-h-[70vh]">
            {selectedConversation ? (
              <div className="h-[70vh]">
                <ChatWindow
                  conversation={selectedConversation}
                  currentUserId={currentUserId}
                  currentUserType={currentUserType as "USER" | "EMPLOYER"}
                />
              </div>
            ) : (
              <div className="p-6 text-gray-500">
                {t("messages.selectConversation")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
