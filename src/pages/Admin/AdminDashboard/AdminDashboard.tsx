import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building2,
  Briefcase,
  FileText,
  MapPin,
  FolderOpen,
  Factory,
  TrendingUp,
} from "lucide-react";
import { userService } from "@/services/user.service";
import { employerService } from "@/services/employer.service";
import { jobService } from "@/services/job.service";
import { postService } from "@/services/post.service";
import { admin_routes } from "@/routes/routes.const";
import { Link } from "react-router-dom";
import { useUserAuth } from "@/context/user-auth";
import Loading from "@/components/Loading";

export default function AdminDashboard() {
  const { state } = useUserAuth();
  const user = state.user;

  // Fetch statistics
  const { data: usersResponse, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["admin-users-count"],
    queryFn: () => userService.getUsers({ pageNumber: 1, pageSize: 1 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: employersResponse, isLoading: isLoadingEmployers } = useQuery({
    queryKey: ["admin-employers-count"],
    queryFn: () => employerService.getEmployersWithSearchParam({ pageNumber: 1, pageSize: 1 }),
    staleTime: 5 * 60 * 1000,
  });

  const { data: jobsResponse, isLoading: isLoadingJobs } = useQuery({
    queryKey: ["admin-jobs-count"],
    queryFn: () => jobService.getAllJobs({ pageNumber: 1, pageSize: 1 }),
    staleTime: 5 * 60 * 1000,
  });

  const { data: postsResponse, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["admin-posts-count"],
    queryFn: () => postService.getPosts({ pageNumber: 1, pageSize: 1 }),
    staleTime: 5 * 60 * 1000,
  });

  const isLoading =
    isLoadingUsers || isLoadingEmployers || isLoadingJobs || isLoadingPosts;

  const totalUsers = usersResponse?.data?.totalItems || 0;
  const totalEmployers = employersResponse?.data?.totalItems || 0;
  const totalJobs = jobsResponse?.data?.totalItems || 0;
  const totalPosts = postsResponse?.data?.totalItems || 0;

  const stats = [
    {
      id: "users",
      label: "Tổng số người dùng",
      value: totalUsers,
      icon: Users,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      href: `${admin_routes.BASE}/${admin_routes.USERS}`,
    },
    {
      id: "employers",
      label: "Tổng số nhà tuyển dụng",
      value: totalEmployers,
      icon: Building2,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      href: `${admin_routes.BASE}/${admin_routes.EMPLOYERS}`,
    },
    {
      id: "jobs",
      label: "Tổng số việc làm",
      value: totalJobs,
      icon: Briefcase,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      href: `${admin_routes.BASE}/${admin_routes.JOBS}`,
    },
    {
      id: "posts",
      label: "Tổng số bài viết",
      value: totalPosts,
      icon: FileText,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      href: `${admin_routes.BASE}/${admin_routes.POSTS}`,
    },
  ];

  const quickLinks = [
    {
      id: "locations",
      label: "Quản lý địa điểm",
      icon: MapPin,
      href: `${admin_routes.BASE}/${admin_routes.LOCATION}`,
    },
    {
      id: "categories",
      label: "Quản lý danh mục bài viết",
      icon: FolderOpen,
      href: `${admin_routes.BASE}/${admin_routes.POST_CATEGORIES}`,
    },
    {
      id: "industries",
      label: "Quản lý ngành nghề",
      icon: Factory,
      href: `${admin_routes.BASE}/${admin_routes.CATEGORY_JOBS_INDUSTRIES}`,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chào mừng trở lại, {user?.fullName || "Admin"}!
          </h1>
          <p className="text-gray-600">
            Tổng quan hệ thống và quản lý nền tảng Workify
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.id} to={stat.href}>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-transparent hover:border-l-4 hover:border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {stat.value.toLocaleString()}
                        </p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <Icon size={24} className={stat.textColor} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quản lý nhanh
              </h2>
              <div className="space-y-3">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link key={link.id} to={link.href}>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Icon className="w-5 h-5 mr-3 text-blue-600" />
                        <span className="font-medium">{link.label}</span>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Tổng quan hệ thống
                </h2>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Tổng số người dùng</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalUsers.toLocaleString()}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">
                      Tổng số nhà tuyển dụng
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalEmployers.toLocaleString()}
                    </p>
                  </div>
                  <Building2 className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Tổng số việc làm</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalJobs.toLocaleString()}
                    </p>
                  </div>
                  <Briefcase className="w-8 h-8 text-purple-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Tổng số bài viết</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalPosts.toLocaleString()}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
