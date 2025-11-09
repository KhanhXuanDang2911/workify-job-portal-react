import type { RouteObject } from "react-router-dom";
import AdminSignIn from "@/pages/Admin/AdminSignIn";
import AdminLayout from "@/layouts/AdminLayout";
import { admin_routes } from "../routes.const";
import GuestRoute from "@/routes/GuestRoute";

const AdminPublicRoutes: RouteObject[] = [
  {
    path: admin_routes.BASE,
    element: <AdminLayout />,
    children: [
      {
        path: admin_routes.SIGN_IN,
        element: (
          <GuestRoute>
            <AdminSignIn />
          </GuestRoute>
        ),
      },
    ],
  },
];

export default AdminPublicRoutes;
