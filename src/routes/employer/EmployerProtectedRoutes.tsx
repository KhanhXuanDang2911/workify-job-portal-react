import type { RouteObject } from "react-router-dom"
import EmployerLayout from "@/layouts/EmployerLayout/EmployerLayout"
import Candidates from "@/pages/Candidates"
import EmployerPostJob from "@/pages/EmployerPostJob"
import Jobs from "@/pages/Jobs"
import SearchTalents from "@/pages/Employer/SearchTalents"
import Organization from "@/pages/Employer/Organization"
import JobDetailManage from "@/pages/Employer/JobDetailManage"
import Settings from "@/pages/Employer/Settings"
import { employer_routes } from "../routes.const"
import ProtectedRoute from "@/routes/ProtectedRoute"

const EmployerProtectedRoutes: RouteObject[] = [
  {
    path: employer_routes.BASE,
    element: <EmployerLayout />,
    children: [
      {
        path: employer_routes.APPLICATIONS,
        element: (
          <ProtectedRoute redirectTo={`${employer_routes.BASE}/${employer_routes.SIGN_IN}`}>
            <Candidates />
          </ProtectedRoute>
        ),
      },
      {
        path: employer_routes.JOBS,
        element: (
          <ProtectedRoute redirectTo={`${employer_routes.BASE}/${employer_routes.SIGN_IN}`}>
            <Jobs />
          </ProtectedRoute>
        ),
      },
      {
        path: employer_routes.JOB_ADD,
        element: (
          <ProtectedRoute redirectTo={`${employer_routes.BASE}/${employer_routes.SIGN_IN}`}>
            <EmployerPostJob />
          </ProtectedRoute>
        ),
      },
      {
        path: `${employer_routes.JOBS}/:jobId`,
        element: (
          <ProtectedRoute redirectTo={`${employer_routes.BASE}/${employer_routes.SIGN_IN}`}>
            <JobDetailManage />
          </ProtectedRoute>
        ),
      },
      {
        path: employer_routes.SEARCH_TALENTS,
        element: (
          <ProtectedRoute redirectTo={`${employer_routes.BASE}/${employer_routes.SIGN_IN}`}>
            <SearchTalents />
          </ProtectedRoute>
        ),
      },
      {
        path: employer_routes.ORGANIZATION,
        element: (
          <ProtectedRoute redirectTo={`${employer_routes.BASE}/${employer_routes.SIGN_IN}`}>
            <Organization />
          </ProtectedRoute>
        ),
      },
      {
        path: employer_routes.SETTINGS,
        element: (
          <ProtectedRoute redirectTo={`${employer_routes.BASE}/${employer_routes.SIGN_IN}`}>
            <Settings />
          </ProtectedRoute>
        ),
      },
    ],
  },
]

export default EmployerProtectedRoutes
