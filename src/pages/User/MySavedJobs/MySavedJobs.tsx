import { useState, useMemo } from "react";
import { Heart, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import Pagination from "@/components/Pagination";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobService } from "@/services/job.service";
import type { JobResponse } from "@/types/job.type";
import { JobTypeLabelVN } from "@/constants";
import { toast } from "react-toastify";
import Loading from "@/components/Loading";
import { Link } from "react-router-dom";
import { routes } from "@/routes/routes.const";
import JobApplicationModal from "@/components/JobApplicationModal/JobApplicationModal";
import { useTranslation } from "@/hooks/useTranslation";
import { formatSalaryCompact } from "@/utils/formatSalary";
import PageTitle from "@/components/PageTitle/PageTitle";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  logo: string;
  expireDate: string;
  expirationDate?: string;
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

const formatSalary = (job: JobResponse): string => {
  const t = (key: string) => {
    if (key.includes("Negotiable") || key.includes("negotiable"))
      return "Thỏa thuận";
    if (key.includes("Competitive") || key.includes("competitive"))
      return "Cạnh tranh";
    return "Thỏa thuận";
  };
  return formatSalaryCompact(job, t);
};

const mapTypeColor = (jobType?: string): string => {
  if (!jobType) return "bg-gray-400";
  if (jobType.includes("FULL") || jobType.includes("TEMPORARY_FULL"))
    return "bg-green-500";
  if (jobType.includes("PART")) return "bg-orange-500";
  if (jobType.includes("CONTRACT")) return "bg-purple-500";
  return "bg-blue-500";
};

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

const getDaysUntilExpiration = (expirationDate?: string): number | null => {
  if (!expirationDate) return null;
  try {
    const expDate = new Date(expirationDate);
    const now = new Date();
    const diffMs = expDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : null;
  } catch (e) {
    return null;
  }
};

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
    if (diffDays === 0) return t("mySavedJobs.relativeTime.today");
    if (diffDays === 1) return t("mySavedJobs.relativeTime.yesterday");
    if (diffDays < 7)
      return t("mySavedJobs.relativeTime.daysAgo", { count: diffDays });
    if (diffDays < 30)
      return t("mySavedJobs.relativeTime.weeksAgo", {
        count: Math.floor(diffDays / 7),
      });
    if (diffDays < 365)
      return t("mySavedJobs.relativeTime.monthsAgo", {
        count: Math.floor(diffDays / 30),
      });
    return t("mySavedJobs.relativeTime.yearsAgo", {
      count: Math.floor(diffDays / 365),
    });
  } catch (e) {
    return "";
  }
};

export default function MySavedJobs() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const queryClient = useQueryClient();

  const {
    data: savedJobsResponse,
    isLoading: isLoadingSavedJobs,
    isError: isErrorSavedJobs,
  } = useQuery({
    queryKey: ["saved-jobs", currentPage, itemsPerPage],
    queryFn: () => jobService.getSavedJobs(currentPage, itemsPerPage),
    staleTime: 0,
  });

  const jobs = useMemo(() => {
    if (!savedJobsResponse?.data?.items) return [];
    return savedJobsResponse.data.items.map((job: JobResponse) => {
      const firstLocation = job.jobLocations?.[0];
      const locationString = firstLocation
        ? `${firstLocation.detailAddress || ""}, ${
            firstLocation.district?.name || ""
          }, ${firstLocation.province?.name || ""}`
            .replace(/^,\s*|,\s*$/g, "")
            .trim()
        : t("mySavedJobs.locationNotUpdated");

      return {
        id: job.id,
        title: job.jobTitle || "",
        company: job.companyName || job.author?.companyName || "",
        location: locationString,
        type:
          JobTypeLabelVN[job.jobType as keyof typeof JobTypeLabelVN] ||
          job.jobType ||
          "",
        logo:
          job.author?.avatarUrl ||
          "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg",
        expireDate: job.expirationDate ? formatDate(job.expirationDate) : "",
        expirationDate: job.expirationDate || "",
        savedDate: job.createdAt ? relativePosted(job.createdAt, t) : "",
        salary: formatSalary(job),
        posted: job.createdAt ? relativePosted(job.createdAt, t) : "",
        applications: (job as any).numberOfApplications?.toString() || "0",
        description: job.jobDescription || "",
        requirements: job.requirement ? [job.requirement] : [],
        benefits: {
          offer: job.jobBenefits?.map((b) => b.description || "") || [],
          rights: [],
        },
        image: job.author?.backgroundUrl || "",
        companyWebsite: job.companyWebsite || "",
        backgroundUrl:
          job.author?.backgroundUrl ||
          "https://marketplace.canva.com/EAGZ0XPzFoE/1/0/1600w/canva-blue-and-white-line-modern-corporate-business-banner-Cvux46kBPZ8.jpg",
      };
    });
  }, [savedJobsResponse, t]);

  const totalPages = savedJobsResponse?.data?.totalPages || 0;
  const currentJobs = jobs;

  const toggleSaveMutation = useMutation({
    mutationFn: (jobId: number) => jobService.toggleSavedJob(jobId),
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["saved-job", jobId] });
      toast.success(t("toast.success.jobUnsaved"));

      if (currentPage > 1 && currentJobs.length === 1) {
        setCurrentPage(currentPage - 1);
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || t("toast.error.unknownError");
      toast.error(errorMessage);
    },
  });

  const handleUnsaveJob = (jobId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveMutation.mutate(jobId);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <PageTitle title={t("pageTitles.mySavedJobs")} />
      <div className="w-full bg-white border-b border-gray-200 py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-5">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0A2E5C] mb-1">
            {t("mySavedJobs.title", {
              count: savedJobsResponse?.data?.numberOfElements || 0,
            })}
          </h1>
          <p className="text-gray-500 text-sm">{t("mySavedJobs.today")}</p>
        </div>
      </div>
      <div className="bg-gray-50 min-h-screen">
        <div className="main-layout relative z-10 pt-4 md:pt-8 pb-8">
          <div className="max-w-7xl mx-auto px-4 md:px-5">
            {/* Content */}
            {isLoadingSavedJobs ? (
              <div className="flex justify-center items-center py-20">
                <Loading />
              </div>
            ) : isErrorSavedJobs ? (
              <div className="text-center py-20">
                <p className="text-gray-600">{t("mySavedJobs.errorLoading")}</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600">{t("mySavedJobs.noSavedJobs")}</p>
              </div>
            ) : (
              <>
                <ListView jobs={currentJobs} onUnsave={handleUnsaveJob} />
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
      </div>
    </>
  );
}

function ListView({
  jobs,
  onUnsave,
}: {
  jobs: Job[];
  onUnsave: (jobId: number, e: React.MouseEvent) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {jobs.map((job, index) => {
        const daysUntilExpiration = getDaysUntilExpiration(job.expirationDate);

        return (
          <div
            key={job.id}
            className={cn(
              "flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors",
              index !== jobs.length - 1 && "border-b border-gray-200"
            )}
          >
            {/* Heart Icon (Saved) */}
            <button
              onClick={(e) => onUnsave(job.id, e)}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-[#0A2E5C] hover:opacity-80 transition-opacity"
              title={t("mySavedJobs.unsave")}
            >
              <Heart className="w-6 h-6 fill-[#0A2E5C]" />
            </button>

            {/* Company Logo */}
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={job.logo || "/placeholder.svg"}
                alt={job.company}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Job Info */}
            <div className="flex-1 min-w-0">
              <Link
                to={`/${routes.JOB_DETAIL}/${job.id}`}
                className="block hover:opacity-80 transition-opacity"
              >
                <h3 className="font-bold text-[#0A2E5C] text-lg mb-1 truncate">
                  {job.title}
                </h3>
                <p className="text-gray-500 text-sm truncate">{job.company}</p>
              </Link>
            </div>

            {/* Expiration Date */}
            <div className="flex-shrink-0 text-right">
              {daysUntilExpiration !== null && daysUntilExpiration >= 0 ? (
                <p className="text-green-600 font-medium text-sm">
                  {t("mySavedJobs.expiresIn", { count: daysUntilExpiration })}
                </p>
              ) : (
                <p className="text-gray-400 text-sm">
                  {t("mySavedJobs.expired")}
                </p>
              )}
            </div>

            {/* Apply Button */}
            <div className="flex-shrink-0">
              <JobApplicationModal
                jobId={job.id}
                jobTitle={job.title}
                companyName={job.company}
              >
                <button className="w-10 h-10 rounded-full bg-[#0A2E5C] hover:bg-[#082040] text-white flex items-center justify-center transition-colors shadow-md hover:shadow-lg">
                  <Send className="w-5 h-5" />
                </button>
              </JobApplicationModal>
            </div>
          </div>
        );
      })}
    </div>
  );
}
