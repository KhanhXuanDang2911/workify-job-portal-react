import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, FileText, Bookmark, Briefcase, MessageSquare, Settings, User } from "lucide-react";

const menuItems = [
  {
    id: "overview",
    label: "Overview",
    icon: Home,
    href: "/overview",
  },
  {
    id: "my-resumes",
    label: "My Resumes",
    icon: FileText,
    href: "/resumes",
  },
  {
    id: "saved-jobs",
    label: "My Saved Jobs",
    icon: Bookmark,
    href: "/saved-jobs",
  },
  {
    id: "applied-jobs",
    label: "My Applied Jobs",
    icon: Briefcase,
    href: "/applied-jobs",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
  {
    id: "messages",
    label: "Messages",
    icon: MessageSquare,
    href: "/messages",
  },
];

interface UserSideBarProps {
  className?: string;
}

export default function UserSideBar({ className }: UserSideBarProps) {
  const location = useLocation();

  return (
    <div className={cn("flex flex-col h-full bg-white border-r border-gray-200 rounded-[20px] overflow-hidden", className)}>
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-[#1967d2] to-[#1557b0]">
        <h2 className="text-xl font-bold text-white">DASHBOARD</h2>
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
                      "relative flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium transition-all duration-300 overflow-hidden group",
                      isActive && "text-white"
                    )}
                  >
                    {/* Background gradient for active state */}
                    <div
                      className={cn(
                        "absolute inset-0 bg-[#368289] transition-transform duration-300 ease-out",
                        isActive ? "translate-x-0" : "-translate-x-full group-hover:translate-x-0"
                      )}
                    />

                    {/* Icon and Label */}
                    <item.icon className={cn("w-5 h-5 relative z-10 transition-colors", isActive ? "text-white" : "text-[#1967d2] group-hover:text-white")} />
                    <span className={cn("relative z-10 transition-colors", isActive ? "text-white" : "group-hover:text-white")}>{item.label}</span>

                    {/* Arrow indicator for active state */}
                    {isActive && (
                      <svg className="w-5 h-5 ml-auto relative z-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
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