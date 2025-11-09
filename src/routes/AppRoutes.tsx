import { useRoutes } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import UserPublicRoutes from "./user/UserPublicRoutes";
import UserProtectedRoutes from "./user/UserProtectedRoutes";
import EmployerPublicRoutes from "./employer/EmployerPublicRoutes";
import EmployerProtectedRoutes from "./employer/EmployerProtectedRoutes";
import AdminPublicRoutes from "./admin/AdminPublicRoutes";
import AdminProtectedRoutes from "./admin/AdminProtectedRoutes";

export default function AppRoutes() {
  const element = useRoutes([
    ...UserPublicRoutes,
    ...UserProtectedRoutes,
    ...EmployerPublicRoutes,
    ...EmployerProtectedRoutes,
    ...AdminPublicRoutes,
    ...AdminProtectedRoutes,
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return <>{element}</>;
}
