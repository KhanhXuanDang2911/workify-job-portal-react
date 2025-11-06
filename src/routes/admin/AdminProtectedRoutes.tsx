import { ROLE } from "@/constants";
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import AdminPosts from "@/pages/Admin/Posts/AdminPosts";
import CreatePost from "@/pages/Admin/Posts/CreatePost";
import EditPost from "@/pages/Admin/Posts/EditPost/EditPost";
import PostCategories from "@/pages/Admin/PostCategories";
import PostDetail from "@/pages/Admin/Posts/PostDetail";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { admin_routes } from "@/routes/routes.const";
import type { RouteObject } from "react-router-dom";
import CategoryJobs from "@/pages/Admin/CategoryJobs/CategoryJobs";
import NotFound from "@/pages/NotFound";
import EmployerManagement from "@/pages/Admin/EmployerManagement/EmployerManagement";
import EditEmployer from "@/pages/Admin/EmployerManagement/EditEmployer";
import LocationManagement from "@/pages/Admin/LocationManagement/LocationManagement";

const AdminProtectedRoutes: RouteObject[] = [
  {
    path: admin_routes.BASE,
    index: true,
    element: <NotFound />,
  },
  {
    path: admin_routes.BASE,
    element: (
      <ProtectedRoute requiredRole={ROLE.ADMIN}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: admin_routes.DASHBOARD,
        element: <AdminDashboard />,
      },
      {
        path: admin_routes.POSTS,
        element: <AdminPosts />,
      },
      {
        path: `${admin_routes.POSTS}/create`,
        element: <CreatePost />,
      },
      {
        path: `${admin_routes.POSTS}/edit/:id`,
        element: <EditPost />,
      },
      {
        path: `${admin_routes.POSTS}/:id`,
        element: <PostDetail />,
      },
      {
        path: admin_routes.POST_CATEGORIES,
        element: <PostCategories />,
      },
      {
        path: admin_routes.CATEGORY_JOBS_INDUSTRIES,
        element: <CategoryJobs />,
      },
      {
        path: admin_routes.EMPLOYERS,
        element: <EmployerManagement />,
      },
      {
        path: `${admin_routes.EMPLOYERS}/edit/:id`,
        element: <EditEmployer />,
      },
      {
        path: `${admin_routes.EMPLOYERS}/:id`,
        element: <EditEmployer />,
      },
      {
        path: admin_routes.LOCATION,
        element: <LocationManagement />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export default AdminProtectedRoutes;
