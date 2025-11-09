import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Code,
} from "lucide-react";
import CategoryCard from "../CategoryCard";
import Loading from "../Loading";
import { jobService } from "@/services";
import type { CategoryJobResponse } from "@/types";

export default function JobCategories() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 8;

  // Fetch categories from API
  const { data: categoriesResponse, isLoading } = useQuery({
    queryKey: ["categories-job-count"],
    queryFn: () => jobService.getCategoriesWithJobCount(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Transform API data to component format
  const categories = useMemo(() => {
    if (!categoriesResponse?.data) return [];

    return categoriesResponse.data.map((category: CategoryJobResponse) => {
      // Calculate total jobs by summing jobCount from all industries
      const totalJobs = category.industries.reduce(
        (sum, industry) => sum + (industry.jobCount || 0),
        0
      );

      // Format jobs count with comma separator
      const formattedJobs = totalJobs.toLocaleString("en-US");

      return {
        name: category.name,
        jobs: `${formattedJobs} Jobs`,
        icon: Code, // Hardcoded icon
        color: "text-[#1967d2]",
        bgColor: "bg-blue-50", // Hardcoded bgColor
      };
    });
  }, [categoriesResponse?.data]);

  const totalSlides = Math.ceil(categories.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Reset slide to 0 when categories change
  useEffect(() => {
    if (categories.length > 0) {
      setCurrentSlide(0);
    }
  }, [categories.length]);

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="main-layout">
          <div className="flex items-center justify-center py-20">
            <Loading variant="spinner" size="lg" />
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="main-layout">
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-600">No categories available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="main-layout">
        <div className="flex items-center justify-between mb-16">
          <div>
            <p className="text-[#1967d2] font-semibold mb-3 text-lg">
              Jobs by Categories
            </p>
            <h2 className="text-4xl font-bold text-gray-900">
              Choose Your Desire Category
            </h2>
          </div>
          <div className="hidden lg:block">
            <p className="text-gray-600 max-w-md leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry the standard dummy text ever since the when an printer
              took.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories
                      .slice(
                        slideIndex * itemsPerSlide,
                        slideIndex * itemsPerSlide + itemsPerSlide
                      )
                      .map((category, index) => (
                        <CategoryCard key={`${slideIndex}-${index}`} category={category} />
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

          {/* <div className="text-center mt-8">
            <Button className="bg-[#1967d2] hover:bg-[#1557b8] text-white px-8 py-3">
              All Categories
            </Button>
          </div> */}
        </div>
      </div>
    </section>
  );
}
