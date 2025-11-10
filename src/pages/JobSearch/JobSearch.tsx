import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Search, ChevronDown, LayoutGrid, List } from "lucide-react";
import JobCard from "@/components/JobCard";
import Pagination from "@/components/Pagination";
import SuggestedJobs from "@/components/SuggestedJob";
import { Badge } from "@/components/ui/badge";
import { jobService } from "@/services/job.service";
import { industryService } from "@/services/industry.service";
import { provinceService } from "@/services/location.service";
import type { JobResponse } from "@/types/job.type";
import {
  JobLevel,
  JobLevelLabelVN,
  JobType,
  JobTypeLabelVN,
  ExperienceLevel,
  ExperienceLevelLabelVN,
  EducationLevel,
  EducationLevelLabelVN,
} from "@/constants/job.constant";
import Loading from "@/components/Loading";

// ===================== MAPPING FUNCTIONS =====================

// Map display labels to enum values
const mapLevelToEnum = (label: string): string => {
  const mapping: Record<string, string> = {
    "Thực tập": JobLevel.INTERN,
    "Mới ra trường/Junior": JobLevel.ENTRY_LEVEL,
    "Nhân viên": JobLevel.STAFF,
    "Kỹ sư": JobLevel.ENGINEER,
    "Giám sát": JobLevel.SUPERVISOR,
    "Quản lý": JobLevel.MANAGER,
    "Giám đốc": JobLevel.DIRECTOR,
    "Quản lý cấp cao": JobLevel.SENIOR_MANAGER,
    "Lãnh đạo cấp cao": JobLevel.EXECUTIVE,
  };
  return mapping[label] || label;
};

const mapExperienceToEnum = (label: string): string => {
  const mapping: Record<string, string> = {
    "Dưới 1 năm": ExperienceLevel.LESS_THAN_ONE_YEAR,
    "1–2 năm": ExperienceLevel.ONE_TO_TWO_YEARS,
    "2–5 năm": ExperienceLevel.TWO_TO_FIVE_YEARS,
    "5–10 năm": ExperienceLevel.FIVE_TO_TEN_YEARS,
    "Trên 10 năm": ExperienceLevel.MORE_THAN_TEN_YEARS,
  };
  return mapping[label] || label;
};

const mapEducationToEnum = (label: string): string => {
  const mapping: Record<string, string> = {
    THPT: EducationLevel.HIGH_SCHOOL,
    "Cao đẳng": EducationLevel.COLLEGE,
    "Đại học": EducationLevel.UNIVERSITY,
    "Sau đại học": EducationLevel.POSTGRADUATE,
    "Thạc sĩ": EducationLevel.MASTER,
    "Tiến sĩ": EducationLevel.DOCTORATE,
    Khác: EducationLevel.OTHER,
  };
  return mapping[label] || label;
};

const mapJobTypeToEnum = (label: string): string => {
  const mapping: Record<string, string> = {
    "Toàn thời gian": JobType.FULL_TIME,
    "Toàn thời gian thời vụ": JobType.TEMPORARY_FULL_TIME,
    "Bán thời gian": JobType.PART_TIME,
    "Bán thời gian thời vụ": JobType.TEMPORARY_PART_TIME,
    "Hợp đồng": JobType.CONTRACT,
    Khác: JobType.OTHER,
  };
  return mapping[label] || label;
};

const mapDatePostedToDays = (label: string): number | undefined => {
  const mapping: Record<string, number> = {
    "Hôm nay": 1,
    "3 ngày qua": 3,
    "Tuần qua": 7,
    "2 tuần qua": 14,
    "Tháng qua": 30,
  };
  return mapping[label];
};

// Format salary from JobResponse
const formatSalary = (job: JobResponse): string => {
  try {
    if (job.salaryType === "RANGE") {
      const min =
        job.minSalary != null ? Number(job.minSalary).toLocaleString() : null;
      const max =
        job.maxSalary != null ? Number(job.maxSalary).toLocaleString() : null;
      return `${min ?? ""}${min && max ? " - " : ""}${max ?? ""} ${
        job.salaryUnit ?? ""
      }`.trim();
    }
    if (job.salaryType === "GREATER_THAN" && job.minSalary != null) {
      return `${Number(job.minSalary).toLocaleString()} ${
        job.salaryUnit ?? ""
      }`;
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
  if (jobType.includes("FULL") || jobType.includes("TEMPORARY_FULL"))
    return "bg-green-500";
  if (jobType.includes("PART")) return "bg-orange-500";
  if (jobType.includes("CONTRACT")) return "bg-purple-500";
  return "bg-blue-500";
};

// Format relative time
const relativePosted = (createdAt?: string): string => {
  if (!createdAt) return "";
  try {
    const created = new Date(createdAt);
    const diffMs = Date.now() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "1 ngày trước";
    if (diffDays < 30) return `${diffDays} ngày trước`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return "1 tháng trước";
    return `${diffMonths} tháng trước`;
  } catch (e) {
    return "";
  }
};

// Transform JobResponse to JobCard format
const mapJobToCard = (job: JobResponse) => {
  const firstLocation =
    Array.isArray(job.jobLocations) && job.jobLocations.length > 0
      ? job.jobLocations[0]
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

  return {
    id: job.id,
    title: job.jobTitle || "",
    company: job.companyName || job.author?.companyName || "",
    location: locationParts.join(", ") || "",
    salary: formatSalary(job),
    period: job.salaryUnit ?? "",
    type:
      JobTypeLabelVN[job.jobType as keyof typeof JobTypeLabelVN] || job.jobType,
    typeColor: mapTypeColor(job.jobType),
    posted: relativePosted(job.createdAt),
    logo:
      job.author?.avatarUrl ||
      "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg",
    companyWebsite: job.companyWebsite,
  };
};

// ===================== MULTI-SELECT COMPONENT =====================

interface MultiSelectOption {
  id: string;
  name: string;
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  placeholder?: string;
}

const MultiSelectDropdown = ({
  options,
  selectedIds,
  onToggle,
  placeholder = "Chọn...",
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOptions = options.filter((opt) => selectedIds.includes(opt.id));

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm border border-gray-200 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex flex-wrap gap-1 flex-1 min-h-[24px]">
          {selectedOptions.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            selectedOptions.map((opt) => (
              <Badge
                key={opt.id}
                variant="secondary"
                className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
              >
                {opt.name}
              </Badge>
            ))
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-60 overflow-y-auto">
          <div className="p-1">
            {options.map((option) => {
              const isSelected = selectedIds.includes(option.id);
              return (
                <div
                  key={option.id}
                  onClick={() => onToggle(option.id)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-sm cursor-pointer hover:bg-gray-100 ${
                    isSelected ? "bg-blue-50" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ===================== COMPONENT =====================

interface JobSearchFilters {
  industry: string[]; // Industry IDs
  level: string[]; // Display labels
  experience: string[]; // Display labels
  salaryMin: number; // >= 0
  salaryMax: number; // >= 0
  salaryUnit: "VND" | "USD"; // Salary unit
  education: string[]; // Display labels
  jobType: string[]; // Display labels
  datePosted: string[]; // Display labels
  provinceId: string[]; // Province IDs
}

const JobSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read from URL params on mount
  const keywordFromUrl = searchParams.get("keyword") || "";
  const provinceIdFromUrl = searchParams.get("provinceId") || "";
  const industryIdFromUrl = searchParams.get("industryId") || "";
  const sortFromUrl = searchParams.get("sort") || "createdAt";
  const sortOrderFromUrl =
    (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
  const pageFromUrl = searchParams.get("page");

  // Applied filters (from URL - used for API calls)
  const [appliedKeyword, setAppliedKeyword] = useState(keywordFromUrl);
  const [appliedFilters, setAppliedFilters] = useState<JobSearchFilters>({
    industry: industryIdFromUrl ? [industryIdFromUrl] : [],
    level: [],
    experience: [],
    salaryMin: 0,
    salaryMax: 0,
    salaryUnit: "VND",
    education: [],
    jobType: [],
    datePosted: [],
    provinceId: provinceIdFromUrl ? [provinceIdFromUrl] : [],
  });
  const [sort, setSort] = useState<
    "createdAt" | "updatedAt" | "expirationDate"
  >(
    (sortFromUrl === "updatedAt" || sortFromUrl === "expirationDate"
      ? sortFromUrl
      : "createdAt") as "createdAt" | "updatedAt" | "expirationDate"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(sortOrderFromUrl);
  const [currentPage, setCurrentPage] = useState(
    pageFromUrl ? Number(pageFromUrl) : 1
  );

  // Temp filters (before applying - used in UI)
  const [tempKeyword, setTempKeyword] = useState<string>(keywordFromUrl);
  const [tempFilters, setTempFilters] = useState<JobSearchFilters>({
    industry: industryIdFromUrl ? [industryIdFromUrl] : [],
    level: [],
    experience: [],
    salaryMin: 0,
    salaryMax: 0,
    salaryUnit: "VND",
    education: [],
    jobType: [],
    datePosted: [],
    provinceId: provinceIdFromUrl ? [provinceIdFromUrl] : [],
  });

  const pageSize = 10; // Fixed page size

  // Update URL params when applied filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (appliedKeyword) {
      params.set("keyword", appliedKeyword);
    }

    if (appliedFilters.provinceId.length > 0) {
      appliedFilters.provinceId.forEach((id) => {
        params.append("provinceId", id);
      });
    }

    if (appliedFilters.industry.length > 0) {
      appliedFilters.industry.forEach((id) => {
        params.append("industryId", id);
      });
    }

    if (sort !== "createdAt") {
      params.set("sort", sort);
    }

    if (sortOrder !== "desc") {
      params.set("sortOrder", sortOrder);
    }

    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }

    setSearchParams(params, { replace: true });
  }, [
    appliedKeyword,
    appliedFilters,
    sort,
    sortOrder,
    currentPage,
    setSearchParams,
  ]);

  // Read from URL params when URL changes (only on mount or external navigation)
  useEffect(() => {
    const keywordParam = searchParams.get("keyword") || "";
    const provinceIdParams = searchParams.getAll("provinceId");
    const industryIdParams = searchParams.getAll("industryId");
    const sortParam = searchParams.get("sort") || "createdAt";
    const sortOrderParam =
      (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
    const pageParam = searchParams.get("page");
    const pageFromUrl = pageParam ? Number(pageParam) : 1;

    setAppliedKeyword(keywordParam);
    setSort(
      (sortParam === "updatedAt" || sortParam === "expirationDate"
        ? sortParam
        : "createdAt") as "createdAt" | "updatedAt" | "expirationDate"
    );
    setSortOrder(sortOrderParam);

    // Only update currentPage if it's different from URL to avoid loop
    if (pageFromUrl !== currentPage) {
      setCurrentPage(pageFromUrl);
    }

    // Update temp values
    setTempKeyword(keywordParam);
    setTempFilters((prev) => ({
      ...prev,
      provinceId: provinceIdParams,
      industry: industryIdParams,
    }));
    setAppliedFilters((prev) => ({
      ...prev,
      provinceId: provinceIdParams,
      industry: industryIdParams,
    }));
  }, [searchParams]); // Remove currentPage from dependency to avoid loop

  // Reset to page 1 when applied filters change (but not when reading from URL)
  const prevFiltersRef = useRef({
    appliedKeyword,
    appliedFilters,
    sort,
    sortOrder,
  });
  useEffect(() => {
    const filtersChanged =
      prevFiltersRef.current.appliedKeyword !== appliedKeyword ||
      JSON.stringify(prevFiltersRef.current.appliedFilters.provinceId) !==
        JSON.stringify(appliedFilters.provinceId) ||
      JSON.stringify(prevFiltersRef.current.appliedFilters.industry) !==
        JSON.stringify(appliedFilters.industry) ||
      prevFiltersRef.current.sort !== sort ||
      prevFiltersRef.current.sortOrder !== sortOrder;

    if (filtersChanged) {
      setCurrentPage(1);
      prevFiltersRef.current = {
        appliedKeyword,
        appliedFilters,
        sort,
        sortOrder,
      };
    }
  }, [appliedKeyword, appliedFilters, sort, sortOrder]);

  // Load industries and provinces
  const { data: industriesResponse } = useQuery({
    queryKey: ["industries"],
    queryFn: () => industryService.getAllIndustries(),
    staleTime: 30 * 60 * 1000,
  });

  const industries = industriesResponse?.data || [];

  const { data: provincesResponse } = useQuery({
    queryKey: ["provinces"],
    queryFn: () => provinceService.getProvinces(),
    staleTime: 30 * 60 * 1000,
  });

  const provinces = provincesResponse?.data || [];

  // Build API params from applied filters
  const apiParams = useMemo(() => {
    const params: any = {
      pageNumber: currentPage,
      pageSize: pageSize,
    };

    if (appliedKeyword) {
      params.keyword = appliedKeyword;
    }

    if (appliedFilters.provinceId.length > 0) {
      params.provinceIds = appliedFilters.provinceId.map((id) => parseInt(id));
    }

    if (appliedFilters.industry.length > 0) {
      params.industryIds = appliedFilters.industry.map((id) => parseInt(id));
    }

    if (appliedFilters.level.length > 0) {
      params.jobLevels = appliedFilters.level.map(mapLevelToEnum);
    }

    if (appliedFilters.experience.length > 0) {
      params.experienceLevels =
        appliedFilters.experience.map(mapExperienceToEnum);
    }

    if (appliedFilters.education.length > 0) {
      params.educationLevels = appliedFilters.education.map(mapEducationToEnum);
    }

    if (appliedFilters.jobType.length > 0) {
      params.jobTypes = appliedFilters.jobType.map(mapJobTypeToEnum);
    }

    if (appliedFilters.datePosted.length > 0) {
      // Use the minimum days (most recent)
      const days = appliedFilters.datePosted
        .map(mapDatePostedToDays)
        .filter((d): d is number => d !== undefined);
      if (days.length > 0) {
        params.postedWithinDays = Math.min(...days);
      }
    }

    // Apply salary filter if user has set values
    if (appliedFilters.salaryMin > 0 || appliedFilters.salaryMax > 0) {
      if (appliedFilters.salaryMin > 0) {
        params.minSalary = appliedFilters.salaryMin;
      }
      if (appliedFilters.salaryMax > 0) {
        params.maxSalary = appliedFilters.salaryMax;
      }
      params.salaryUnit = appliedFilters.salaryUnit;
    }

    // Format sort with order: createdAt:desc
    params.sort = `${sort}:${sortOrder}`;

    return params;
  }, [appliedKeyword, appliedFilters, sort, sortOrder, currentPage, pageSize]);

  // Fetch jobs
  const {
    data: jobsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["job-search", apiParams],
    queryFn: () => jobService.searchJobsAdvanced(apiParams),
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  const jobs = useMemo(() => {
    if (!jobsResponse?.data?.items) return [];
    return jobsResponse.data.items.map(mapJobToCard);
  }, [jobsResponse]);

  const totalPages = jobsResponse?.data?.totalPages || 0;
  // Calculate total jobs: if on last page, use actual count, otherwise estimate
  const totalJobs =
    totalPages > 0
      ? currentPage === totalPages
        ? (currentPage - 1) * pageSize + jobs.length
        : totalPages * pageSize
      : 0;

  // Fetch top attractive jobs for suggestions
  const { data: topAttractiveResponse } = useQuery({
    queryKey: ["top-attractive-jobs", 8],
    queryFn: () => jobService.getTopAttractiveJobs(8),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const suggestedJobs = useMemo(() => {
    if (!topAttractiveResponse?.data) return [];
    return topAttractiveResponse.data.map((job) => {
      const firstLocation =
        Array.isArray(job.jobLocations) && job.jobLocations.length > 0
          ? job.jobLocations[0]
          : null;
      const locationParts: string[] = [];
      if (firstLocation) {
        if (firstLocation.province?.name)
          locationParts.push(firstLocation.province.name);
        if (firstLocation.district?.name)
          locationParts.push(firstLocation.district.name);
      }

      return {
        id: job.id,
        title: job.jobTitle || "",
        company: job.companyName || job.author?.companyName || "",
        salary: formatSalary(job),
        type:
          JobTypeLabelVN[job.jobType as keyof typeof JobTypeLabelVN] ||
          job.jobType,
        typeColor: mapTypeColor(job.jobType),
        logo:
          job.author?.avatarUrl ||
          "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg",
      };
    });
  }, [topAttractiveResponse]);

  const handleSearch = () => {
    setAppliedKeyword(tempKeyword);
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setAppliedKeyword(tempKeyword);
    setAppliedFilters(tempFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    const emptyFilters: JobSearchFilters = {
      industry: [],
      level: [],
      experience: [],
      salaryMin: 0,
      salaryMax: 0,
      salaryUnit: "VND",
      education: [],
      jobType: [],
      datePosted: [],
      provinceId: [],
    };
    setTempKeyword("");
    setTempFilters(emptyFilters);
    setAppliedKeyword("");
    setAppliedFilters(emptyFilters);
    setSort("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const handleCheckboxChange = (
    category: keyof Pick<
      JobSearchFilters,
      "level" | "experience" | "education" | "jobType" | "datePosted"
    >,
    value: string,
    checked: boolean
  ) => {
    const currentValues = tempFilters[category] as string[];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((item) => item !== value);

    setTempFilters({
      ...tempFilters,
      [category]: newValues,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Multi-select handlers
  const handleProvinceToggle = (provinceId: string) => {
    const isSelected = tempFilters.provinceId.includes(provinceId);
    if (isSelected) {
      setTempFilters({
        ...tempFilters,
        provinceId: tempFilters.provinceId.filter((id) => id !== provinceId),
      });
    } else {
      setTempFilters({
        ...tempFilters,
        provinceId: [...tempFilters.provinceId, provinceId],
      });
    }
  };

  const handleIndustryToggle = (industryId: string) => {
    const isSelected = tempFilters.industry.includes(industryId);
    if (isSelected) {
      setTempFilters({
        ...tempFilters,
        industry: tempFilters.industry.filter((id) => id !== industryId),
      });
    } else {
      setTempFilters({
        ...tempFilters,
        industry: [...tempFilters.industry, industryId],
      });
    }
  };

  // Filter options
  const levelOptions = Object.entries(JobLevelLabelVN).map(([key, label]) => ({
    value: label,
    key,
  }));

  const experienceOptions = Object.entries(ExperienceLevelLabelVN).map(
    ([key, label]) => ({
      value: label,
      key,
    })
  );

  const educationOptions = Object.entries(EducationLevelLabelVN).map(
    ([key, label]) => ({
      value: label,
      key,
    })
  );

  const jobTypeOptions = Object.entries(JobTypeLabelVN).map(([key, label]) => ({
    value: label,
    key,
  }));

  const datePostedOptions = [
    { value: "Hôm nay", days: 1 },
    { value: "3 ngày qua", days: 3 },
    { value: "Tuần qua", days: 7 },
    { value: "2 tuần qua", days: 14 },
    { value: "Tháng qua", days: 30 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full blur-xl opacity-60 animate-float-gentle"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-lg opacity-50 animate-float-gentle-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-2xl opacity-40 animate-breathe"></div>
      </div> */}

      {/* Header */}
      {/* <div className="bg-gradient-to-r from-white via-blue-50 to-indigo-50 border-b relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-96 h-32 bg-gradient-to-l from-cyan-200 via-blue-100 to-transparent opacity-70">
          <div className="absolute top-4 right-8">
            <Cross className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 relative z-10">
          <h1 className="text-4xl font-semibold text-center text-[#1967d2] mb-4">
            Find Your Dream Job
          </h1>
        </div>
      </div> */}
      <div className="relative bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 overflow-hidden py-12 border-b border-gray-200">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-5 left-10 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-5 right-10 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between gap-12">
            {/* Left Illustration */}
            <div className="hidden lg:block flex-shrink-0 w-52">
              <img
                src="/left-job.svg"
                alt="Person working"
                className="w-full h-auto"
              />
            </div>

            {/* Center Content */}
            <div className="flex-1">
              <div className="text-center mb-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  <span className="text-blue-600">{totalJobs || 22} Jobs</span>{" "}
                  <span className="text-gray-800">Available Now</span>
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Tiếp cận hàng nghìn tin tuyển dụng việc làm mỗi ngày từ các
                  doanh nghiệp uy tín tại Việt Nam
                </p>
              </div>

              {/* Search Input */}
              <div className="bg-white rounded-xl shadow-lg p-4 flex gap-3 items-center max-w-4xl mx-auto">
                {/* Keyword Input */}
                <div className="flex-1 relative">
                  <Input
                    placeholder="Your keyword..."
                    value={tempKeyword}
                    onChange={(e) => setTempKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    className="h-12 pl-10 border-gray-200"
                  />
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>

                {/* Search Button */}
                <Button
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-12 w-12 p-0 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="hidden lg:block flex-shrink-0 w-52">
              <img
                src="/right-job.svg"
                alt="Person with laptop"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filters + Content */}
      <div className="main-layout relative z-10 pt-20 pb-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm border border-gray-200 p-5 h-fit">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
                  <h2 className="text-base font-semibold text-gray-900">
                    Advance Filter
                  </h2>
                  <Button
                    onClick={handleClearFilters}
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm px-2 py-1 h-auto"
                  >
                    Reset
                  </Button>
                </div>
                <div className="space-y-4">
                  {/* Location Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#1a1f36] text-base">
                      Location
                    </h3>
                    <MultiSelectDropdown
                      options={provinces.map((p) => ({
                        id: p.id.toString(),
                        name: p.name,
                      }))}
                      selectedIds={tempFilters.provinceId}
                      onToggle={handleProvinceToggle}
                      placeholder="Chọn địa điểm"
                    />
                    <Separator className="my-4" />
                  </div>

                  {/* Industry Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#1a1f36] text-base">
                      Industry
                    </h3>
                    <MultiSelectDropdown
                      options={industries.map((i) => ({
                        id: i.id.toString(),
                        name: i.name,
                      }))}
                      selectedIds={tempFilters.industry}
                      onToggle={handleIndustryToggle}
                      placeholder="Chọn ngành nghề"
                    />
                    <Separator className="my-4" />
                  </div>

                  {/* Level Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#1a1f36] text-base">
                      Position
                    </h3>
                    <div className="space-y-3">
                      {levelOptions.map((option) => (
                        <div
                          key={option.key}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`level-${option.key}`}
                            checked={tempFilters.level.includes(option.value)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                "level",
                                option.value,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`level-${option.key}`}
                            className="text-sm text-gray-700 cursor-pointer font-normal"
                          >
                            {option.value}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                  </div>

                  {/* Experience Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#1a1f36] text-base">
                      Experience Level
                    </h3>
                    <div className="space-y-3">
                      {experienceOptions.map((option) => (
                        <div
                          key={option.key}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`experience-${option.key}`}
                            checked={tempFilters.experience.includes(
                              option.value
                            )}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                "experience",
                                option.value,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`experience-${option.key}`}
                            className="text-sm text-gray-700 cursor-pointer font-normal"
                          >
                            {option.value}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                  </div>

                  {/* Salary Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#1a1f36] text-base">
                      Salary Range
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Label
                            htmlFor="min-salary"
                            className="text-xs text-gray-600 uppercase"
                          >
                            MIN
                          </Label>
                          <div className="relative">
                            <Input
                              id="min-salary"
                              type="number"
                              value={tempFilters.salaryMin || ""}
                              onChange={(e) =>
                                setTempFilters({
                                  ...tempFilters,
                                  salaryMin: Math.max(
                                    0,
                                    parseFloat(e.target.value) || 0
                                  ),
                                })
                              }
                              className="text-sm"
                              min="0"
                              step="0.01"
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div className="text-gray-400 mt-6">-</div>

                        <div className="flex-1">
                          <Label
                            htmlFor="max-salary"
                            className="text-xs text-gray-600 uppercase"
                          >
                            MAX
                          </Label>
                          <div className="relative">
                            <Input
                              id="max-salary"
                              type="number"
                              value={tempFilters.salaryMax || ""}
                              onChange={(e) =>
                                setTempFilters({
                                  ...tempFilters,
                                  salaryMax: Math.max(
                                    0,
                                    parseFloat(e.target.value) || 0
                                  ),
                                })
                              }
                              className="text-sm"
                              min="0"
                              step="0.01"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Label
                          htmlFor="salary-unit"
                          className="text-xs text-gray-600 uppercase mb-1 block"
                        >
                          Đơn vị
                        </Label>
                        <Select
                          value={tempFilters.salaryUnit}
                          onValueChange={(value) =>
                            setTempFilters({
                              ...tempFilters,
                              salaryUnit: value as "VND" | "USD",
                            })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VND">
                              Việt Nam Đồng (VND)
                            </SelectItem>
                            <SelectItem value="USD">Đô la Mỹ (USD)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Separator className="my-4" />
                  </div>

                  {/* Education Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#1a1f36] text-base">
                      Education
                    </h3>
                    <div className="space-y-3">
                      {educationOptions.map((option) => (
                        <div
                          key={option.key}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`education-${option.key}`}
                            checked={tempFilters.education.includes(
                              option.value
                            )}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                "education",
                                option.value,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`education-${option.key}`}
                            className="text-sm text-gray-700 cursor-pointer font-normal"
                          >
                            {option.value}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                  </div>

                  {/* Job Type Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#1a1f36] text-base">
                      Onsite/Remote
                    </h3>
                    <div className="space-y-3">
                      {jobTypeOptions.map((option) => (
                        <div
                          key={option.key}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`jobType-${option.key}`}
                            checked={tempFilters.jobType.includes(option.value)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                "jobType",
                                option.value,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`jobType-${option.key}`}
                            className="text-sm text-gray-700 cursor-pointer font-normal"
                          >
                            {option.value}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                  </div>

                  {/* Date Posted Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#1a1f36] text-base">
                      Job Posted
                    </h3>
                    <div className="space-y-3">
                      {datePostedOptions.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`date-${option.value}`}
                            checked={tempFilters.datePosted.includes(
                              option.value
                            )}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                "datePosted",
                                option.value,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`date-${option.value}`}
                            className="text-sm text-gray-700 cursor-pointer font-normal"
                          >
                            {option.value}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                  </div>

                  {/* Action Button */}
                  <div className="pt-4">
                    <Button
                      onClick={handleApplyFilters}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all duration-300"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {/* Results Header */}
            <Card className="bg-white shadow-sm border border-gray-200 p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  {totalJobs > 0 ? (
                    <span className="font-normal">
                      Showing:{" "}
                      <span className="font-semibold text-blue-600">
                        {(currentPage - 1) * pageSize + 1}
                      </span>{" "}
                      -{" "}
                      <span className="font-semibold">
                        {(currentPage - 1) * pageSize + jobs.length}
                      </span>{" "}
                      of <span className="font-semibold">{totalJobs}</span> jobs
                    </span>
                  ) : (
                    <span className="font-normal">No jobs found</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <Select
                    value={sort}
                    onValueChange={(value) => {
                      setSort(
                        value as "createdAt" | "updatedAt" | "expirationDate"
                      );
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-40 h-9 border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Newest Post</SelectItem>
                      <SelectItem value="updatedAt">Mới cập nhật</SelectItem>
                      <SelectItem value="expirationDate">
                        Sắp hết hạn
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-1 ml-2 border border-gray-300 rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 hover:bg-gray-100"
                    >
                      <LayoutGrid className="w-4 h-4 text-gray-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 bg-blue-50 hover:bg-blue-100"
                    >
                      <List className="w-4 h-4 text-blue-600" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Loading state */}
            {isLoading && (
              <div className="text-center py-12">
                <Loading />
              </div>
            )}

            {/* Error state */}
            {isError && (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-red-800 font-medium mb-2">
                    Lỗi tải việc làm
                  </p>
                  <p className="text-red-600 text-sm">
                    {(error as any)?.message ||
                      "Không thể tải dữ liệu việc làm"}
                  </p>
                </div>
              </div>
            )}

            {/* Job Cards */}
            {!isLoading && !isError && (
              <>
                {jobs.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {jobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 0 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">
                      Không tìm thấy việc làm nào. Hãy thử điều chỉnh tìm kiếm
                      hoặc bộ lọc.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Job Suggestions Sidebar */}
          <div className="lg:col-span-2">
            <SuggestedJobs
              jobs={suggestedJobs}
              onViewAll={() => console.log("View all suggestions")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
