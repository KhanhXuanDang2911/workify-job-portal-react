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
      }
      ,
      {
        path: employer_routes.JOB_ADD,
        element: <EmployerPostJob />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export default EmployerPublicRoutes;
