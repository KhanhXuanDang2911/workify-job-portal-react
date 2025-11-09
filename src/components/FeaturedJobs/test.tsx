"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import JobCard from "../JobCard";
import http from "@/lib/http"; // ✅ import axios instance có sẵn

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 4;

  // ✅ Gọi API /workify/api/v1/jobs/advanced qua axios instance
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await http.get("/jobs/advanced");
        const jobList = res?.data?.data?.items || [];

        setJobs(jobList);
      } catch (error) {
        console.error("❌ Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const totalSlides = Math.ceil(jobs.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 relative overflow-x-hidden">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-teal-300 rounded-full blur-2xl"></div>
      </div>

      <div className="main-layout relative z-10">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-medium mb-2">All Jobs Post</p>
          <h2 className="text-3xl font-bold text-gray-900">
            Find Your Career You Deserve it
          </h2>
        </div>

        {/* ✅ Loading / Empty states */}
        {loading ? (
          <p className="text-center text-gray-500">Đang tải công việc...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-gray-500">Không có công việc nào.</p>
        ) : (
          <div className="relative">
            <div className="overflow-x-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-2">
                      {jobs
                        .slice(
                          slideIndex * itemsPerSlide,
                          slideIndex * itemsPerSlide + itemsPerSlide
                        )
                        .map((job: any) => (
                          <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nút chuyển slide */}
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
                      index === currentSlide
                        ? "bg-[#1967d2]"
                        : "bg-gray-300"
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

            <div className="text-center mt-8">
              <Button className="bg-[#1967d2] hover:bg-[#1557b8] text-white px-8 py-3">
                View All Jobs
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
