import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { formatRelativeTime } from "@/lib/relativeTime";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { chatService } from "@/services/chat.service";
import { useWebSocket } from "@/context/WebSocket/WebSocketContext";
import type { ConversationResponse, MessageResponse } from "@/types/chat.type";
import { Send, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useTranslation } from "@/hooks/useTranslation";

interface ChatWindowProps {
  conversation: ConversationResponse | null;
  applicationId?: number;
  currentUserId?: number;
  currentUserType?: "USER" | "EMPLOYER";
}

export default function ChatWindow({
  conversation: initialConversation,
  applicationId,
  currentUserId,
  currentUserType,
}: ChatWindowProps) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<ConversationResponse | null>(
    initialConversation
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const {
    subscribeToMessages,
    markConversationAsSeenLocally,
    recordOwnSentMessage,
  } = useWebSocket();
  const queryClient = useQueryClient();
  const processedMessageIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (initialConversation) setConversation(initialConversation);
  }, [initialConversation]);

  useEffect(() => {
    if (conversation?.id && inputRef.current) {
      inputRef.current.focus();

      const side = currentUserType === "EMPLOYER" ? "employer" : "user";
      queryClient.setQueryData(["focusedConversation", side], conversation.id);

      if (conversation?.id) {
        try {
          markConversationAsSeenLocally(conversation.id);
        } catch (e) {}
        chatService.markAsSeen(conversation.id).catch(() => {});
      }
    }
  }, [conversation?.id]);

  useEffect(() => {
    if (applicationId && !conversation) {
      chatService
        .getConversationByApplicationId(applicationId)
        .then((res) => {
          if (res?.data) setConversation(res.data);
        })
        .catch(() => {});
    }
  }, [applicationId]);

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["messages", conversation?.id],
    queryFn: async () => {
      if (!conversation?.id) throw new Error("No conversation ID");
      return await chatService.getMessages(conversation.id);
    },
    enabled: !!conversation?.id,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });

  const messages = useMemo(
    () => messagesData?.data || [],
    [messagesData?.data]
  );

  const canSendMessage =
    currentUserType === "EMPLOYER" ||
    (currentUserType === "USER" && conversation?.hasEmployerMessage);

  useEffect(() => {
    if (!conversation?.id) return;

    const unsubscribe = subscribeToMessages((payload: any) => {
      let newMessage: MessageResponse | undefined;
      try {
        if (payload?.type === "MESSAGE")
          newMessage = payload.message as MessageResponse;
        else newMessage = payload as MessageResponse;
      } catch (e) {
        return;
      }

      if (!newMessage) return;

      if (newMessage.id && processedMessageIdsRef.current.has(newMessage.id))
        return;
      if (newMessage.id) processedMessageIdsRef.current.add(newMessage.id);

      if (newMessage.conversationId === conversation.id) {
        queryClient.setQueryData<{ data: MessageResponse[] }>(
          ["messages", conversation.id],
          (old) => {
            if (!old) return { data: [newMessage!] };
            const exists = old.data.some((msg) => msg.id === newMessage!.id);
            if (exists) return old;
            return { data: [...old.data, newMessage!] };
          }
        );

        setConversation((prev) => {
          if (
            currentUserType === "USER" &&
            newMessage!.senderType === "EMPLOYER" &&
            prev &&
            !prev.hasEmployerMessage
          ) {
            if (prev.applicationId) {
              queryClient.invalidateQueries({
                queryKey: ["conversation", prev.applicationId],
              });
            }
            return {
              ...prev,
              hasEmployerMessage: true,
            } as ConversationResponse;
          }
          return prev;
        });

        try {
          const side = currentUserType === "EMPLOYER" ? "employer" : "user";
          const focusedConvId = queryClient.getQueryData([
            "focusedConversation",
            side,
          ]) as number | undefined;
          const inputFocused =
            inputRef.current && document.activeElement === inputRef.current;
          if (
            focusedConvId === conversation.id &&
            inputFocused &&
            conversation.id
          ) {
            try {
              markConversationAsSeenLocally(conversation.id);
            } catch (e) {}
            chatService.markAsSeen(conversation.id).catch(() => {});
          }
        } catch (e) {}
      }

      if (
        newMessage.conversationId &&
        newMessage.conversationId !== conversation.id
      ) {
        const msg = newMessage;
        const convId = msg.conversationId;

        queryClient.setQueryData(
          [
            "conversations",
            currentUserType === "EMPLOYER" ? "employer" : "user",
          ],
          (old: any) => {
            if (!old) return old;
            const list: ConversationResponse[] = Array.isArray(old)
              ? old
              : old.data || [];
            const idx = list.findIndex((c) => c.id === convId);
            if (idx !== -1) {
              const updated = { ...list[idx] } as any;
              updated.lastMessage = msg.content;
              updated.lastMessageSenderId = msg.senderId;
              updated.lastMessageSenderType = msg.senderType;
              updated.updatedAt = msg.createdAt;

              return list.map((c) => (c.id === convId ? updated : c));
            }
            return list;
          }
        );
      }
    });

    return () => unsubscribe();
  }, [conversation?.id, subscribeToMessages, queryClient, currentUserType]);

  useEffect(() => {
    if (conversation?.id) refetchMessages();
  }, [conversation?.id, refetchMessages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (messagesEndRef.current)
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages.length]);

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return chatService.sendMessage({
        conversationId: conversation!.id,
        content,
      });
    },
    onSuccess: (res: any) => {
      setMessage("");
      try {
        const msg: MessageResponse = res?.data ?? res;
        if (!msg) return;

        queryClient.setQueryData<{ data: MessageResponse[] }>(
          ["messages", conversation!.id],
          (old) => {
            if (!old) return { data: [msg] };
            const exists = old.data.some((m) => m.id === msg.id);
            if (exists) return old;
            return { data: [...old.data, msg] };
          }
        );

        queryClient.setQueryData(
          [
            "conversations",
            currentUserType === "EMPLOYER" ? "employer" : "user",
          ],
          (old: any) => {
            if (!old) return old;
            const list: any[] = Array.isArray(old) ? old : old.data || [];
            const idx = list.findIndex((c) => c.id === conversation!.id);
            if (idx !== -1) {
              const updated = { ...list[idx] } as any;
              updated.lastMessage = msg.content;
              updated.lastMessageSenderId = msg.senderId;
              updated.lastMessageSenderType = msg.senderType;
              updated.updatedAt = msg.createdAt;
              return list.map((c) => (c.id === conversation!.id ? updated : c));
            }
            return list;
          }
        );
        try {
          if (msg?.id && typeof recordOwnSentMessage === "function") {
            recordOwnSentMessage(msg.id);
          }
        } catch (e) {}

        try {
          const el = inputRef.current;
          if (el) {
            el.focus();
            const len = el.value?.length ?? 0;
            el.setSelectionRange(len, len);
          }
        } catch (e) {}
      } catch (e) {}
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || t("chatModal.errorSendingMessage");
      toast.error(errorMessage);
    },
  });

  const handleSendMessage = useCallback(() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !canSendMessage) return;
    sendMessageMutation.mutate(trimmedMessage);
  }, [message, canSendMessage, sendMessageMutation]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (dateString: string) =>
    formatRelativeTime(dateString, t);

  const getOtherPartyInfo = () => {
    if (!conversation) return null;
    if (currentUserType === "EMPLOYER")
      return {
        name: conversation.jobSeekerName,
        avatar: conversation.jobSeekerAvatar,
      };
    return {
      name: conversation.employerName,
      avatar: conversation.employerAvatar,
    };
  };

  const otherParty = getOtherPartyInfo();

  if (!conversation) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 ring-2 ring-blue-200 shadow-md">
            <AvatarImage src={otherParty?.avatar || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
              {otherParty?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold text-gray-900 truncate">
              {otherParty?.name}
            </p>
            <p className="text-sm text-gray-600 truncate">
              {conversation.jobTitle}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <ScrollArea ref={scrollAreaRef as any} className="h-full px-4 py-6">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="text-sm text-muted-foreground">
                  {t("chatModal.loading")}
                </p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-2 font-medium">
                {t("chatModal.noMessages")}
              </p>
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {messages.map((msg, index) => {
                const isCurrentUser =
                  msg.senderId === currentUserId &&
                  msg.senderType === currentUserType;
                const showAvatar =
                  index === 0 ||
                  messages[index - 1].senderId !== msg.senderId ||
                  messages[index - 1].senderType !== msg.senderType;

                const showTime =
                  index === messages.length - 1 ||
                  messages[index + 1].senderId !== msg.senderId ||
                  messages[index + 1].senderType !== msg.senderType ||
                  (index < messages.length - 1 &&
                    messages[index + 1].senderId === msg.senderId &&
                    messages[index + 1].senderType === msg.senderType &&
                    new Date(messages[index + 1].createdAt).getTime() -
                      new Date(msg.createdAt).getTime() >
                      60000);

                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3 items-start",
                      isCurrentUser ? "flex-row-reverse" : "flex-row",
                      !showAvatar && "mt-1"
                    )}
                  >
                    <div className="w-10 shrink-0 flex items-end pb-1">
                      {!isCurrentUser && showAvatar && (
                        <Avatar className="h-10 w-10 ring-2 ring-gray-200 shadow-sm">
                          <AvatarImage src={msg.senderAvatar || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white text-xs font-semibold">
                            {msg.senderName?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>

                    <div
                      className={cn(
                        "flex flex-col max-w-[75%] group",
                        isCurrentUser ? "items-end" : "items-start"
                      )}
                    >
                      {showAvatar && !isCurrentUser && (
                        <p className="text-xs text-gray-500 mb-1 px-1 font-medium">
                          {msg.senderName}
                        </p>
                      )}
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2.5 break-words relative shadow-sm transition-all duration-200 hover:shadow-md",
                          isCurrentUser
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                            : "bg-white text-gray-900 border border-gray-200"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {msg.content}
                        </p>
                      </div>
                      {showTime && (
                        <p className="text-xs text-gray-400 mt-1.5 px-2">
                          {formatMessageTime(msg.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="border-t bg-white px-4 py-4 shadow-lg">
        {!canSendMessage && currentUserType === "USER" && (
          <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700 text-center">
              {t("chatModal.cannotSendUntilEmployerMessage")}
            </p>
          </div>
        )}
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <Textarea
              ref={inputRef}
              value={message}
              onChange={(e) =>
                setMessage((e.target as HTMLTextAreaElement).value)
              }
              onFocus={() => {
                const side =
                  currentUserType === "EMPLOYER" ? "employer" : "user";
                queryClient.setQueryData(
                  ["focusedConversation", side],
                  conversation.id
                );

                if (conversation?.id) {
                  try {
                    markConversationAsSeenLocally(conversation.id);
                  } catch (e) {}
                  chatService.markAsSeen(conversation.id).catch(() => {});
                }
              }}
              onBlur={() => {
                const side =
                  currentUserType === "EMPLOYER" ? "employer" : "user";
                const focused = queryClient.getQueryData([
                  "focusedConversation",
                  side,
                ]);
                if (focused === conversation.id)
                  queryClient.setQueryData(
                    ["focusedConversation", side],
                    undefined
                  );
              }}
              onKeyDown={handleKeyPress}
              placeholder={
                canSendMessage
                  ? t("chatModal.placeholderCanSend")
                  : t("chatModal.placeholderWaiting")
              }
              disabled={!canSendMessage}
              className={cn(
                "min-h-[64px] max-h-[140px] resize-none pr-12 border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
                !canSendMessage && "bg-gray-50 cursor-not-allowed"
              )}
              rows={2}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            onMouseDown={(e) => e.preventDefault()}
            disabled={
              !message.trim() ||
              !canSendMessage ||
              sendMessageMutation.isPending
            }
            size="icon"
            className="shrink-0 h-[64px] w-[64px] rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
