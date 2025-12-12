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
import TemplatesCV from "@/pages/TemplatesCV/TemplatesCV";
import ResumeBuilder from "@/pages/ResumeBuilder";
import MessagesPage from "@/pages/Messages/Messages";
import ViewResume from "@/pages/ViewResume";
import { ResumeProvider } from "@/context/ResumeContext/resumeProvider";

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
        path: routes.TEMPLATES_CV,
        element: (
          <ProtectedRoute requiredRole={ROLE.JOB_SEEKER}>
            <ResumeProvider>
              <TemplatesCV />
            </ResumeProvider>
          </ProtectedRoute>
        ),
      },
      {
        path: routes.CREATE_RESUME,
        element: (
          <ProtectedRoute requiredRole={ROLE.JOB_SEEKER}>
            <ResumeProvider>
              <ResumeBuilder />
            </ResumeProvider>
          </ProtectedRoute>
        ),
      },
      {
        path: `${routes.CREATE_RESUME}/template/:template`,
        element: (
          <ProtectedRoute requiredRole={ROLE.JOB_SEEKER}>
            <ResumeProvider>
              <ResumeBuilder />
            </ResumeProvider>
          </ProtectedRoute>
        ),
      },
      {
        path: `${routes.CREATE_RESUME}/edit/:id`,
        element: (
          <ProtectedRoute requiredRole={ROLE.JOB_SEEKER}>
            <ResumeProvider>
              <ResumeBuilder />
            </ResumeProvider>
          </ProtectedRoute>
        ),
      },
      {
        path: `${routes.VIEW_RESUME}/:id`,
        element: (
          <ProtectedRoute requiredRole={ROLE.JOB_SEEKER}>
            <ResumeProvider>
              <ViewResume />
            </ResumeProvider>
          </ProtectedRoute>
        ),
      },
      {
        path: routes.MESSAGES,
        element: (
          <ProtectedRoute requiredRole={ROLE.JOB_SEEKER}>
            <MessagesPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

export default UserProtectedRoutes;
