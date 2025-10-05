import Footer from "@/components/Footer";
import EmployerHeader from "@/components/EmployerHeader";
import { Outlet, useLocation } from "react-router-dom";
import EmployerSidebar from "@/components/EmployerSideBar";
import { useContext, useState } from "react";
import { ResponsiveContext } from "@/context/ResponsiveContext";

export default function EmployerLayout() {
  const { device } = useContext(ResponsiveContext);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // test
   const location = useLocation();
  const authenticatedPaths = [
    "/employer/applications",
    "/employer/search-talents",
    "/employer/viewed-talents",
    "/employer/saved-talents",
    "/employer/jobs",
    "/employer/jobs/add",
    "/employer/settings",
    "/employer/organization",
  ];
  const publicPaths = [
    "/employer/sign-up",
    "/employer/sign-in",
    "/employer/home",
  ];
  const authenticated = authenticatedPaths.some((p) => location.pathname.startsWith(p));

  return (
    <>
      {authenticated ? (
        <div className="h-screen bg-gray-50 flex flex-col">
          <EmployerHeader
            onMobileMenuClick={() => setMobileSidebarOpen((v) => !v)}
            mobileSidebarOpen={mobileSidebarOpen}
            isCollapsed={isCollapsed}
            onToggleCollapsed={() => setIsCollapsed((v) => !v)}
            device={device}
            isAuthenticated={true}
          />

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
        </div>
      ) : (
        <>
          <EmployerHeader isAuthenticated={false} />
          <Outlet />
          <Footer />
        </>
      )}
    </>
  );
}
