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
import { Bell, Check, User, FileText } from "lucide-react";
import { useWebSocket } from "@/context/WebSocket/WebSocketContext";
import { notificationService } from "@/services";
import type { NotificationType } from "@/types/notification.type";
import { employer_routes, routes } from "@/routes/routes.const";
import { useTranslation } from "@/hooks/useTranslation";

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

export default function NotificationDropdown() {
  const { t, currentLanguage } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const {
    notifications: wsNotifications,
    unreadCount: wsUnreadCount,
    markAsRead: wsMarkAsRead,
    markAllAsRead: wsMarkAllAsRead,
  } = useWebSocket();

  const relativeTime = (dateString?: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return t("notifications.time.justNow");
      if (diffMins < 60)
        return t("notifications.time.minutesAgo", { count: diffMins });
      if (diffHours < 24)
        return t("notifications.time.hoursAgo", { count: diffHours });
      if (diffDays < 7)
        return t("notifications.time.daysAgo", { count: diffDays });
      return date.toLocaleDateString(
        currentLanguage === "vi" ? "vi-VN" : "en-US"
      );
    } catch (e) {
      return "";
    }
  };
  const [currentPage] = useState(1);
  const pageSize = 10;

  const { data: notificationsResponse, isLoading } = useQuery({
    queryKey: ["employer-notifications", currentPage, pageSize],
    queryFn: () =>
      notificationService.getNotifications({
        pageNumber: currentPage,
        pageSize: pageSize,
      }),
    staleTime: 30 * 1000,
  });

  const { data: unreadCountResponse } = useQuery({
    queryKey: ["employer-notifications-unread-count"],
    queryFn: () => notificationService.getUnreadCount(),
    staleTime: 30 * 1000,
  });

  const prevNotificationsLengthRef = useRef(0);
  useEffect(() => {
    if (wsNotifications.length > prevNotificationsLengthRef.current) {
      const latestNotification = wsNotifications[0];
      if (!latestNotification.readFlag) {
        queryClient.invalidateQueries({
          queryKey: ["employer-notifications-unread-count"],
        });
      }
      prevNotificationsLengthRef.current = wsNotifications.length;
    }
  }, [wsNotifications, queryClient]);

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer-notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["employer-notifications-unread-count"],
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer-notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["employer-notifications-unread-count"],
      });
      wsMarkAllAsRead();
    },
  });

  const apiNotifications = notificationsResponse?.data?.items || [];
  const allNotifications = [...wsNotifications, ...apiNotifications].filter(
    (notif, index, self) => index === self.findIndex((n) => n.id === notif.id)
  );

  const unreadCount = unreadCountResponse?.data ?? wsUnreadCount;

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
    wsMarkAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleNotificationClick = () => {};

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
              {t("notifications.title")}
            </h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
                className="text-[#1967d2] hover:text-[#1557b8] text-sm font-medium"
              >
                {t("notifications.markAllAsRead")}
              </Button>
            )}
          </div>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {t("notifications.dropdown.unreadMessage", {
                count: unreadCount,
              })}
            </p>
          )}
        </div>

        <ScrollArea className="h-96">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">
                {t("notifications.dropdown.loading")}
              </p>
            </div>
          ) : allNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">
                {t("notifications.noNotifications")}
              </p>
              <p className="text-gray-400 text-sm">
                {t("notifications.allCaughtUp")}
              </p>
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
                  onClick={handleNotificationClick}
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
                        <div
                          className="flex items-center space-x-1 ml-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {!notification.readFlag && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              disabled={markAsReadMutation.isPending}
                              className="p-1 h-auto hover:bg-blue-200"
                              title={t("notifications.markAsRead")}
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
                const isEmployerRoute = location.pathname.startsWith(
                  employer_routes.BASE
                );
                const notificationsPath = isEmployerRoute
                  ? `${employer_routes.BASE}/${employer_routes.NOTIFICATIONS}`
                  : `/${routes.NOTIFICATIONS}`;
                navigate(notificationsPath);
              }}
            >
              {t("notifications.dropdown.viewAll")}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
