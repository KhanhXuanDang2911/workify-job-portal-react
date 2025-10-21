import EmployerHeader from "@/components/EmployerHeader";
import { Outlet, useLocation } from "react-router-dom";
import EmployerSidebar from "@/components/EmployerSideBar";
import { useContext, useState } from "react";
import { ResponsiveContext } from "@/context/ResponsiveContext";
import { useAuth } from "@/context/auth/useAuth";
import { ROLE } from "@/constants";
import { employer_routes } from "@/routes/routes.const";

const employerPublicRoutes = [employer_routes.SIGN_UP, employer_routes.SIGN_IN, employer_routes.FORGOT_PASSWORD, employer_routes.RESET_PASSWORD, employer_routes.VERIFY_EMAIL];

export default function EmployerLayout() {
  const { device } = useContext(ResponsiveContext);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {
    state: { isAuthenticated, role },
  } = useAuth();

  const location = useLocation();

  const isPublicRoute = employerPublicRoutes.some((route) => location.pathname.includes(route));
  const isBaseRoute = location.pathname === employer_routes.BASE;

  return (
    <>
      <div className="h-screen bg-gray-50 flex flex-col">
        <EmployerHeader
          onMobileMenuClick={() => setMobileSidebarOpen((v) => !v)}
          mobileSidebarOpen={mobileSidebarOpen}
          isCollapsed={isCollapsed}
          onToggleCollapsed={() => setIsCollapsed((v) => !v)}
          device={device}
        />
        {isAuthenticated && role === ROLE.EMPLOYER && !isPublicRoute && !isBaseRoute ? (
          <div className="flex flex-row flex-1 overflow-hidden">
            <EmployerSidebar
              mobileOpen={device !== "desktop" && mobileSidebarOpen}
              onClose={() => setMobileSidebarOpen(false)}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              device={device}
            />
            {/* <main className="flex-1 overflow-y-auto"> */}
            <Outlet />
            {/* </main> */}
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </>
  );
}
