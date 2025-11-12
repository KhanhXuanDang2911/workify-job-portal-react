import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/useTranslation";
import UserSideBar from "@/components/UserSideBar";
import { FileText, Bookmark, Briefcase, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  jobService,
  notificationService,
  userService,
  applicationService,
} from "@/services";
import { Loader2 } from "lucide-react";

export default function Overview() {
  const { t } = useTranslation();

  // Fetch user profile
  const { data: profileResponse } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => userService.getUserProfile(),
  });

  // Fetch resumes count - placeholder for now until backend API is available
  const { data: resumesData, isLoading: isLoadingResumes } = useQuery({
    queryKey: ["myResumes"],
    queryFn: async () => {
      // TODO: Replace with actual API call when available
      // For now, return a mock count
      return { data: { totalElements: 0 } };
    },
  });

  // Fetch saved jobs count
  const { data: savedJobsResponse, isLoading: isLoadingSavedJobs } = useQuery({
    queryKey: ["savedJobs", { pageNumber: 1, pageSize: 1 }],
    queryFn: () => jobService.getSavedJobs(1, 1),
  });

  // Fetch applied jobs count
  const { data: appliedJobsResponse, isLoading: isLoadingAppliedJobs } =
    useQuery({
      queryKey: ["myApplications", { pageNumber: 1, pageSize: 1 }],
      queryFn: () =>
        applicationService.getMyApplications({ pageNumber: 1, pageSize: 1 }),
    });

  // Fetch unread notifications count
  const { data: unreadCountResponse, isLoading: isLoadingUnreadCount } =
    useQuery({
      queryKey: ["unreadNotificationsCount"],
      queryFn: () => notificationService.getUnreadCount(),
    });

  const user = profileResponse?.data;
  const resumesCount = resumesData?.data?.totalElements || 0;
  const savedJobsCount = savedJobsResponse?.data?.items?.length || 0;
  const appliedJobsCount = appliedJobsResponse?.data?.items?.length || 0;
  const unreadNotificationsCount = unreadCountResponse?.data || 0;

  const isLoading =
    isLoadingResumes ||
    isLoadingSavedJobs ||
    isLoadingAppliedJobs ||
    isLoadingUnreadCount;

  const stats = [
    {
      title: t("overview.stats.resumes"),
      value: resumesCount,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/resumes",
    },
    {
      title: t("overview.stats.savedJobs"),
      value: savedJobsCount,
      icon: Bookmark,
      color: "text-green-600",
      bgColor: "bg-green-50",
      href: "/saved-jobs",
    },
    {
      title: t("overview.stats.appliedJobs"),
      value: appliedJobsCount,
      icon: Briefcase,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/applied-jobs",
    },
    {
      title: t("overview.stats.unreadNotifications"),
      value: unreadNotificationsCount,
      icon: Bell,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      href: "/notifications",
    },
  ];

  return (
    <div
      className="flex flex-col lg:flex-row min-h-screen"
      style={{
        background:
          "linear-gradient(90deg,#FCD1C0 0%,#BBDFD5 43%,#88D5D6 100%)",
      }}
    >
      {/* Sidebar */}
      <div className="lg:ml-5 lg:my-4 w-full lg:w-64 flex-shrink-0">
        <UserSideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto min-h-screen">
        <div className="max-w-6xl mx-auto my-4 px-4 lg:px-4">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("overview.welcome", {
                name: user?.fullName || t("overview.user"),
              })}
            </h1>
            <p className="text-gray-600">{t("overview.subtitle")}</p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.title}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => (window.location.href = stat.href)}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-full ${stat.bgColor}`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    ) : (
                      <div className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t("overview.quickActions")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/resumes"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <FileText className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {t("overview.actions.manageResumes")}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t("overview.actions.manageResumesDesc")}
                  </div>
                </div>
              </a>
              <a
                href="/jobs"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <Briefcase className="w-6 h-6 text-green-600" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {t("overview.actions.searchJobs")}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t("overview.actions.searchJobsDesc")}
                  </div>
                </div>
              </a>
              <a
                href="/settings"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <Bell className="w-6 h-6 text-purple-600" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {t("overview.actions.updateProfile")}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t("overview.actions.updateProfileDesc")}
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
