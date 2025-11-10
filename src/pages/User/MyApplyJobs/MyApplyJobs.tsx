import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Building2,
  Eye,
  FileText,
  Calendar,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Pagination from "@/components/Pagination";
import SuggestedJobs from "@/components/SuggestedJob";
import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/services/job.service";
import { applicationService } from "@/services/application.service";
import { JobTypeLabelVN } from "@/constants";
import { ApplicationStatus } from "@/types";
import { Link } from "react-router-dom";
import { routes } from "@/routes/routes.const";
import Loading from "@/components/Loading";

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
  status: ApplicationStatus
): { label: string; color: string } => {
  const statusMap: Record<ApplicationStatus, { label: string; color: string }> =
    {
      [ApplicationStatus.UNREAD]: { label: "Chưa đọc", color: "bg-gray-500" },
      [ApplicationStatus.VIEWED]: { label: "Đã xem", color: "bg-blue-500" },
      [ApplicationStatus.EMAILED]: {
        label: "Đã gửi email",
        color: "bg-purple-500",
      },
      [ApplicationStatus.SCREENING]: {
        label: "Đang sàng lọc",
        color: "bg-yellow-500",
      },
      [ApplicationStatus.SCREENING_PENDING]: {
        label: "Chờ sàng lọc",
        color: "bg-orange-500",
      },
      [ApplicationStatus.INTERVIEW_SCHEDULING]: {
        label: "Đang lên lịch phỏng vấn",
        color: "bg-indigo-500",
      },
      [ApplicationStatus.INTERVIEWED_PENDING]: {
        label: "Chờ kết quả phỏng vấn",
        color: "bg-pink-500",
      },
      [ApplicationStatus.OFFERED]: {
        label: "Đã nhận offer",
        color: "bg-green-500",
      },
      [ApplicationStatus.REJECTED]: {
        label: "Đã từ chối",
        color: "bg-red-500",
      },
    };
  return statusMap[status] || { label: status, color: "bg-gray-500" };
};

// Relative time
const relativePosted = (dateString?: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
    return `${Math.floor(diffDays / 365)} năm trước`;
  } catch (e) {
    return "";
  }
};

export default function MyApplyJobs() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

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
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Fetch top attractive jobs for suggestions
  const { data: topAttractiveResponse } = useQuery({
    queryKey: ["top-attractive-jobs", 7],
    queryFn: () => jobService.getTopAttractiveJobs(7),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Map applications from API to ApplicationJob interface
  const applications = useMemo(() => {
    if (!applicationsResponse?.data?.items) return [];
    return applicationsResponse.data.items.map((application) => {
      const statusInfo = getStatusInfo(application.status);
      return {
        id: application.job.id,
        applicationId: application.id,
        title: application.job.jobTitle || "",
        company: application.job.employer.companyName || "",
        location: "Chưa cập nhật địa chỉ", // ApplicationResponse doesn't include location
        logo:
          application.job.employer.avatarUrl ||
          "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg",
        appliedDate: application.createdAt
          ? relativePosted(application.createdAt)
          : "",
        status: application.status,
        statusLabel: statusInfo.label,
        statusColor: statusInfo.color,
        cvUrl: application.cvUrl,
        applyCount: application.applyCount,
      };
    });
  }, [applicationsResponse]);

  // Map suggested jobs
  const suggestedJobs = useMemo(() => {
    if (!topAttractiveResponse?.data) return [];
    return topAttractiveResponse.data.map((job) => ({
      id: job.id,
      title: job.jobTitle || "",
      company: job.companyName || job.author?.companyName || "",
      salary: "Thỏa thuận", // Simplified for suggested jobs
      type:
        JobTypeLabelVN[job.jobType as keyof typeof JobTypeLabelVN] ||
        job.jobType,
      typeColor: "bg-blue-500",
      logo:
        job.author?.avatarUrl ||
        "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg",
    }));
  }, [topAttractiveResponse]);

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
        <div className="flex main-layout relative z-10 pt-20 pb-8 gap-6">
          {/* Main Content - Danh sách việc làm đã ứng tuyển */}
          <div className="flex-1">
            <div className="max-w-7xl mx-auto px-5">
              {/* Content */}
              {isLoadingApplications ? (
                <div className="flex justify-center items-center py-20">
                  <Loading />
                </div>
              ) : isErrorApplications ? (
                <div className="text-center py-20">
                  <p className="text-gray-600">
                    Có lỗi xảy ra khi tải danh sách việc làm đã ứng tuyển
                  </p>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600">
                    Bạn chưa ứng tuyển việc làm nào
                  </p>
                </div>
              ) : (
                <>
                  <TableView applications={currentApplications} />
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
          <div className="w-96 flex-shrink-0">
            <SuggestedJobs jobs={suggestedJobs} />
          </div>
        </div>
      </div>
    </>
  );
}

// Table View Component
function TableView({ applications }: { applications: ApplicationJob[] }) {
  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="grid grid-cols-[4fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-gradient-to-r from-[#5ba4cf] to-[#7bb8d9] text-white font-semibold text-sm rounded-lg shadow-lg">
        <div>VIỆC LÀM</div>
        <div>NGÀY ỨNG TUYỂN</div>
        <div>TRẠNG THÁI</div>
        <div>LẦN ỨNG TUYỂN</div>
        <div className="text-right">HÀNH ĐỘNG</div>
      </div>

      {/* Table Rows */}
      <div className="space-y-3">
        {applications.map((application) => (
          <div
            key={application.applicationId}
            className="grid grid-cols-[4fr_1fr_1fr_1fr_1fr] gap-4 items-center px-6 py-4 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 min-h-[100px]"
          >
            {/* Job Info */}
            <div className="flex items-center gap-4 min-w-0">
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

            {/* Applied Date */}
            <div className="flex items-center gap-1 text-sm text-gray-600 min-w-0">
              <Calendar className="w-4 h-4 shrink-0" />
              <span className="truncate">{application.appliedDate}</span>
            </div>

            {/* Status */}
            <div className="min-w-0">
              <Badge
                className={cn("text-xs text-white", application.statusColor)}
              >
                {application.statusLabel}
              </Badge>
            </div>

            {/* Apply Count */}
            <div className="text-sm text-gray-600 text-center">
              Lần {application.applyCount}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 justify-end">
              <Link
                to={`/${routes.JOB_DETAIL}/${application.id}`}
                className="w-8 h-8 rounded-full border-2 border-blue-300 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors bg-white shrink-0"
                title="Xem chi tiết"
              >
                <Eye className="w-4 h-4" />
              </Link>
              {application.cvUrl && (
                <a
                  href={application.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border-2 border-green-300 flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors bg-white shrink-0"
                  title="Xem CV đã gửi"
                >
                  <FileText className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
