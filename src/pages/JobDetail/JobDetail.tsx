import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CalendarDays,
  Clock,
  Briefcase,
  Users,
  MapPin,
  Heart,
} from "lucide-react";
import SuggestedJobs from "@/components/SuggestedJob";
import CompanyHiringJobs from "@/components/CompanyHiringJobs/CompanyHiringJobs";
import JobInformation from "@/components/JobInformation";
import JobApplicationModal from "@/components/JobApplicationModal";
import { jobService } from "@/services/job.service";
import type { JobResponse } from "@/types/job.type";
import {
  CompanySizeLabel,
  ExperienceLevelLabelVN,
  JobTypeLabelVN,
  JobType,
  ExperienceLevel,
} from "@/constants";
import Loading from "@/components/Loading";
import { useUserAuth } from "@/context/user-auth";
import LoginRequiredModal from "@/components/LoginRequiredModal/LoginRequiredModal";
import { useTranslation } from "@/hooks/useTranslation";
import { formatSalaryCompact } from "@/utils/formatSalary";

// Format salary (using compact format)
const formatSalary = (job: JobResponse, t: (key: string) => string): string => {
  return formatSalaryCompact(job, t);
};

// Map type to color
const mapTypeColor = (jobType?: string): string => {
  if (!jobType) return "bg-gray-400";
  if (jobType.includes("FULL") || jobType.includes("TEMPORARY_FULL"))
    return "bg-green-500";
  if (jobType.includes("PART")) return "bg-orange-500";
  if (jobType.includes("CONTRACT")) return "bg-purple-500";
  return "bg-blue-500";
};

// Calculate remaining days
const calculateRemainingDays = (
  expirationDate: string | undefined,
  t: (key: string) => string
): string => {
  if (!expirationDate) return "";
  try {
    const expiration = new Date(expirationDate);
    const now = new Date();
    const diffMs = expiration.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return t("jobDetail.expired");
    if (diffDays === 0) return t("jobDetail.expiresToday");
    if (diffDays === 1) return t("jobDetail.daysRemaining", { count: 1 });
    return t("jobDetail.daysRemaining", { count: diffDays });
  } catch (e) {
    return "";
  }
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

// Map enum to display label using translation
const mapEnumToJobType = (
  enumValue: string,
  t: (key: string) => string
): string => {
  const mapping: Record<string, string> = {
    [JobType.FULL_TIME]: t("jobSearch.enums.jobType.FULL_TIME"),
    [JobType.TEMPORARY_FULL_TIME]: t(
      "jobSearch.enums.jobType.TEMPORARY_FULL_TIME"
    ),
    [JobType.PART_TIME]: t("jobSearch.enums.jobType.PART_TIME"),
    [JobType.TEMPORARY_PART_TIME]: t(
      "jobSearch.enums.jobType.TEMPORARY_PART_TIME"
    ),
    [JobType.CONTRACT]: t("jobSearch.enums.jobType.CONTRACT"),
    [JobType.OTHER]: t("jobSearch.enums.jobType.OTHER"),
  };
  return mapping[enumValue] || enumValue;
};

const mapEnumToExperience = (
  enumValue: string,
  t: (key: string) => string
): string => {
  const mapping: Record<string, string> = {
    [ExperienceLevel.LESS_THAN_ONE_YEAR]: t(
      "jobSearch.enums.experienceLevel.LESS_THAN_ONE_YEAR"
    ),
    [ExperienceLevel.ONE_TO_TWO_YEARS]: t(
      "jobSearch.enums.experienceLevel.ONE_TO_TWO_YEARS"
    ),
    [ExperienceLevel.TWO_TO_FIVE_YEARS]: t(
      "jobSearch.enums.experienceLevel.TWO_TO_FIVE_YEARS"
    ),
    [ExperienceLevel.FIVE_TO_TEN_YEARS]: t(
      "jobSearch.enums.experienceLevel.FIVE_TO_TEN_YEARS"
    ),
    [ExperienceLevel.MORE_THAN_TEN_YEARS]: t(
      "jobSearch.enums.experienceLevel.MORE_THAN_TEN_YEARS"
    ),
  };
  return mapping[enumValue] || enumValue;
};

const JobDetail = () => {
  const { t, currentLanguage } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { state: authState } = useUserAuth();
  const isAuthenticated = authState.isAuthenticated;
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Fetch job detail
  const {
    data: jobResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: () => jobService.getJobById(Number(id)),
    enabled: !!id,
  });

  // Get employer ID from job response
  const employerId = jobResponse?.data?.author?.id;

  // Fetch hiring jobs of the company
  const { data: companyJobsResponse } = useQuery({
    queryKey: ["company-hiring-jobs", employerId],
    queryFn: () => jobService.getJobsByEmployerId(employerId!, 1, 6),
    enabled: !!employerId && !!jobResponse?.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Map company hiring jobs (exclude current job)
  const companyHiringJobs = useMemo(() => {
    if (!companyJobsResponse?.data?.items) return [];
    const currentJobId = jobResponse?.data?.id;
    return companyJobsResponse.data.items
      .filter((job) => job.id !== currentJobId) // Exclude current job
      .slice(0, 5) // Limit to 5 jobs
      .map((job) => {
        const firstLocation =
          Array.isArray(job.jobLocations) && job.jobLocations.length > 0
            ? job.jobLocations[0]
            : null;
        const locationParts: string[] = [];
        if (firstLocation) {
          if (firstLocation.province?.name)
            locationParts.push(firstLocation.province.name);
          if (firstLocation.district?.name)
            locationParts.push(firstLocation.district.name);
        }

        return {
          id: job.id,
          title: job.jobTitle || "",
          company: job.companyName || job.author?.companyName || "",
          location: locationParts.join(", ") || "",
          salary: formatSalary(job, t),
          type: mapEnumToJobType(job.jobType, t),
          typeColor: mapTypeColor(job.jobType),
          logo:
            job.author?.avatarUrl ||
            "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg",
          numberOfApplications: job.numberOfApplications || 0,
        };
      });
  }, [companyJobsResponse, jobResponse?.data?.id, t]);

  // Fetch top 5 attractive jobs for sidebar
  const { data: topAttractiveResponse } = useQuery({
    queryKey: ["top-attractive-jobs", 5],
    queryFn: () => jobService.getTopAttractiveJobs(5),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Map top 5 attractive jobs for sidebar
  const topAttractiveJobs = useMemo(() => {
    if (!topAttractiveResponse?.data) return [];
    const currentJobId = jobResponse?.data?.id;
    return topAttractiveResponse.data
      .filter((job) => job.id !== currentJobId) // Exclude current job
      .slice(0, 5) // Limit to 5 jobs
      .map((job) => ({
        id: job.id,
        title: job.jobTitle || "",
        company: job.companyName || job.author?.companyName || "",
        salary: formatSalary(job, t),
        type: mapEnumToJobType(job.jobType, t),
        typeColor: mapTypeColor(job.jobType),
        logo:
          job.author?.avatarUrl ||
          "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg",
      }));
  }, [topAttractiveResponse, jobResponse?.data?.id, t]);

  // Map job data for JobInformation component
  const jobData = useMemo(() => {
    if (!jobResponse?.data) return null;

    const job = jobResponse.data;
    const createdAt = job.createdAt ? new Date(job.createdAt) : null;
    const isNew = createdAt
      ? Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)) <
        7
      : false;

    return {
      isNew,
      companyBanner:
        job.author?.backgroundUrl ||
        "https://marketplace.canva.com/EAGZ0XPzFoE/1/0/1600w/canva-blue-and-white-line-modern-corporate-business-banner-Cvux46kBPZ8.jpg",
      companyLogo:
        job.author?.avatarUrl ||
        "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg",
      jobTitle: job.jobTitle || "",
      companyName: job.companyName || job.author?.companyName || "",
      jobLocation: job.jobLocations || [],
      companyWebsite: job.companyWebsite || "",
      salary: {
        salaryType: job.salaryType,
        minSalary: job.minSalary,
        maxSalary: job.maxSalary,
        salaryUnit: job.salaryUnit,
      },
      expirationDate: job.expirationDate || "",
      jobDescription: job.jobDescription || "",
      jobBenefits: job.jobBenefits || [],
      requirement: job.requirement || "",
      jobType: job.jobType,
      jobLevel: job.jobLevel,
      educationLevel: job.educationLevel,
      experienceLevel: job.experienceLevel,
      gender: job.gender,
      age: {
        ageType: job.ageType,
        minAge: job.minAge,
        maxAge: job.maxAge,
      },
      industries: job.industries || [],
      contactPerson: job.contactPerson || "",
      phoneNumber: job.phoneNumber || "",
      contactLocation: job.contactLocation || {
        province: {} as any,
        district: {} as any,
        detailAddress: "",
      },
      description: job.description,
      companySize: job.companySize,
      aboutCompany: job.aboutCompany || "",
    };
  }, [jobResponse]);

  // Calculate remaining days and formatted date
  const remainingDays = useMemo(() => {
    if (!jobResponse?.data?.expirationDate) return "";
    return calculateRemainingDays(jobResponse.data.expirationDate, t);
  }, [jobResponse, t]);

  const formattedDeadline = useMemo(() => {
    if (!jobResponse?.data?.expirationDate) return "";
    return formatDate(jobResponse.data.expirationDate);
  }, [jobResponse]);

  // Format location string
  const locationString = useMemo(() => {
    if (!jobData?.jobLocation || jobData.jobLocation.length === 0) return "";
    const firstLocation = jobData.jobLocation[0];
    const parts: string[] = [];
    if (firstLocation.province?.name) parts.push(firstLocation.province.name);
    if (firstLocation.district?.name) parts.push(firstLocation.district.name);
    return parts.join(", ");
  }, [jobData]);

  // Format address string
  const addressString = useMemo(() => {
    if (!jobData?.jobLocation || jobData.jobLocation.length === 0) return "";
    const firstLocation = jobData.jobLocation[0];
    const parts: string[] = [];
    if (firstLocation.detailAddress) parts.push(firstLocation.detailAddress);
    if (firstLocation.district?.name) parts.push(firstLocation.district.name);
    if (firstLocation.province?.name) parts.push(firstLocation.province.name);
    return parts.join(", ");
  }, [jobData]);

  // Format experience string
  const experienceString = useMemo(() => {
    if (!jobResponse?.data?.experienceLevel) return "";
    return mapEnumToExperience(jobResponse.data.experienceLevel, t);
  }, [jobResponse, t]);

  // Format work type string
  const workTypeString = useMemo(() => {
    if (!jobResponse?.data?.jobType) return "";
    return mapEnumToJobType(jobResponse.data.jobType, t);
  }, [jobResponse, t]);

  // Format company size string
  const companySizeString = useMemo(() => {
    if (!jobResponse?.data?.companySize) return "";
    return (
      CompanySizeLabel[currentLanguage][
        jobResponse.data.companySize as keyof (typeof CompanySizeLabel)["vi"]
      ] || jobResponse.data.companySize
    );
  }, [jobResponse, currentLanguage]);

  const queryClient = useQueryClient();
  const jobId = jobResponse?.data?.id;

  // Check if job is saved - only check when user is authenticated
  const { data: isSavedResponse } = useQuery({
    queryKey: ["saved-job", jobId],
    queryFn: () => jobService.checkSavedJob(jobId!),
    enabled: !!jobId && isAuthenticated, // Only check when authenticated
    retry: false,
    placeholderData: () => {
      // Check if job exists in saved-jobs cache
      const savedJobsQueries = queryClient.getQueriesData({
        queryKey: ["saved-jobs"],
      });
      for (const [, data] of savedJobsQueries) {
        const savedJobsData = data as any;
        if (savedJobsData?.data?.items) {
          const isInSavedList = savedJobsData.data.items.some(
            (job: any) => job.id === jobId
          );
          if (isInSavedList) {
            return { status: 200, message: "", data: true };
          }
        }
      }
      return undefined;
    },
  });

  const isSaved = isSavedResponse?.data ?? false;

  // Toggle save/unsave mutation
  const toggleSaveMutation = useMutation({
    mutationFn: () => jobService.toggleSavedJob(jobId!),
    onSuccess: () => {
      // Invalidate both saved-job status and saved-jobs list
      queryClient.invalidateQueries({ queryKey: ["saved-job", jobId] });
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      toast.success(
        isSaved ? t("toast.success.jobUnsaved") : t("toast.success.jobSaved")
      );
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || t("toast.error.unknownError");
      toast.error(errorMessage);
    },
  });

  const handleToggleSave = () => {
    if (!jobId) {
      toast.error(t("toast.error.notFound"));
      return;
    }
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    toggleSaveMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError || !jobData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("jobDetail.notFound")}
          </h2>
          <p className="text-gray-600 mb-4">
            {(error as any)?.message || t("jobDetail.notFoundMessage")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <div className="main-layout relative z-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Job Information */}
          <div className="lg:col-span-2 space-y-8">
            <JobInformation
              job={jobData}
              jobId={jobResponse?.data?.id}
              hideActionButtons={false}
            />

            {/* Company Hiring Jobs */}
            <div className="mt-8">
              <CompanyHiringJobs
                jobs={companyHiringJobs}
                companyName={jobData?.companyName || ""}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Job Quick Details */}
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/30 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/30 opacity-60"></div>
                <div className="relative z-10">
                  <h3 className="font-semibold text-gray-900 text-lg mb-4">
                    {t("jobDetail.jobDetails")}
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">
                          {t("jobDetail.location")}
                        </p>
                        <p className="font-medium text-gray-900">
                          {locationString || t("jobDetail.notUpdated")}
                        </p>
                        {addressString && (
                          <p className="text-xs text-gray-500 mt-1">
                            {addressString}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">
                          {t("jobDetail.experience")}
                        </p>
                        <p className="font-medium text-gray-900">
                          {experienceString || t("jobDetail.notUpdated")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Briefcase className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">
                          {t("jobDetail.jobType")}
                        </p>
                        <p className="font-medium text-gray-900">
                          {workTypeString || t("jobDetail.notUpdated")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Users className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">
                          {t("jobDetail.companySize")}
                        </p>
                        <p className="font-medium text-gray-900">
                          {companySizeString || t("jobDetail.notUpdated")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CalendarDays className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">
                          {t("jobDetail.applicationDeadline")}
                        </p>
                        <p className="font-medium text-gray-900">
                          {formattedDeadline || t("jobDetail.notUpdated")}
                        </p>
                        {remainingDays && (
                          <p className="text-sm text-red-600 font-medium mt-1">
                            {remainingDays}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t space-y-3">
                    {jobId && (
                      <JobApplicationModal
                        jobId={jobId}
                        jobTitle={jobData.jobTitle}
                        companyName={jobData.companyName}
                      >
                        <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                          {t("jobDetail.applyNow")}
                        </Button>
                      </JobApplicationModal>
                    )}
                    <Button
                      variant="outline"
                      onClick={handleToggleSave}
                      disabled={!jobId || toggleSaveMutation.isPending}
                      className={`w-full border-red-200 hover:bg-red-50 bg-transparent ${
                        isSaved ? "text-red-600 bg-red-50" : "text-red-600"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`}
                      />
                      {isSaved ? t("jobDetail.saved") : t("jobDetail.saveJob")}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Top 5 Attractive Jobs */}
              <SuggestedJobs
                jobs={topAttractiveJobs}
                onViewAll={() => console.log("View all suggested jobs")}
              />
            </div>
          </div>
        </div>
      </div>

      <LoginRequiredModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        title={t("loginRequired.title")}
        description={t("loginRequired.description")}
        actionText={t("loginRequired.actionText")}
      />
    </div>
  );
};

export default JobDetail;
