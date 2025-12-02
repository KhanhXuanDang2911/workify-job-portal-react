import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// date helpers available in `formatRelativeTime`
import { formatRelativeTime } from "@/lib/relativeTime";
import { useTranslation } from "@/hooks/useTranslation";
import { chatService } from "@/services/chat.service";
import type { ConversationResponse } from "@/types/chat.type";
import ChatWindow from "@/components/Chat/ChatWindow";
import { useUserAuth } from "@/context/user-auth";
import { useEmployerAuth } from "@/context/employer-auth";
import { employer_routes } from "@/routes/routes.const";
import { useWebSocket } from "@/context/websocket/WebSocketContext";
import type { MessageResponse } from "@/types/chat.type";

export default function MessagesPage() {
  const location = useLocation();
  const isEmployerRoute = location.pathname.startsWith(employer_routes.BASE);
  const { state: userState } = useUserAuth();
  const { state: employerState } = useEmployerAuth();

  const { data: conversationsData, isLoading } = useQuery({
    queryKey: ["conversations", isEmployerRoute ? "employer" : "user"],
    queryFn: async () => {
      if (isEmployerRoute) {
        const res = await chatService.getEmployerConversations();
        return res.data as ConversationResponse[];
      }
      const res = await chatService.getUserConversations();
      return res.data as ConversationResponse[];
    },
    enabled: true,
  });

  const conversations = conversationsData || [];

  const queryClient = useQueryClient();
  const { subscribeToMessages, conversationUnread } = useWebSocket();

  // Note: per-conversation unread counts and header aggregate are not
  // maintained locally. UI will not display per-conversation unread numbers.

  const [selectedConversation, setSelectedConversation] =
    useState<ConversationResponse | null>(null);

  const processedMessageIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const unsubscribe = subscribeToMessages((payload: any) => {
      // payload may be envelope { type: 'MESSAGE', message, unread } or raw MessageResponse
      try {
        if (payload?.type === "MESSAGE") {
          const msg: MessageResponse = payload.message;
          // ignore duplicate message events
          if (msg?.id && processedMessageIdsRef.current.has(msg.id)) return;
          if (msg?.id) processedMessageIdsRef.current.add(msg.id);
          const convId = msg.conversationId;

          queryClient.setQueryData(
            ["conversations", isEmployerRoute ? "employer" : "user"],
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
          // header aggregate not updated here
        } else if (payload?.type === "SEEN_UPDATE") {
          // payload.unread contains conversation-level unread for each side
          const convUnread = payload.unread;
          const convId = convUnread?.conversationId;
          // do not update per-conversation unread counts locally
          if (convId) {
            // intentionally no-op for unread bookkeeping
          }
        } else {
          // assume raw MessageResponse
          const msg: MessageResponse = payload as MessageResponse;
          // ignore duplicate message events
          if (msg?.id && processedMessageIdsRef.current.has(msg.id)) return;
          if (msg?.id) processedMessageIdsRef.current.add(msg.id);
          const convId = msg.conversationId;
          queryClient.setQueryData(
            ["conversations", isEmployerRoute ? "employer" : "user"],
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
          // header aggregate not updated here
        }
      } catch (e) {
        // swallow parse errors
        console.error("ws message handler error", e);
      }
    });

    return () => unsubscribe();
  }, [
    subscribeToMessages,
    queryClient,
    isEmployerRoute,
    selectedConversation?.id,
  ]);

  const currentUserId = isEmployerRoute
    ? employerState.employer?.id
    : userState.user?.id;

  const currentUserType = isEmployerRoute ? "EMPLOYER" : "USER";

  const { t, currentLanguage } = useTranslation();

  return (
    <div className="main-layout py-8">
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="grid grid-cols-12">
          <div className="col-span-4 border-r min-h-[70vh]">
            <div className="px-4 py-4 border-b">
              <h2 className="font-semibold">{t("messages.title")}</h2>
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
                  // Bold only when there's unread AND the last message is not sent by current user
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
                        // record active conversation globally so header can avoid incrementing totals
                        queryClient.setQueryData(
                          [
                            "activeConversation",
                            isEmployerRoute ? "employer" : "user",
                          ],
                          c.id
                        );

                        // Do NOT mark as read here. Marking will occur when the user focuses the
                        // input inside the conversation (matches Facebook UX). We only open the
                        // conversation and expose the activeConversation id for header logic.
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${isActive ? "bg-blue-50" : "hover:bg-gray-50"}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {isEmployerRoute ? (
                          c.jobSeekerAvatar ? (
                            <img
                              src={c.jobSeekerAvatar}
                              alt={c.jobSeekerName}
                            />
                          ) : (
                            <span className="text-sm font-semibold text-gray-600">
                              {c.jobSeekerName?.charAt(0)}
                            </span>
                          )
                        ) : c.employerAvatar ? (
                          <img src={c.employerAvatar} alt={c.employerName} />
                        ) : (
                          <span className="text-sm font-semibold text-gray-600">
                            {c.employerName?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="min-w-0">
                            <p
                              className={`text-sm ${shouldBold ? "font-semibold" : "font-medium"} truncate`}
                            >
                              {isEmployerRoute
                                ? c.jobSeekerName
                                : c.employerName}
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
