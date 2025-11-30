import { useState, useMemo, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Building2,
  Eye,
  FileText,
  Calendar,
  Briefcase,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Pagination from "@/components/Pagination";
import SuggestedJobs from "@/components/SuggestedJob";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { jobService } from "@/services/job.service";
import { applicationService } from "@/services/application.service";
import { JobTypeLabelVN } from "@/constants";
import { ApplicationStatus } from "@/types";
import { Link, useLocation } from "react-router-dom";
import { routes } from "@/routes/routes.const";
import Loading from "@/components/Loading";
import { useTranslation } from "@/hooks/useTranslation";
import { JobType } from "@/constants/job.constant";
import ChatModal from "@/components/Chat/ChatModal";
import { chatService } from "@/services/chat.service";
import type { ConversationResponse } from "@/types/chat.type";
import { useUserAuth } from "@/context/user-auth";
import { toast } from "react-toastify";
import { useWebSocket } from "@/context/websocket/WebSocketContext";

interface ApplicationJob {
  id: number;
  applicationId: number;
  title: string;
  company: string;
  location: string;
  logo: string;
  appliedDate: string;
  status: ApplicationStatus;
  statusLabel: string;
  statusColor: string;
  cvUrl: string;
  applyCount: number;
}

// Map application status to label and color
const getStatusInfo = (
  status: ApplicationStatus,
  t: (key: string) => string
): { label: string; color: string } => {
  const statusMap: Record<ApplicationStatus, { label: string; color: string }> =
    {
      [ApplicationStatus.UNREAD]: {
        label: t("myApplyJobs.status.UNREAD"),
        color: "bg-gray-500",
      },
      [ApplicationStatus.VIEWED]: {
        label: t("myApplyJobs.status.VIEWED"),
        color: "bg-blue-500",
      },
      [ApplicationStatus.EMAILED]: {
        label: t("myApplyJobs.status.EMAILED"),
        color: "bg-purple-500",
      },
      [ApplicationStatus.SCREENING]: {
        label: t("myApplyJobs.status.SCREENING"),
        color: "bg-yellow-500",
      },
      [ApplicationStatus.SCREENING_PENDING]: {
        label: t("myApplyJobs.status.SCREENING_PENDING"),
        color: "bg-orange-500",
      },
      [ApplicationStatus.INTERVIEW_SCHEDULING]: {
        label: t("myApplyJobs.status.INTERVIEW_SCHEDULING"),
        color: "bg-indigo-500",
      },
      [ApplicationStatus.INTERVIEWED_PENDING]: {
        label: t("myApplyJobs.status.INTERVIEWED_PENDING"),
        color: "bg-pink-500",
      },
      [ApplicationStatus.OFFERED]: {
        label: t("myApplyJobs.status.OFFERED"),
        color: "bg-green-500",
      },
      [ApplicationStatus.REJECTED]: {
        label: t("myApplyJobs.status.REJECTED"),
        color: "bg-red-500",
      },
    };
  return statusMap[status] || { label: status, color: "bg-gray-500" };
};

// Relative time
const relativePosted = (
  dateString?: string,
  t?: (key: string, options?: any) => string
): string => {
  if (!dateString || !t) return "";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return t("myApplyJobs.relativeTime.today");
    if (diffDays === 1) return t("myApplyJobs.relativeTime.yesterday");
    if (diffDays < 7)
      return t("myApplyJobs.relativeTime.daysAgo", { count: diffDays });
    if (diffDays < 30)
      return t("myApplyJobs.relativeTime.weeksAgo", {
        count: Math.floor(diffDays / 7),
      });
    if (diffDays < 365)
      return t("myApplyJobs.relativeTime.monthsAgo", {
        count: Math.floor(diffDays / 30),
      });
    return t("myApplyJobs.relativeTime.yearsAgo", {
      count: Math.floor(diffDays / 365),
    });
  } catch (e) {
    return "";
  }
};

export default function MyApplyJobs() {
  const { t } = useTranslation();
  const { state: userAuth } = useUserAuth();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { notifications } = useWebSocket();
  const prevNotificationsLengthRef = useRef(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Chat modal state
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationResponse | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    number | null
  >(null);

  // Handle open chat
  const handleOpenChat = async (
    applicationId: number,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();
    try {
      const conversationResponse =
        await chatService.getConversationByApplicationId(applicationId);
      if (conversationResponse.data) {
        setSelectedConversation(conversationResponse.data);
        setSelectedApplicationId(applicationId);
        setShowChatModal(true);
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        toast.error(t("toast.error.networkError"));
      }
      const status = error?.response?.status;
      const message = error?.response?.data?.message;
      if (status === 404) {
        toast.error(
          t("myApplyJobs.chatNotFound") ||
            "Chưa có kênh chat cho đơn ứng tuyển này"
        );
      } else if (status === 403) {
        toast.error(
          t("myApplyJobs.chatNoPermission") ||
            "Bạn không có quyền truy cập chat này"
        );
      } else if (status === 401) {
        toast.error(
          t("myApplyJobs.chatUnauthorized") ||
            "Vui lòng đăng nhập lại để sử dụng tính năng chat"
        );
      } else {
        toast.error(
          message ||
            t("myApplyJobs.chatError") ||
            "Không thể mở chat. Vui lòng thử lại sau."
        );
      }
    }
  };

  // Fetch my applications
  const {
    data: applicationsResponse,
    isLoading: isLoadingApplications,
    isError: isErrorApplications,
  } = useQuery({
    queryKey: ["my-applications", currentPage, itemsPerPage],
    queryFn: () =>
      applicationService.getMyApplications({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
        sorts: "createdAt:desc",
      }),
    staleTime: 0,
  });

  // Fetch top attractive jobs for suggestions
  const userIndustryId = userAuth?.user?.industry?.id;

  const { data: topAttractiveResponse } = useQuery({
    queryKey: ["top-attractive-jobs", 7, userIndustryId ?? null],
    queryFn: () =>
      jobService.getTopAttractiveJobs(
        7,
        userIndustryId ? { industryId: Number(userIndustryId) } : undefined
      ),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Map applications from API to ApplicationJob interface
  const applications = useMemo(() => {
    if (!applicationsResponse?.data?.items) return [];
    return applicationsResponse.data.items.map((application) => {
      const statusInfo = getStatusInfo(application.status, t);
      return {
        id: application.job.id,
        applicationId: application.id,
        title: application.job.jobTitle || "",
        company: application.job.employer.companyName || "",
        location: t("myApplyJobs.locationNotUpdated"), // ApplicationResponse doesn't include location
        logo:
          application.job.employer.avatarUrl ||
          "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg",
        appliedDate: application.createdAt
          ? relativePosted(application.createdAt, t)
          : "",
        status: application.status,
        statusLabel: statusInfo.label,
        statusColor: statusInfo.color,
        cvUrl: application.cvUrl,
        applyCount: application.applyCount,
      };
    });
  }, [applicationsResponse, t]);

  // Map suggested jobs
  const suggestedJobs = useMemo(() => {
    if (!topAttractiveResponse?.data) return [];
    return topAttractiveResponse.data.map((job) => ({
      id: job.id,
      title: job.jobTitle || "",
      company: job.companyName || job.author?.companyName || "",
      salary: t("jobSearch.salaryNegotiable"), // Simplified for suggested jobs
      type:
        JobTypeLabelVN[job.jobType as keyof typeof JobTypeLabelVN] ||
        job.jobType,
      typeColor: "bg-blue-500",
      logo:
        job.author?.avatarUrl ||
        "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg",
    }));
  }, [topAttractiveResponse, t]);

  // Refetch applications when receiving notification about application status change
  useEffect(() => {
    // Check if we're on the applied-jobs page
    const isOnAppliedJobsPage =
      location.pathname === `/${routes.MY_APPLIED_JOBS}`;

    if (!isOnAppliedJobsPage) {
      return;
    }

    // Check if there are new notifications
    if (notifications.length > prevNotificationsLengthRef.current) {
      const latestNotification = notifications[0];

      // Check if notification has applicationId (indicates application-related notification)
      if (latestNotification?.applicationId) {
        // Refetch the applications query to get updated status
        queryClient.invalidateQueries({
          queryKey: ["my-applications"],
        });
      }

      prevNotificationsLengthRef.current = notifications.length;
    }
  }, [notifications, location.pathname, queryClient]);

  const totalPages = applicationsResponse?.data?.totalPages || 0;
  const currentApplications = applications;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
      </div>
      <div
        style={{
          background:
            "linear-gradient(90deg, #fafcfb 0%, #f5faf7 30%, #f0f7f5 60%, #f0f7fc 100%)",
        }}
      >
        <div className="flex flex-col lg:flex-row main-layout relative z-10 pt-8 md:pt-20 pb-8 gap-6">
          {/* Main Content - Danh sách việc làm đã ứng tuyển */}
          <div className="flex-1">
            <div className="max-w-7xl mx-auto px-4 md:px-5">
              {/* Content */}
              {isLoadingApplications ? (
                <div className="flex justify-center items-center py-20">
                  <Loading />
                </div>
              ) : isErrorApplications ? (
                <div className="text-center py-20">
                  <p className="text-gray-600">
                    {t("myApplyJobs.errorLoading")}
                  </p>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600">
                    {t("myApplyJobs.noApplications")}
                  </p>
                </div>
              ) : (
                <>
                  <TableView
                    applications={currentApplications}
                    onOpenChat={handleOpenChat}
                  />
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Sidebar - Việc làm hấp dẫn */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <SuggestedJobs jobs={suggestedJobs} />
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {selectedConversation && (
        <ChatModal
          open={showChatModal}
          onOpenChange={setShowChatModal}
          conversation={selectedConversation}
          applicationId={selectedApplicationId || undefined}
          currentUserId={userAuth.user?.id}
          currentUserType="USER"
        />
      )}
    </>
  );
}

// Table View Component
function TableView({
  applications,
  onOpenChat,
}: {
  applications: ApplicationJob[];
  onOpenChat: (applicationId: number, e?: React.MouseEvent) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      {/* Table Header - Hidden on mobile */}
      <div className="hidden lg:grid grid-cols-[4fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-gradient-to-r from-[#5ba4cf] to-[#7bb8d9] text-white font-semibold text-sm rounded-lg shadow-lg">
        <div>{t("myApplyJobs.tableHeaders.job")}</div>
        <div>{t("myApplyJobs.tableHeaders.appliedDate")}</div>
        <div>{t("myApplyJobs.tableHeaders.status")}</div>
        <div>{t("myApplyJobs.tableHeaders.applyCount")}</div>
        <div className="text-right">{t("myApplyJobs.tableHeaders.action")}</div>
      </div>

      {/* Table Rows */}
      <div className="space-y-3">
        {applications.map((application) => (
          <div
            key={application.applicationId}
            className="lg:grid lg:grid-cols-[4fr_1fr_1fr_1fr_1fr] gap-4 lg:items-center px-4 md:px-6 py-4 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 min-h-[100px]"
          >
            {/* Job Info */}
            <div className="flex items-center gap-4 min-w-0 mb-3 lg:mb-0">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <img
                  src={application.logo || "/placeholder.svg"}
                  alt={application.company}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {application.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                  <Building2 className="w-3 h-3 shrink-0" />
                  <span className="truncate">{application.company}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{application.location}</span>
                </div>
              </div>
            </div>

            {/* Mobile: Combined info row */}
            <div className="flex flex-wrap items-center gap-3 mb-3 lg:hidden">
              {/* Applied Date */}
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{application.appliedDate}</span>
              </div>

              {/* Status */}
              <Badge
                className={cn("text-xs text-white", application.statusColor)}
              >
                {application.statusLabel}
              </Badge>

              {/* Apply Count */}
              <div className="text-sm text-gray-600">
                {t("myApplyJobs.applyCount", { count: application.applyCount })}
              </div>
            </div>

            {/* Desktop: Applied Date */}
            <div className="hidden lg:flex items-center gap-1 text-sm text-gray-600 min-w-0">
              <Calendar className="w-4 h-4 shrink-0" />
              <span className="truncate">{application.appliedDate}</span>
            </div>

            {/* Desktop: Status */}
            <div className="hidden lg:block min-w-0">
              <Badge
                className={cn("text-xs text-white", application.statusColor)}
              >
                {application.statusLabel}
              </Badge>
            </div>

            {/* Desktop: Apply Count */}
            <div className="hidden lg:block text-sm text-gray-600 text-center">
              {t("myApplyJobs.applyCount", { count: application.applyCount })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 lg:justify-end">
              <Link
                to={`/${routes.JOB_DETAIL}/${application.id}`}
                className="w-8 h-8 rounded-full border-2 border-blue-300 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors bg-white shrink-0"
                title={t("myApplyJobs.viewDetails")}
              >
                <Eye className="w-4 h-4" />
              </Link>
              {application.cvUrl && (
                <a
                  href={application.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border-2 border-green-300 flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors bg-white shrink-0"
                  title={t("myApplyJobs.viewCV")}
                >
                  <FileText className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={(e) => onOpenChat(application.applicationId, e)}
                className="w-8 h-8 rounded-full border-2 border-purple-300 flex items-center justify-center text-purple-500 hover:bg-purple-50 transition-colors bg-white shrink-0"
                title={t("myApplyJobs.chat") || "Chat"}
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
