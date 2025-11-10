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
      numberOfHiringJobs: item.numberOfHiringJobs ?? item.openJobs ?? 0,
      location: location,
      description: item.aboutCompany || item.companyName,
      featured: item.status === "ACTIVE",
      companySize: item.companySize || null,
      createdAt: item.createdAt || null,
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
    <section className="relative py-20 bg-gradient-to-b from-white via-indigo-50/30 to-purple-50/30 overflow-x-hidden overflow-y-visible">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-100/10 rounded-full blur-3xl"></div>
      </div>

      <div className="main-layout relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/50 rounded-full mb-4">
            <Award className="w-4 h-4 text-[#1967d2]" />
            <p className="text-[#1967d2] font-semibold text-sm">
              Top Hiring Employers
            </p>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Featured{" "}
            <span className="text-[#1967d2]">
              Employers
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with leading companies actively hiring. Explore opportunities with top employers.
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
                {(queryError as any)?.message || "Không thể tải danh sách nhà tuyển dụng"}
              </p>
            </div>
          ) : mappedEmployers.length === 0 ? (
            <div className="py-20 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <p className="text-gray-600 font-medium">Không có nhà tuyển dụng nào</p>
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

              <div className="overflow-x-hidden overflow-y-visible">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-4">
                        {mappedEmployers
                          .slice(
                            slideIndex * itemsPerSlide,
                            (slideIndex + 1) * itemsPerSlide
                          )
                          .map((employer: any) => (
                            <div key={employer.id} className="pb-2">
                              <EmployerCard employer={employer} />
                            </div>
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
              variant="outline"
              className="border-[#1967d2] text-[#1967d2] hover:bg-[#1967d2] hover:text-white bg-transparent px-8 py-3 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Link to={`/${routes.EMPLOYER_SEARCH}`}>
                View All Employers
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
