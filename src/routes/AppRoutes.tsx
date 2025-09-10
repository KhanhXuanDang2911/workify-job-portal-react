import { useRoutes } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import EmployerPublicRoutes from "./EmployerPublicRoutes";

export default function AppRoutes() {
  const element = useRoutes([...PublicRoutes, ...EmployerPublicRoutes]);
  return <>{element}</>;
}
