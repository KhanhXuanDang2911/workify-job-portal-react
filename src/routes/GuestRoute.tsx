import type React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth/useAuth";
import { ROLE } from "@/constants";
import { admin_routes, employer_routes, routes } from "@/routes/routes.const";
import Loading from "@/components/Loading";

interface GuestRouteProps {
  children: React.ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
  const {
    state: { isAuthenticated, role, isLoading },
  } = useAuth();

  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2">
        <Loading variant="bars" />
      </div>
    );
  }

  if (isAuthenticated) {
    if (role === ROLE.ADMIN) {
      return <Navigate to={`${admin_routes.BASE}/${admin_routes.DASHBOARD}`} replace />;
    }
    if (role === ROLE.EMPLOYER) {
      return <Navigate to={`${employer_routes.BASE}/${employer_routes.JOBS}`} replace />;
    }

    return <Navigate to={`/`} replace />;
  }

  return <>{children}</>;
}
