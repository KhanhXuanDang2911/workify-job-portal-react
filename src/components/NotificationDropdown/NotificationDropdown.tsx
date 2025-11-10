import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bell,
  Check,
  X,
  User,
  Building2,
  FileText,
} from "lucide-react";
import { useWebSocket } from "@/context/websocket/WebSocketContext";
import { notificationService } from "@/services";
import type { NotificationResponse, NotificationType } from "@/types/notification.type";
import { employer_routes, routes } from "@/routes/routes.const";

// Map notification type to icon
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "NEW_APPLICATION":
      return <User className="w-4 h-4 text-blue-600" />;
    case "APPLICATION_STATUS_UPDATE":
      return <FileText className="w-4 h-4 text-green-600" />;
    default:
      return <Bell className="w-4 h-4 text-gray-600" />;
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

export default function NotificationDropdown() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { notifications: wsNotifications, unreadCount: wsUnreadCount, markAsRead: wsMarkAsRead, markAllAsRead: wsMarkAllAsRead } = useWebSocket();
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

  // Refetch unread count when receiving new notification via WebSocket
  const prevNotificationsLengthRef = useRef(0);
  useEffect(() => {
    if (wsNotifications.length > prevNotificationsLengthRef.current) {
      const latestNotification = wsNotifications[0];
      if (!latestNotification.readFlag) {
        // Invalidate query to refetch unread count when new unread notification arrives
        queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
      }
      prevNotificationsLengthRef.current = wsNotifications.length;
    }
  }, [wsNotifications, queryClient]);

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

  // Combine API notifications with WebSocket notifications
  const apiNotifications = notificationsResponse?.data?.items || [];
  const allNotifications = [...wsNotifications, ...apiNotifications].filter(
    (notif, index, self) => index === self.findIndex((n) => n.id === notif.id)
  );

  // Use unread count from API (more accurate) or WebSocket as fallback
  const unreadCount = unreadCountResponse?.data ?? wsUnreadCount;

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
    wsMarkAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleNotificationClick = (notification: NotificationResponse) => {
    // No navigation on click
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 hover:bg-gray-100"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end" sideOffset={8}>
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Thông báo
            </h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
                className="text-[#1967d2] hover:text-[#1557b8] text-sm font-medium"
              >
                Đánh dấu tất cả đã đọc
              </Button>
            )}
          </div>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Bạn có {unreadCount} thông báo chưa đọc
            </p>
          )}
        </div>

        <ScrollArea className="h-96">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">Đang tải...</p>
            </div>
          ) : allNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">Không có thông báo</p>
              <p className="text-gray-400 text-sm">Bạn đã cập nhật tất cả!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {allNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 transition-all cursor-pointer relative border-l-4 ${
                    !notification.readFlag
                      ? "bg-blue-50 border-blue-500 shadow-sm hover:bg-blue-100 hover:shadow-md"
                      : "hover:bg-gray-50 border-transparent"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-sm font-semibold ${
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
                            className={`text-sm mt-1 line-clamp-2 ${
                              !notification.readFlag
                                ? "text-gray-800 font-medium"
                                : "text-gray-600"
                            }`}
                          >
                            {notification.content}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {relativeTime(notification.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2" onClick={(e) => e.stopPropagation()}>
                          {!notification.readFlag && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              disabled={markAsReadMutation.isPending}
                              className="p-1 h-auto hover:bg-blue-200"
                              title="Đánh dấu đã đọc"
                            >
                              <Check className="w-3 h-3 text-blue-600" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {allNotifications.length > 0 && (
          <div className="border-t border-gray-200 p-3">
            <Button
              variant="ghost"
              className="w-full text-[#1967d2] hover:text-[#1557b8] hover:bg-blue-50 font-medium"
              onClick={() => {
                const isEmployerRoute = location.pathname.startsWith(employer_routes.BASE);
                const notificationsPath = isEmployerRoute
                  ? `${employer_routes.BASE}/${employer_routes.NOTIFICATIONS}`
                  : `/${routes.NOTIFICATIONS}`;
                navigate(notificationsPath);
              }}
            >
              Xem tất cả thông báo
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
