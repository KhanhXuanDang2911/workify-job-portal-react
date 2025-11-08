import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CalendarDays,
  Clock,
  Briefcase,
  Users,
  MapPin,
} from "lucide-react";
import SuggestedJobs from "@/components/SuggestedJob";
import JobInformation from "@/components/JobInformation";
import JobApplicationModal from "@/components/JobApplicationModal";
import { jobService } from "@/services/job.service";
import type { JobResponse } from "@/types/job.type";
import {
  CompanySizeLabel,
  ExperienceLevelLabelVN,
  JobTypeLabelVN,
} from "@/constants";
import Loading from "@/components/Loading";

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

// Calculate remaining days
const calculateRemainingDays = (expirationDate?: string): string => {
  if (!expirationDate) return "";
  try {
    const expiration = new Date(expirationDate);
    const now = new Date();
    const diffMs = expiration.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "Đã hết hạn";
    if (diffDays === 0) return "Hết hạn hôm nay";
    if (diffDays === 1) return "1 ngày còn lại";
    return `${diffDays} ngày còn lại`;
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

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();

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

  // Fetch top attractive jobs for suggestions
  const { data: topAttractiveResponse } = useQuery({
    queryKey: ["top-attractive-jobs"],
    queryFn: () => jobService.getTopAttractiveJobs(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

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
    }));
  }, [topAttractiveResponse]);

  // Map job data for JobInformation component
  const jobData = useMemo(() => {
    if (!jobResponse?.data) return null;

    const job = jobResponse.data;
    const createdAt = job.createdAt ? new Date(job.createdAt) : null;
    const isNew = createdAt
      ? Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)) < 7
      : false;

    return {
      isNew,
      companyBanner: job.author?.backgroundUrl || "",
      companyLogo: job.author?.avatarUrl || "",
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
    return calculateRemainingDays(jobResponse.data.expirationDate);
  }, [jobResponse]);

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
    return ExperienceLevelLabelVN[jobResponse.data.experienceLevel as keyof typeof ExperienceLevelLabelVN] || jobResponse.data.experienceLevel;
  }, [jobResponse]);

  // Format work type string
  const workTypeString = useMemo(() => {
    if (!jobResponse?.data?.jobType) return "";
    return JobTypeLabelVN[jobResponse.data.jobType as keyof typeof JobTypeLabelVN] || jobResponse.data.jobType;
  }, [jobResponse]);

  // Format company size string
  const companySizeString = useMemo(() => {
    if (!jobResponse?.data?.companySize) return "";
    return CompanySizeLabel["vi"][jobResponse.data.companySize as keyof typeof CompanySizeLabel["vi"]] || jobResponse.data.companySize;
  }, [jobResponse]);

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy việc làm</h2>
          <p className="text-gray-600 mb-4">
            {(error as any)?.message || "Việc làm không tồn tại hoặc bạn không có quyền truy cập."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Job Information */}
          <div className="lg:col-span-2">
            <JobInformation job={jobData} hideActionButtons={false} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Job Quick Details */}
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/30 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/30 opacity-60"></div>
                <div className="relative z-10">
                  <h3 className="font-semibold text-gray-900 text-lg mb-4">
                    Job Details
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium text-gray-900">
                          {locationString || "Chưa cập nhật"}
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
                        <p className="text-sm text-gray-600">Experience</p>
                        <p className="font-medium text-gray-900">
                          {experienceString || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Briefcase className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Job Type</p>
                        <p className="font-medium text-gray-900">
                          {workTypeString || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Users className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Company Size</p>
                        <p className="font-medium text-gray-900">
                          {companySizeString || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CalendarDays className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">
                          Application Deadline
                        </p>
                        <p className="font-medium text-gray-900">
                          {formattedDeadline || "Chưa cập nhật"}
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
                    <JobApplicationModal
                      jobTitle={jobData.jobTitle}
                      companyName={jobData.companyName}
                    >
                      <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                        Nộp đơn ngay
                      </Button>
                    </JobApplicationModal>
                    <Button
                      variant="outline"
                      className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                    >
                      Lưu việc làm
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Suggested Jobs */}
              <SuggestedJobs
                jobs={suggestedJobs}
                onViewAll={() => console.log("View all suggested jobs")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
