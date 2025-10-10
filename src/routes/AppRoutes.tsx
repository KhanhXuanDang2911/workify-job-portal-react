import { useRoutes } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import UserPublicRoutes from "./user/UserPublicRoutes";
import UserProtectedRoutes from "./user/UserProtectedRoutes";
import EmployerPublicRoutes from "./employer/EmployerPublicRoutes";
import EmployerProtectedRoutes from "./employer/EmployerProtectedRoutes";

export default function AppRoutes() {
  const element = useRoutes([
    ...UserPublicRoutes,
    ...UserProtectedRoutes,
    ...EmployerPublicRoutes,
    ...EmployerProtectedRoutes,
    
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return <>{element}</>;
}
