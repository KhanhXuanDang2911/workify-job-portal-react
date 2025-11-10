import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Briefcase,
  Users,
  FileText,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  HelpCircle,
  Building,
  Settings,
  User,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";

const menuItems = [
  {
    id: "jobs",
    label: "Jobs",
    icon: Briefcase,
    expandable: true,
    children: [
      {
        label: "My Jobs",
        href: `/employer/jobs`,
        icon: Briefcase,
      },
      {
        label: "Post Jobs",
        href: `/employer/jobs/add`,
        icon: FileText,
      },
    ],
  },
  {
    id: "candidates",
    label: "My Candidates",
    icon: Users,
    href: `/employer/applications`,
  },
  {
    id: "blog",
    label: "Blog",
    icon: MessageSquare,
    expandable: true,
    children: [
      {
        label: "Hiring Advice",
        href: `/articles`,
        icon: HelpCircle,
      },
      {
        label: "Tips for Employers",
        href: `/articles`,
        icon: MessageSquare,
      },
    ],
  },
  {
    id: "help",
    label: "Get helps",
    icon: HelpCircle,
    href: `#`,
  },
  {
    id: "organization",
    label: "Organization",
    icon: Building,
    href: `/employer/organization`,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: `/employer/settings`,
  },
];

export default function EmployerSidebar({
  mobileOpen = false,
  onClose,
  isCollapsed = false,
  setIsCollapsed,
  device,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  device?: string;
}) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "jobs",
    "candidates",
  ]);
  const location = useLocation();

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  useEffect(() => {
    if (mobileOpen) setIsCollapsed(false);
  }, [mobileOpen, setIsCollapsed]);
  console.log(isCollapsed, mobileOpen);

  return (
    <>
      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          className="backdrop fixed inset-0 bg-gray-900 opacity-50 z-40 xl:hidden transition-colors"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}
      <div
        className={cn(
          "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 z-45  overflow-y-auto",
          isCollapsed ? "w-16" : "w-64",
          mobileOpen
            ? "fixed top-16 left-0 xl:static shadow-lg W-64"
            : "hidden xl:flex"
        )}
        style={mobileOpen ? { height: "100vh" } : {}}
      >
        {/* Collapse Toggle Button - Desktop only */}
        {device === "desktop" && (
          <div className="p-2 border-b border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              className="w-full p-2 bg-white/50 hover:bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              onClick={() => setIsCollapsed((v) => !v)}
              aria-label={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight
                  className="w-5 h-5 text-gray-600"
                  strokeWidth={2}
                />
              ) : (
                <ChevronLeft
                  className="w-5 h-5 text-gray-600"
                  strokeWidth={2}
                />
              )}
            </Button>
          </div>
        )}
        {/* Navigation */}
        <nav className="overflow-y-auto p-2 ">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                {item.expandable ? (
                  <div>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full flex justify-between text-left font-normal",
                        isCollapsed ? "px-2" : "px-3"
                      )}
                      onClick={() => toggleSection(item.id)}
                    >
                      {!isCollapsed && (
                        <>
                          <span className="ml-3 font-semibold">
                            {item.label}
                          </span>
                        </>
                      )}
                      {expandedSections.includes(item.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    {expandedSections.includes(item.id) && item.children && (
                      <ul className=" mt-1 space-y-1">
                        {item.children.map((child, index) => (
                          <li key={index}>
                            <Link to={child.href}>
                              {!isCollapsed ? (
                                <Button
                                  variant="ghost"
                                  className={cn(
                                    "w-full justify-start text-left font-normal text-[15px]",
                                    location.pathname === child.href &&
                                      "bg-blue-50 text-blue-600"
                                  )}
                                >
                                  <child.icon
                                    className="size-5 shrink-0"
                                    strokeWidth={2}
                                    color="#1967d2"
                                  />
                                  <span className="ml-3">{child.label}</span>
                                </Button>
                              ) : (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className={cn(
                                        "w-full justify-start text-left font-normal text-[15px]",
                                        location.pathname === child.href &&
                                          "bg-blue-50 text-blue-600"
                                      )}
                                    >
                                      <child.icon
                                        className="size-5 shrink-0"
                                        strokeWidth={2}
                                        color="#1967d2"
                                      />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="right"
                                    sideOffset={10}
                                    className="bg-[#1967d2] text-white"
                                  >
                                    {child.label}
                                    <TooltipArrow className="fill-[#1967d2]" />
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link to={item.href!}>
                    {!isCollapsed ? (
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          isCollapsed ? "px-2" : "px-3",
                          location.pathname === item.href &&
                            "bg-blue-50 text-blue-600"
                        )}
                      >
                        <item.icon
                          className="size-5 shrink-0"
                          strokeWidth={2}
                          color="#1967d2"
                        />
                        {!isCollapsed && (
                          <span className="ml-3">{item.label}</span>
                        )}
                      </Button>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start text-left font-normal text-[15px]",
                              location.pathname === item.href &&
                                "bg-blue-50 text-blue-600"
                            )}
                          >
                            <item.icon
                              className="size-5 shrink-0"
                              strokeWidth={2}
                              color="#1967d2"
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{item.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        {(!isCollapsed || (device !== "desktop" && mobileOpen)) && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Employer Name
                </p>
                <p className="text-xs text-gray-500 truncate">
                  employer.2025@gmail.com
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
