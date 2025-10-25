import { Outlet, useLocation } from "react-router-dom";
import { admin_routes } from "@/routes/routes.const";
import AdminSidebar from "@/components/AdminSideBar";

export default function AdminLayout() {
  const location = useLocation();

  const adminPublicRoutes = [admin_routes.SIGN_IN, admin_routes.FORGOT_PASSWORD, admin_routes.RESET_PASSWORD, admin_routes.VERIFY_EMAIL];
  const isPublicRoute = adminPublicRoutes.some((route) => location.pathname.includes(route));

  return (
    <div className="min-h-screen">
      {isPublicRoute ? (
        <Outlet />
      ) : (
        <div className="flex">
          {/* Sidebar for protected routes */}
          <AdminSidebar />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      )}
    </div>
  );
}
