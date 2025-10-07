import NotFound from "@/pages/NotFound";
import EmployerLayout from "@/layouts/EmployerLayout/EmployerLayout";
import { employer_routes } from "./routes.const";
import type { RouteObject } from "react-router-dom";
import EmployerSignUp from "@/pages/EmployerSignUp";
import EmployerSignIn from "@/pages/EmployerSignIn";
import EmployerHome from "@/pages/EmployerHome";
import Candidates from "@/pages/Candidates";
import EmployerPostJob from "@/pages/EmployerPostJob";
import Jobs from "@/pages/Jobs";
import SearchTalents from "@/pages/Employer/SearchTalents";
import Organization from "@/pages/Employer/Organization";
import JobDetailManage from "@/pages/Employer/JobDetailManage";
import Settings from "@/pages/Employer/Settings";

const EmployerPublicRoutes: RouteObject[] = [
  {
    path: employer_routes.BASE,
    element: <EmployerLayout />,
    children: [
      {
        index: true,
        element: <EmployerHome />,
      },
      {
        path: employer_routes.SIGN_UP,
        element: <EmployerSignUp />,
      },
      {
        path: employer_routes.SIGN_IN,
        element: <EmployerSignIn />,
      },
      {
        path: employer_routes.APPLICATIONS,
        element: <Candidates />,
      },
      {
        path: employer_routes.JOBS,
        element: <Jobs />,
      },
      {
        path: employer_routes.JOB_ADD,
        element: <EmployerPostJob />,
      },
      {
        path: `${employer_routes.JOBS}/:jobId`,
        element: <JobDetailManage />,
      },
      {
        path: employer_routes.SEARCH_TALENTS,
        element: <SearchTalents />,
      },
      {
        path: employer_routes.ORGANIZATION,
        element: <Organization />,
      },
      {
        path: employer_routes.SETTINGS,
        element: <Settings />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export default EmployerPublicRoutes;
