import AdminLayout from "@/layouts/AdminLayout";
import AdminPosts from "@/pages/Admin/AdminPosts";
import { admin_routes } from "@/routes/routes.const";
import type { RouteObject } from "react-router-dom";

const AdminProtectedRoutes: RouteObject[] = [
  {
    path: admin_routes.BASE,
    element: <AdminLayout />,
    children: [
      {
        path: admin_routes.POSTS,
        element: <AdminPosts />,
      },
    ],
  },
];

export default AdminProtectedRoutes;
