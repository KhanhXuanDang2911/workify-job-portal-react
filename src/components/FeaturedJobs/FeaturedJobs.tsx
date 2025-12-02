"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import JobCard from "../JobCard";
import Loading from "../Loading";
import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/services/job.service";
import { routes } from "@/routes/routes.const";
import { useTranslation } from "@/hooks/useTranslation";
import { JobType, JobLevel } from "@/constants/job.constant";
import { formatSalaryCompact } from "@/utils/formatSalary";

export default function FeaturedJobs({
  overrideJobs,
}: {
  overrideJobs?: any[];
}) {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 4;

  // If overrideJobs provided, use them; otherwise fetch top attractive jobs
  const {
    data: apiResponse,
    isLoading,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: ["top-attractive-jobs", 8],
    queryFn: () => jobService.getTopAttractiveJobs(8),
    staleTime: 5 * 60 * 1000,
    enabled: !overrideJobs,
  });

  const itemsFromApi: any[] = overrideJobs
    ? overrideJobs
    : Array.isArray(apiResponse?.data)
      ? apiResponse.data
      : [];

  const formatSalary = (item: any) => {
    return formatSalaryCompact(item, t);
  };

  const mapTypeColor = (jobType?: string) => {
    if (!jobType) return "bg-gray-400";
    if (jobType.includes("FULL") || jobType.includes("TEMPORARY_FULL"))
      return "bg-green-500";
    if (jobType.includes("PART")) return "bg-orange-500";
    if (jobType.includes("FREELANCE") || jobType.includes("FREELANCER"))
      return "bg-teal-500";
    return "bg-purple-500";
  };

  const relativePosted = (createdAt?: string) => {
    if (!createdAt) return "";
    try {
      const created = new Date(createdAt);
      const diffMs = Date.now() - created.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return t("featuredJobs.today");
      if (diffDays === 1) return t("featuredJobs.dayAgo", { count: 1 });
      if (diffDays < 30) return t("featuredJobs.daysAgo", { count: diffDays });
      const diffMonths = Math.floor(diffDays / 30);
      if (diffMonths === 1) return t("featuredJobs.monthAgo", { count: 1 });
      return t("featuredJobs.monthsAgo", { count: diffMonths });
    } catch (e) {
      return "";
    }
  };

  const mapEnumToJobType = (enumValue: string): string => {
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

  const mapApiItemToCard = (item: any) => {
    const firstLocation =
      Array.isArray(item.jobLocations) && item.jobLocations.length > 0
        ? item.jobLocations[0]
        : null;
    const locationParts: string[] = [];
    if (firstLocation) {
      if (firstLocation.province?.name)
        locationParts.push(firstLocation.province.name);
      if (firstLocation.district?.name)
        locationParts.push(firstLocation.district.name);
      if (firstLocation.detailAddress)
        locationParts.push(firstLocation.detailAddress);
    }

    const jobType = item.jobType ? mapEnumToJobType(item.jobType) : "";

    return {
      id: item.id,
      title: item.jobTitle || item.title || "",
      company: item.companyName || item.author?.companyName || "",
      location: locationParts.join(", ") || "",
      salary: formatSalary(item),
      period: "", // Không cần period vì đã có trong salary
      type: jobType,
      typeColor: mapTypeColor(item.jobType ?? item.jobLevel),
      posted: relativePosted(item.createdAt),
      logo:
        item.author?.avatarUrl ||
        item.companyLogo ||
        "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg",
      companyWebsite: item.companyWebsite,
    };
  };

  const mappedJobs = itemsFromApi.map(mapApiItemToCard);
  const totalSlides = Math.max(1, Math.ceil(mappedJobs.length / itemsPerSlide));

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Reset slide to 0 when jobs change
  useEffect(() => {
    if (mappedJobs.length > 0) {
      setCurrentSlide(0);
    }
  }, [mappedJobs.length]);

  return (
    <section className="relative py-20 bg-gradient-to-b from-white via-blue-50/30 to-indigo-50/30 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-100/10 rounded-full blur-3xl"></div>
      </div>

      <div className="main-layout relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/50 rounded-full mb-4">
            <span className="w-2 h-2 bg-[#1967d2] rounded-full animate-pulse"></span>
            <p className="text-[#1967d2] font-semibold text-sm">
              {t("featuredJobs.badge")}
            </p>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t("featuredJobs.title")}{" "}
            <span className="bg-gradient-to-r from-[#1967d2] to-[#1557b8] bg-clip-text text-transparent">
              {t("featuredJobs.titleHighlight")}
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("featuredJobs.description")}
          </p>
        </div>

        <div className="relative">
          {isLoading ? (
            <div className="py-20 flex items-center justify-center">
              <Loading variant="spinner" size="lg" />
            </div>
          ) : isError ? (
            <div className="py-20 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-red-600 font-medium">
                {(queryError as any)?.message ||
                  t("featuredJobs.loadJobsError")}
              </p>
            </div>
          ) : mappedJobs.length === 0 ? (
            <div className="py-20 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <p className="text-gray-600 font-medium">
                {t("featuredJobs.noJobs")}
              </p>
            </div>
          ) : (
            <>
              {/* Navigation buttons */}
              {totalSlides > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-[#1967d2] transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                    disabled={currentSlide === 0}
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-[#1967d2] transition-colors" />
                  </button>

                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-[#1967d2] transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                    disabled={currentSlide === totalSlides - 1}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#1967d2] transition-colors" />
                  </button>
                </>
              )}

              <div className="overflow-x-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {mappedJobs
                          .slice(
                            slideIndex * itemsPerSlide,
                            slideIndex * itemsPerSlide + itemsPerSlide
                          )
                          .map((job) => (
                            <JobCard key={job.id} job={job} />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination dots */}
              {totalSlides > 1 && (
                <div className="flex justify-center items-center space-x-3 mt-10">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`transition-all duration-300 rounded-full ${
                        index === currentSlide
                          ? "w-8 h-2 bg-[#1967d2]"
                          : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          <div className="text-center mt-12">
            <Button
              asChild
              className="bg-gradient-to-r from-[#1967d2] to-[#1557b8] hover:from-[#1557b8] hover:to-[#1445a0] text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link to={`/${routes.JOB_SEARCH}`}>
                {t("featuredJobs.viewAllJobs")}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
