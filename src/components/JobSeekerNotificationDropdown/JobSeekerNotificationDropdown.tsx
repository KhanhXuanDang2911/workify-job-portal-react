import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bell,
  Check,
  X,
  Briefcase,
  Heart,
  MessageSquare,
  Star,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "job_match" | "application_update" | "message" | "favorite";
  time: string;
  isRead: boolean;
  icon: React.ReactNode;
}

export default function JobSeekerNotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Job Match",
      message: "Frontend Developer position at TechCorp matches your profile",
      type: "job_match",
      time: "5 minutes ago",
      isRead: false,
      icon: <Briefcase className="w-4 h-4 text-blue-600" />,
    },
    {
      id: "2",
      title: "Application Update",
      message: "Your application for UI/UX Designer has been reviewed",
      type: "application_update",
      time: "2 hours ago",
      isRead: false,
      icon: <Star className="w-4 h-4 text-green-600" />,
    },
    {
      id: "3",
      title: "New Message",
      message: "HR Manager from StartupXYZ sent you a message",
      type: "message",
      time: "1 day ago",
      isRead: true,
      icon: <MessageSquare className="w-4 h-4 text-purple-600" />,
    },
    {
      id: "4",
      title: "Job Saved",
      message:
        "Senior React Developer position has been saved to your favorites",
      type: "favorite",
      time: "2 days ago",
      isRead: true,
      icon: <Heart className="w-4 h-4 text-red-600" />,
    },
    {
      id: "5",
      title: "Profile View",
      message: "3 employers viewed your profile this week",
      type: "job_match",
      time: "3 days ago",
      isRead: false,
      icon: <Briefcase className="w-4 h-4 text-orange-600" />,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
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
              Notifications
            </h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-[#1967d2] hover:text-[#1557b8] text-sm font-medium"
              >
                Mark all as read
              </Button>
            )}
          </div>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              You have {unreadCount} unread notification
              {unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No notifications</p>
              <p className="text-gray-400 text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {notification.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${
                              !notification.isRead
                                ? "text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {notification.time}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 h-auto hover:bg-blue-100"
                              title="Mark as read"
                            >
                              <Check className="w-3 h-3 text-blue-600" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNotification(notification.id)}
                            className="p-1 h-auto hover:bg-red-100"
                            title="Remove notification"
                          >
                            <X className="w-3 h-3 text-red-600" />
                          </Button>
                        </div>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-[#1967d2] rounded-full absolute left-2 top-6"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="border-t border-gray-200 p-3">
            <Button
              variant="ghost"
              className="w-full text-[#1967d2] hover:text-[#1557b8] hover:bg-blue-50 font-medium"
            >
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
