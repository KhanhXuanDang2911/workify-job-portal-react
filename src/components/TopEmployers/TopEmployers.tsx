"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Award } from "lucide-react";
import EmployerCard from "../EmployerCard";
import Loading from "../Loading";
import { useQuery } from "@tanstack/react-query";
import { employerService } from "@/services";
import { routes } from "@/routes/routes.const";

export default function TopEmployers() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 4;
  
  // Fetch top hiring employers with limit = 8
  const { data: apiResponse, isLoading, isError, error: queryError } = useQuery({
    queryKey: ["top-hiring-employers", 8],
    queryFn: () => employerService.getTopHiringEmployers(8),
    staleTime: 5 * 60 * 1000,
    // staleTime: 0,
  });

  const itemsFromApi: any[] = Array.isArray(apiResponse?.data) ? apiResponse.data : [];

  const mapApiToCard = (item: any) => {
    const provinceName = item.province?.name || "";
    const districtName = item.district?.name || "";
    const location = [provinceName, districtName].filter(Boolean).join(", ");
    return {
      id: item.id,
      name: item.companyName || item.email || "",
      logo: item.avatarUrl || "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg",
      coverImage: item.backgroundUrl || "https://marketplace.canva.com/EAGZ0XPzFoE/1/0/1600w/canva-blue-and-white-line-modern-corporate-business-banner-Cvux46kBPZ8.jpg",
      openJobs: item.openJobs ?? 0,
      location: location,
      description: item.aboutCompany || item.companyName,
      featured: item.status === "ACTIVE",
    };
  };

  const mappedEmployers = itemsFromApi.map(mapApiToCard);
  const totalSlides = Math.max(1, Math.ceil(mappedEmployers.length / itemsPerSlide));

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Reset slide to 0 when employers change
  useEffect(() => {
    if (mappedEmployers.length > 0) {
      setCurrentSlide(0);
    }
  }, [mappedEmployers.length]);

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-x-hidden">
      {/* Background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-100/40 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-100/40 rounded-full blur-2xl animate-float-gentle"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-100/40 rounded-full blur-xl animate-float-gentle-delayed"></div>
        <div className="absolute top-20 right-1/4 w-28 h-28 bg-yellow-100/30 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-pink-100/30 rounded-full blur-2xl animate-float-gentle"></div>
      </div>

      <div className="main-layout relative z-10">
        <div className="flex justify-between items-center mb-12">
          <div>
            <p className="text-[#1967d2] font-semibold text-lg mb-2 flex items-center">
              <Award className="w-5 h-5 mr-2 font-semibold" />
              Top Hiring Employers
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Featured Employers
            </h2>
          </div>
          <Link to={`/${routes.EMPLOYER_SEARCH}`}>
            <Button
              variant="outline"
              className="text-[#1967d2] border-[#1967d2] hover:bg-[#1967d2] hover:text-white bg-transparent transition-all duration-300 hover:shadow-lg"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="relative">
          {/* Navigation buttons - only show if there are employers and more than 1 slide */}
          {mappedEmployers.length > 0 && totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentSlide === totalSlides - 1}
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </>
          )}

          {/* Carousel container */}
          <div className="overflow-x-hidden">
            {isLoading ? (
              <div className="py-12 flex items-center justify-center">
                <Loading variant="spinner" size="lg" />
              </div>
            ) : isError ? (
              <div className="py-12 text-center text-red-600">
                {(queryError as any)?.message || "Không thể tải danh sách nhà tuyển dụng"}
              </div>
            ) : mappedEmployers.length === 0 ? (
              <div className="py-12 text-center text-gray-600">
                Không có nhà tuyển dụng nào
              </div>
            ) : (
              <>
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-2">
                        {mappedEmployers
                          .slice(
                            slideIndex * itemsPerSlide,
                            (slideIndex + 1) * itemsPerSlide
                          )
                          .map((employer: any) => (
                            <EmployerCard key={employer.id} employer={employer} />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination dots - only show if more than 1 slide */}
                {totalSlides > 1 && (
                  <div className="flex justify-center mt-8 space-x-2">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide
                            ? "bg-[#1967d2] scale-125"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
