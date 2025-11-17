import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isToday, isYesterday } from "date-fns";
import { vi } from "date-fns/locale";
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
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<ConversationResponse | null>(
    initialConversation
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { subscribeToMessages } = useWebSocket();
  const queryClient = useQueryClient();

  // Fetch conversation by applicationId if not provided
  const { data: conversationData } = useQuery({
    queryKey: ["conversation", applicationId],
    queryFn: () => chatService.getConversationByApplicationId(applicationId!),
    enabled: open && !conversation && !!applicationId,
    staleTime: 0, // Always fetch fresh conversation data
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
        if (
          newMessage.senderId !== currentUserId ||
          newMessage.senderType !== currentUserType
        ) {
          chatService.markAsSeen(conversation.id).catch(() => {});
        }
      }
    });

    return () => unsubscribe();
  }, [
    open,
    conversation?.id,
    subscribeToMessages,
    queryClient,
    currentUserId,
    currentUserType,
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
      chatService.markAsSeen(conversation.id).catch(() => {});
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
    onSuccess: () => {
      setMessage("");
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
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, "HH:mm");
    } else if (isYesterday(date)) {
      return `${t("chatModal.yesterday")} ${format(date, "HH:mm")}`;
    } else {
      return format(date, "dd/MM/yyyy HH:mm", { locale: vi });
    }
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
      <DialogContent className="flex flex-col h-[80vh] max-w-2xl p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={otherParty?.avatar || undefined} />
              <AvatarFallback>
                {otherParty?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-lg font-semibold">
                {otherParty?.name || t("chatModal.title")}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {conversation.jobTitle}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea ref={scrollAreaRef} className="h-full px-4 py-4">
            {isLoadingMessages ? (
              <div className="flex items-center justify-center h-full min-h-[200px]">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                <p className="text-muted-foreground mb-2">
                  {t("chatModal.noMessages")}
                </p>
                {!canSendMessage && currentUserType === "USER" && (
                  <p className="text-sm text-muted-foreground">
                    {t("chatModal.cannotSendUntilEmployerMessage")}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-1 pb-4">
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
                        "flex gap-2 items-start",
                        isCurrentUser ? "flex-row-reverse" : "flex-row",
                        !showAvatar && "mt-0.5"
                      )}
                    >
                      {/* Avatar or placeholder for other user */}
                      <div className="w-8 shrink-0 flex items-end pb-0.5">
                        {!isCurrentUser && showAvatar && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={msg.senderAvatar || undefined} />
                            <AvatarFallback>
                              {msg.senderName?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>

                      <div
                        className={cn(
                          "flex flex-col max-w-[70%] group",
                          isCurrentUser ? "items-end" : "items-start"
                        )}
                      >
                        <div
                          className={cn(
                            "rounded-2xl px-3 py-2 break-words relative",
                            isCurrentUser
                              ? "bg-[#1967d2] text-white"
                              : "bg-muted text-foreground"
                          )}
                          title={msg.senderName}
                        >
                          <p className="text-sm whitespace-pre-wrap">
                            {msg.content}
                          </p>
                        </div>
                        {showTime && (
                          <p className="text-xs text-muted-foreground mt-1 px-3">
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

        <div className="border-t px-4 py-3">
          {!canSendMessage && currentUserType === "USER" && (
            <p className="text-xs text-muted-foreground mb-2 text-center">
              {t("chatModal.cannotSendUntilEmployerMessage")}
            </p>
          )}
          <div className="flex gap-2 items-end">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                canSendMessage
                  ? t("chatModal.placeholderCanSend")
                  : t("chatModal.placeholderWaiting")
              }
              disabled={!canSendMessage || sendMessageMutation.isPending}
              className="min-h-[60px] max-h-[120px] resize-none"
              rows={2}
            />
            <Button
              onClick={handleSendMessage}
              disabled={
                !message.trim() ||
                !canSendMessage ||
                sendMessageMutation.isPending
              }
              size="icon"
              className="shrink-0 h-[60px] w-[60px]"
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
