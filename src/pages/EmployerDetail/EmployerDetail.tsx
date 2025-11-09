import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  PhoneCall,
  Mail,
  Users,
  Facebook,
  Twitter,
  Linkedin,
  Globe,
  Youtube,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { employerService } from "@/services/employer.service";
import { jobService } from "@/services/job.service";
import { CompanySizeLabelVN, JobTypeLabelVN } from "@/constants";
import Loading from "@/components/Loading";
import JobCard from "@/components/JobCard";
import Pagination from "@/components/Pagination";
import type { JobResponse } from "@/types/job.type";

export default function EmployerDetail() {
  const { id } = useParams<{ id: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3;

  // Fetch employer data
  const {
    data: employerResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["employer", id],
    queryFn: () => employerService.getEmployerById(Number(id)),
    enabled: !!id && !isNaN(Number(id)),
    staleTime: 5 * 60 * 1000,
  });

  const employer = employerResponse?.data;

  // Fetch jobs by employer id
  const {
    data: jobsResponse,
    isLoading: isLoadingJobs,
  } = useQuery({
    queryKey: ["employer-jobs", id, currentPage, jobsPerPage],
    queryFn: () => jobService.getJobsByEmployerId(Number(id), currentPage, jobsPerPage),
    enabled: !!id && !isNaN(Number(id)) && !!employer,
    staleTime: 5 * 60 * 1000,
  });

  const totalJobs = jobsResponse?.data?.numberOfElements || 0;
  const totalPages = jobsResponse?.data?.totalPages || 0;

  // Build full address
  const buildFullAddress = () => {
    if (!employer) return "";
    const parts = [
      employer.detailAddress,
      employer.district?.name,
      employer.province?.name,
    ].filter(Boolean);
    return parts.join(", ") || "Chưa cập nhật";
  };

  // Build Google Maps URL for iframe
  const buildGoogleMapsUrl = () => {
    const address = buildFullAddress();
    if (!address || address === "Chưa cập nhật") {
      return "https://maps.google.com/maps?width=100%25&height=400&hl=en&q=Vietnam&t=&z=6&ie=UTF8&iwloc=B&output=embed";
    }
    const encodedAddress = encodeURIComponent(address);
    return `https://maps.google.com/maps?width=100%25&height=400&hl=en&q=${encodedAddress}&t=&z=14&ie=UTF8&iwloc=B&output=embed`;
  };

  // Get company size label
  const getCompanySizeLabel = () => {
    if (!employer?.companySize) return "Chưa cập nhật";
    return CompanySizeLabelVN[employer.companySize as keyof typeof CompanySizeLabelVN] || employer.companySize;
  };

  // Parse websiteUrls (can be array or string)
  const getWebsiteUrls = () => {
    if (!employer?.websiteUrls) return [];
    if (Array.isArray(employer.websiteUrls)) return employer.websiteUrls;
    try {
      const parsed = JSON.parse(employer.websiteUrls);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // Sort and map jobs
  const sortedJobs = useMemo(() => {
    const jobsList = jobsResponse?.data?.items || [];

    // Format salary from JobResponse
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

    // Get relative posted time
    const relativePosted = (dateString: string): string => {
      try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return "Hôm nay";
        if (diffDays === 1) return "1 ngày trước";
        if (diffDays < 7) return `${diffDays} ngày trước`;
        if (diffDays < 30) {
          const weeks = Math.floor(diffDays / 7);
          return `${weeks} ${weeks === 1 ? "tuần" : "tuần"} trước`;
        }
        if (diffDays < 365) {
          const months = Math.floor(diffDays / 30);
          return `${months} ${months === 1 ? "tháng" : "tháng"} trước`;
        }
        const years = Math.floor(diffDays / 365);
        return `${years} ${years === 1 ? "năm" : "năm"} trước`;
      } catch (e) {
        return "";
      }
    };

    // Transform JobResponse to JobCard format
    const mapJobToCard = (job: JobResponse) => {
      const firstLocation = Array.isArray(job.jobLocations) && job.jobLocations.length > 0 ? job.jobLocations[0] : null;
      const locationParts: string[] = [];
      if (firstLocation) {
        if (firstLocation.province?.name) locationParts.push(firstLocation.province.name);
        if (firstLocation.district?.name) locationParts.push(firstLocation.district.name);
        if (firstLocation.detailAddress) locationParts.push(firstLocation.detailAddress);
      }

      return {
        id: job.id,
        title: job.jobTitle || "",
        company: job.companyName || job.author?.companyName || "",
        location: locationParts.join(", ") || "",
        salary: formatSalary(job),
        period: job.salaryUnit ?? "",
        type: JobTypeLabelVN[job.jobType as keyof typeof JobTypeLabelVN] || job.jobType,
        typeColor: mapTypeColor(job.jobType),
        posted: relativePosted(job.createdAt),
        logo: job.author?.avatarUrl || employer?.avatarUrl || "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg",
        companyWebsite: job.companyWebsite,
      };
    };

    const mapped = jobsList.map(mapJobToCard);
    return mapped.sort((a, b) => {
      const jobA = jobsList.find(j => j.id === a.id);
      const jobB = jobsList.find(j => j.id === b.id);
      if (!jobA || !jobB) return 0;
      
      // Sort by updatedAt (most recent first)
      return new Date(jobB.updatedAt).getTime() - new Date(jobA.updatedAt).getTime();
    });
  }, [jobsResponse?.data?.items, employer]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <Loading variant="spinner" size="lg" />
      </div>
    );
  }

  // Error state
  if (isError || !employer) {
    let errorMessage = "Không thể tải thông tin nhà tuyển dụng. Vui lòng thử lại sau.";
    
    if (error && typeof error === "object" && "response" in error) {
      const errorResponse = error.response as { data?: { message?: string } };
      if (errorResponse?.data?.message) {
        errorMessage = errorResponse.data.message;
      }
    } else if (!employer && !isError) {
      errorMessage = "Không tìm thấy nhà tuyển dụng.";
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-800 font-medium mb-2">Lỗi khi tải thông tin nhà tuyển dụng</p>
            <p className="text-red-600 text-sm mb-4">{errorMessage}</p>
            <Button onClick={() => window.history.back()} variant="outline">
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full blur-xl opacity-60 animate-float-gentle"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-lg opacity-50 animate-float-gentle-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-2xl opacity-40 animate-breathe"></div>
        <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full blur-xl opacity-45 animate-float-gentle"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full blur-2xl opacity-35 animate-breathe"></div>
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-white via-blue-50 to-indigo-50 border-b relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-96 h-32 bg-gradient-to-l from-cyan-200 via-blue-100 to-transparent opacity-70"></div>
        <div className="absolute top-0 left-0 w-64 h-24 bg-gradient-to-r from-purple-100 to-transparent opacity-50"></div>

        <div className="main-layout relative z-10 py-8">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Company Image and Info */}
            <div className="lg:col-span-2">
              <div className="relative h-80 rounded-lg overflow-hidden mb-6">
                <img
                  src={
                    employer.backgroundUrl ||
                    "https://marketplace.canva.com/EAGZ0XPzFoE/1/0/1600w/canva-blue-and-white-line-modern-corporate-business-banner-Cvux46kBPZ8.jpg"
                  }
                  alt={`${employer.companyName} background`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://marketplace.canva.com/EAGZ0XPzFoE/1/0/1600w/canva-blue-and-white-line-modern-corporate-business-banner-Cvux46kBPZ8.jpg";
                  }}
                />

                {/* Company logo positioned at bottom left */}
                <div className="absolute bottom-6 left-6">
                  <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center shadow-lg border overflow-hidden">
                    <img
                      src={
                        employer.avatarUrl ||
                        "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg"
                      }
                      alt={employer.companyName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg";
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons positioned below the image */}
              

              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {employer.companyName}
                </h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{buildFullAddress()}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{getCompanySizeLabel()}</span>
                </div>
                {employer.websiteUrls && getWebsiteUrls().length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    {employer.facebookUrl && (
                      <a
                        href={employer.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                    {employer.twitterUrl && (
                      <a
                        href={employer.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {employer.linkedinUrl && (
                      <a
                        href={employer.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {employer.googleUrl && (
                      <a
                        href={employer.googleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                    {employer.youtubeUrl && (
                      <a
                        href={employer.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                        <Youtube className="w-5 h-5" />
                </a>
                    )}
                  </div>
                )}
              </div>

              {/* About Company Section */}
              {employer.aboutCompany && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-blue-600 mb-4">
                  About Company
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>{employer.aboutCompany}</p>
                </div>
              </div>
              )}
            </div>

            {/* Right Column - Location and Profile Info Sidebars */}
            <div className="lg:col-span-1 space-y-6">
              {/* Location Section */}
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/30 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 opacity-60"></div>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">
                    Location
                  </h3>
                  <div className="mb-3">
                    {employer.district && (
                      <div className="text-sm text-gray-600 mb-1">
                        {employer.district.name}
                      </div>
                    )}
                    <div className="font-medium text-gray-900">
                      {buildFullAddress()}
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(buildFullAddress())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:underline"
                    >
                      View larger map
                    </a>
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <iframe
                      src={buildGoogleMapsUrl()}
                      width="100%"
                      height="300"
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="border-0"
                    />
                  </div>
                </div>
              </Card>

              {/* Profile Info Section */}
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/30 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/30 opacity-60"></div>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">
                    Profile Info
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Company Size</p>
                        <p className="font-medium text-gray-900">
                          {getCompanySizeLabel()}
                        </p>
                      </div>
                    </div>

                    {employer.contactPerson && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                          <p className="text-sm text-gray-600">Contact Person</p>
                          <p className="font-medium text-gray-900">
                            {employer.contactPerson}
                          </p>
                      </div>
                    </div>
                    )}

                    {employer.phoneNumber && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <PhoneCall className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium text-gray-900">
                            {employer.phoneNumber}
                        </p>
                      </div>
                    </div>
                    )}

                    {employer.email && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">
                            {employer.email}
                        </p>
                      </div>
                    </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Available Jobs Section */}
      <div className="main-layout relative z-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Available Jobs */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/30 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-pink-50/30 opacity-60"></div>
              <div className="relative z-10">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-[#1967d2]">
                    Available Jobs
                  </h2>
                </div>

                {isLoadingJobs ? (
                  <div className="py-12 flex items-center justify-center">
                    <Loading variant="spinner" size="lg" />
                  </div>
                ) : sortedJobs.length === 0 ? (
                  <div className="py-12 text-center text-gray-600">
                    Không có công việc nào
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {sortedJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="mt-6 pt-4 border-t">
                        <div className="text-sm text-gray-600 mb-4">
                          Showing {((currentPage - 1) * jobsPerPage) + 1}-
                          {Math.min(currentPage * jobsPerPage, totalJobs)}{" "}
                          of {totalJobs} jobs
                        </div>
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Empty space to maintain layout consistency */}
          <div className="lg:col-span-1"></div>
        </div>
      </div>
    </div>
  );
}
