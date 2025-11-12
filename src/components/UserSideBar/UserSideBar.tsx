import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  FileText,
  Bookmark,
  Briefcase,
  MessageSquare,
  Settings,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface UserSideBarProps {
  className?: string;
}

export default function UserSideBar({ className }: UserSideBarProps) {
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    {
      id: "overview",
      label: t("sidebar.overview"),
      icon: Home,
      href: "/overview",
    },
    {
      id: "my-resumes",
      label: t("sidebar.myResumes"),
      icon: FileText,
      href: "/resumes",
    },
    {
      id: "saved-jobs",
      label: t("sidebar.savedJobs"),
      icon: Bookmark,
      href: "/saved-jobs",
    },
    {
      id: "applied-jobs",
      label: t("sidebar.appliedJobs"),
      icon: Briefcase,
      href: "/applied-jobs",
    },
    {
      id: "settings",
      label: t("sidebar.settings"),
      icon: Settings,
      href: "/settings",
    },
    {
      id: "messages",
      label: t("sidebar.messages"),
      icon: MessageSquare,
      href: "/messages",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white border-r border-gray-200 rounded-lg overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {t("sidebar.dashboard")}
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.id}>
                <Link to={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 font-medium transition-colors hover:bg-gray-50",
                      isActive && "bg-blue-50 text-blue-600"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5",
                        isActive ? "text-blue-600" : "text-gray-600"
                      )}
                      strokeWidth={2}
                    />
                    <span>{item.label}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
