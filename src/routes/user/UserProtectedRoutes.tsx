import type { RouteObject } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import Settings from "@/pages/User/Settings";
import MyResume from "@/pages/User/MyResume";
import MySavedJobs from "@/pages/User/MySavedJobs";
import { routes } from "../routes.const";
import ProtectedRoute from "@/routes/ProtectedRoute";
import CVBuilder from "@/pages/CVBuilder";

const UserProtectedRoutes: RouteObject[] = [
  {
    path: routes.BASE,
    element: <MainLayout />,
    children: [
      {
        path: routes.SETTINGS,
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: routes.MY_RESUME,
        element: (
          <ProtectedRoute>
            <MyResume />
          </ProtectedRoute>
        ),
      },
      {
        path: routes.MY_SAVED_JOBS,
        element: (
          <ProtectedRoute>
            <MySavedJobs />
          </ProtectedRoute>
        ),
      },
      {
        path: routes.MY_APPLIED_JOBS,
        element: (
          <ProtectedRoute>
            <MySavedJobs />
          </ProtectedRoute>
        ),
      },
      {
        path: routes.CREATE_CV,
        element: (
          <ProtectedRoute>
            <CVBuilder />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

export default UserProtectedRoutes;
