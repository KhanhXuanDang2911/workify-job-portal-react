import { Outlet, useLocation } from "react-router-dom";
import { admin_routes } from "@/routes/routes.const";
import AdminSidebar from "@/components/AdminSideBar";
import { useState, useContext } from "react";
import { ResponsiveContext } from "@/context/ResponsiveContext";

export default function AdminLayout() {
  const location = useLocation();
  const { device } = useContext(ResponsiveContext);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const adminPublicRoutes = [admin_routes.FORGOT_PASSWORD, admin_routes.RESET_PASSWORD, admin_routes.VERIFY_EMAIL];
  const isPublicRoute = adminPublicRoutes.some((route) => location.pathname.includes(route));

  return (
    <>
      {isPublicRoute ? (
        <Outlet />
      ) : (
        <div className="flex flex-row overflow-hidden min-h-screen bg-gray-50">
          {/* Sidebar for protected routes */}
          <AdminSidebar
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            device={device}
          />
          <main className="flex-1 h-screen overflow-auto">
            <Outlet />
          </main>
        </div>
      )}
    </>
  );
}
