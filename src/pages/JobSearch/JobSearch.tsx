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
import { Search, Trash2, ChevronDown } from "lucide-react";
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
        "THPT": EducationLevel.HIGH_SCHOOL,
        "Cao đẳng": EducationLevel.COLLEGE,
        "Đại học": EducationLevel.UNIVERSITY,
        "Sau đại học": EducationLevel.POSTGRADUATE,
        "Thạc sĩ": EducationLevel.MASTER,
        "Tiến sĩ": EducationLevel.DOCTORATE,
        "Khác": EducationLevel.OTHER,
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
        "Khác": JobType.OTHER,
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
            const min = job.minSalary != null ? Number(job.minSalary).toLocaleString() : null;
            const max = job.maxSalary != null ? Number(job.maxSalary).toLocaleString() : null;
            return `${min ?? ""}${min && max ? " - " : ""}${max ?? ""} ${job.salaryUnit ?? ""}`.trim();
        }
        if (job.salaryType === "GREATER_THAN" && job.minSalary != null) {
            return `${Number(job.minSalary).toLocaleString()} ${job.salaryUnit ?? ""}`;
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
    if (jobType.includes("FULL") || jobType.includes("TEMPORARY_FULL")) return "bg-green-500";
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
    const firstLocation = Array.isArray(job.jobLocations) && job.jobLocations.length > 0 ? job.jobLocations[0] : null;
    const locationParts: string[] = [];
    if (firstLocation) {
        if (firstLocation.province?.name) locationParts.push(firstLocation.province.name);
        if (firstLocation.district?.name) locationParts.push(firstLocation.district.name);
        if (firstLocation.detailAddress) locationParts.push(firstLocation.detailAddress);
    }

    return {
        id: job.id,
        title: job.jobTitle || "",
        company: job.companyName || job.author?.companyName || "",
        location: locationParts.join(", ") || "",
        salary: formatSalary(job),
        period: job.salaryUnit ?? "",
        type: JobTypeLabelVN[job.jobType as keyof typeof JobTypeLabelVN] || job.jobType,
        typeColor: mapTypeColor(job.jobType),
        posted: relativePosted(job.createdAt),
        logo: job.author?.avatarUrl || "https://www.vj-tech.jp/_nuxt/img/logo-vj.c7683b6.png",
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

const MultiSelectDropdown = ({ options, selectedIds, onToggle, placeholder = "Chọn..." }: MultiSelectDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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
                            <Badge key={opt.id} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                {opt.name}
                            </Badge>
                        ))
                    )}
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
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
    const sortOrderFromUrl = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
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
    const [sort, setSort] = useState<"createdAt" | "updatedAt" | "expirationDate">(
        (sortFromUrl === "updatedAt" || sortFromUrl === "expirationDate" ? sortFromUrl : "createdAt") as "createdAt" | "updatedAt" | "expirationDate"
    );
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">(sortOrderFromUrl);
    const [currentPage, setCurrentPage] = useState(pageFromUrl ? Number(pageFromUrl) : 1);

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

    const pageSize = 6; // Fixed page size

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
    }, [appliedKeyword, appliedFilters, sort, sortOrder, currentPage, setSearchParams]);

    // Read from URL params when URL changes
    useEffect(() => {
        const keywordParam = searchParams.get("keyword") || "";
        const provinceIdParams = searchParams.getAll("provinceId");
        const industryIdParams = searchParams.getAll("industryId");
        const sortParam = searchParams.get("sort") || "createdAt";
        const sortOrderParam = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
        const pageParam = searchParams.get("page");

        setAppliedKeyword(keywordParam);
        setSort(
            (sortParam === "updatedAt" || sortParam === "expirationDate" ? sortParam : "createdAt") as "createdAt" | "updatedAt" | "expirationDate"
        );
        setSortOrder(sortOrderParam);
        setCurrentPage(pageParam ? Number(pageParam) : 1);

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
    }, [searchParams]);

    // Reset to page 1 when applied filters change
    useEffect(() => {
        setCurrentPage(1);
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
            params.experienceLevels = appliedFilters.experience.map(mapExperienceToEnum);
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
    }, [
        appliedKeyword,
        appliedFilters,
        sort,
        sortOrder,
        currentPage,
        pageSize,
    ]);

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

    const totalJobs = jobsResponse?.data?.numberOfElements || 0;
    const totalPages = jobsResponse?.data?.totalPages || 0;

    // Fetch top attractive jobs for suggestions
    const { data: topAttractiveResponse } = useQuery({
        queryKey: ["top-attractive-jobs"],
        queryFn: () => jobService.getTopAttractiveJobs(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const suggestedJobs = useMemo(() => {
        if (!topAttractiveResponse?.data) return [];
        return topAttractiveResponse.data.map((job) => {
            const firstLocation = Array.isArray(job.jobLocations) && job.jobLocations.length > 0 ? job.jobLocations[0] : null;
            const locationParts: string[] = [];
            if (firstLocation) {
                if (firstLocation.province?.name) locationParts.push(firstLocation.province.name);
                if (firstLocation.district?.name) locationParts.push(firstLocation.district.name);
            }

            return {
                id: job.id,
                title: job.jobTitle || "",
                company: job.companyName || job.author?.companyName || "",
                salary: formatSalary(job),
                type: JobTypeLabelVN[job.jobType as keyof typeof JobTypeLabelVN] || job.jobType,
                typeColor: mapTypeColor(job.jobType),
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
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Find Your Dream Job
          </h1>
        </div>
      </div> */}
            <div
                className="w-full h-[450px] bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center"
                style={{
                    backgroundImage:
                        "linear-gradient(#00000080, #00000080), url('/work1.jpg')",
                        fontFamily: "'Poppins', sans-serif",
                        
                }}
            >
                <div className="text-center px-4">
                    <h1 
                        className="text-white  drop-shadow-lg"
                        style={{
                            marginBottom: 0,
                            fontWeight: 500,
                            lineHeight: '60px',
                            fontSize: '40px',
                        }}
                    >
                        Tìm việc làm nhanh 24h mới nhất trên toàn quốc
                    </h1>
                    <p 
                        className="text-white mt-4"
                        style={{
                            color: '#fff',
                            fontSize: '18px',
                            lineHeight: '28px',
                            fontWeight: 400,
                            opacity: 0.95,
                        }}
                    >
                        Tiếp cận 60.000+ tin tuyển dụng việc làm mỗi ngày từ hàng nghìn doanh nghiệp uy tín tại Việt Nam
                    </p>
        </div>
      </div>



      {/* Search + Filters + Content */}
            <div className="main-layout relative z-10 pt-20 pb-8">
        {/* Search Bar */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 p-4 mb-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 opacity-50"></div>
                    <div className="relative z-10">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Keyword Input */}
            <div className="flex-1 relative">
                                <div className="relative">
              <Input
                placeholder="Job title or company name"
                                        value={tempKeyword}
                                        onChange={(e) => setTempKeyword(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleSearch();
                                            }
                                        }}
                className="pl-10 h-12 text-gray-700 border-gray-200 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-3 h-6 w-6 text-gray-400" />
            </div>
            </div>

                            {/* Search Button */}
            <Button
              onClick={handleSearch}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 h-12 font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
                                <Search className="w-5 h-5 mr-2" />
              Search Jobs
            </Button>
                        </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/30 p-6 h-fit relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 opacity-60"></div>
              <div className="relative z-10">
                <div className="space-y-4">
                                    {/* Location Filter */}
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-gray-900 text-sm">
                                            Location
                                        </h3>
                                        <MultiSelectDropdown
                                            options={provinces.map((p) => ({ id: p.id.toString(), name: p.name }))}
                                            selectedIds={tempFilters.provinceId}
                                            onToggle={handleProvinceToggle}
                                            placeholder="Chọn địa điểm"
                                        />
                                        <Separator className="my-4" />
                                    </div>

                  {/* Industry Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Industry
                    </h3>
                    <MultiSelectDropdown
                        options={industries.map((i) => ({ id: i.id.toString(), name: i.name }))}
                        selectedIds={tempFilters.industry}
                        onToggle={handleIndustryToggle}
                        placeholder="Chọn ngành nghề"
                    />
                    <Separator className="my-4" />
                  </div>

                  {/* Level Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Level
                    </h3>
                    <div className="space-y-2">
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
                            className="text-sm text-gray-700 cursor-pointer"
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
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Experience
                    </h3>
                    <div className="space-y-2">
                                            {experienceOptions.map((option) => (
                        <div
                                                    key={option.key}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                                                        id={`experience-${option.key}`}
                                                        checked={tempFilters.experience.includes(option.value)}
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
                            className="text-sm text-gray-700 cursor-pointer"
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
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Salary
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
                            <SelectItem value="VND">Việt Nam Đồng (VND)</SelectItem>
                            <SelectItem value="USD">Đô la Mỹ (USD)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Separator className="my-4" />
                  </div>

                  {/* Education Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Education
                    </h3>
                    <div className="space-y-2">
                                            {educationOptions.map((option) => (
                        <div
                                                    key={option.key}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                                                        id={`education-${option.key}`}
                                                        checked={tempFilters.education.includes(option.value)}
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
                            className="text-sm text-gray-700 cursor-pointer"
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
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Job Type
                    </h3>
                    <div className="space-y-2">
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
                            className="text-sm text-gray-700 cursor-pointer"
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
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Date Posted
                    </h3>
                    <div className="space-y-2">
                                            {datePostedOptions.map((option) => (
                                                <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                                                        id={`date-${option.value}`}
                                                        checked={tempFilters.datePosted.includes(option.value)}
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
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                                                        {option.value}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 space-y-3">
                    <Button
                      onClick={handleApplyFilters}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Apply Filters
                    </Button>
                    <Button
                      onClick={handleClearFilters}
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 font-medium transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {/* Results Header */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/30 p-4 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/40 to-purple-50/40 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">
                                            {isLoading
                                                ? "Loading..."
                                                : `Hiển thị ${totalJobs.toLocaleString()} việc làm`}
                    </span>
                  </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-700">Sắp xếp</span>
                                        <Select
                                            value={sort}
                                            onValueChange={(value) => {
                                                setSort(value as "createdAt" | "updatedAt" | "expirationDate");
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <SelectTrigger className="w-48">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="createdAt">Mới nhất</SelectItem>
                                                <SelectItem value="updatedAt">Mới cập nhật</SelectItem>
                                                <SelectItem value="expirationDate">Sắp hết hạn</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Select
                                            value={sortOrder}
                                            onValueChange={(value) => {
                                                setSortOrder(value as "asc" | "desc");
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="desc">Giảm dần</SelectItem>
                                                <SelectItem value="asc">Tăng dần</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                    <p className="text-red-800 font-medium mb-2">Lỗi tải việc làm</p>
                                    <p className="text-red-600 text-sm">
                                        {(error as any)?.message || "Không thể tải dữ liệu việc làm"}
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
                                            Không tìm thấy việc làm nào. Hãy thử điều chỉnh tìm kiếm hoặc bộ lọc.
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
