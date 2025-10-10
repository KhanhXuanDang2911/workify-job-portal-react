import type React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { routes } from "@/routes/routes.const";
import { authUtils } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ children, redirectTo = `/${routes.SIGN_IN}` }: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = authUtils.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
