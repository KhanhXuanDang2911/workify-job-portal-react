import type { RouteObject } from "react-router-dom";
import EmployerLayout from "@/layouts/EmployerLayout/EmployerLayout";
import Candidates from "@/pages/Candidates";
import EmployerPostJob from "@/pages/EmployerPostJob";
import Jobs from "@/pages/Jobs";
import Organization from "@/pages/Employer/Organization";
import Settings from "@/pages/Employer/Settings";
import { employer_routes } from "../routes.const";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { ROLE } from "@/constants";
import Notifications from "@/pages/Notifications";

const EmployerProtectedRoutes: RouteObject[] = [
  {
    path: employer_routes.BASE,
    element: <EmployerLayout />,
    children: [
      {
        path: employer_routes.APPLICATIONS,
        element: (
          <ProtectedRoute requiredRole={ROLE.EMPLOYER}>
            <Candidates />
          </ProtectedRoute>
        ),
      },
      {
        path: employer_routes.JOBS,
        element: (
          <ProtectedRoute requiredRole={ROLE.EMPLOYER}>
            <Jobs />
          </ProtectedRoute>
        ),
      },
      {
        path: employer_routes.JOB_ADD,
        element: (
          <ProtectedRoute requiredRole={ROLE.EMPLOYER}>
            <EmployerPostJob />
          </ProtectedRoute>
        ),
      },
      {
        path: `${employer_routes.JOBS}/:jobId/edit`,
        element: (
          <ProtectedRoute requiredRole={ROLE.EMPLOYER}>
            <EmployerPostJob />
          </ProtectedRoute>
        ),
      },
      {
        path: employer_routes.ORGANIZATION,
        element: (
          <ProtectedRoute requiredRole={ROLE.EMPLOYER}>
            <Organization />
          </ProtectedRoute>
        ),
      },
      {
        path: employer_routes.SETTINGS,
        element: (
          <ProtectedRoute requiredRole={ROLE.EMPLOYER}>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: employer_routes.NOTIFICATIONS,
        element: (
          <ProtectedRoute requiredRole={ROLE.EMPLOYER}>
            <Notifications />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

export default EmployerProtectedRoutes;
