import type React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { routes } from "@/routes/routes.const";
import { employer_routes } from "@/routes/routes.const";
import { useAuth } from "@/context/auth/useAuth";
import { ROLE } from "@/constants";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation();
  const {
    state: { isAuthenticated, role },
  } = useAuth();

  console.log("LOCATION", location);

  if (!isAuthenticated) {
    const defaultRedirect = location.pathname.startsWith("/employer") ? `${employer_routes.BASE}/${employer_routes.SIGN_IN}` : `/${routes.SIGN_IN}`;

    return <Navigate to={defaultRedirect} state={{ from: location }} />;
  }

  if (requiredRole && role !== requiredRole) {
    const loginPath = requiredRole === ROLE.EMPLOYER ? `${employer_routes.BASE}/${employer_routes.SIGN_IN}` : `/${routes.SIGN_IN}`;
    console.log(role);
    return <Navigate to={loginPath} state={{ from: location }} />;
  }

  return <>{children}</>;
}
