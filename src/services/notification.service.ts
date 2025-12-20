import userHttp from "@/lib/userHttp";
import employerHttp from "@/lib/employerHttp";
import type { ApiResponse, PageResponse, SearchParams } from "@/types";
import type { NotificationResponse } from "@/types/notification.type";

const getHttpClient = () => {
  if (typeof window !== "undefined") {
    const pathname = window.location.pathname;
    if (pathname.startsWith("/employer")) {
      return employerHttp;
    }
  }
  return userHttp;
};

export const notificationService = {
  getNotifications: async (
    params?: SearchParams
  ): Promise<ApiResponse<PageResponse<NotificationResponse>>> => {
    const http = getHttpClient();
    const response = await http.get<
      ApiResponse<PageResponse<NotificationResponse>>
    >("/notifications", { params });
    return response.data;
  },

  markAsRead: async (id: number): Promise<ApiResponse<void>> => {
    const http = getHttpClient();
    const response = await http.post<ApiResponse<void>>(
      `/notifications/${id}/read`
    );
    return response.data;
  },

  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    const http = getHttpClient();
    const response = await http.post<ApiResponse<void>>(
      "/notifications/read-all"
    );
    return response.data;
  },

  getUnreadCount: async (): Promise<ApiResponse<number>> => {
    const http = getHttpClient();
    const response = await http.get<ApiResponse<number>>(
      "/notifications/unread-count"
    );
    return response.data;
  },
};
