import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Briefcase,
  BookmarkIcon,
  File,
  Home,
  Building2,
  BookOpen,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { employer_routes, routes, admin_routes } from "@/routes/routes.const";
import JobSeekerNotificationDropdown from "../JobSeekerNotificationDropdown";
import { userTokenUtils } from "@/lib/token";
import { toast } from "react-toastify";
import { authService } from "@/services";
import { useUserAuth } from "@/context/UserAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ROLE } from "@/constants";
import { Settings } from "lucide-react";
import { getNameInitials } from "@/utils/string";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";
import { useWebSocket } from "@/context/WebSocket/WebSocketContext";

export default function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isEmployerRoute = location.pathname.startsWith(employer_routes.BASE);
  const queryClient = useQueryClient();
  const { state, dispatch } = useUserAuth();
  const { conversationUnread } = useWebSocket();

  const chatConversationCount = Object.values(conversationUnread ?? {}).filter(
    (v) => (v ?? 0) > 0
  ).length;

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

  const isActive = (path: string) => {
    if (path === routes.BASE) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(`/${path}`);
  };

  const getLinkClassName = (path: string, isMobile = false) => {
    const active = isActive(path);
    const baseClass = isMobile
      ? "px-4 py-2 text-sm rounded-md transition-colors flex items-center gap-2"
      : "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group flex items-center gap-2";

    const activeClass = isMobile
      ? "text-[#1967d2] bg-blue-50 font-medium"
      : "text-[#1967d2] bg-blue-50/50";

    const inactiveClass = isMobile
      ? "text-gray-600 hover:text-[#1967d2] hover:bg-gray-50"
      : "text-gray-700 hover:text-[#1967d2] hover:bg-blue-50/50";

    return `${baseClass} ${active ? activeClass : inactiveClass}`;
  };

  return (
    <header className="relative bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-indigo-50/30 pointer-events-none"></div>

      <div className="main-layout relative z-10">
        <div className="flex items-center justify-between h-16">
          <Link to={routes.BASE} className="flex items-center space-x-2 group">
            <div className="w-8 h-8 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <img
                src="/logo.png"
                alt="logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-gray-900 group-hover:text-[#1967d2] transition-colors duration-200">
              Workify
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            <Link to={routes.BASE} className={getLinkClassName(routes.BASE)}>
              <Home className="w-4 h-4" />
              {t("header.home")}
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-[#1967d2] transition-all duration-300 ${
                  isActive(routes.BASE) ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
            <Link
              to={routes.JOB_SEARCH}
              className={getLinkClassName(routes.JOB_SEARCH)}
            >
              <Briefcase className="w-4 h-4" />
              {t("header.jobs")}
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-[#1967d2] transition-all duration-300 ${
                  isActive(routes.JOB_SEARCH)
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
            <Link
              to={routes.ARTICLES}
              className={getLinkClassName(routes.ARTICLES)}
            >
              <BookOpen className="w-4 h-4" />
              {t("header.careerGuide")}
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-[#1967d2] transition-all duration-300 ${
                  isActive(routes.ARTICLES)
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
            <Link
              to={routes.EMPLOYER_SEARCH}
              className={getLinkClassName(routes.EMPLOYER_SEARCH)}
            >
              <Building2 className="w-4 h-4" />
              {t("header.companies")}
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-[#1967d2] transition-all duration-300 ${
                  isActive(routes.EMPLOYER_SEARCH)
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
            <Link
              to={routes.TEMPLATES_CV}
              className={getLinkClassName(routes.TEMPLATES_CV)}
            >
              <FileText className="w-4 h-4" />
              {t("header.createCV")}
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-[#1967d2] transition-all duration-300 ${
                  isActive(routes.TEMPLATES_CV)
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
          </nav>

          <div className="hidden lg:flex items-center space-x-3">
            <LanguageSwitcher />
            {state.isAuthenticated ? (
              <>
                <JobSeekerNotificationDropdown />
                <Link
                  to={
                    isEmployerRoute
                      ? `${employer_routes.BASE}/messages`
                      : `/${routes.MESSAGES}`
                  }
                  className="relative p-2 rounded hover:bg-gray-50 transition-colors"
                  aria-label={t("header.messages")}
                >
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                  {chatConversationCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full shadow">
                      {chatConversationCount > 99
                        ? "99+"
                        : chatConversationCount}
                    </span>
                  )}
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none hover:opacity-90 transition-all duration-200 rounded-lg px-2 py-1.5 hover:bg-gray-50">
                    <Avatar className="h-9 w-9 ring-2 ring-gray-200 hover:ring-[#1967d2]/30 transition-all duration-300">
                      <AvatarImage
                        src={
                          user?.avatarUrl ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName}`
                        }
                        alt={user?.fullName || t("header.user")}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-[#1967d2] to-[#1557b8] text-white">
                        {getNameInitials(user?.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 shadow-xl border-gray-200/50 backdrop-blur-sm bg-white/95"
                  >
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to={routes.SETTINGS} className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {t("header.profile")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link
                        to={routes.MY_APPLIED_JOBS}
                        className="flex items-center"
                      >
                        <Briefcase className="w-4 h-4 mr-2" />
                        {t("header.appliedJobs")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link
                        to={routes.MY_SAVED_JOBS}
                        className="flex items-center"
                      >
                        <BookmarkIcon className="w-4 h-4 mr-2" />
                        {t("header.savedJobs")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to={routes.MY_RESUME} className="flex items-center">
                        <File className="w-4 h-4 mr-2" />
                        {t("header.myResumes")}
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === ROLE.ADMIN && (
                      <>
                        <DropdownMenuSeparator className="bg-gray-200" />
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link
                            to={`${admin_routes.BASE}/${admin_routes.DASHBOARD}`}
                            className="flex items-center"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            {t("header.goToAdmin")}
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator className="bg-gray-200" />
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t("header.signOut")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 hover:text-[#1967d2] hover:bg-blue-50/50 transition-all duration-200"
                >
                  <Link to={routes.SIGN_IN}>{t("header.signIn")}</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-[#1967d2] to-[#1557b8] hover:from-[#1557b8] hover:to-[#1445a0] text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Link to={routes.SIGN_UP}>{t("header.signUp")}</Link>
                </Button>
              </>
            )}
            <div className="w-px h-6 bg-gray-300"></div>
            <Link
              to={employer_routes.BASE}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#1967d2] transition-all duration-200 rounded-lg hover:bg-blue-50/50"
            >
              {t("header.forEmployers")}
            </Link>
          </div>

          {/* Mobile menu */}
          <div className="lg:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            {state.isAuthenticated && (
              <>
                <JobSeekerNotificationDropdown />
                <Link
                  to={
                    isEmployerRoute
                      ? `${employer_routes.BASE}/messages`
                      : `/${routes.MESSAGES}`
                  }
                  className="relative p-2 rounded hover:bg-gray-50 transition-colors"
                  aria-label={t("header.messages")}
                >
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                  {chatConversationCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full shadow">
                      {chatConversationCount > 99
                        ? "99+"
                        : chatConversationCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4">
            <nav className="flex flex-col space-y-1">
              <Link
                to={routes.BASE}
                className={getLinkClassName(routes.BASE, true)}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-4 h-4" />
                {t("header.home")}
              </Link>
              <Link
                to={routes.JOB_SEARCH}
                className={getLinkClassName(routes.JOB_SEARCH, true)}
                onClick={() => setIsMenuOpen(false)}
              >
                <Briefcase className="w-4 h-4" />
                {t("header.jobs")}
              </Link>
              <Link
                to={routes.ARTICLES}
                className={getLinkClassName(routes.ARTICLES, true)}
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="w-4 h-4" />
                {t("header.careerGuide")}
              </Link>
              <Link
                to={routes.EMPLOYER_SEARCH}
                className={getLinkClassName(routes.EMPLOYER_SEARCH, true)}
                onClick={() => setIsMenuOpen(false)}
              >
                <Building2 className="w-4 h-4" />
                {t("header.companies")}
              </Link>
              <Link
                to={routes.TEMPLATES_CV}
                className={getLinkClassName(routes.TEMPLATES_CV, true)}
                onClick={() => setIsMenuOpen(false)}
              >
                <FileText className="w-4 h-4" />
                {t("header.createCV")}
              </Link>
              {state.isAuthenticated && (
                <>
                  <div className="border-t border-gray-100 my-2"></div>
                  {/* messages link removed from mobile expanded menu — standalone icon kept outside menu */}
                  <Link
                    to={routes.SETTINGS}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-[#1967d2] hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("header.profile")}
                  </Link>
                  <Link
                    to={routes.MY_APPLIED_JOBS}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-[#1967d2] hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("header.appliedJobs")}
                  </Link>
                  <Link
                    to={routes.MY_SAVED_JOBS}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-[#1967d2] hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("header.savedJobs")}
                  </Link>
                  <button
                    className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors text-left"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleSignOut();
                    }}
                  >
                    {t("header.signOut")}
                  </button>
                </>
              )}
              {!state.isAuthenticated && (
                <>
                  <div className="border-t border-gray-100 my-2"></div>
                  <Link
                    to={routes.SIGN_IN}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-[#1967d2] hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("header.signIn")}
                  </Link>
                  <Link
                    to={routes.SIGN_UP}
                    className="px-4 py-2 text-sm text-[#1967d2] hover:bg-[#1967d2] hover:text-white rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("header.signUp")}
                  </Link>
                </>
              )}
              <div className="border-t border-gray-100 my-2"></div>
              <Link
                to={employer_routes.BASE}
                className="px-4 py-2 text-sm text-gray-600 hover:text-[#1967d2] hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("header.forEmployers")}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
