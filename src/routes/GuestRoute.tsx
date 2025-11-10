import type React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserAuth } from "@/context/user-auth";
import { useEmployerAuth } from "@/context/employer-auth";
import { ROLE } from "@/constants";
import { admin_routes, employer_routes } from "@/routes/routes.const";
import Loading from "@/components/Loading";

interface GuestRouteProps {
  children: React.ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
  const { state: userState } = useUserAuth();
  const { state: employerState } = useEmployerAuth();
  const location = useLocation();

  // Determine if current route is employer route
  const isEmployerRoute = location.pathname.startsWith(employer_routes.BASE);

  const isLoading = userState.isLoading || employerState.isLoading;

  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2">
        <Loading variant="bars" />
      </div>
    );
  }

  // If on employer route, only check employer auth
  if (isEmployerRoute) {
    if (employerState.isAuthenticated && employerState.employer) {
      return (
        <Navigate
          to={`${employer_routes.BASE}/${employer_routes.JOBS}`}
          replace
        />
      );
    }
    // Allow access to employer guest pages even if user is logged in
    return <>{children}</>;
  }

  // If on user/admin route, only check user auth
  if (userState.isAuthenticated && userState.user) {
    if (userState.user.role === ROLE.ADMIN) {
      return (
        <Navigate
          to={`${admin_routes.BASE}/${admin_routes.DASHBOARD}`}
          replace
        />
      );
    }
    return <Navigate to={`/`} replace />;
  }

  return <>{children}</>;
}
