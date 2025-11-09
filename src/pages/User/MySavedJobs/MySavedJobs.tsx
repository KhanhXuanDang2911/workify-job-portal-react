import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, Trash2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import JobSummarySheet from "@/components/JobSummarySheet";
import Pagination from "@/components/Pagination";
import SuggestedJobs from "@/components/SuggestedJob";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobService } from "@/services/job.service";
import type { JobResponse } from "@/types/job.type";
import { JobTypeLabelVN } from "@/constants";
import { toast } from "react-toastify";
import Loading from "@/components/Loading";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  logo: string;
  expireDate: string;
  savedDate: string;
  salary: string;
  posted: string;
  applications: string;
  description: string;
  requirements: string[];
  benefits: {
    offer: string[];
    rights: string[];
  };
  image: string;
  companyWebsite?: string;
}

// Format salary
const formatSalary = (job: JobResponse): string => {
  try {
    if (job.salaryType === "RANGE") {
      const min = job.minSalary != null ? Number(job.minSalary).toLocaleString() : null;
      const max = job.maxSalary != null ? Number(job.maxSalary).toLocaleString() : null;
      return `${min ?? ""}${min && max ? " - " : ""}${max ?? ""} ${job.salaryUnit ?? ""}`.trim();
    }
    if (job.salaryType === "GREATER_THAN" && job.minSalary != null) {
      return `${Number(job.minSalary).toLocaleString()} ${job.salaryUnit ?? ""}`;
    }
    if (job.salaryType === "NEGOTIABLE") return "Thỏa thuận";
    if (job.salaryType === "COMPETITIVE") return "Cạnh tranh";
    return "Thỏa thuận";
  } catch (e) {
    return "Thỏa thuận";
  }
};

// Map type to color
const mapTypeColor = (jobType?: string): string => {
  if (!jobType) return "bg-gray-400";
  if (jobType.includes("FULL") || jobType.includes("TEMPORARY_FULL")) return "bg-green-500";
  if (jobType.includes("PART")) return "bg-orange-500";
  if (jobType.includes("CONTRACT")) return "bg-purple-500";
  return "bg-blue-500";
};

// Format date
const formatDate = (dateString?: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (e) {
    return "";
  }
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

export default function MySavedJobs() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const queryClient = useQueryClient();

  // Fetch saved jobs
  const {
    data: savedJobsResponse,
    isLoading: isLoadingSavedJobs,
    isError: isErrorSavedJobs,
  } = useQuery({
    queryKey: ["saved-jobs", currentPage, itemsPerPage],
    queryFn: () => jobService.getSavedJobs(currentPage, itemsPerPage),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Fetch top attractive jobs for suggestions
  const { data: topAttractiveResponse } = useQuery({
    queryKey: ["top-attractive-jobs", 7],
    queryFn: () => jobService.getTopAttractiveJobs(7),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Map saved jobs from API to Job interface
  const jobs = useMemo(() => {
    if (!savedJobsResponse?.data?.items) return [];
    return savedJobsResponse.data.items.map((job: JobResponse) => {
      const firstLocation = job.jobLocations?.[0];
      const locationString = firstLocation
        ? `${firstLocation.detailAddress || ""}, ${firstLocation.district?.name || ""}, ${firstLocation.province?.name || ""}`.replace(/^,\s*|,\s*$/g, "").trim()
        : "Chưa cập nhật địa chỉ";

      return {
        id: job.id,
        title: job.jobTitle || "",
        company: job.companyName || job.author?.companyName || "",
        location: locationString,
        type: JobTypeLabelVN[job.jobType as keyof typeof JobTypeLabelVN] || job.jobType || "",
        logo: job.author?.avatarUrl || "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg",
        expireDate: job.expirationDate ? formatDate(job.expirationDate) : "",
        savedDate: job.createdAt ? relativePosted(job.createdAt) : "",
        salary: formatSalary(job),
        posted: job.createdAt ? relativePosted(job.createdAt) : "",
        applications: (job as any).numberOfApplications?.toString() || "0",
        description: job.jobDescription || "",
        requirements: job.requirement ? [job.requirement] : [],
        benefits: {
          offer: job.jobBenefits?.map((b) => b.description || "") || [],
          rights: [],
        },
        image: job.author?.backgroundUrl || "",
        companyWebsite: job.companyWebsite || "",
      };
    });
  }, [savedJobsResponse]);

  // Map suggested jobs
  const suggestedJobs = useMemo(() => {
    if (!topAttractiveResponse?.data) return [];
    return topAttractiveResponse.data.map((job) => ({
      id: job.id,
      title: job.jobTitle || "",
      company: job.companyName || job.author?.companyName || "",
      salary: formatSalary(job),
      type: JobTypeLabelVN[job.jobType as keyof typeof JobTypeLabelVN] || job.jobType,
      typeColor: mapTypeColor(job.jobType),
      logo: job.author?.avatarUrl || "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg",
    }));
  }, [topAttractiveResponse]);

  const totalPages = savedJobsResponse?.data?.totalPages || 0;
  const currentJobs = jobs;

  // Toggle save/unsave mutation
  const toggleSaveMutation = useMutation({
    mutationFn: (jobId: number) => jobService.toggleSavedJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      toast.success("Đã bỏ lưu việc làm");
      // Close sheet if viewing deleted job
      if (selectedJob) {
        setIsSheetOpen(false);
        setSelectedJob(null);
      }
      // Adjust page if needed
      if (currentPage > 1 && currentJobs.length === 1) {
        setCurrentPage(currentPage - 1);
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Có lỗi xảy ra";
      toast.error(errorMessage);
    },
  });

  const handleDeleteJob = (jobId: number) => {
    toggleSaveMutation.mutate(jobId);
  };

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setIsSheetOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div
        className="w-full h-[450px] bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(#00000080, #00000080), url('/work1.jpg')",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div className="text-center px-4">
          <h1
            className="text-white drop-shadow-lg"
            style={{
              marginBottom: 0,
              fontWeight: 500,
              lineHeight: '60px',
              fontSize: '40px',
            }}
          >
            Tìm việc làm nhanh 24h mới nhất trên toàn quốc
          </h1>
          <p
            className="text-white mt-4"
            style={{
              color: '#fff',
              fontSize: '18px',
              lineHeight: '28px',
              fontWeight: 400,
              opacity: 0.95,
            }}
          >
            Tiếp cận 60.000+ tin tuyển dụng việc làm mỗi ngày từ hàng nghìn doanh nghiệp uy tín tại Việt Nam
          </p>
        </div>
      </div>
      <div style={{ background: "linear-gradient(90deg, #fafcfb 0%, #f5faf7 30%, #f0f7f5 60%, #f0f7fc 100%)" }}>
      <div className="flex main-layout relative z-10 pt-20 pb-8" >
          {/* Left Sidebar - Suggested Jobs */}
          <div className="w-96 flex-shrink-0">
            <SuggestedJobs jobs={suggestedJobs} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="max-w-7xl mx-auto px-5">
              {/* Content */}
              {isLoadingSavedJobs ? (
                <div className="flex justify-center items-center py-20">
                  <Loading />
                </div>
              ) : isErrorSavedJobs ? (
                <div className="text-center py-20">
                  <p className="text-gray-600">Có lỗi xảy ra khi tải danh sách việc làm đã lưu</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600">Bạn chưa lưu việc làm nào</p>
                </div>
              ) : (
                <>
                  <GridView jobs={currentJobs} onView={handleViewJob} onDelete={handleDeleteJob} />
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          {/* Job Summary Sheet */}
          <JobSummarySheet job={selectedJob} isOpen={isSheetOpen} onOpenChange={setIsSheetOpen} onDelete={handleDeleteJob} />

        </div>
      </div>
    </>
  );
}

// Grid View Component
function GridView({ jobs, onView, onDelete }: { jobs: Job[]; onView: (job: Job) => void; onDelete: (id: number) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <div key={job.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer relative p-6">
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => onView(job)}
              className="w-8 h-8 rounded-full border-2 border-blue-300 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(job.id)}
              className="w-8 h-8 rounded-full border-2 border-red-300 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Job Logo */}
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 mb-4">
            <img src={job.logo || "/placeholder.svg"} alt={job.company} className="w-full h-full object-cover" />
          </div>

          {/* Job Title */}
          <div className="mb-2">
            <h3 className="font-bold text-gray-900 text-lg mb-1">{job.title}</h3>
            {job.type && (
              <Badge variant="secondary" className={cn("text-xs", job.type === "Remote" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700")}>
                {job.type}
              </Badge>
            )}
          </div>

          {/* Location */}
          <div className="flex items-start gap-1 text-sm text-gray-500 mb-4">
            <MapPin className="w-8 h-8" />
            <span>{job.location}</span>
          </div>

          {/* Company */}
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Building2 className="w-4 h-4" />
            <span>{job.company}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

