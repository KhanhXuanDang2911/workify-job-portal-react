import type React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { admin_routes, routes } from "@/routes/routes.const";
import { employer_routes } from "@/routes/routes.const";
import { useUserAuth } from "@/context/UserAuth";
import { useEmployerAuth } from "@/context/EmployerAuth";
import { ROLE } from "@/constants";
import Loading from "@/components/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { state: userState } = useUserAuth();
  const { state: employerState } = useEmployerAuth();

  const isEmployerRoute = requiredRole === ROLE.EMPLOYER;

  const isAuthenticated = isEmployerRoute
    ? employerState.isAuthenticated
    : userState.isAuthenticated;
  const isLoading = isEmployerRoute
    ? employerState.isLoading
    : userState.isLoading;
  const user = userState.user;
  const employer = employerState.employer;

  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2">
        <Loading size="lg" variant="bars" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const isEmployerApp = window.location.pathname.startsWith(
      `${employer_routes.BASE}`
    );

    if (isEmployerApp) {
      return (
        <Navigate
          to={`${employer_routes.BASE}/${employer_routes.SIGN_IN}`}
          state={{ from: location }}
        />
      );
    }

    return <Navigate to={`/${routes.SIGN_IN}`} state={{ from: location }} />;
  }

  if (requiredRole) {
    if (requiredRole === ROLE.EMPLOYER && !employer) {
      return (
        <Navigate
          to={`${employer_routes.BASE}/${employer_routes.SIGN_IN}`}
          state={{ from: location }}
        />
      );
    } else if (requiredRole === ROLE.ADMIN && user?.role !== ROLE.ADMIN) {
      return <Navigate to={`/${routes.SIGN_IN}`} state={{ from: location }} />;
    } else if (requiredRole === ROLE.JOB_SEEKER) {
      if (user?.role !== ROLE.JOB_SEEKER && user?.role !== ROLE.ADMIN) {
        return (
          <Navigate to={`/${routes.SIGN_IN}`} state={{ from: location }} />
        );
      }
    }
  }

  return <>{children}</>;
}
