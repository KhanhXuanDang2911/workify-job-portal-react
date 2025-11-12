import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  BookHeart,
  FolderOpen,
  Building,
  Factory,
  MapPinPen,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Home,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userTokenUtils } from "@/lib/token";
import { authService } from "@/services";
import { useUserAuth } from "@/context/user-auth";
import { toast } from "react-toastify";
import { admin_routes } from "@/routes/routes.const";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";

const getMenuItems = (t: (key: string) => string) => [
  {
    id: "dashboard",
    label: t("admin.dashboard"),
    icon: LayoutDashboard,
    href: `${admin_routes.BASE}/${admin_routes.DASHBOARD}`,
  },
  {
    id: "jobs",
    label: t("admin.jobs"),
    icon: BriefcaseBusiness,
    href: `${admin_routes.BASE}/${admin_routes.JOBS}`,
  },
  {
    id: "posts",
    label: t("admin.posts"),
    icon: BookHeart,
    href: `${admin_routes.BASE}/${admin_routes.POSTS}`,
  },
  {
    id: "post-categories",
    label: t("admin.postCategories"),
    icon: FolderOpen,
    href: `${admin_routes.BASE}/${admin_routes.POST_CATEGORIES}`,
  },
  {
    id: "companies",
    label: t("admin.companies"),
    icon: Building,
    href: `${admin_routes.BASE}/${admin_routes.EMPLOYERS}`,
  },
  {
    id: "industries",
    label: t("admin.industries"),
    icon: Factory,
    href: `${admin_routes.BASE}/${admin_routes.CATEGORY_JOBS_INDUSTRIES}`,
  },
  {
    id: "locations",
    label: t("admin.locations"),
    icon: MapPinPen,
    href: `${admin_routes.BASE}/${admin_routes.LOCATION}`,
  },
  {
    id: "users",
    label: t("admin.users"),
    icon: Users,
    href: `${admin_routes.BASE}/${admin_routes.USERS}`,
  },
];

export default function AdminSidebar({
  isCollapsed = false,
  setIsCollapsed,
  device,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  device?: string;
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const { state, dispatch } = useUserAuth();
  const queryClient = useQueryClient();
  const user = state.user;

  const signOutMutation = useMutation({
    mutationFn: () => {
      const accessToken = userTokenUtils.getAccessToken() || "";
      const refreshToken = userTokenUtils.getRefreshToken() || "";
      return authService.signOut(accessToken, refreshToken);
    },
    onSettled: () => {
      dispatch({ type: "CLEAR_USER" });
      userTokenUtils.clearAuth();
      queryClient.removeQueries();
      toast.success(t("header.signedOutSuccess"));
    },
  });

  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 z-45 overflow-y-auto",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Collapse Toggle Button - Desktop only */}
      {device === "desktop" && (
        <div className="p-2 border-b border-gray-200 space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full p-2 bg-white/50 hover:bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={
              isCollapsed
                ? t("admin.expandSidebar")
                : t("admin.collapseSidebar")
            }
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" strokeWidth={2} />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" strokeWidth={2} />
            )}
          </Button>
          <div className={isCollapsed ? "flex justify-center" : ""}>
            <LanguageSwitcher />
          </div>
        </div>
      )}

      {/* Language Switcher for Mobile */}
      {device !== "desktop" && (
        <div className="p-2 border-b border-gray-200">
          <LanguageSwitcher />
        </div>
      )}

      {/* Navigation */}
      <nav className="overflow-y-auto p-2 flex-1">
        <ul className="space-y-1">
          {/* Home Button */}
          <li>
            <Link to="/">
              {!isCollapsed ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left font-normal text-blue-600 hover:bg-blue-50"
                >
                  <Home
                    className="size-5 shrink-0"
                    strokeWidth={2}
                    color="#1967d2"
                  />
                  <span className="ml-3">{t("admin.backToHome")}</span>
                </Button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left font-normal text-[15px] text-blue-600 hover:bg-blue-50"
                    >
                      <Home
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
                    {t("admin.backToHome")}
                    <TooltipArrow className="fill-[#1967d2]" />
                  </TooltipContent>
                </Tooltip>
              )}
            </Link>
          </li>
          {getMenuItems(t).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <li key={item.id}>
                <Link to={item.href}>
                  {!isCollapsed ? (
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        isActive && "bg-blue-50 text-blue-600"
                      )}
                    >
                      <Icon
                        className="size-5 shrink-0"
                        strokeWidth={2}
                        color={isActive ? "#1967d2" : "#1967d2"}
                      />
                      <span className="ml-3">{item.label}</span>
                    </Button>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start text-left font-normal text-[15px]",
                            isActive && "bg-blue-50 text-blue-600"
                          )}
                        >
                          <Icon
                            className="size-5 shrink-0"
                            strokeWidth={2}
                            color={isActive ? "#1967d2" : "#1967d2"}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        sideOffset={10}
                        className="bg-[#1967d2] text-white"
                      >
                        {item.label}
                        <TooltipArrow className="fill-[#1967d2]" />
                      </TooltipContent>
                    </Tooltip>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName || t("admin.dashboard")}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="h-4 w-4 text-gray-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.fullName || "Admin"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "admin@workify.com"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal text-red-600 hover:bg-red-50 hover:border-red-300"
            onClick={handleSignOut}
            disabled={signOutMutation.isPending}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t("admin.signOut")}
          </Button>
        </div>
      )}

      {/* Collapsed Logout */}
      {isCollapsed && (
        <div className="p-2 border-t border-gray-200">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-center text-red-600 hover:bg-red-50"
                onClick={handleSignOut}
                disabled={signOutMutation.isPending}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              sideOffset={10}
              className="bg-red-600 text-white"
            >
              {t("admin.signOut")}
              <TooltipArrow className="fill-red-600" />
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
