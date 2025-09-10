import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Search, BarChart3, Globe } from "lucide-react";
import FeaturedArticles from "@/components/FeaturedArticles";
import FeaturedJobs from "@/components/FeaturedJobs";
import JobCategories from "@/components/JobCategories";
import TopEmployers from "@/components/TopEmployers";

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = ["/hero2.png", "/hero1.png"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      title: "Register Your Account",
      description:
        "Create your profile and showcase your skills to potential employers worldwide.",
      icon: "https://thewebmax.org/react/jobzilla/assets/images/work-process/icon1.png",
      color: "from-[#1967d2] to-[#1557b8]",
      bgColor: "from-blue-50 to-blue-100",
    },
    {
      title: "Apply For Dream Job",
      description:
        "Browse thousands of opportunities and apply to positions that match your career goals.",
      icon: "https://thewebmax.org/react/jobzilla/assets/images/work-process/icon2.png",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
    },
    {
      title: "Upload Your Resume",
      description:
        "Share your experience and let employers discover your unique talents and expertise.",
      icon: "https://thewebmax.org/react/jobzilla/assets/images/work-process/icon3.png",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
    },
  ];

  return (
    <>
      {/* Enhanced Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 relative overflow-hidden">
        {/* Enhanced Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated gradient orbs */}
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-indigo-300/20 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-purple-200/15 to-pink-300/15 rounded-full blur-3xl animate-float-slow-delayed"></div>
          <div className="absolute top-1/2 left-10 w-60 h-60 bg-gradient-to-br from-green-200/10 to-teal-300/10 rounded-full blur-2xl animate-float-slow-delayed-2"></div>

          {/* Floating particles with enhanced colors */}
          <div
            className="absolute top-[20%] right-[45%] w-4 h-4 bg-gradient-to-br from-blue-400/30 to-blue-600/30 rounded-full animate-particle-float"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="absolute top-[60%] right-[35%] w-6 h-6 bg-gradient-to-br from-purple-400/30 to-purple-600/30 rounded-full animate-particle-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-[30%] right-[25%] w-8 h-8 bg-gradient-to-br from-green-400/30 to-green-600/30 rounded-full animate-particle-float"
            style={{ animationDelay: "4s" }}
          ></div>
          <div
            className="absolute top-[70%] right-[15%] w-3 h-3 bg-gradient-to-br from-yellow-400/30 to-yellow-600/30 rounded-full animate-particle-float"
            style={{ animationDelay: "6s" }}
          ></div>
          <div
            className="absolute top-[15%] right-[5%] w-5 h-5 bg-gradient-to-br from-pink-400/30 to-pink-600/30 rounded-full animate-particle-float"
            style={{ animationDelay: "8s" }}
          ></div>
        </div>

        <div className="main-layout relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-4">
                <p className="text-[#1967d2] font-medium animate-fade-in-up delay-300 bg-gradient-to-r from-[#1967d2] to-[#1557b8] bg-clip-text text-transparent">
                  We Have 208,000+ Live Jobs
                </p>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight animate-fade-in-up delay-500">
                  Find the{" "}
                  <span className="bg-gradient-to-r from-[#1967d2] via-[#1557b8] to-[#1445a0] bg-clip-text text-transparent animate-gradient-shift">
                    job
                  </span>{" "}
                  that fits your life
                </h1>
                <p className="text-gray-600 text-lg animate-fade-in-up delay-700">
                  Type your keyword, then click search to find your perfect job.
                </p>
              </div>

              <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/30 animate-fade-in-up delay-1000 hover:shadow-3xl transition-all duration-500">
                {/* First row - Keywords */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    KEYWORDS
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Enter keywords (e.g. Developer, Designer, Manager...)"
                      className="pl-10 h-12 border-gray-200 focus:border-[#1967d2] focus:ring-[#1967d2]/20 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Second row - Job details */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      WHAT
                    </label>
                    <Select>
                      <SelectTrigger className="h-12 border-gray-200 focus:border-[#1967d2] focus:ring-[#1967d2]/20 transition-all duration-300">
                        <SelectValue placeholder="Job Title" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="designer">Designer</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      TYPE
                    </label>
                    <Select>
                      <SelectTrigger className="h-12 border-gray-200 focus:border-[#1967d2] focus:ring-[#1967d2]/20 transition-all duration-300">
                        <SelectValue placeholder="All Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fulltime">Full Time</SelectItem>
                        <SelectItem value="parttime">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      LOCATION
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search location..."
                        className="pl-10 h-12 border-gray-200 focus:border-[#1967d2] focus:ring-[#1967d2]/20 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-[#1967d2] via-[#1557b8] to-[#1445a0] hover:from-[#1557b8] hover:via-[#1445a0] hover:to-[#1334a0] text-white h-12 font-semibold shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] animate-gradient-shift"
                  size="lg"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Find Job
                </Button>

                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Popular Searches:{" "}
                    <span className="text-[#1967d2] font-medium">
                      Developer, Designer, Architect, Engineer ...
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center animate-fade-in-up delay-1000">
              {/* Enhanced background effects */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[500px] h-[500px] bg-gradient-to-br from-blue-200/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse-gentle"></div>
                <div
                  className="absolute w-[300px] h-[300px] bg-gradient-to-br from-purple-200/15 to-pink-300/15 rounded-full blur-2xl animate-pulse-gentle"
                  style={{ animationDelay: "-1s" }}
                ></div>
                <div
                  className="absolute w-[200px] h-[200px] bg-gradient-to-br from-green-200/15 to-teal-300/15 rounded-full blur-xl animate-pulse-gentle"
                  style={{ animationDelay: "-2s" }}
                ></div>
              </div>

              <div className="relative w-full max-w-md z-10">
                {heroImages.map((image, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-[4000ms] ease-in-out ${
                      index === currentImageIndex
                        ? "opacity-100 transform translate-x-0 scale-100"
                        : "opacity-0 absolute top-0 left-0 transform translate-x-2 scale-98"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Job Search Hero ${index + 1}`}
                      className="w-full h-auto object-contain rounded-lg"
                    />
                  </div>
                ))}
              </div>

              {/* Enhanced floating cards with better animations */}
              <div className="absolute top-8 right-0 bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-white/40 z-50 animate-float-gentle hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center shadow-lg">
                    <Globe className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                      98+
                    </p>
                    <p className="text-xs text-gray-600 font-medium">
                      Job For Countries
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-white/40 z-50 animate-float-gentle-delayed hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-6 h-6 text-[#1967d2]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-[#1967d2] to-[#1557b8] bg-clip-text text-transparent">
                      12K+
                    </p>
                    <p className="text-xs text-gray-600 font-medium">
                      Companies Jobs
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 right-0 bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-white/40 z-50 animate-float-gentle-delayed-2 hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-1">
                    <div className="w-7 h-7 bg-gradient-to-br from-red-400 to-red-500 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="w-7 h-7 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="w-7 h-7 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="w-7 h-7 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full border-2 border-white shadow-lg"></div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                      3K+
                    </p>
                    <p className="text-xs text-gray-600 font-medium">
                      Jobs Done
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-100/40 to-blue-200/40 rounded-full blur-2xl animate-float-slow"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-purple-100/40 to-purple-200/40 rounded-full blur-2xl animate-float-slow-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-green-100/30 to-green-200/30 rounded-full blur-3xl animate-float-slow-delayed-2"></div>
        </div>

        <div className="main-layout relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="text-[#1967d2] font-semibold mb-3 text-lg bg-gradient-to-r from-[#1967d2] to-[#1557b8] bg-clip-text text-transparent">
              Working Process
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Follow these simple steps to find your dream job and start your
              career journey with us
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl mb-6 group-hover:shadow-2xl transition-all duration-700 transform group-hover:-translate-y-4 shadow-lg border border-gray-100/50 category-hover relative overflow-hidden">
                  {/* Background gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${step.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}
                  ></div>

                  <div className="relative z-10">
                    {/* Step number indicator */}
                    <div
                      className={`absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-br ${step.color} text-white rounded-full flex items-center justify-center text-sm font-bold shadow-xl group-hover:scale-110 transition-transform duration-300`}
                    >
                      {index + 1}
                    </div>

                    <div className="w-24 h-24 bg-gradient-to-br from-white to-gray-50 rounded-3xl mx-auto flex items-center justify-center shadow-xl border border-gray-100 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <img
                        src={step.icon || "/placeholder.svg"}
                        alt={step.title}
                        className="w-14 h-14 object-contain"
                      />
                    </div>
                    <div
                      className={`inline-block px-8 py-4 bg-gradient-to-r ${step.color} text-white rounded-2xl font-semibold text-base shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105`}
                    >
                      {step.title}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed text-base group-hover:text-gray-700 transition-colors duration-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Call to action */}
          <div className="text-center mt-16 animate-fade-in-up delay-1000">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#1967d2] via-[#1557b8] to-[#1445a0] hover:from-[#1557b8] hover:via-[#1445a0] hover:to-[#1334a0] text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-gradient-shift"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      <JobCategories />
      <FeaturedJobs />
      <TopEmployers />
      <FeaturedArticles />
    </>
  );
}
