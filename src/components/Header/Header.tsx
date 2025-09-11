import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu,
  X,
  ChevronDown,
  LogIn,
  UserPlus,
  Settings,
  LogOut,
  User,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { employer_routes, routes } from "@/routes/routes.const";
import JobSeekerNotificationDropdown from "../JobSeekerNotificationDropdown";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileSections, setMobileSections] = useState({
    jobs: false,
    pages: false,
    blog: false,
    cv: false,
  });

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
            <Link
              to={routes.BASE}
              className="text-[#4b4b4b] hover:text-[#1967d2] font-[600]"
            >
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-[#4b4b4b] hover:text-[#1967d2] font-[600]">
                Jobs <ChevronDown className="ml-1 w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={8}
                className="w-[380px] p-2 rounded-none border border-gray-100 shadow-xl bg-white backdrop-blur-sm"
              >
                <div className="grid grid-cols-2 gap-0.5">
                  {[
                    { label: "Jobs Grid", to: "/jobs/grid" },
                    { label: "Jobs Grid with Map", to: "/jobs/grid-map" },
                    { label: "Jobs List", to: "/jobs/list" },
                    { label: "Job Detail", to: "/jobs/1" },
                    { label: "Apply Jobs", to: "/jobs/apply" },
                    { label: "Job Categories", to: "/jobs/categories" },
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
                Blog <ChevronDown className="ml-1 w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={8}
                className="w-[320px] p-2 rounded-none border border-gray-100 shadow-xl bg-white backdrop-blur-sm"
              >
                <div className="grid grid-cols-2 gap-0.5">
                  {[
                    { label: "Blog Grid", to: "/blog/grid" },
                    { label: "Blog List", to: "/blog/list" },
                    { label: "Blog Single", to: "/blog/1" },
                    { label: "Author", to: "/blog/author" },
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
              <DropdownMenuContent
                align="start"
                sideOffset={8}
                className="w-[300px] p-2 rounded-none border border-gray-100 shadow-xl bg-white backdrop-blur-sm"
              >
                <div className="grid grid-cols-2 gap-0.5">
                  {[
                    { label: "Create CV", to: "/cv/create" },
                    { label: "CV Templates", to: "/cv/templates" },
                    { label: "My CVs", to: "/cv" },
                    { label: "Import from PDF", to: "/cv/import" },
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
                Pages <ChevronDown className="ml-1 w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={8}
                className="w-[380px] p-2 rounded-none border border-gray-100 shadow-xl bg-white backdrop-blur-sm"
              >
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
            </DropdownMenu>
          </nav>

          <div className="hidden lg:flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="border-[#1967d2] text-[#1967d2] hover:bg-[#e0eeff] bg-transparent font-semibold"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              <Link to={routes.SIGN_UP}>Sign Up</Link>
            </Button>
            <Button
              size="sm"
              className="bg-[#1967d2] hover:bg-[#1557b8] text-white font-semibold"
            >
              <LogIn className="w-4 h-4 mr-2" />
              <Link to={routes.SIGN_IN}>Sign In</Link>
            </Button>

            {/* Notifications */}
            {/* <JobSeekerNotificationDropdown /> */}

            {/* User Avatar Menu */}
            {/* <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://i.pravatar.cc/150?img=3"
                    alt="User"
                  />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-900">
                    Jane Smith
                  </span>
                  <span className="text-xs text-gray-500">Job Seeker</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Search className="w-4 h-4 mr-2" />
                  My Applications
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
            <Link to={routes.SIGN_UP}>
              <Button
                variant="outline"
                size="sm"
                className="border-[#1967d2] text-[#1967d2] hover:bg-[#e0eeff] bg-transparent font-semibold p-2"
              >
                <UserPlus className="w-4 h-4" />
              </Button>
            </Link>

            <Link to={routes.SIGN_IN}>
              <Button
                size="sm"
                className="bg-[#1967d2] hover:bg-[#1557b8] text-white font-semibold p-2"
              >
                <LogIn className="w-4 h-4" />
              </Button>
            </Link>

            {/* Mobile Notifications */}
            {/* <JobSeekerNotificationDropdown /> */}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-3">
              {/* User Info */}
              {/* <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src="https://i.pravatar.cc/150?img=3"
                    alt="User"
                  />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    Jane Smith
                  </span>
                  <span className="text-xs text-gray-500">Job Seeker</span>
                </div>
              </div> */}

              <Link
                to={routes.BASE}
                className="text-[#4b4b4b] hover:text-[#1967d2] font-[600]"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              {/* Jobs - mobile dropdown */}
              <div>
                <button
                  onClick={() =>
                    setMobileSections((prev) => ({ ...prev, jobs: !prev.jobs }))
                  }
                  className="w-full text-left text-[#4b4b4b] hover:text-[#1967d2] font-[600] flex items-center justify-between"
                  aria-expanded={mobileSections.jobs}
                >
                  Jobs
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileSections.jobs ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileSections.jobs && (
                  <div className="mt-2 ml-4 flex flex-col space-y-2">
                    <Link
                      to="/jobs/grid"
                      className="text-sm text-slate-600 hover:text-[#1967d2] py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Jobs Grid
                    </Link>
                    <Link
                      to="/jobs/grid-map"
                      className="text-sm text-slate-600 hover:text-[#1967d2] py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Jobs Grid with Map
                    </Link>
                    <Link
                      to="/jobs/list"
                      className="text-sm text-slate-600 hover:text-[#1967d2] py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Jobs List
                    </Link>
                    <Link
                      to="/jobs/1"
                      className="text-sm text-slate-600 hover:text-[#1967d2] py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Job Detail
                    </Link>
                    <Link
                      to="/jobs/apply"
                      className="text-sm text-slate-600 hover:text-[#1967d2] py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Apply Jobs
                    </Link>
                    <Link
                      to="/jobs/categories"
                      className="text-sm text-slate-600 hover:text-[#1967d2] py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Job Categories
                    </Link>
                  </div>
                )}
              </div>

              {/* Blog - mobile dropdown */}
              <div>
                <button
                  onClick={() =>
                    setMobileSections((prev) => ({ ...prev, blog: !prev.blog }))
                  }
                  className="w-full text-left text-[#4b4b4b] hover:text-[#1967d2] font-[600] flex items-center justify-between"
                  aria-expanded={mobileSections.blog}
                >
                  Blog
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileSections.blog ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileSections.blog && (
                  <div className="mt-2 ml-4 flex flex-col space-y-2">
                    <Link
                      to="/blog/grid"
                      className="text-sm text-slate-600 hover:text-[#1967d2] py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Blog Grid
                    </Link>
                    <Link
                      to="/blog/list"
                      className="text-sm text-slate-600 hover:text-[#1967d2] py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Blog List
                    </Link>
                    <Link
                      to="/blog/1"
                      className="text-sm text-slate-600 hover:text-[#1967d2] py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Blog Single
                    </Link>
                    <Link
                      to="/blog/author"
                      className="text-sm text-slate-600 hover:text-[#1967d2] py-1 font-[600]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Author
                    </Link>
                  </div>
                )}
              </div>

              {/* CV - mobile dropdown */}
              <div>
                <button
                  onClick={() =>
                    setMobileSections((prev) => ({ ...prev, cv: !prev.cv }))
                  }
                  className="w-full text-left text-[#4b4b4b] hover:text-[#1967d2] font-[600] flex items-center justify-between"
                  aria-expanded={mobileSections.cv}
                >
                  CV
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileSections.cv ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileSections.cv && (
                  <div className="mt-2 ml-4 flex flex-col space-y-2">
                    <Link
                      to="/cv/create"
                      className="text-sm text-slate-600 hover:text-[#1967d2] py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Create CV
                    </Link>
                    <Link
                      to="/cv/templates"
                      className="text-sm text-slate-600 hover:text-[#1967d2] py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      CV Templates
                    </Link>
                    <Link
                      to="/cv"
                      className="text-sm text-slate-600 hover:text-[#1967d2] py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My CVs
                    </Link>
                    <Link
                      to="/cv/import"
                      className="text-sm text-slate-600 hover:text-[#1967d2] py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Import from PDF
                    </Link>
                  </div>
                )}
              </div>

              {/* Pages - mobile dropdown */}
              <div>
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
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileSections.pages ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileSections.pages && (
                  <div className="mt-2 ml-4 flex flex-col space-y-2">
                    <Link
                      to="/about"
                      className="text-sm text-slate-600 hover:text-[#1967d2] py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      About Us
                    </Link>
                    <Link
                      to="/contact"
                      className="text-sm text-slate-600 hover:text-[#1967d2] py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Contact
                    </Link>
                    <Link
                      to="/faq"
                      className="text-sm text-slate-600 hover:text-[#1967d2] py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      FAQ
                    </Link>
                    <Link
                      to="/pricing"
                      className="text-sm text-slate-600 hover:text-[#1967d2] py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Pricing
                    </Link>
                    <Link
                      to="/terms"
                      className="text-sm text-slate-600 hover:text-[#1967d2] py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Terms
                    </Link>
                    <Link
                      to="/privacy"
                      className="text-sm text-slate-600 hover:text-[#1967d2] py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Privacy
                    </Link>
                  </div>
                )}
              </div>

              {/* <div className="border-t border-gray-200 pt-3 mt-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 text-gray-700 hover:text-[#1967d2] font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/applications"
                  className="flex items-center space-x-3 text-gray-700 hover:text-[#1967d2] font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Search className="w-5 h-5" />
                  <span>My Applications</span>
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
