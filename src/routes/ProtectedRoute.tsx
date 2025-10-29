import type React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { admin_routes, routes } from "@/routes/routes.const";
import { employer_routes } from "@/routes/routes.const";
import { useAuth } from "@/context/auth/useAuth";
import { ROLE } from "@/constants";
import Loading from "@/components/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation();
  const {
    state: { isAuthenticated, role, isLoading },
  } = useAuth();

  // console.log("LOCATION", location);
  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2">
        <Loading size="lg" variant="bars" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const isEmployerApp = window.location.pathname.startsWith(`${employer_routes.BASE}`);
    const isAdmin = window.location.pathname.startsWith(`${admin_routes.BASE}`);

    if (isAdmin) {
      return <Navigate to={`${admin_routes.BASE}/${admin_routes.SIGN_IN}`} state={{ from: location }} />;
    } else if (isEmployerApp) {
      return <Navigate to={`${employer_routes.BASE}/${employer_routes.SIGN_IN}`} state={{ from: location }} />;
    }

    const defaultRedirect = `/${routes.SIGN_IN}`;

    return <Navigate to={defaultRedirect} state={{ from: location }} />;
  }

  if (requiredRole && role !== requiredRole) {
    console.log(role);

    if (requiredRole === ROLE.EMPLOYER) {
      return <Navigate to={`${employer_routes.BASE}/${employer_routes.SIGN_IN}`} state={{ from: location }} />;
    } else if (requiredRole === ROLE.ADMIN) {
      return <Navigate to={`${admin_routes.BASE}/${admin_routes.SIGN_IN}`} state={{ from: location }} />;
    }
    return <Navigate to={`/${routes.SIGN_IN}`} state={{ from: location }} />;
  }

  return <>{children}</>;
}
