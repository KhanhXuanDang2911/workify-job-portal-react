import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu,
  X,
  ChevronDown,
  Settings,
  LogOut,
  User,
  LogIn,
  UserPlus,
  Home,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationDropdown from "../NotificationDropdown/NotificationDropdown";
import { employer_routes } from "@/routes/routes.const";

export default function EmployerHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="main-layout">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
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
            {/* Sign In / Sign Up Buttons */}
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
            {/* Job Seeker Link */}
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-700 hover:text-[#1967d2] font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              <Home className="w-4 h-4" />
              <span>Job Seeker</span>
            </Link>

            {/* Notifications */}
            {/* <NotificationDropdown /> */}

            {/* User Menu */}
            {/* <DropdownMenu>
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
            </DropdownMenu> */}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Mobile Notifications */}
            <NotificationDropdown />

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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-3">
              {/* User Info */}
              {/* <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src="https://i.pravatar.cc/150?img=5"
                    alt="User"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    John Doe
                  </span>
                  <span className="text-xs text-gray-500">Tech Corp</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 mt-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 text-gray-700 hover:text-[#1967d2] font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>

                <Link
                  to="/settings"
                  className="flex items-center space-x-3 text-gray-700 hover:text-[#1967d2] font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>

                <button
                  className="flex items-center space-x-3 text-red-600 hover:text-red-700 font-medium py-2 w-full text-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div> */}

              {/* Sign In / Sign Up */}
              <div className="flex space-x-3 py-2">
                <Link
                  to={employer_routes.SIGN_UP}
                  className="flex-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-[#1967d2] text-[#1967d2] hover:bg-[#e0eeff] bg-transparent font-semibold"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </Button>
                </Link>
                <Link
                  to={employer_routes.SIGN_IN}
                  className="flex-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button
                    size="sm"
                    className="w-full bg-[#1967d2] hover:bg-[#1557b8] text-white font-semibold"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              </div>
              {/* Job Seeker Link */}
              <Link
                to="/"
                className="flex items-center space-x-3 text-gray-700 hover:text-[#1967d2] font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>Job Seeker</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
