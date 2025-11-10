import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  Menu,
  X,
  UserPlus,
  LogIn,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Briefcase,
  Users,
  Bookmark,
  FileText,
  Building,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationDropdown from "@/components/NotificationDropdown";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { employer_routes } from "@/routes/routes.const";
import { employerTokenUtils } from "@/lib/token";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEmployerAuth } from "@/context/employer-auth";
import { authService } from "@/services";
import { toast } from "react-toastify";
import { getNameInitials } from "@/utils/string";

interface EmployerHeaderProps {
  onMobileMenuClick?: () => void;
  mobileSidebarOpen?: boolean;
  device?: string;
  showSidebar?: boolean; // Only show menu buttons when sidebar is available
}

export default function EmployerHeader({
  onMobileMenuClick,
  mobileSidebarOpen,
  device,
  showSidebar = false,
}: EmployerHeaderProps) {
  const { state, dispatch } = useEmployerAuth();
  const employer = state.employer;
  const queryClient = useQueryClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const signOutMutation = useMutation({
    mutationFn: () => {
      const accessToken = employerTokenUtils.getAccessToken() || "";
      const refreshToken = employerTokenUtils.getRefreshToken() || "";
      return authService.signOutEmployer(accessToken, refreshToken);
    },
    onSettled: () => {
      dispatch({ type: "CLEAR_EMPLOYER" });

      employerTokenUtils.clearAuth();
      queryClient.removeQueries();
      toast.success("Signed out successfully");
    },
  });

  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  return (
    <header className="relative bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-indigo-50/30 pointer-events-none"></div>
      <div className="main-layout relative z-10">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {/* Menu Toggle - Mobile (always show on mobile < lg, hidden on desktop) */}
            {showSidebar && onMobileMenuClick ? (
              // Toggle sidebar when sidebar is available
              <Button
                variant="ghost"
                size="sm"
                onClick={onMobileMenuClick}
                className="lg:hidden p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200"
                aria-label={mobileSidebarOpen ? "Đóng menu" : "Mở menu"}
              >
                {mobileSidebarOpen ? (
                  <X className="w-5 h-5 text-gray-600" strokeWidth={2} />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" strokeWidth={2} />
                )}
              </Button>
            ) : (
              // Show mobile menu dropdown when no sidebar
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200"
                aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600" strokeWidth={2} />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" strokeWidth={2} />
                )}
              </Button>
            )}

            {/* Logo */}
            <Link to="/employer" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <img
                  src="/logo.png"
                  alt="logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-[#1967d2] group-hover:to-[#1557b8] transition-all duration-300">
                  Workify
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Employer Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Only show when no sidebar */}
          {!showSidebar && (
            <nav className="hidden lg:flex items-center space-x-1">
              <Link
                to={employer_routes.BASE}
                className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#1967d2] transition-all duration-300 rounded-lg hover:bg-blue-50/50 group flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1967d2] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#1967d2] transition-all duration-300 rounded-lg hover:bg-blue-50/50 group flex items-center gap-2 outline-none">
                  <Briefcase className="w-4 h-4" />
                  Jobs
                  <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1967d2] group-hover:w-full transition-all duration-300"></span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-48 shadow-xl border-gray-200/50 backdrop-blur-sm bg-white/95"
                >
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      to={employer_routes.JOBS}
                      className="flex items-center gap-2"
                    >
                      <Briefcase className="w-4 h-4" />
                      My Jobs
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      to={employer_routes.JOB_ADD}
                      className="flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Post Job
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#1967d2] transition-all duration-300 rounded-lg hover:bg-blue-50/50 group flex items-center gap-2 outline-none">
                  <Users className="w-4 h-4" />
                  Candidates
                  <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1967d2] group-hover:w-full transition-all duration-300"></span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-48 shadow-xl border-gray-200/50 backdrop-blur-sm bg-white/95"
                >
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      to={employer_routes.APPLICATIONS}
                      className="flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Applications
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                to={employer_routes.ORGANIZATION}
                className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#1967d2] transition-all duration-300 rounded-lg hover:bg-blue-50/50 group flex items-center gap-2"
              >
                <Building className="w-4 h-4" />
                Organization
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1967d2] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>
          )}

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {state.isAuthenticated ? (
              <>
                <NotificationDropdown />
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2 transition-all duration-200 hover:shadow-sm border border-transparent hover:border-gray-200">
                    <Avatar className="h-9 w-9 ring-2 ring-gray-100 hover:ring-[#1967d2]/30 transition-all duration-200">
                      <AvatarImage
                        src={
                          employer?.avatarUrl ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${employer?.companyName}`
                        }
                        alt={employer?.companyName || "Employer"}
                      />
                      <AvatarFallback className="bg-[#1967d2] text-white font-semibold">
                        {getNameInitials(employer?.companyName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-900">
                        {employer?.companyName || "Employer"}
                      </span>
                      <span className="text-xs text-gray-500">Employer</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link
                        to={employer_routes.ORGANIZATION}
                        className="cursor-pointer flex items-center gap-3"
                      >
                        <User className="w-4 h-4" />
                        Organization
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to={employer_routes.SETTINGS}
                        className="cursor-pointer flex items-center gap-3"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to={employer_routes.JOBS}
                        className="cursor-pointer flex items-center gap-3"
                      >
                        <Briefcase className="w-4 h-4" />
                        My Jobs
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to={employer_routes.JOB_ADD}
                        className="cursor-pointer flex items-center gap-3"
                      >
                        <FileText className="w-4 h-4" />
                        Post Job
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to={employer_routes.APPLICATIONS}
                        className="cursor-pointer flex items-center gap-3"
                      >
                        <FileText className="w-4 h-4" />
                        Applications
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-[#1967d2] text-[#1967d2] hover:bg-[#1967d2] hover:text-white bg-transparent font-medium transition-all duration-200 hover:shadow-md"
                >
                  <Link
                    to={employer_routes.SIGN_UP}
                    className="flex items-center"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-[#1967d2] hover:bg-[#1557b8] text-white font-medium transition-all duration-200 hover:shadow-lg"
                >
                  <Link
                    to={employer_routes.SIGN_IN}
                    className="flex items-center"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              </>
            )}

            {/* Job Seeker Link */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-gray-700 hover:text-[#1967d2] hover:bg-gray-50 font-medium transition-all duration-200"
            >
              <Link to="/" className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Job Seeker</span>
              </Link>
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center space-x-2">
            {state.isAuthenticated && (
              <>
                <NotificationDropdown />
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <Avatar className="h-8 w-8 ring-2 ring-gray-100">
                      <AvatarImage
                        src={
                          employer?.avatarUrl ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${employer?.companyName}`
                        }
                        alt={employer?.companyName || "Employer"}
                      />
                      <AvatarFallback className="bg-[#1967d2] text-white text-xs font-semibold">
                        {getNameInitials(employer?.companyName)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link
                        to={employer_routes.ORGANIZATION}
                        className="cursor-pointer flex items-center gap-3"
                      >
                        <User className="w-4 h-4" />
                        Organization
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to={employer_routes.SETTINGS}
                        className="cursor-pointer flex items-center gap-3"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown (only show when no sidebar) */}
        {!showSidebar && isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4">
            <nav className="flex flex-col space-y-1">
              {state.isAuthenticated ? (
                <>
                  <Link
                    to={employer_routes.BASE}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-[#1967d2] hover:bg-gray-50 rounded-md transition-colors flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Home className="w-4 h-4" />
                    My Workify
                  </Link>
                  <Link
                    to={employer_routes.JOBS}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-[#1967d2] hover:bg-gray-50 rounded-md transition-colors flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Briefcase className="w-4 h-4" />
                    My Jobs
                  </Link>
                  <Link
                    to={employer_routes.JOB_ADD}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-[#1967d2] hover:bg-gray-50 rounded-md transition-colors flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FileText className="w-4 h-4" />
                    Post Job
                  </Link>
                  <div className="border-t border-gray-100 my-2"></div>
                  <Link
                    to={employer_routes.ORGANIZATION}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-[#1967d2] hover:bg-gray-50 rounded-md transition-colors flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Building className="w-4 h-4" />
                    Organization
                  </Link>
                  <Link
                    to={employer_routes.SETTINGS}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-[#1967d2] hover:bg-gray-50 rounded-md transition-colors flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <div className="border-t border-gray-100 my-2"></div>
                  <button
                    className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors text-left flex items-center gap-2"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleSignOut();
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={employer_routes.SIGN_IN}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-[#1967d2] hover:bg-gray-50 rounded-md transition-colors flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Link>
                  <Link
                    to={employer_routes.SIGN_UP}
                    className="px-4 py-2 text-sm text-[#1967d2] hover:bg-[#1967d2] hover:text-white rounded-md transition-colors flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </Link>
                </>
              )}
              <div className="border-t border-gray-100 my-2"></div>
              <Link
                to="/"
                className="px-4 py-2 text-sm text-gray-600 hover:text-[#1967d2] hover:bg-gray-50 rounded-md transition-colors flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-4 h-4" />
                Job Seeker Portal
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
