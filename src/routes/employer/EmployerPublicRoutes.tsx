import type { RouteObject } from "react-router-dom";
import EmployerLayout from "@/layouts/EmployerLayout/EmployerLayout";
import EmployerSignUp from "@/pages/EmployerSignUp";
import EmployerSignIn from "@/pages/EmployerSignIn";
import EmployerHome from "@/pages/EmployerHome";
import { employer_routes } from "../routes.const";
import ResetPassword from "@/pages/ResetPassword";
import ForgotPassword from "@/pages/ForgotPassword";

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
        path: employer_routes.FORGOT_PASSWORD,
        element: <ForgotPassword />,
      },
      {
        path: employer_routes.RESET_PASSWORD,
        element: <ResetPassword />,
      },
    ],
  },
];

export default EmployerPublicRoutes;
