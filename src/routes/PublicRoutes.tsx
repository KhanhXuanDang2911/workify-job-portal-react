import type { RouteObject } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import { routes } from "./routes.const";
import SignUp from "@/pages/SignUp";
import SignIn from "@/pages/SignIn";
import JobSearch from "@/pages/JobSearch";
import EmployerSearch from "@/pages/EmployerSearch";
import JobDetail from "@/pages/JobDetail/JobDetail";

const PublicRoutes: RouteObject[] = [
  {
    path: routes.BASE,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: routes.SIGN_UP,
        element: <SignUp />,
      },
      {
        path: routes.SIGN_IN,
        element: <SignIn />,
      },
      {
        path: routes.JOB_SEARCH,
        element: <JobSearch />,
      },
      {
        path: routes.EMPLOYER_SEARCH,
        element: <EmployerSearch />,
      },
      {
        path: routes.JOB_DETAIL,
        element: <JobDetail />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export default PublicRoutes;
