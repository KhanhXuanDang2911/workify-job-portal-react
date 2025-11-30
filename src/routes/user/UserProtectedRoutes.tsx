import type { RouteObject } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import Settings from "@/pages/User/Settings";
import MyResume from "@/pages/User/MyResume";
import MySavedJobs from "@/pages/User/MySavedJobs";
import Overview from "@/pages/User/Overview";
import { routes } from "../routes.const";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { ROLE } from "@/constants";
import MyApplyJobs from "@/pages/User/MyApplyJobs";
import Notifications from "@/pages/Notifications";
import Messages from "@/pages/Messages";

const UserProtectedRoutes: RouteObject[] = [
  {
    path: routes.BASE,
    element: <MainLayout />,
    children: [
      {
        path: routes.OVERVIEW,
        element: (
          <ProtectedRoute requiredRole={ROLE.JOB_SEEKER}>
            <Overview />
          </ProtectedRoute>
        ),
      },
      {
        path: routes.SETTINGS,
        element: (
          <ProtectedRoute requiredRole={ROLE.JOB_SEEKER}>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: routes.MY_RESUME,
        element: (
          <ProtectedRoute requiredRole={ROLE.JOB_SEEKER}>
            <MyResume />
          </ProtectedRoute>
        ),
      },
      {
        path: routes.MY_SAVED_JOBS,
        element: (
          <ProtectedRoute requiredRole={ROLE.JOB_SEEKER}>
            <MySavedJobs />
          </ProtectedRoute>
        ),
      },
      {
        path: routes.MY_APPLIED_JOBS,
        element: (
          <ProtectedRoute requiredRole={ROLE.JOB_SEEKER}>
            <MyApplyJobs />
          </ProtectedRoute>
        ),
      },
      {
        path: routes.NOTIFICATIONS,
        element: (
          <ProtectedRoute requiredRole={ROLE.JOB_SEEKER}>
            <Notifications />
          </ProtectedRoute>
        ),
      },
      {
        path: routes.MESSAGES,
        element: (
          <ProtectedRoute requiredRole={ROLE.JOB_SEEKER}>
            <Messages />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

export default UserProtectedRoutes;
