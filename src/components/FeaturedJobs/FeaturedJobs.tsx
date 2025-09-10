"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import JobCard from "../JobCard";

export default function FeaturedJobs() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 4;

  const jobs = [
    {
      id: 1,
      title: "Senior Web Designer, Developer",
      company: "COMPANY",
      location: "1563-1385 Sunset Blvd Los Angeles, CA 90026, USA",
      salary: "$2500",
      period: "Month",
      type: "New",
      typeColor: "bg-green-500",
      posted: "1 days ago",
      logo: "https://thewebmax.org/react/jobzilla/assets/images/jobs-company/pic1.jpg",
    },
    {
      id: 2,
      title: "Need Senior Rolling Stock Technician",
      company: "BUSINESS",
      location: "1563-1385 Sunset Blvd Los Angeles, CA 90026, USA",
      salary: "$2000",
      period: "Month",
      type: "Internship",
      typeColor: "bg-orange-500",
      posted: "15 days ago",
      logo: "https://thewebmax.org/react/jobzilla/assets/images/jobs-company/pic2.jpg",
    },
    {
      id: 3,
      title: "IT Department Manager & Blogger-Entrepreneur",
      company: "COMPANY NAME",
      location: "1563-1385 Sunset Blvd Los Angeles, CA 90026, USA",
      salary: "$1500",
      period: "Month",
      type: "Fulltime",
      typeColor: "bg-purple-500",
      posted: "6 Month ago",
      logo: "https://thewebmax.org/react/jobzilla/assets/images/jobs-company/pic3.jpg",
    },
    {
      id: 4,
      title: "Art Production Specialist",
      company: "ARROW",
      location: "1563-1385 Sunset Blvd Los Angeles, CA 90026, USA",
      salary: "$1200",
      period: "Month",
      type: "Freelancer",
      typeColor: "bg-teal-500",
      posted: "2 days ago",
      logo: "https://thewebmax.org/react/jobzilla/assets/images/jobs-company/pic4.jpg",
    },
    {
      id: 5,
      title: "Frontend React Developer",
      company: "TECH CORP",
      location: "1563-1385 Sunset Blvd Los Angeles, CA 90026, USA",
      salary: "$3000",
      period: "Month",
      type: "New",
      typeColor: "bg-green-500",
      posted: "3 days ago",
      logo: "https://thewebmax.org/react/jobzilla/assets/images/jobs-company/pic5.jpg",
    },
    {
      id: 6,
      title: "UX/UI Designer",
      company: "DESIGN STUDIO",
      location: "1563-1385 Sunset Blvd Los Angeles, CA 90026, USA",
      salary: "$2800",
      period: "Month",
      type: "Fulltime",
      typeColor: "bg-purple-500",
      posted: "1 week ago",
      logo: "https://thewebmax.org/react/jobzilla/assets/images/jobs-company/pic5.jpg",
    },
  ];

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
        <div className="absolute top-20 right-1/4 w-2 h-20 bg-gradient-to-b from-blue-200 to-transparent rotate-45"></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-16 bg-gradient-to-b from-purple-200 to-transparent -rotate-45"></div>
        <div className="absolute top-1/3 right-10 w-1 h-12 bg-gradient-to-b from-teal-200 to-transparent rotate-12"></div>
      </div>

      <div className="main-layout relative z-10">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-medium mb-2">All Jobs Post</p>
          <h2 className="text-3xl font-bold text-gray-900">
            Find Your Career You Deserve it
          </h2>
        </div>

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
                      .map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

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

          <div className="text-center mt-8">
            <Button className="bg-[#1967d2] hover:bg-[#1557b8] text-white px-8 py-3">
              View All Jobs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
