import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/Pagination";
import {
  Bell,
  Check,
  User,
  FileText,
  CheckCheck,
} from "lucide-react";
import { useWebSocket } from "@/context/websocket/WebSocketContext";
import { notificationService } from "@/services";
import type { NotificationResponse, NotificationType } from "@/types/notification.type";
import Loading from "@/components/Loading";

// Map notification type to icon
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "NEW_APPLICATION":
      return <User className="w-5 h-5 text-blue-600" />;
    case "APPLICATION_STATUS_UPDATE":
      return <FileText className="w-5 h-5 text-green-600" />;
    default:
      return <Bell className="w-5 h-5 text-gray-600" />;
  }
};

// Format relative time
const relativeTime = (dateString?: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  } catch (e) {
    return "";
  }
};

export default function Notifications() {
  const queryClient = useQueryClient();
  const { notifications: wsNotifications, markAsRead: wsMarkAsRead, markAllAsRead: wsMarkAllAsRead } = useWebSocket();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch notifications from API
  const { data: notificationsResponse, isLoading } = useQuery({
    queryKey: ["notifications", currentPage, pageSize],
    queryFn: () =>
      notificationService.getNotifications({
        pageNumber: currentPage,
        pageSize: pageSize,
      }),
    staleTime: 30 * 1000, // 30 seconds
  });

  // Fetch unread count
  const { data: unreadCountResponse } = useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: () => notificationService.getUnreadCount(),
    staleTime: 30 * 1000, // 30 seconds
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
      wsMarkAllAsRead();
    },
  });

  // Use API notifications only for pagination (WebSocket notifications are shown in dropdown)
  const apiNotifications = notificationsResponse?.data?.items || [];
  const allNotifications = apiNotifications;

  // Use unread count from API (more accurate)
  const unreadCount = unreadCountResponse?.data ?? 0;
  const totalPages = notificationsResponse?.data?.totalPages || 0;
  const totalItems = notificationsResponse?.data?.totalItems || 0;

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
    wsMarkAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      style={{
        background: "linear-gradient(90deg, #fafcfb 0%, #f5faf7 30%, #f0f7f5 60%, #f0f7fc 100%)",
        minHeight: "100vh",
      }}
    >
      <div className="main-layout relative z-10 pt-12 pb-8">
        <div className="max-w-4xl mx-auto px-5">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Thông báo
                </h1>
                <p className="text-gray-600 mt-1">
                  Xem tất cả thông báo của bạn
                </p>
              </div>
            </div>

            {/* Header with mark all as read */}
            <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Tất cả thông báo
                </h2>
                <div className="flex items-center gap-4 mt-1">
                  {totalItems > 0 && (
                    <p className="text-sm text-gray-600">
                      Tổng cộng: {totalItems} thông báo
                    </p>
                  )}
                  {unreadCount > 0 && (
                    <p className="text-sm text-blue-600 font-medium">
                      {unreadCount} chưa đọc
                    </p>
                  )}
                </div>
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  onClick={handleMarkAllAsRead}
                  disabled={markAllAsReadMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  Đánh dấu tất cả đã đọc
                </Button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loading />
              </div>
            ) : allNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-lg shadow-sm">
                <Bell className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium text-lg">Không có thông báo</p>
                <p className="text-gray-400 text-sm mt-2">Bạn đã cập nhật tất cả!</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {allNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-5 transition-all relative border-l-4 rounded-lg shadow-sm ${
                        !notification.readFlag
                          ? "bg-blue-50 border-blue-500 hover:bg-blue-100 hover:shadow-md"
                          : "bg-white border-transparent hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <p
                                  className={`text-base font-semibold ${
                                    !notification.readFlag
                                      ? "text-blue-900"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {notification.title}
                                </p>
                                {!notification.readFlag && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                )}
                              </div>
                              <p
                                className={`text-sm mb-2 ${
                                  !notification.readFlag
                                    ? "text-gray-800 font-medium"
                                    : "text-gray-600"
                                }`}
                              >
                                {notification.content}
                              </p>
                              <p className="text-xs text-gray-400">
                                {relativeTime(notification.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              {!notification.readFlag && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  disabled={markAsReadMutation.isPending}
                                  className="p-2 h-auto hover:bg-blue-200"
                                  title="Đánh dấu đã đọc"
                                >
                                  <Check className="w-4 h-4 text-blue-600" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 0 && (
                  <div className="mt-8 flex flex-col items-center gap-4">
                    <div className="text-sm text-gray-600">
                      Trang {currentPage} / {totalPages} ({totalItems} thông báo)
                    </div>
                    {totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </div>
                )}
              </>
            )}
        </div>
      </div>
    </div>
  );
}

