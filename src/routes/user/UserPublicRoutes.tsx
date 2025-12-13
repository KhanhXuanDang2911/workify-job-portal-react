import type { RouteObject } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import Home from "@/pages/Home";
import SignUp from "@/pages/SignUp";
import SignIn from "@/pages/SignIn";
import VerifyEmail from "@/pages/VerifyEmail";
import JobSearch from "@/pages/JobSearch";
import EmployerSearch from "@/pages/EmployerSearch";
import JobDetail from "@/pages/JobDetail/JobDetail";
import EmployerDetail from "@/pages/EmployerDetail";
import Articles from "@/pages/Articles";
import ArticleDetail from "@/pages/ArticleDetail";
import { routes } from "../routes.const";
import ResetPassword from "@/pages/ResetPassword";
import ForgotPassword from "@/pages/ForgotPassword";
import CreatePassword from "@/pages/CreatePassword";
import GuestRoute from "@/routes/GuestRoute";
import LinkedInAuthenticate from "@/pages/LinkedInAuthenticate";
import ResumeBuilder from "@/pages/ResumeBuilder";
import { ResumeProvider } from "@/context/ResumeContext/resumeProvider";
import TemplatesCV from "@/pages/TemplatesCV/TemplatesCV";
const UserPublicRoutes: RouteObject[] = [
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
        element: (
          <GuestRoute>
            <SignUp />
          </GuestRoute>
        ),
      },
      {
        path: routes.SIGN_IN,
        element: (
          <GuestRoute>
            <SignIn />
          </GuestRoute>
        ),
      },
      {
        path: routes.VERIFY_EMAIL,
        element: <VerifyEmail />,
      },
      {
        path: routes.JOB_SEARCH,
        element: <JobSearch />,
      },
      {
        path: `${routes.JOB_DETAIL}/:id`,
        element: <JobDetail />,
      },
      {
        path: routes.EMPLOYER_SEARCH,
        element: <EmployerSearch />,
      },
      {
        path: `${routes.EMPLOYER_DETAIL}/:id`,
        element: <EmployerDetail />,
      },
      {
        path: routes.ARTICLES,
        element: <Articles />,
      },
      {
        path: `${routes.ARTICLES_DETAIL}/:id`,
        element: <ArticleDetail />,
      },
      {
        path: routes.FORGOT_PASSWORD,
        element: <ForgotPassword />,
      },
      {
        path: routes.RESET_PASSWORD,
        element: <ResetPassword />,
      },
      {
        path: routes.CREATE_PASSWORD,
        element: <CreatePassword />,
      },
      {
        path: routes.LINKEDIN_AUTHENTICATE,
        element: <LinkedInAuthenticate />,
      },
      {
        path: `${routes.RESUME}/create/:template?`,
        element: (
          <ResumeProvider>
            <ResumeBuilder />
          </ResumeProvider>
        ),
      },
      {
        path: routes.TEMPLATES_CV,
        element: (
          <ResumeProvider>
            <TemplatesCV />
          </ResumeProvider>
        ),
      },
    ],
  },
];

export default UserPublicRoutes;
