import userHttp from "@/lib/userHttp";
import employerHttp from "@/lib/employerHttp";
import type { ApiResponse, PageResponse, SearchParams } from "@/types";
import type { NotificationResponse } from "@/types/notification.type";

// Helper to get the appropriate HTTP client based on current route
// This should be called from a component that has access to useLocation
// For now, we'll use userHttp as default (works for both user and employer)
// The backend will determine which notifications to return based on the token
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

export const notificationService = {
  // Get notifications (JOB_SEEKER, EMPLOYER, ADMIN)
  getNotifications: async (
    params?: SearchParams
  ): Promise<ApiResponse<PageResponse<NotificationResponse>>> => {
    const http = getHttpClient();
    const response = await http.get<
      ApiResponse<PageResponse<NotificationResponse>>
    >("/notifications", { params });
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id: number): Promise<ApiResponse<void>> => {
    const http = getHttpClient();
    const response = await http.post<ApiResponse<void>>(
      `/notifications/${id}/read`
    );
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    const http = getHttpClient();
    const response = await http.post<ApiResponse<void>>(
      "/notifications/read-all"
    );
    return response.data;
  },

  // Get unread count
  getUnreadCount: async (): Promise<ApiResponse<number>> => {
    const http = getHttpClient();
    const response = await http.get<ApiResponse<number>>(
      "/notifications/unread-count"
    );
    return response.data;
  },
};
