import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, ChevronDown, LogIn, UserPlus, Settings, LogOut, User, Briefcase, BookmarkIcon, MessageCircle, File } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { employer_routes, routes } from "@/routes/routes.const";
import JobSeekerNotificationDropdown from "../JobSeekerNotificationDropdown";
import { authUtils } from "@/lib/auth";
import { toast } from "react-toastify";
import { authService } from "@/services";
import { useAuth } from "@/context/auth/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut } from "@/context/auth/auth.action";
import type { User as UserType } from "@/types";
import { getNameInitials } from "@/utils/string";
import { ROLE } from "@/constants";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileSections, setMobileSections] = useState({
    jobs: false,
    pages: false,
    blog: false,
    cv: false,
  });
  const queryClient = useQueryClient();
  const { state, dispatch } = useAuth();

  const user = state.user as UserType | null;

  const signOutMutation = useMutation({
    mutationFn: () => {
      const accessToken = authUtils.getAccessToken() || "";
      const refreshToken = authUtils.getRefreshToken() || "";
      return authService.signOut(accessToken, refreshToken);
    },
    onSettled: () => {
      dispatch(signOut());

      authUtils.clearAuth();
      queryClient.removeQueries();
      toast.success("Signed out successfully");
    },
  });

  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="main-layout">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/logo.png" alt="logo" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-primary-color">
                <Link to={routes.BASE}>Workify</Link>
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center lg:space-x-8">
            <Link to={routes.BASE} className="text-[#4b4b4b] hover:text-[#1967d2] font-[600]">
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-[#4b4b4b] hover:text-[#1967d2] font-[600]">
                Jobs <ChevronDown className="ml-1 w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" sideOffset={8} className="w-[380px] p-2 rounded-none border border-gray-100 shadow-xl bg-white backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-0.5">
                  {[
                    { label: "Find jobs", to: routes.JOB_SEARCH },
                    { label: "Saved Jobs", to: routes.MY_SAVED_JOBS },
                    { label: "Applied Jobs", to: routes.MY_APPLIED_JOBS },
                    { label: "My Resumes", to: routes.MY_RESUME },
                    { label: "Messages", to: routes.MESSAGES },
                  ].map(({ label, to }) => (
                    <Link
                      key={label}
                      to={to}
                      className="px-3 py-2 text-[13px] font-medium text-slate-700 hover:text-[#1967d2] hover:bg-[#f8faff] transition-all duration-200 hover:translate-x-0.5 border-l-2 border-transparent hover:border-[#1967d2]"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-[#4b4b4b] hover:text-[#1967d2] font-[600]">
                CV <ChevronDown className="ml-1 w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" sideOffset={8} className="w-[300px] p-2 rounded-none border border-gray-100 shadow-xl bg-white backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-0.5">
                  {[
                    { label: "Create CV", to: "/cv/create" },
                    { label: "CV Templates", to: "/cv/templates" },
                    { label: "My CVs", to: "/cv" },
                  ].map(({ label, to }) => (
                    <Link
                      key={label}
                      to={to}
                      className="px-3 py-2 text-[13px] font-medium text-slate-700 hover:text-[#1967d2] hover:bg-[#f8faff] transition-all duration-200 hover:translate-x-0.5 border-l-2 border-transparent hover:border-[#1967d2]"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to={routes.ARTICLES} className="text-[#4b4b4b] hover:text-[#1967d2] font-[600]">
              Career guide
            </Link>
            <Link to={routes.EMPLOYER_SEARCH} className="text-[#4b4b4b] hover:text-[#1967d2] font-[600]">
              Companies
            </Link>
            {/* <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-[#4b4b4b] hover:text-[#1967d2] font-[600]">
                Pages <ChevronDown className="ml-1 w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" sideOffset={8} className="w-[380px] p-2 rounded-none border border-gray-100 shadow-xl bg-white backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-0.5">
                  {[
                    { label: "About Us", to: "/about" },
                    { label: "Contact", to: "/contact" },
                    { label: "FAQ", to: "/faq" },
                    { label: "Pricing", to: "/pricing" },
                    { label: "Terms", to: "/terms" },
                    { label: "Privacy", to: "/privacy" },
                  ].map(({ label, to }) => (
                    <Link
                      key={label}
                      to={to}
                      className="px-3 py-2 text-[13px] font-medium text-slate-700 hover:text-[#1967d2] hover:bg-[#f8faff] transition-all duration-200 hover:translate-x-0.5 border-l-2 border-transparent hover:border-[#1967d2]"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </nav>

          <div className="hidden lg:flex items-center space-x-3">
            {state.isAuthenticated && state.role === ROLE.JOB_SEEKER ? (
              <>
                {/* Notifications */}
                <JobSeekerNotificationDropdown />

                {/* User Avatar Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 focus:border-none focus:outline-0 hover:bg-gray-50 rounded-lg p-2 transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName}`} alt={user?.fullName || "User"} />
                      <AvatarFallback>{getNameInitials(user?.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-900">{user?.fullName || "User"}</span>
                      <span className="text-xs text-gray-500">Job Seeker</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild className="focus:bg-sky-200 focus:text-[#1967d2]">
                      <Link to={routes.SETTINGS} className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-sky-200 focus:text-[#1967d2]">
                      <Link to={routes.MY_APPLIED_JOBS} className="cursor-pointer">
                        <Briefcase className="w-4 h-4 mr-2" />
                        My Applied Jobs
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-sky-200 focus:text-[#1967d2]">
                      <Link to={routes.MY_SAVED_JOBS} className="cursor-pointer">
                        <BookmarkIcon className="w-4 h-4 mr-2" />
                        Saved Jobs
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-sky-200 focus:text-[#1967d2]">
                      <Link to={routes.MY_RESUME} className="cursor-pointer">
                        <File className="w-4 h-4 mr-2" />
                        My Resumes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-sky-200 focus:text-[#1967d2]">
                      <Link to={routes.MESSAGES} className="cursor-pointer">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Messages
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-sky-200 focus:text-[#1967d2]">
                      <Link to={routes.SETTINGS} className="cursor-pointer">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 cursor-pointer focus:bg-sky-200 focus:text-red-600" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" className="border-[#1967d2] text-[#1967d2] hover:bg-[#e0eeff] bg-transparent font-semibold">
                  <UserPlus className="w-4 h-4 mr-2" />
                  <Link to={routes.SIGN_UP}>Sign Up</Link>
                </Button>
                <Button size="sm" className="bg-[#1967d2] hover:bg-[#1557b8] text-white font-semibold">
                  <LogIn className="w-4 h-4 mr-2" />
                  <Link to={routes.SIGN_IN}>Sign In</Link>
                </Button>
              </>
            )}

            <div className="w-px h-6 bg-gray-300"></div>
            <Link
              to={employer_routes.BASE}
              className="text-[#4b4b4b] hover:text-[#1967d2] font-medium px-4 py-2 hover:bg-[#f8faff] rounded-md transition-all duration-200 border border-transparent hover:border-[#e0eeff]"
            >
              Employers
            </Link>
          </div>

          {/* Mobile menu button (visible until lg) */}
          <div className="lg:hidden flex items-center space-x-2">
            {state.isAuthenticated && state.role === ROLE.JOB_SEEKER ? (
              <>
                {/* Mobile Notifications */}
                <JobSeekerNotificationDropdown />
              </>
            ) : (
              <>
                <Link to={routes.SIGN_UP}>
                  <Button variant="outline" size="sm" className="border-[#1967d2] text-[#1967d2] hover:bg-[#e0eeff] bg-transparent font-semibold p-2">
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </Link>

                <Link to={routes.SIGN_IN}>
                  <Button size="sm" className="bg-[#1967d2] hover:bg-[#1557b8] text-white font-semibold p-2">
                    <LogIn className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            )}

            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-3">
              {state.isAuthenticated && state.role === ROLE.JOB_SEEKER && (
                <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName}`} alt={user?.fullName || "User"} />
                    <AvatarFallback>{getNameInitials(user?.fullName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{user?.fullName || "User"}</span>
                    <span className="text-xs text-gray-500">Job Seeker</span>
                  </div>
                </div>
              )}

              <Link to={routes.BASE} className="text-[#4b4b4b] hover:text-[#1967d2] font-[600]" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>

              {/* Jobs - mobile dropdown */}
              <div>
                <button
                  onClick={() => setMobileSections((prev) => ({ ...prev, jobs: !prev.jobs }))}
                  className="w-full text-left text-[#4b4b4b] hover:text-[#1967d2] font-[600] flex items-center justify-between"
                  aria-expanded={mobileSections.jobs}
                >
                  Jobs
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileSections.jobs ? "rotate-180" : ""}`} />
                </button>
                {mobileSections.jobs && (
                  <div className="mt-2 ml-4 flex flex-col space-y-2">
                    <Link to={routes.JOB_SEARCH} className="text-sm text-slate-600 hover:text-[#1967d2] py-1" onClick={() => setIsMenuOpen(false)}>
                      Find jobs
                    </Link>
                    <Link to={routes.MY_APPLIED_JOBS} className="text-sm text-slate-600 hover:text-[#1967d2] py-1" onClick={() => setIsMenuOpen(false)}>
                      Applied jobs
                    </Link>
                    <Link to={routes.MY_SAVED_JOBS} className="text-sm text-slate-600 hover:text-[#1967d2] py-1" onClick={() => setIsMenuOpen(false)}>
                      Bookmarked jobs
                    </Link>
                  </div>
                )}
              </div>

              {/* CV - mobile dropdown */}
              <div>
                <button
                  onClick={() => setMobileSections((prev) => ({ ...prev, cv: !prev.cv }))}
                  className="w-full text-left text-[#4b4b4b] hover:text-[#1967d2] font-[600] flex items-center justify-between"
                  aria-expanded={mobileSections.cv}
                >
                  CV
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileSections.cv ? "rotate-180" : ""}`} />
                </button>
                {mobileSections.cv && (
                  <div className="mt-2 ml-4 flex flex-col space-y-2">
                    <Link to="/cv/create" className="text-sm text-slate-600 hover:text-[#1967d2] py-1" onClick={() => setIsMenuOpen(false)}>
                      Create CV
                    </Link>
                    <Link to="/cv/templates" className="text-sm text-slate-600 hover:text-[#1967d2] py-1" onClick={() => setIsMenuOpen(false)}>
                      CV Templates
                    </Link>
                    <Link to="/cv" className="text-sm text-slate-600 hover:text-[#1967d2] py-1" onClick={() => setIsMenuOpen(false)}>
                      My CVs
                    </Link>
                  </div>
                )}
              </div>

              {/* Companies - mobile dropdown */}
              <Link to={routes.EMPLOYER_SEARCH} className="text-[#4b4b4b] hover:text-[#1967d2] font-[600]" onClick={() => setIsMenuOpen(false)}>
                Companies
              </Link>

              {/* Articles - mobile dropdown */}
              <Link to={routes.ARTICLES} className="text-[#4b4b4b] hover:text-[#1967d2] font-[600]" onClick={() => setIsMenuOpen(false)}>
                Career guide
              </Link>

              {/* Pages - mobile dropdown */}
              {/* <div>
                <button
                  onClick={() =>
                    setMobileSections((prev) => ({
                      ...prev,
                      pages: !prev.pages,
                    }))
                  }
                  className="w-full text-left text-[#4b4b4b] hover:text-[#1967d2] font-[600] flex items-center justify-between"
                  aria-expanded={mobileSections.pages}
                >
                  Pages
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileSections.pages ? "rotate-180" : ""}`} />
                </button>
                {mobileSections.pages && (
                  <div className="mt-2 ml-4 flex flex-col space-y-2">
                    <Link to="/about" className="text-sm text-slate-600 hover:text-[#1967d2] py-1" onClick={() => setIsMenuOpen(false)}>
                      About Us
                    </Link>
                    <Link to="/contact" className="text-sm text-slate-600 hover:text-[#1967d2] py-1" onClick={() => setIsMenuOpen(false)}>
                      Contact
                    </Link>
                    <Link to="/faq" className="text-sm text-slate-600 hover:text-[#1967d2] py-1" onClick={() => setIsMenuOpen(false)}>
                      FAQ
                    </Link>
                    <Link to="/pricing" className="text-sm text-slate-600 hover:text-[#1967d2] py-1" onClick={() => setIsMenuOpen(false)}>
                      Pricing
                    </Link>
                    <Link to="/terms" className="text-sm text-slate-600 hover:text-[#1967d2] py-1" onClick={() => setIsMenuOpen(false)}>
                      Terms
                    </Link>
                    <Link to="/privacy" className="text-sm text-slate-600 hover:text-[#1967d2] py-1" onClick={() => setIsMenuOpen(false)}>
                      Privacy
                    </Link>
                  </div>
                )}
              </div> */}

              {state.isAuthenticated && state.role === ROLE.JOB_SEEKER && (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <Link to={routes.SETTINGS} className="flex items-center space-x-3 text-gray-700 hover:text-[#1967d2] font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                    <User className="w-5 h-5" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to={routes.MY_APPLIED_JOBS}
                    className="flex items-center space-x-3 text-gray-700 hover:text-[#1967d2] font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Briefcase className="w-5 h-5" />
                    <span>My Applied Jobs</span>
                  </Link>

                  <Link to={routes.MY_SAVED_JOBS} className="flex items-center space-x-3 text-gray-700 hover:text-[#1967d2] font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                    <BookmarkIcon className="w-5 h-5" />
                    <span>Saved Jobs</span>
                  </Link>

                  <Link to={routes.SETTINGS} className="flex items-center space-x-3 text-gray-700 hover:text-[#1967d2] font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>

                  <button
                    className="flex items-center space-x-3 text-red-600 hover:text-red-700 font-medium py-2 w-full text-left"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleSignOut();
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}

              <div className="border-t border-gray-200 pt-3 mt-2">
                <Link
                  to={employer_routes.BASE}
                  className="text-[#4b4b4b] hover:text-[#1967d2] font-[600] block py-2 px-3 hover:bg-[#f8faff] rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Employers
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
