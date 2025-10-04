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

interface EmployerHeaderProps {
  onMobileMenuClick?: () => void;
  mobileSidebarOpen?: boolean;
  isCollapsed?: boolean;
  onToggleCollapsed?: () => void;
  device?: string;
  isAuthenticated: boolean;
}

export default function EmployerHeader({
  onMobileMenuClick,
  mobileSidebarOpen,
  isCollapsed,
  onToggleCollapsed,
  device,
  isAuthenticated,
}: EmployerHeaderProps) {
  return (
    <header className=" bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="main-layout">
        <div className="  flex items-center justify-between h-16">
          <div className="flex items-center">
            <div
              className={`absolute ${
                device === "desktop" ? "left-4" : "right-4"
              } `}
            >
              {/* menu desktop */}
              <Button
                variant="ghost"
                size="sm"
                className="p-1 hidden px-0 lg:inline-flex  bg-white font-bold  shadow"
                onClick={onToggleCollapsed}
                aria-label={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
              >
                {isCollapsed ? (
                  <Menu className="size-5" strokeWidth={3} />
                ) : (
                  <X className="size-5" strokeWidth={3} />
                )}
              </Button>
              {/*  menu mobile  */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onMobileMenuClick}
                className="p-2 mr-2 lg:hidden border border-gray-300 rounded-lg bg-white font-bold hover:bg-gray-100 shadow"
                aria-label={mobileSidebarOpen ? "Đóng menu" : "Mở menu"}
              >
                {mobileSidebarOpen ? (
                  <X className="size-5" strokeWidth={3} />
                ) : (
                  <Menu className="size-5" strokeWidth={3} />
                )}
              </Button>
            </div>
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/logo.png" alt="logo" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-[#1967d2]">
                  <Link to="/employer/dashboard">Workify</Link>
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Employer Portal
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <NotificationDropdown />
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2 transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="https://i.pravatar.cc/150?img=5"
                        alt="User"
                      />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-900">
                        John Doe
                      </span>
                      <span className="text-xs text-gray-500">Tech Corp</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
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
                  className="border-[#1967d2] text-[#1967d2] hover:bg-[#e0eeff] bg-transparent font-semibold"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  <Link to={employer_routes.SIGN_UP}>Sign Up</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-[#1967d2] hover:bg-[#1557b8] text-white font-semibold"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  <Link to={employer_routes.SIGN_IN}>Sign In</Link>
                </Button>
              </>
            )}

            {/* Job Seeker Link */}
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-700 hover:text-[#1967d2] font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              <Home className="w-4 h-4" />
              <span>Job Seeker</span>
            </Link>
          </div>

          {/* Mobile Actions (nếu cần thêm gì cho mobile thì để ở đây) */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Có thể để thông báo mobile ở đây nếu muốn */}
          </div>
        </div>
      </div>
    </header>
  );
}
