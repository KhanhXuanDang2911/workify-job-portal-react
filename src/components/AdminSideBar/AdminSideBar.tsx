import type React from "react";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, User, LogOut, Menu, X, BookHeart, Factory, Building, MapPinPen, Users, FolderOpen, BriefcaseBusiness } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LucideProps } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authUtils } from "@/lib/auth";
import { authService } from "@/services";
import { useAuth } from "@/context/auth/useAuth";
import { signOut } from "@/context/auth/auth.action";
import { toast } from "react-toastify";
import { admin_routes } from "@/routes/routes.const";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: `${admin_routes.BASE}/${admin_routes.DASHBOARD}`,
  },
  {
    id: "jobs",
    label: "Jobs",
    icon: BriefcaseBusiness,
    href: `${admin_routes.BASE}/${admin_routes.JOBS}`,
  },
  {
    id: "posts",
    label: "Posts",
    icon: BookHeart,
    href: `${admin_routes.BASE}/${admin_routes.POSTS}`,
  },
  {
    id: "post-categories",
    label: "Post Categories",
    icon: FolderOpen,
    href: `${admin_routes.BASE}/${admin_routes.POST_CATEGORIES}`,
  },
  {
    id: "companies",
    label: "Companies",
    icon: Building,
    href: `${admin_routes.BASE}/${admin_routes.EMPLOYERS}`,
  },
  {
    id: "industries",
    label: "Industries",
    icon: Factory,
    href: `${admin_routes.BASE}/${admin_routes.CATEGORY_JOBS_INDUSTRIES}`,
  },
  {
    id: "locations",
    label: "Locations",
    icon: MapPinPen,
    href: `${admin_routes.BASE}/${admin_routes.LOCATION}`,
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
    href: `${admin_routes.BASE}/${admin_routes.USERS}`,
  },
];

type Face = "up" | "down";
type Position = "top" | "mid" | "bottom";

function getTailwindClass(face: Face, position: Position): string {
  const map: Record<Face, Record<Position, string>> = {
    up: {
      top: "rounded-tl-[32px] rounded-tr-[4px] rounded-bl-[0px] rounded-br-[32px]",
      mid: "rounded-tl-[32px] rounded-tr-[0px] rounded-bl-[0px] rounded-br-[32px]",
      bottom: "rounded-tl-[32px] rounded-tr-[0px] rounded-bl-[4px] rounded-br-[32px]",
    },
    down: {
      top: "rounded-tr-[32px] rounded-bl-[32px] rounded-br-[0px]",
      mid: "rounded-tl-[0px] rounded-tr-[32px] rounded-bl-[32px] rounded-br-[0px]",
      bottom: "rounded-tl-[0px] rounded-tr-[32px] rounded-bl-[32px] rounded-br-[4px]",
    },
  };

  return map[face][position];
}

interface SidebarItemProps {
  item: MenuItem;
  isCollapsed: boolean;
  isActive: boolean;
  face: Face;
  position: Position;
}

export function SidebarItem({ item, isCollapsed, isActive, face, position }: SidebarItemProps) {
  const { label, icon: Icon, href = "#" } = item;

  const borderClass = getTailwindClass(face, position);

  const baseClass = `
    h-[56px] flex items-center gap-3 px-4  text-[15px]
    transition-all duration-200 cursor-pointer select-none 
    outline outline-1 outline-[#009473]/30 outline-offset-[-1px]
    hover:outline-[#009473]/100 hover:bg-[#6EBD9D] hover:text-[#6AE2B2]
    ${borderClass}
    ${isCollapsed ? "w-[72px] justify-center" : "w-[177px]"}
    ${isActive ? " text-[#1E1E1E] bg-[#4B9D7C] drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)]" : "text-[#4c5b55]  bg-[#6EBD9D]"}
  `;
  return (
    <Link to={href} className={baseClass}>
      {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
      {!isCollapsed && <span className="font-normal">{label}</span>}
    </Link>
  );
}

export default function AdminSidebar() {
  const location = useLocation();
  const [userName] = useState("Dung Van");
  const [userEmail] = useState("admin@workify.com");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { dispatch } = useAuth();
  const queryClient = useQueryClient();

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
    <div className={cn("flex flex-col h-screen relative bg-[#6AE2B2] transition-all duration-300 overflow-hidden", isCollapsed ? "w-[120px]" : "w-[215px]")}>
      {/* Header with Logo and Toggle */}
      <div className="flex items-center justify-between p-6 py-4">
        {!isCollapsed && (
          <div className="flex gap-2 items-center">
            <img src="/logo.png" alt="" className="w-10 h-10" />
            <h1 className="text-2xl font-bold text-[#4B9D7C]">Workify</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed((isCollapsed) => !isCollapsed)}
          className={cn("text-white hover:bg-white/20", !isCollapsed ? "hidden" : "mx-auto")}
        >
          {isCollapsed && <Menu className="h-8! w-8! text-[#4B9D7C]" strokeWidth={1.8} />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed((isCollapsed) => !isCollapsed)}
          className={cn("text-white hover:bg-white/20 absolute right-1 top-1", isCollapsed && "hidden")}
        >
          <X className="h-5 w-5 text-[#4B9D7C]" />
        </Button>
      </div>
      {/* User Profile Section */}
      <Link
        to="/admin/profile"
        className={cn(
          "h-[56px] flex items-center gap-3 px-4 text-[15px] transition-all duration-200 cursor-pointer select-none outline-1 outline-[#009473]/30 outline-offset-[-1px] hover:outline-[#009473]/100 hover:bg-[#6EBD9D] hover:text-[#6AE2B2] mx-auto mb-4",
          isCollapsed ? "w-[72px] justify-center" : "w-[177px] justify-start",
          location.pathname === "/admin/profile" ? "text-[#1E1E1E] bg-[#4B9D7C] drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)]" : "text-[#4c5b55] bg-[#6EBD9D]",
          "rounded-tl-[4px] rounded-tr-[32px] rounded-bl-[32px] rounded-br-[4px]"
        )}
      >
        <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
          <User className="h-5 w-5 flex-shrink-0" />
        </div>
        {!isCollapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{userName}</p>
            <p className="text-xs truncate">{userEmail}</p>
          </div>
        )}
      </Link>

      {/* Menu Items */}
      <nav className="flex-1 flex flex-col items-center z-10 px-4 overflow-y-auto ">
        {menuItems.map((item, index, array) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          const position = index === 0 ? "top" : index === array.length - 1 ? "bottom" : "mid";
          return <SidebarItem key={item.id} item={item} isCollapsed={isCollapsed} isActive={isActive} face={index % 2 === 0 ? "up" : "down"} position={position} />;
        })}
      </nav>
      {/* Decorative Plant Section */}
      <img src="/asset-1.png" alt="" className="absolute bottom-1 w-full" />
      {/* Logout Button */}
      <button
        className={cn(
          "h-[56px] flex items-center gap-3 px-4 text-[15px] transition-all duration-200 outline-1 outline-[#009473]/30 outline-offset-[-1px] hover:outline-[#009473]/100 hover:bg-[#6EBD9D] hover:text-[#6AE2B2] mx-auto mb-4 absolute bottom-1 z-10 left-1/2 transform -translate-x-1/2 text-[#4c5b55] bg-[#6EBD9D] cursor-pointer",
          isCollapsed ? "w-[72px] justify-center" : "w-[177px] justify-start",
          "rounded-tl-[32px] rounded-tr-[4px] rounded-bl-[4px] rounded-br-[32px]"
        )}
        onClick={handleSignOut}
      >
        <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
          <LogOut className="h-5 w-5 flex-shrink-0" />
        </div>
        {!isCollapsed && <span>Log out</span>}
      </button>
    </div>
  );
}
