import userHttp from "@/lib/userHttp";
import employerHttp from "@/lib/employerHttp";
import type { ApiResponse } from "@/types";
import type {
  ConversationResponse,
  MessageResponse,
  SendMessageRequest,
} from "@/types/chat.type";

// Helper to get the appropriate HTTP client based on current route
const getHttpClient = () => {
  // Check if we're on employer route
  if (typeof window !== "undefined") {
    const pathname = window.location.pathname;
    if (pathname.startsWith("/employer")) {
      return employerHttp;
    }
  }
  return userHttp;
};

export const chatService = {
  // Get conversations for employer
  getEmployerConversations: async (): Promise<
    ApiResponse<ConversationResponse[]>
  > => {
    const response =
      await employerHttp.get<ApiResponse<ConversationResponse[]>>(
        "/conversations"
      );
    return response.data;
  },

  // Get conversations for user
  getUserConversations: async (): Promise<
    ApiResponse<ConversationResponse[]>
  > => {
    const response =
      await userHttp.get<ApiResponse<ConversationResponse[]>>("/conversations");
    return response.data;
  },

  // Get conversation by application ID
  getConversationByApplicationId: async (
    applicationId: number
  ): Promise<ApiResponse<ConversationResponse>> => {
    const http = getHttpClient();
    const response = await http.get<ApiResponse<ConversationResponse>>(
      `/conversations/application/${applicationId}`
    );
    return response.data;
  },

  // Get messages by conversation ID
  getMessages: async (
    conversationId: number
  ): Promise<ApiResponse<MessageResponse[]>> => {
    const http = getHttpClient();
    const response = await http.get<ApiResponse<MessageResponse[]>>(
      `/messages/${conversationId}`
    );
    return response.data;
  },

  // Send message
  sendMessage: async (
    data: SendMessageRequest
  ): Promise<ApiResponse<MessageResponse>> => {
    const http = getHttpClient();
    const response = await http.post<ApiResponse<MessageResponse>>(
      "/messages",
      data
    );
    return response.data;
  },

  // Mark messages as seen
  markAsSeen: async (conversationId: number): Promise<ApiResponse<void>> => {
    const http = getHttpClient();
    const response = await http.put<ApiResponse<void>>(
      `/messages/${conversationId}/seen`
    );
    return response.data;
  },
  // Get total unread count for current user
  getUnreadCount: async (): Promise<ApiResponse<{ totalUnread: number }>> => {
    const http = getHttpClient();
    const response = await http.get<ApiResponse<{ totalUnread: number }>>(
      `/messages/unread-count`
    );
    return response.data;
  },
};
