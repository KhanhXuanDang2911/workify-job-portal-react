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

export default function FeaturedJobs() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 4;

  // useQuery to fetch top attractive jobs with limit = 8
  const { data: apiResponse, isLoading, isError, error: queryError } = useQuery({
    queryKey: ["top-attractive-jobs", 8],
    queryFn: () => jobService.getTopAttractiveJobs(8),
    staleTime: 5 * 60 * 1000,
  });

  const itemsFromApi: any[] = Array.isArray(apiResponse?.data) ? apiResponse.data : [];

  const formatSalary = (item: any) => {
    try {
      if (item.salaryType === "RANGE") {
        const min = item.minSalary != null ? Number(item.minSalary).toLocaleString() : null;
        const max = item.maxSalary != null ? Number(item.maxSalary).toLocaleString() : null;
        return `${min ?? ""}${min && max ? " - " : ""}${max ?? ""} ${item.salaryUnit ?? ""}`.trim();
      }
      if (item.minSalary != null) return `${Number(item.minSalary).toLocaleString()} ${item.salaryUnit ?? ""}`;
      return "Negotiable";
    } catch (e) {
      return "Negotiable";
    }
  };

  const mapTypeColor = (jobType?: string) => {
    if (!jobType) return "bg-gray-400";
    if (jobType.includes("FULL") || jobType.includes("TEMPORARY_FULL")) return "bg-green-500";
    if (jobType.includes("PART")) return "bg-orange-500";
    if (jobType.includes("FREELANCE") || jobType.includes("FREELANCER")) return "bg-teal-500";
    return "bg-purple-500";
  };

  const relativePosted = (createdAt?: string) => {
    if (!createdAt) return "";
    try {
      const created = new Date(createdAt);
      const diffMs = Date.now() - created.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "1 day ago";
      if (diffDays < 30) return `${diffDays} days ago`;
      const diffMonths = Math.floor(diffDays / 30);
      if (diffMonths === 1) return "1 month ago";
      return `${diffMonths} months ago`;
    } catch (e) {
      return "";
    }
  };

  const mapApiItemToCard = (item: any) => {
    const firstLocation = Array.isArray(item.jobLocations) && item.jobLocations.length > 0 ? item.jobLocations[0] : null;
    const locationParts: string[] = [];
    if (firstLocation) {
      if (firstLocation.province?.name) locationParts.push(firstLocation.province.name);
      if (firstLocation.district?.name) locationParts.push(firstLocation.district.name);
      if (firstLocation.detailAddress) locationParts.push(firstLocation.detailAddress);
    }

    return {
      id: item.id,
      title: item.jobTitle || item.title || "",
      company: item.companyName || item.author?.companyName || "",
      location: locationParts.join(", ") || "",
      salary: formatSalary(item),
      period: item.salaryUnit ?? "",
      type: item.jobType ?? item.jobLevel ?? "",
      typeColor: mapTypeColor(item.jobType ?? item.jobLevel),
      posted: relativePosted(item.createdAt),
      logo: item.author?.avatarUrl || item.companyLogo || "https://www.vj-tech.jp/_nuxt/img/logo-vj.c7683b6.png",
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
    <section className="py-16 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 relative overflow-x-hidden">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-teal-300 rounded-full blur-2xl"></div>
        <div className="absolute top-20 right-1/4 w-2 h-20 bg-gradient-to-b from-blue-200 to-transparent rotate-45"></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-16 bg-gradient-to-b from-purple-200 to-transparent -rotate-45"></div>
        <div className="absolute top-1/3 right-10 w-1 h-12 bg-gradient-to-b from-teal-200 to-transparent rotate-12"></div>
      </div>

      <div className="main-layout relative z-10">
        <div className="text-center mb-12">
          <p className="text-[#1967d2] font-semibold mb-3 text-lg">All Jobs Post</p>
          <h2 className="text-3xl font-bold text-gray-900">
            Find Your Career You Deserve it
          </h2>
        </div>

        <div className="relative">
          {isLoading ? (
            <div className="py-12 flex items-center justify-center">
              <Loading variant="spinner" size="lg" />
            </div>
          ) : isError ? (
            <div className="py-12 text-center text-red-600">
              {(queryError as any)?.message || "Không thể tải danh sách công việc"}
            </div>
          ) : mappedJobs.length === 0 ? (
            <div className="py-12 text-center text-gray-600">
              Không có công việc nào
            </div>
          ) : (
            <>
              <div className="overflow-x-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-2">
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

              {totalSlides > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevSlide}
                    className="border-[#1967d2] text-[#1967d2] hover:bg-[#1967d2] hover:text-white bg-transparent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex space-x-2">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentSlide ? "bg-[#1967d2]" : "bg-gray-300"
                        }`}
                        onClick={() => setCurrentSlide(index)}
                      />
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextSlide}
                    className="border-[#1967d2] text-[#1967d2] hover:bg-[#1967d2] hover:text-white bg-transparent"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}

          <div className="text-center mt-8">
            <Link to={`/${routes.JOB_SEARCH}`}>
              <Button className="bg-[#1967d2] hover:bg-[#1557b8] text-white px-8 py-3">
                View All Jobs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
