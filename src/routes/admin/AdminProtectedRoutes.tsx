import { ROLE } from "@/constants";
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import AdminPosts from "@/pages/Admin/AdminPosts";
import CreatePost from "@/pages/Admin/CreatePost";
import EditPost from "@/pages/Admin/EditPost/EditPost";
import PostCategories from "@/pages/Admin/PostCategories";
import PostDetail from "@/pages/Admin/PostDetail";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { admin_routes } from "@/routes/routes.const";
import type { RouteObject } from "react-router-dom";

const AdminProtectedRoutes: RouteObject[] = [
  {
    path: admin_routes.BASE,
    element: <AdminLayout />,
    children: [
      {
        path: admin_routes.DASHBOARD,
        element: (
          <ProtectedRoute requiredRole={ROLE.ADMIN}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: admin_routes.POSTS,
        element: (
          <ProtectedRoute requiredRole={ROLE.ADMIN}>
            <AdminPosts />
          </ProtectedRoute>
        ),
      },
      {
        path: `${admin_routes.POSTS}/create`,
        element: (
          <ProtectedRoute requiredRole={ROLE.ADMIN}>
            <CreatePost />
          </ProtectedRoute>
        ),
      },
      {
        path: `${admin_routes.POSTS}/edit/:id`,
        element: (
          <ProtectedRoute requiredRole={ROLE.ADMIN}>
            <EditPost />
          </ProtectedRoute>
        ),
      },
      {
        path: `${admin_routes.POSTS}/:id`,
        element: (
          <ProtectedRoute requiredRole={ROLE.ADMIN}>
            <PostDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: admin_routes.POST_CATEGORIES,
        element: (
          <ProtectedRoute requiredRole={ROLE.ADMIN}>
            <PostCategories />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

export default AdminProtectedRoutes;
