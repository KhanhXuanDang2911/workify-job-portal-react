import userHttp from "@/lib/userHttp";
import employerHttp from "@/lib/employerHttp";
import type { ApiResponse } from "@/types";
import type {
  ConversationResponse,
  MessageResponse,
  SendMessageRequest,
} from "@/types/chat.type";

const getHttpClient = () => {
  if (typeof window !== "undefined") {
    const pathname = window.location.pathname;
    if (pathname.startsWith("/employer")) {
      return employerHttp;
    }
  }
  return userHttp;
};

export const chatService = {
  getEmployerConversations: async (): Promise<
    ApiResponse<ConversationResponse[]>
  > => {
    const response =
      await employerHttp.get<ApiResponse<ConversationResponse[]>>(
        "/conversations"
      );
    return response.data;
  },

  getUserConversations: async (): Promise<
    ApiResponse<ConversationResponse[]>
  > => {
    const response =
      await userHttp.get<ApiResponse<ConversationResponse[]>>("/conversations");
    return response.data;
  },

  getConversationByApplicationId: async (
    applicationId: number
  ): Promise<ApiResponse<ConversationResponse>> => {
    const http = getHttpClient();
    const response = await http.get<ApiResponse<ConversationResponse>>(
      `/conversations/application/${applicationId}`
    );
    return response.data;
  },

  getMessages: async (
    conversationId: number
  ): Promise<ApiResponse<MessageResponse[]>> => {
    const http = getHttpClient();
    const response = await http.get<ApiResponse<MessageResponse[]>>(
      `/messages/${conversationId}`
    );
    return response.data;
  },

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

  markAsSeen: async (conversationId: number): Promise<ApiResponse<void>> => {
    const http = getHttpClient();
    const response = await http.put<ApiResponse<void>>(
      `/messages/${conversationId}/seen`
    );
    return response.data;
  },

  getUnreadCount: async (): Promise<ApiResponse<{ totalUnread: number }>> => {
    const http = getHttpClient();
    const response = await http.get<ApiResponse<{ totalUnread: number }>>(
      `/messages/unread-count`
    );
    return response.data;
  },
};
