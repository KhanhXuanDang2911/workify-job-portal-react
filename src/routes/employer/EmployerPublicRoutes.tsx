import type { RouteObject } from "react-router-dom";
import EmployerLayout from "@/layouts/EmployerLayout/EmployerLayout";
import EmployerSignUp from "@/pages/EmployerSignUp";
import EmployerSignIn from "@/pages/EmployerSignIn";
import EmployerHome from "@/pages/EmployerHome";
import { employer_routes } from "../routes.const";
import ResetPassword from "@/pages/ResetPassword";
import ForgotPassword from "@/pages/ForgotPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import GuestRoute from "@/routes/GuestRoute";

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
        element: (
          <GuestRoute>
            <EmployerSignUp />
          </GuestRoute>
        ),
      },
      {
        path: employer_routes.SIGN_IN,
        element: (
          <GuestRoute>
            <EmployerSignIn />
          </GuestRoute>
        ),
      },
      {
        path: employer_routes.FORGOT_PASSWORD,
        element: <ForgotPassword />,
      },
      {
        path: employer_routes.RESET_PASSWORD,
        element: <ResetPassword />,
      },
      {
        path: employer_routes.VERIFY_EMAIL,
        element: <VerifyEmail />,
      },
    ],
  },
];

export default EmployerPublicRoutes;
