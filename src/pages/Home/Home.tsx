import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Briefcase, MapPin } from "lucide-react";
import FeaturedArticles from "@/components/FeaturedArticles";
import FeaturedJobs from "@/components/FeaturedJobs";
import JobCategories from "@/components/JobCategories";
import TopEmployers from "@/components/TopEmployers";
import { useTranslation } from "@/hooks/useTranslation";
import { industryService } from "@/services/industry.service";
import { provinceService } from "@/services/location.service";
import { jobService } from "@/services/job.service";
import { routes } from "@/routes/routes.const";
import { saveSearchHistory } from "@/utils/searchHistory";

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>("");
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");

  const popularSearches = [
    "Designer",
    "Web",
    "IOS",
    "Developer",
    "PHP",
    "Senior",
    "Engineer",
  ];

  // Query industries
  const { data: industriesResponse } = useQuery({
    queryKey: ["all-industries"],
    queryFn: () => industryService.getAllIndustries(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Query provinces
  const { data: provincesResponse } = useQuery({
    queryKey: ["all-provinces"],
    queryFn: () => provinceService.getProvinces(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const industries = industriesResponse?.data || [];
  const provinces = provincesResponse?.data || [];

  // Personalized jobs for the current user (server will fallback when not personalized)
  const { data: personalizedResponse } = useQuery({
    queryKey: ["personalized-jobs", 8],
    queryFn: () => jobService.getPersonalized(8),
    staleTime: 5 * 60 * 1000,
  });

  const personalizedJobs = Array.isArray(personalizedResponse?.data)
    ? personalizedResponse?.data
    : undefined;

  const handleSearch = () => {
    // Lưu vào search history
    if (keyword.trim() || selectedIndustryId || selectedProvinceId) {
      saveSearchHistory(
        keyword.trim(),
        selectedIndustryId || undefined,
        selectedProvinceId || undefined
      );
    }

    // Build search params
    const params = new URLSearchParams();
    if (keyword.trim()) {
      params.set("keyword", keyword.trim());
    }
    if (selectedIndustryId) {
      params.append("industryId", selectedIndustryId);
    }
    if (selectedProvinceId) {
      params.append("provinceId", selectedProvinceId);
    }

    // Navigate to job search
    const queryString = params.toString();
    navigate(`/${routes.JOB_SEARCH}${queryString ? `?${queryString}` : ""}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #e8f1fc 0%, #e8eef7 50%, #e0e7f1 100%)",
        }}
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large blur shape top right */}
          <div
            className="absolute -top-32 -right-32 w-[800px] h-[800px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(185, 212, 250, 0.4) 0%, transparent 70%)",
              animation: "float-slow 20s ease-in-out infinite",
            }}
          ></div>

          {/* Medium blur shape bottom left */}
          <div
            className="absolute -bottom-48 -left-48 w-[700px] h-[700px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(200, 220, 255, 0.3) 0%, transparent 70%)",
              animation: "float-slow 25s ease-in-out infinite 2s",
            }}
          ></div>

          {/* Decorative dots grid - top right area */}
          <div
            className="absolute top-[20%] right-[8%] w-32 h-32 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle, #5b8fd7 2px, transparent 2px)",
              backgroundSize: "16px 16px",
              animation: "float-slow 15s ease-in-out infinite",
            }}
          ></div>

          {/* Decorative dots grid - bottom left area */}
          <div
            className="absolute bottom-[25%] left-[5%] w-24 h-24 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle, #5b8fd7 2px, transparent 2px)",
              backgroundSize: "14px 14px",
              animation: "float-slow 18s ease-in-out infinite 3s",
            }}
          ></div>
        </div>

        <div className="main-layout relative z-10 pt-2 pb-16 lg:pt-4 lg:pb-20">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Hero Content */}
            <div className="space-y-7">
              <div
                className="space-y-5"
                style={{
                  animation: "fadeInUp 0.8s ease-out",
                }}
              >
                <h1 className="text-5xl lg:text-[64px] font-bold leading-[1.15]">
                  <span className="text-[#1e3a5f]">{t("home.hero.title")}</span>
                </h1>

                <p className="text-[17px] text-[#66789c] leading-relaxed max-w-[520px]">
                  {t("home.hero.subtitle")}
                </p>
              </div>

              {/* Search Form */}
              <div
                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-5"
                style={{
                  animation: "fadeInUp 0.8s ease-out 0.2s both",
                }}
              >
                <div className="flex flex-col md:flex-row gap-3 items-center overflow-hidden">
                  {/* Industry Select */}
                  <div className="relative w-full md:w-[150px] flex-shrink-0">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
                    <Select
                      value={selectedIndustryId}
                      onValueChange={setSelectedIndustryId}
                    >
                      <SelectTrigger className="min-h-12 h-12 w-full border border-gray-300 bg-white hover:border-gray-400 transition-colors rounded-lg pl-10 flex items-center">
                        <SelectValue
                          placeholder={t("home.hero.industryPlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem
                            key={industry.id}
                            value={industry.id.toString()}
                          >
                            {industry.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location Select */}
                  <div className="relative w-full md:w-[150px] flex-shrink-0">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
                    <Select
                      value={selectedProvinceId}
                      onValueChange={setSelectedProvinceId}
                    >
                      <SelectTrigger className="min-h-12 h-12 w-full border border-gray-300 bg-white hover:border-gray-400 transition-colors rounded-lg pl-10 flex items-center">
                        <SelectValue
                          placeholder={t("home.hero.locationPlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((province) => (
                          <SelectItem
                            key={province.id}
                            value={province.id.toString()}
                          >
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Keyword Input */}
                  <div className="relative flex-1 min-w-0 max-w-[400px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <Input
                      placeholder={t("home.hero.keywordPlaceholder")}
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="min-h-12 h-12 w-full border border-gray-300 bg-white pl-10 pr-4 py-3 hover:border-gray-400 transition-colors rounded-lg placeholder:text-gray-400"
                    />
                  </div>

                  {/* Search Button */}
                  <Button
                    onClick={handleSearch}
                    size="icon"
                    className="h-12 w-12 md:w-12 bg-[#4a6cf7] hover:bg-[#3d5ce6] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex-shrink-0"
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Popular Searches */}
              <div
                className="flex flex-wrap items-center gap-3"
                style={{
                  animation: "fadeInUp 0.8s ease-out 0.4s both",
                }}
              >
                <span className="text-sm text-gray-600 font-medium">
                  {t("home.hero.popularSearches")}
                </span>
                {popularSearches.map((search, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-sm text-gray-600 hover:text-[#4a6cf7] underline decoration-gray-300 hover:decoration-[#4a6cf7] transition-colors"
                  >
                    {search}
                    {index < popularSearches.length - 1 && ","}
                  </a>
                ))}
              </div>
            </div>

            {/* Hero Images */}
            <div
              className="relative hidden lg:block"
              style={{
                animation: "fadeInRight 1s ease-out 0.2s both",
              }}
            >
              <div className="relative">
                {/* Top Image */}
                <div
                  className="relative rounded-[32px] overflow-hidden shadow-xl border-4 border-[#4a6cf7] z-10"
                  style={{
                    animation: "float-simple 6s ease-in-out infinite",
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=90"
                    alt="Team collaboration"
                    className="w-full h-[280px] object-cover"
                  />
                </div>

                {/* Bottom Image - overlapping */}
                <div
                  className="absolute top-[220px] left-12 rounded-[32px] overflow-hidden shadow-xl border-4 border-[#4a6cf7]"
                  style={{
                    animation: "float-simple 6s ease-in-out infinite 0.5s",
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=90"
                    alt="Business meeting"
                    className="w-[420px] h-[280px] object-cover"
                  />
                </div>

                {/* Decorative dots grid - right side */}
                <div
                  className="absolute top-[40%] -right-8 w-28 h-28 opacity-50"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #5b8fd7 3px, transparent 3px)",
                    backgroundSize: "16px 16px",
                    animation: "float-slow 12s ease-in-out infinite",
                  }}
                ></div>

                {/* Decorative dots grid - bottom */}
                <div
                  className="absolute bottom-4 left-[45%] w-20 h-20 opacity-40"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #5b8fd7 2px, transparent 2px)",
                    backgroundSize: "14px 14px",
                    animation: "float-slow 10s ease-in-out infinite 1s",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <JobCategories />
      <FeaturedJobs overrideJobs={personalizedJobs} />
      <TopEmployers />
      <FeaturedArticles />
    </>
  );
}
