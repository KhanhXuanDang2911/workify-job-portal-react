import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vi } from "date-fns/locale";
import { enUS } from "date-fns/locale";
import { formatRelativeTime } from "@/lib/relativeTime";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { chatService } from "@/services/chat.service";
import { useWebSocket } from "@/context/websocket/WebSocketContext";
import type { ConversationResponse, MessageResponse } from "@/types/chat.type";
import { Send, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useTranslation } from "@/hooks/useTranslation";

interface ChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversation: ConversationResponse | null;
  applicationId?: number;
  currentUserId?: number;
  currentUserType?: "USER" | "EMPLOYER";
}

export default function ChatModal({
  open,
  onOpenChange,
  conversation: initialConversation,
  applicationId,
  currentUserId,
  currentUserType,
}: ChatModalProps) {
  const { t, currentLanguage } = useTranslation();
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<ConversationResponse | null>(
    initialConversation
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const {
    subscribeToMessages,
    markConversationAsSeenLocally,
    recordOwnSentMessage,
  } = useWebSocket();
  const queryClient = useQueryClient();

  // Fetch conversation by applicationId if not provided
  const { data: conversationData } = useQuery({
    queryKey: ["conversation", applicationId],
    queryFn: () => chatService.getConversationByApplicationId(applicationId!),
    enabled: open && !conversation && !!applicationId,
    staleTime: 0,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (initialConversation) {
      setConversation(initialConversation);
    }
  }, [initialConversation]);

  useEffect(() => {
    if (conversationData?.data) {
      setConversation(conversationData.data);
    }
  }, [conversationData]);

  useEffect(() => {
    if (!open) {
      setConversation(null);
      setMessage("");
    }
  }, [open]);

  // Fetch messages
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
    enabled: open && !!conversation?.id,
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
    if (!open || !conversation?.id) return;

    const unsubscribe = subscribeToMessages((newMessage: MessageResponse) => {
      if (newMessage.conversationId === conversation.id) {
        queryClient.setQueryData<{ data: MessageResponse[] }>(
          ["messages", conversation.id],
          (old) => {
            if (!old) return { data: [newMessage] };
            const exists = old.data.some((msg) => msg.id === newMessage.id);
            if (exists) return old;
            return { data: [...old.data, newMessage] };
          }
        );

        // If employer sends first message and user is viewing, update conversation state
        if (
          currentUserType === "USER" &&
          newMessage.senderType === "EMPLOYER" &&
          !conversation.hasEmployerMessage
        ) {
          // Update local state immediately for better UX
          setConversation((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              hasEmployerMessage: true,
            };
          });
          // Invalidate conversation query to sync with backend
          if (applicationId) {
            queryClient.invalidateQueries({
              queryKey: ["conversation", applicationId],
            });
          }
        }

        // Do not auto mark as seen here — we'll mark as seen when the user focuses the input.
      }
    });

    return () => unsubscribe();
  }, [
    open,
    conversation?.id,
    conversation?.hasEmployerMessage,
    subscribeToMessages,
    queryClient,
    currentUserId,
    currentUserType,
    applicationId,
  ]);

  // Scroll to bottom when messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [messages.length]);

  useEffect(() => {
    if (open && conversation?.id) {
      refetchMessages();
      // Do not mark as seen on open. Marking will happen when input is focused.
    }
  }, [open, conversation?.id, refetchMessages]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!conversation?.id) throw new Error("No conversation selected");
      return chatService.sendMessage({
        conversationId: conversation.id,
        content,
      });
    },
    onSuccess: (res: any) => {
      setMessage("");
      try {
        const msg: MessageResponse = res?.data ?? res;
        if (!msg) return;

        // Update messages cache so sender sees the message immediately
        queryClient.setQueryData<{ data: MessageResponse[] }>(
          ["messages", conversation!.id],
          (old) => {
            if (!old) return { data: [msg] };
            const exists = old.data.some((m) => m.id === msg.id);
            if (exists) return old;
            return { data: [...old.data, msg] };
          }
        );

        // Record this message id so when the websocket echoes it back we don't
        // mark it as unread or show transient notifications for the sender.
        try {
          if (msg?.id && typeof recordOwnSentMessage === "function") {
            recordOwnSentMessage(msg.id);
          }
        } catch (e) {
          // ignore
        }

        // Update conversations list so preview shows lastMessage immediately
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

        // keep focus in the input so user can continue typing
        try {
          const focusChatInput = () => {
            const el = document.querySelector(
              'textarea[data-chat-input="true"]'
            ) as HTMLTextAreaElement | null;
            const inputEl =
              el || (document.activeElement as HTMLTextAreaElement | null);
            if (inputEl) {
              try {
                inputEl.focus();
                const len = inputEl.value?.length ?? 0;
                try {
                  inputEl.setSelectionRange(len, len);
                } catch (e) {
                  // ignore
                }
              } catch (e) {
                // ignore
              }
            }
          };

          // Try immediate focus
          focusChatInput();
          // Fallback: focus again after a short delay to handle re-renders/UI focus steals
          setTimeout(focusChatInput, 50);
        } catch (e) {
          // ignore
        }
      } catch (e) {
        // ignore
      }
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

    // Always use REST API to save message to database
    // Backend will automatically broadcast the message via WebSocket to other clients
    // This ensures message is saved in database AND delivered in real-time
    sendMessageMutation.mutate(trimmedMessage);
  }, [message, canSendMessage, sendMessageMutation]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (dateString: string) => {
    const locale = currentLanguage === "vi" ? vi : enUS;
    return formatRelativeTime(dateString, t);
  };

  const getOtherPartyInfo = () => {
    if (!conversation) return null;
    if (currentUserType === "EMPLOYER") {
      return {
        name: conversation.jobSeekerName,
        avatar: conversation.jobSeekerAvatar,
      };
    } else {
      return {
        name: conversation.employerName,
        avatar: conversation.employerAvatar,
      };
    }
  };

  const otherParty = getOtherPartyInfo();

  if (!conversation) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col h-[85vh] max-w-2xl p-0 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-blue-200 dark:ring-blue-800 shadow-md transition-transform hover:scale-105">
              <AvatarImage src={otherParty?.avatar || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                {otherParty?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                {otherParty?.name || t("chatModal.title")}
              </DialogTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {conversation.jobTitle}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
          <ScrollArea ref={scrollAreaRef} className="h-full px-4 py-6">
            {isLoadingMessages ? (
              <div className="flex items-center justify-center h-full min-h-[200px]">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <p className="text-sm text-muted-foreground animate-pulse">
                    {t("chatModal.loading") || "Đang tải tin nhắn..."}
                  </p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center animate-in fade-in-0 duration-500">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center mb-4">
                  <svg
                    className="w-10 h-10 text-blue-500 dark:text-blue-400"
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
                <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">
                  {t("chatModal.noMessages")}
                </p>
                {!canSendMessage && currentUserType === "USER" && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 max-w-md">
                    {t("chatModal.cannotSendUntilEmployerMessage")}
                  </p>
                )}
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

                  // Check if time difference is more than 1 minute
                  const showTime =
                    index === messages.length - 1 ||
                    messages[index + 1].senderId !== msg.senderId ||
                    messages[index + 1].senderType !== msg.senderType ||
                    (index < messages.length - 1 &&
                      messages[index + 1].senderId === msg.senderId &&
                      messages[index + 1].senderType === msg.senderType &&
                      new Date(messages[index + 1].createdAt).getTime() -
                        new Date(msg.createdAt).getTime() >
                        60000); // 1 minute in milliseconds

                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex gap-3 items-start animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
                        isCurrentUser ? "flex-row-reverse" : "flex-row",
                        !showAvatar && "mt-1"
                      )}
                    >
                      {/* Avatar or placeholder for other user */}
                      <div className="w-10 shrink-0 flex items-end pb-1">
                        {!isCurrentUser && showAvatar && (
                          <Avatar className="h-10 w-10 ring-2 ring-gray-200 dark:ring-gray-700 shadow-sm">
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
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-1 font-medium">
                            {msg.senderName}
                          </p>
                        )}
                        <div
                          className={cn(
                            "rounded-2xl px-4 py-2.5 break-words relative shadow-sm transition-all duration-200",
                            "hover:shadow-md",
                            isCurrentUser
                              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                              : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                          )}
                          title={msg.senderName}
                        >
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">
                            {msg.content}
                          </p>
                        </div>
                        {showTime && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 px-2">
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

        <div className="border-t bg-white dark:bg-gray-900 px-4 py-4 shadow-lg">
          {!canSendMessage && currentUserType === "USER" && (
            <div className="mb-3 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-xs text-amber-700 dark:text-amber-400 text-center flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                {t("chatModal.cannotSendUntilEmployerMessage")}
              </p>
            </div>
          )}
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                value={message}
                data-chat-input={"true"}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                onFocus={() => {
                  const side =
                    currentUserType === "EMPLOYER" ? "employer" : "user";
                  // mark this conversation as focused (for other components)
                  queryClient.setQueryData(
                    ["focusedConversation", side],
                    conversation?.id
                  );

                  // Optimistically clear local unread state for snappy UX,
                  // then call server to persist (server will emit SEEN_UPDATE to reconcile).
                  if (conversation?.id) {
                    try {
                      markConversationAsSeenLocally(conversation.id);
                    } catch (e) {
                      // ignore
                    }
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
                  if (focused === conversation?.id) {
                    queryClient.setQueryData(
                      ["focusedConversation", side],
                      undefined
                    );
                  }
                }}
                placeholder={
                  canSendMessage
                    ? t("chatModal.placeholderCanSend")
                    : t("chatModal.placeholderWaiting")
                }
                disabled={!canSendMessage || sendMessageMutation.isPending}
                className={cn(
                  "min-h-[64px] max-h-[140px] resize-none pr-12",
                  "border-2 transition-all duration-200",
                  "focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800",
                  !canSendMessage &&
                    "bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
                )}
                rows={2}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              onMouseDown={(e) => e.preventDefault()}
              onTouchStart={(e) => e.preventDefault()}
              disabled={
                !message.trim() ||
                !canSendMessage ||
                sendMessageMutation.isPending
              }
              size="icon"
              className={cn(
                "shrink-0 h-[64px] w-[64px] rounded-xl",
                "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
                "text-white shadow-lg hover:shadow-xl",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg",
                "hover:scale-105 active:scale-95"
              )}
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
