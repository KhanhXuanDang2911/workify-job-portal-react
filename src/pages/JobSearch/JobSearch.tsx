import { useState, useEffect, useMemo, useRef } from "react";
import { PageTitle } from "@/components/PageTitle/PageTitle";
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
import { Textarea } from "@/components/ui/textarea";
import { Search, ChevronDown, Sparkles, ChevronUp } from "lucide-react";
import JobCard from "@/components/JobCard";
import Pagination from "@/components/Pagination";
import SuggestedJobs from "@/components/SuggestedJob";
import { Badge } from "@/components/ui/badge";
import { jobService } from "@/services/job.service";
import { industryService } from "@/services/industry.service";
import { provinceService } from "@/services/location.service";
import { extractSearchParams } from "@/services/smart_search_gemini";
import type { JobResponse } from "@/types/job.type";
import { formatSalaryCompact } from "@/utils/formatSalary";
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
import { useTranslation } from "@/hooks/useTranslation";
import { useUserAuth } from "@/context/UserAuth";
import {
  getSearchHistory,
  removeSearchHistoryItem,
  clearSearchHistory,
  saveSearchHistory,
  type SearchHistoryItem,
} from "@/utils/searchHistory";
import { X, Clock } from "lucide-react";

const mapLevelToEnum = (label: string, t: (key: string) => string): string => {
  const mapping: Record<string, string> = {
    [t("jobSearch.enums.jobLevel.INTERN")]: JobLevel.INTERN,
    [t("jobSearch.enums.jobLevel.ENTRY_LEVEL")]: JobLevel.ENTRY_LEVEL,
    [t("jobSearch.enums.jobLevel.STAFF")]: JobLevel.STAFF,
    [t("jobSearch.enums.jobLevel.ENGINEER")]: JobLevel.ENGINEER,
    [t("jobSearch.enums.jobLevel.SUPERVISOR")]: JobLevel.SUPERVISOR,
    [t("jobSearch.enums.jobLevel.MANAGER")]: JobLevel.MANAGER,
    [t("jobSearch.enums.jobLevel.DIRECTOR")]: JobLevel.DIRECTOR,
    [t("jobSearch.enums.jobLevel.SENIOR_MANAGER")]: JobLevel.SENIOR_MANAGER,
    [t("jobSearch.enums.jobLevel.EXECUTIVE")]: JobLevel.EXECUTIVE,
  };
  return mapping[label] || label;
};

const mapEnumToLevel = (
  enumValue: string,
  t: (key: string) => string
): string => {
  const mapping: Record<string, string> = {
    [JobLevel.INTERN]: t("jobSearch.enums.jobLevel.INTERN"),
    [JobLevel.ENTRY_LEVEL]: t("jobSearch.enums.jobLevel.ENTRY_LEVEL"),
    [JobLevel.STAFF]: t("jobSearch.enums.jobLevel.STAFF"),
    [JobLevel.ENGINEER]: t("jobSearch.enums.jobLevel.ENGINEER"),
    [JobLevel.SUPERVISOR]: t("jobSearch.enums.jobLevel.SUPERVISOR"),
    [JobLevel.MANAGER]: t("jobSearch.enums.jobLevel.MANAGER"),
    [JobLevel.DIRECTOR]: t("jobSearch.enums.jobLevel.DIRECTOR"),
    [JobLevel.SENIOR_MANAGER]: t("jobSearch.enums.jobLevel.SENIOR_MANAGER"),
    [JobLevel.EXECUTIVE]: t("jobSearch.enums.jobLevel.EXECUTIVE"),
  };
  return mapping[enumValue] || enumValue;
};

const mapExperienceToEnum = (
  label: string,
  t: (key: string) => string
): string => {
  const mapping: Record<string, string> = {
    [t("jobSearch.enums.experienceLevel.LESS_THAN_ONE_YEAR")]:
      ExperienceLevel.LESS_THAN_ONE_YEAR,
    [t("jobSearch.enums.experienceLevel.ONE_TO_TWO_YEARS")]:
      ExperienceLevel.ONE_TO_TWO_YEARS,
    [t("jobSearch.enums.experienceLevel.TWO_TO_FIVE_YEARS")]:
      ExperienceLevel.TWO_TO_FIVE_YEARS,
    [t("jobSearch.enums.experienceLevel.FIVE_TO_TEN_YEARS")]:
      ExperienceLevel.FIVE_TO_TEN_YEARS,
    [t("jobSearch.enums.experienceLevel.MORE_THAN_TEN_YEARS")]:
      ExperienceLevel.MORE_THAN_TEN_YEARS,
  };
  return mapping[label] || label;
};

const mapEnumToExperience = (
  enumValue: string,
  t: (key: string) => string
): string => {
  const mapping: Record<string, string> = {
    [ExperienceLevel.LESS_THAN_ONE_YEAR]: t(
      "jobSearch.enums.experienceLevel.LESS_THAN_ONE_YEAR"
    ),
    [ExperienceLevel.ONE_TO_TWO_YEARS]: t(
      "jobSearch.enums.experienceLevel.ONE_TO_TWO_YEARS"
    ),
    [ExperienceLevel.TWO_TO_FIVE_YEARS]: t(
      "jobSearch.enums.experienceLevel.TWO_TO_FIVE_YEARS"
    ),
    [ExperienceLevel.FIVE_TO_TEN_YEARS]: t(
      "jobSearch.enums.experienceLevel.FIVE_TO_TEN_YEARS"
    ),
    [ExperienceLevel.MORE_THAN_TEN_YEARS]: t(
      "jobSearch.enums.experienceLevel.MORE_THAN_TEN_YEARS"
    ),
  };
  return mapping[enumValue] || enumValue;
};

const mapEducationToEnum = (
  label: string,
  t: (key: string) => string
): string => {
  const mapping: Record<string, string> = {
    [t("jobSearch.enums.educationLevel.HIGH_SCHOOL")]:
      EducationLevel.HIGH_SCHOOL,
    [t("jobSearch.enums.educationLevel.COLLEGE")]: EducationLevel.COLLEGE,
    [t("jobSearch.enums.educationLevel.UNIVERSITY")]: EducationLevel.UNIVERSITY,
    [t("jobSearch.enums.educationLevel.POSTGRADUATE")]:
      EducationLevel.POSTGRADUATE,
    [t("jobSearch.enums.educationLevel.MASTER")]: EducationLevel.MASTER,
    [t("jobSearch.enums.educationLevel.DOCTORATE")]: EducationLevel.DOCTORATE,
    [t("jobSearch.enums.educationLevel.OTHER")]: EducationLevel.OTHER,
  };
  return mapping[label] || label;
};

const mapEnumToEducation = (
  enumValue: string,
  t: (key: string) => string
): string => {
  const mapping: Record<string, string> = {
    [EducationLevel.HIGH_SCHOOL]: t(
      "jobSearch.enums.educationLevel.HIGH_SCHOOL"
    ),
    [EducationLevel.COLLEGE]: t("jobSearch.enums.educationLevel.COLLEGE"),
    [EducationLevel.UNIVERSITY]: t("jobSearch.enums.educationLevel.UNIVERSITY"),
    [EducationLevel.POSTGRADUATE]: t(
      "jobSearch.enums.educationLevel.POSTGRADUATE"
    ),
    [EducationLevel.MASTER]: t("jobSearch.enums.educationLevel.MASTER"),
    [EducationLevel.DOCTORATE]: t("jobSearch.enums.educationLevel.DOCTORATE"),
    [EducationLevel.OTHER]: t("jobSearch.enums.educationLevel.OTHER"),
  };
  return mapping[enumValue] || enumValue;
};

const mapJobTypeToEnum = (
  label: string,
  t: (key: string) => string
): string => {
  const mapping: Record<string, string> = {
    [t("jobSearch.enums.jobType.FULL_TIME")]: JobType.FULL_TIME,
    [t("jobSearch.enums.jobType.TEMPORARY_FULL_TIME")]:
      JobType.TEMPORARY_FULL_TIME,
    [t("jobSearch.enums.jobType.PART_TIME")]: JobType.PART_TIME,
    [t("jobSearch.enums.jobType.TEMPORARY_PART_TIME")]:
      JobType.TEMPORARY_PART_TIME,
    [t("jobSearch.enums.jobType.CONTRACT")]: JobType.CONTRACT,
    [t("jobSearch.enums.jobType.OTHER")]: JobType.OTHER,
  };
  return mapping[label] || label;
};

const mapEnumToJobType = (
  enumValue: string,
  t: (key: string) => string
): string => {
  const mapping: Record<string, string> = {
    [JobType.FULL_TIME]: t("jobSearch.enums.jobType.FULL_TIME"),
    [JobType.TEMPORARY_FULL_TIME]: t(
      "jobSearch.enums.jobType.TEMPORARY_FULL_TIME"
    ),
    [JobType.PART_TIME]: t("jobSearch.enums.jobType.PART_TIME"),
    [JobType.TEMPORARY_PART_TIME]: t(
      "jobSearch.enums.jobType.TEMPORARY_PART_TIME"
    ),
    [JobType.CONTRACT]: t("jobSearch.enums.jobType.CONTRACT"),
    [JobType.OTHER]: t("jobSearch.enums.jobType.OTHER"),
  };
  return mapping[enumValue] || enumValue;
};

const mapDatePostedToDays = (
  label: string,
  t: (key: string) => string
): number | undefined => {
  const mapping: Record<string, number> = {
    [t("jobSearch.datePostedToday")]: 1,
    [t("jobSearch.datePosted3Days")]: 3,
    [t("jobSearch.datePostedWeek")]: 7,
    [t("jobSearch.datePosted2Weeks")]: 14,
    [t("jobSearch.datePostedMonth")]: 30,
  };
  return mapping[label];
};

const mapDaysToDatePosted = (
  days: number,
  t: (key: string) => string
): string | undefined => {
  const mapping: Record<number, string> = {
    1: t("jobSearch.datePostedToday"),
    3: t("jobSearch.datePosted3Days"),
    7: t("jobSearch.datePostedWeek"),
    14: t("jobSearch.datePosted2Weeks"),
    30: t("jobSearch.datePostedMonth"),
  };
  return mapping[days];
};

const formatSalary = (job: JobResponse, t: (key: string) => string): string => {
  return formatSalaryCompact(job, t);
};

const mapTypeColor = (jobType?: string): string => {
  if (!jobType) return "bg-gray-400";
  if (jobType.includes("FULL") || jobType.includes("TEMPORARY_FULL"))
    return "bg-green-500";
  if (jobType.includes("PART")) return "bg-orange-500";
  if (jobType.includes("CONTRACT")) return "bg-purple-500";
  return "bg-blue-500";
};

const relativePosted = (
  createdAt?: string,
  t?: (key: string, options?: any) => string
): string => {
  if (!createdAt || !t) return "";
  try {
    const created = new Date(createdAt);
    const diffMs = Date.now() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return t("jobSearch.today");
    if (diffDays === 1) return t("jobSearch.dayAgo");
    if (diffDays < 30) return t("jobSearch.daysAgo", { count: diffDays });
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return t("jobSearch.monthAgo");
    return t("jobSearch.monthsAgo", { count: diffMonths });
  } catch (e) {
    return "";
  }
};

const mapJobToCard = (job: JobResponse, t: (key: string) => string) => {
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
    salary: formatSalary(job, t),
    period: "",
    type: mapEnumToJobType(job.jobType, t),
    typeColor: mapTypeColor(job.jobType),
    posted: relativePosted(job.createdAt, t),
    logo:
      job.author?.avatarUrl ||
      "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg",
    companyWebsite: job.companyWebsite,
  };
};

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

interface JobSearchFilters {
  industry: string[];
  level: string[];
  experience: string[];
  salaryMin: number;
  salaryMax: number;
  salaryUnit: "VND" | "USD";
  education: string[];
  jobType: string[];
  datePosted: string[];
  provinceId: string[];
}

const getSortFieldLabels = (
  t: (key: string) => string
): Record<string, string> => ({
  createdAt: t("jobSearch.newest"),
  updatedAt: t("jobSearch.newlyUpdated"),
  expirationDate: t("jobSearch.expiringSoon"),
});

const getSortOrderLabels = (
  t: (key: string) => string
): Record<"asc" | "desc", string> => ({
  asc: t("jobSearch.ascending"),
  desc: t("jobSearch.descending"),
});

const JobSearch = () => {
  const { t } = useTranslation();

  const { state: userAuth } = useUserAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSmartSearch, setShowSmartSearch] = useState(false);
  const [smartSearchInput, setSmartSearchInput] = useState("");
  const [isExtractingParams, setIsExtractingParams] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const historyDropdownRef = useRef<HTMLDivElement>(null);
  const jobsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showHistory &&
        historyDropdownRef.current &&
        !historyDropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowHistory(false);
      }
    };

    if (showHistory) {
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showHistory]);

  const parseSortsFromUrl = (
    sortsString: string
  ): { field: string; direction: "asc" | "desc" } => {
    if (!sortsString) return { field: "createdAt", direction: "desc" };
    const [field, direction] = sortsString.split(":");
    return {
      field: field || "createdAt",
      direction: (direction as "asc" | "desc") || "desc",
    };
  };

  const parseFiltersFromUrl = (params: URLSearchParams): JobSearchFilters => {
    const levelParams = params.getAll("level");
    const experienceParams = params.getAll("experience");
    const jobTypeParams = params.getAll("jobType");
    const datePostedParams = params.getAll("datePosted");
    const educationParams = params.getAll("education");
    const salaryMin = params.get("salaryMin");
    const salaryMax = params.get("salaryMax");
    const salaryUnit = (params.get("salaryUnit") as "VND" | "USD") || "VND";

    return {
      industry: params.getAll("industryId"),
      provinceId: params.getAll("provinceId"),
      level: levelParams.map((v) => mapEnumToLevel(v, t)),
      experience: experienceParams.map((v) => mapEnumToExperience(v, t)),
      jobType: jobTypeParams.map((v) => mapEnumToJobType(v, t)),
      datePosted: datePostedParams,
      education: educationParams.map((v) => mapEnumToEducation(v, t)),
      salaryMin: salaryMin ? Number(salaryMin) : 0,
      salaryMax: salaryMax ? Number(salaryMax) : 0,
      salaryUnit,
    };
  };

  const keywordFromUrl = searchParams.get("keyword") || "";
  const sortsFromUrl = searchParams.get("sorts") || "createdAt:desc";
  const pageFromUrl = searchParams.get("page");
  const initialFilters = parseFiltersFromUrl(searchParams);
  const initialSort = parseSortsFromUrl(sortsFromUrl);

  const [appliedKeyword, setAppliedKeyword] = useState(keywordFromUrl);
  const [tempKeyword, setTempKeyword] = useState(keywordFromUrl);
  const [appliedFilters, setAppliedFilters] =
    useState<JobSearchFilters>(initialFilters);
  const [appliedSort, setAppliedSort] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>(initialSort);
  const [currentPage, setCurrentPage] = useState(
    pageFromUrl ? Number(pageFromUrl) : 1
  );

  const [tempSalaryMin, setTempSalaryMin] = useState<string>(
    initialFilters.salaryMin > 0 ? initialFilters.salaryMin.toString() : ""
  );
  const [tempSalaryMax, setTempSalaryMax] = useState<string>(
    initialFilters.salaryMax > 0 ? initialFilters.salaryMax.toString() : ""
  );

  const pageSize = 10;

  const sortsString = `${appliedSort.field}:${appliedSort.direction}`;

  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  const refreshSearchHistory = () => {
    setSearchHistory(getSearchHistory());
  };

  const handleSearch = () => {
    setAppliedKeyword(tempKeyword);
    setCurrentPage(1);
    setShowHistory(false);
    if (tempKeyword.trim()) {
      const industryId =
        appliedFilters.industry.length > 0
          ? appliedFilters.industry[0]
          : undefined;
      const provinceId =
        appliedFilters.provinceId.length > 0
          ? appliedFilters.provinceId[0]
          : undefined;
      saveSearchHistory(tempKeyword.trim(), industryId, provinceId);
      refreshSearchHistory();
    }
  };

  const handleSmartSearch = async () => {
    if (!smartSearchInput.trim() || isExtractingParams) return;

    setIsExtractingParams(true);
    try {
      const extractedParams = await extractSearchParams(
        smartSearchInput.trim(),
        {
          provinces,
          industries,
        }
      );

      const newFilters: JobSearchFilters = { ...appliedFilters };

      if (extractedParams.keyword) {
        setAppliedKeyword(extractedParams.keyword);
      }

      if (
        extractedParams.provinceIds &&
        extractedParams.provinceIds.length > 0
      ) {
        newFilters.provinceId = extractedParams.provinceIds.map((id) =>
          String(id)
        );
      }

      if (
        extractedParams.industryIds &&
        extractedParams.industryIds.length > 0
      ) {
        newFilters.industry = extractedParams.industryIds.map((id) =>
          String(id)
        );
      }

      if (extractedParams.jobLevels && extractedParams.jobLevels.length > 0) {
        newFilters.level = extractedParams.jobLevels.map((level) =>
          mapEnumToLevel(level, t)
        );
      }

      if (
        extractedParams.experienceLevels &&
        extractedParams.experienceLevels.length > 0
      ) {
        newFilters.experience = extractedParams.experienceLevels.map((exp) =>
          mapEnumToExperience(exp, t)
        );
      }

      if (
        extractedParams.educationLevels &&
        extractedParams.educationLevels.length > 0
      ) {
        newFilters.education = extractedParams.educationLevels.map((edu) =>
          mapEnumToEducation(edu, t)
        );
      }

      if (extractedParams.jobTypes && extractedParams.jobTypes.length > 0) {
        newFilters.jobType = extractedParams.jobTypes.map((type) =>
          mapEnumToJobType(type, t)
        );
      }

      if (extractedParams.postedWithinDays) {
        const daysLabel = mapDaysToDatePosted(
          extractedParams.postedWithinDays,
          t
        );
        if (daysLabel) {
          newFilters.datePosted = [daysLabel];
        }
      }

      if (extractedParams.minSalary || extractedParams.maxSalary) {
        newFilters.salaryMin = extractedParams.minSalary || 0;
        newFilters.salaryMax = extractedParams.maxSalary || 0;
        newFilters.salaryUnit =
          (extractedParams.salaryUnit as "VND" | "USD") || "VND";
      }

      if (extractedParams.sort) {
        const [field, direction] = extractedParams.sort.split(":");
        setAppliedSort({
          field: field || "createdAt",
          direction: (direction as "asc" | "desc") || "desc",
        });
      }

      setAppliedFilters(newFilters);
      setCurrentPage(1);

      if (jobsSectionRef.current) {
        jobsSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } catch (error) {
    } finally {
      setIsExtractingParams(false);
    }
  };

  const handleHistoryItemClick = (item: SearchHistoryItem) => {
    const keyword = item.keyword || "";
    setTempKeyword(keyword);
    setAppliedKeyword(keyword);
    const newFilters = { ...appliedFilters };
    if (item.industryId) {
      newFilters.industry = [item.industryId];
    } else {
      newFilters.industry = [];
    }
    if (item.provinceId) {
      newFilters.provinceId = [item.provinceId];
    } else {
      newFilters.provinceId = [];
    }
    setAppliedFilters(newFilters);
    setCurrentPage(1);
    setShowHistory(false);
  };

  const handleRemoveHistoryItem = (
    item: SearchHistoryItem,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();
    removeSearchHistoryItem(item.timestamp);
    refreshSearchHistory();

    setShowHistory(true);
  };

  const handleClearHistory = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearSearchHistory();
    refreshSearchHistory();

    setShowHistory(true);
  };

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

    if (appliedFilters.level.length > 0) {
      appliedFilters.level.forEach((label) => {
        params.append("level", mapLevelToEnum(label, t));
      });
    }

    if (appliedFilters.experience.length > 0) {
      appliedFilters.experience.forEach((label) => {
        params.append("experience", mapExperienceToEnum(label, t));
      });
    }

    if (appliedFilters.jobType.length > 0) {
      appliedFilters.jobType.forEach((label) => {
        params.append("jobType", mapJobTypeToEnum(label, t));
      });
    }

    if (appliedFilters.datePosted.length > 0) {
      appliedFilters.datePosted.forEach((label) => {
        params.append("datePosted", label);
      });
    }

    if (appliedFilters.education.length > 0) {
      appliedFilters.education.forEach((label) => {
        params.append("education", mapEducationToEnum(label, t));
      });
    }

    if (appliedFilters.salaryMin > 0) {
      params.set("salaryMin", appliedFilters.salaryMin.toString());
    }

    if (appliedFilters.salaryMax > 0) {
      params.set("salaryMax", appliedFilters.salaryMax.toString());
    }

    if (appliedFilters.salaryUnit !== "VND") {
      params.set("salaryUnit", appliedFilters.salaryUnit);
    }

    if (sortsString !== "createdAt:desc") {
      params.set("sorts", sortsString);
    }

    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }

    setSearchParams(params, { replace: true });
  }, [
    appliedKeyword,
    appliedFilters,
    sortsString,
    currentPage,
    setSearchParams,
  ]);

  useEffect(() => {
    const keywordParam = searchParams.get("keyword") || "";
    const sortsParam = searchParams.get("sorts") || "createdAt:desc";
    const pageParam = searchParams.get("page");
    const pageFromUrl = pageParam ? Number(pageParam) : 1;

    const parsedSort = parseSortsFromUrl(sortsParam);
    const parsedFilters = parseFiltersFromUrl(searchParams);

    setAppliedKeyword(keywordParam);
    setTempKeyword(keywordParam);
    setAppliedSort(parsedSort);
    setAppliedFilters(parsedFilters);

    setTempSalaryMin(
      parsedFilters.salaryMin > 0 ? parsedFilters.salaryMin.toString() : ""
    );
    setTempSalaryMax(
      parsedFilters.salaryMax > 0 ? parsedFilters.salaryMax.toString() : ""
    );

    if (pageFromUrl !== currentPage) {
      setCurrentPage(pageFromUrl);
    }
  }, [searchParams]);

  const autoAppliedRef = useRef(false);

  useEffect(() => {
    try {
      if (autoAppliedRef.current) return;

      const userIndustryId = userAuth?.user?.industry?.id;

      const urlIndustryIds = searchParams.getAll("industryId");
      if (urlIndustryIds.length > 0) {
        autoAppliedRef.current = true;
        return;
      }

      if (userIndustryId && appliedFilters.industry.length === 0) {
        setAppliedFilters((prev) => ({
          ...prev,
          industry: [String(userIndustryId)],
        }));
        setCurrentPage(1);
      }

      autoAppliedRef.current = true;
    } catch (e) {}
  }, [userAuth?.user?.industry?.id, searchParams]);

  const prevFiltersRef = useRef({
    appliedKeyword,
    appliedFilters,
    sortsString,
  });
  useEffect(() => {
    const filtersChanged =
      prevFiltersRef.current.appliedKeyword !== appliedKeyword ||
      JSON.stringify(prevFiltersRef.current.appliedFilters.provinceId) !==
        JSON.stringify(appliedFilters.provinceId) ||
      JSON.stringify(prevFiltersRef.current.appliedFilters.industry) !==
        JSON.stringify(appliedFilters.industry) ||
      prevFiltersRef.current.sortsString !== sortsString;

    if (filtersChanged) {
      setCurrentPage(1);
      prevFiltersRef.current = {
        appliedKeyword,
        appliedFilters,
        sortsString,
      };
    }
  }, [appliedKeyword, appliedFilters, sortsString]);

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
      params.jobLevels = appliedFilters.level.map((v) => mapLevelToEnum(v, t));
    }

    if (appliedFilters.experience.length > 0) {
      params.experienceLevels = appliedFilters.experience.map((v) =>
        mapExperienceToEnum(v, t)
      );
    }

    if (appliedFilters.education.length > 0) {
      params.educationLevels = appliedFilters.education.map((v) =>
        mapEducationToEnum(v, t)
      );
    }

    if (appliedFilters.jobType.length > 0) {
      params.jobTypes = appliedFilters.jobType.map((v) =>
        mapJobTypeToEnum(v, t)
      );
    }

    if (appliedFilters.datePosted.length > 0) {
      const days = appliedFilters.datePosted
        .map((v) => mapDatePostedToDays(v, t))
        .filter((d): d is number => d !== undefined);
      if (days.length > 0) {
        params.postedWithinDays = Math.min(...days);
      }
    }

    if (appliedFilters.salaryMin > 0 || appliedFilters.salaryMax > 0) {
      if (appliedFilters.salaryMin > 0) {
        params.minSalary = appliedFilters.salaryMin;
      }
      if (appliedFilters.salaryMax > 0) {
        params.maxSalary = appliedFilters.salaryMax;
      }
      params.salaryUnit = appliedFilters.salaryUnit;
    }

    params.sort = sortsString;

    return params;
  }, [appliedKeyword, appliedFilters, sortsString, currentPage, pageSize]);

  const {
    data: jobsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["job-search", apiParams],
    queryFn: () => jobService.searchJobsAdvanced(apiParams),
    staleTime: 1 * 60 * 1000,
  });

  const jobs = useMemo(() => {
    if (!jobsResponse?.data?.items) return [];
    return jobsResponse.data.items.map((job) => mapJobToCard(job, t));
  }, [jobsResponse, t]);

  const totalPages = jobsResponse?.data?.totalPages || 0;

  const totalJobs =
    totalPages > 0
      ? currentPage === totalPages
        ? (currentPage - 1) * pageSize + jobs.length
        : totalPages * pageSize
      : 0;

  const userIndustryId = userAuth?.user?.industry?.id;

  const { data: topAttractiveResponse } = useQuery({
    queryKey: ["top-attractive-jobs", 8, userIndustryId ?? null],
    queryFn: () =>
      jobService.getTopAttractiveJobs(
        8,
        userIndustryId ? { industryId: Number(userIndustryId) } : undefined
      ),
    staleTime: 5 * 60 * 1000,
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
        salary: formatSalary(job, t),
        type: mapEnumToJobType(job.jobType, t),
        typeColor: mapTypeColor(job.jobType),
        logo:
          job.author?.avatarUrl ||
          "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg",
      };
    });
  }, [topAttractiveResponse, t]);

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
    setAppliedKeyword("");
    setAppliedFilters(emptyFilters);
    setAppliedSort({ field: "createdAt", direction: "desc" });
    setTempSalaryMin("");
    setTempSalaryMax("");
    setCurrentPage(1);
  };

  const handleClearSmartSearch = () => {
    setSmartSearchInput("");
    handleClearFilters();
    setTempKeyword("");
  };

  const handleCheckboxChange = (
    category: keyof Pick<
      JobSearchFilters,
      "level" | "experience" | "education" | "jobType" | "datePosted"
    >,
    value: string,
    checked: boolean
  ) => {
    const currentValues = appliedFilters[category] as string[];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((item) => item !== value);

    setAppliedFilters({
      ...appliedFilters,
      [category]: newValues,
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProvinceToggle = (provinceId: string) => {
    const isSelected = appliedFilters.provinceId.includes(provinceId);
    if (isSelected) {
      setAppliedFilters({
        ...appliedFilters,
        provinceId: appliedFilters.provinceId.filter((id) => id !== provinceId),
      });
    } else {
      setAppliedFilters({
        ...appliedFilters,
        provinceId: [...appliedFilters.provinceId, provinceId],
      });
    }
    setCurrentPage(1);
  };

  const handleIndustryToggle = (industryId: string) => {
    const isSelected = appliedFilters.industry.includes(industryId);
    if (isSelected) {
      setAppliedFilters({
        ...appliedFilters,
        industry: appliedFilters.industry.filter((id) => id !== industryId),
      });
    } else {
      setAppliedFilters({
        ...appliedFilters,
        industry: [...appliedFilters.industry, industryId],
      });
    }
    setCurrentPage(1);
  };

  const handleSortFieldChange = (field: string) => {
    let direction: "asc" | "desc" = "desc";
    if (field === "expirationDate") {
      direction = "asc";
    } else if (field === "createdAt" || field === "updatedAt") {
      direction = "desc";
    }
    setAppliedSort({ field, direction });
    setCurrentPage(1);
  };

  const applySalaryFilter = () => {
    const min = tempSalaryMin ? Math.max(0, parseFloat(tempSalaryMin) || 0) : 0;
    const max = tempSalaryMax ? Math.max(0, parseFloat(tempSalaryMax) || 0) : 0;
    setAppliedFilters({
      ...appliedFilters,
      salaryMin: min,
      salaryMax: max,
    });
    setCurrentPage(1);
  };

  const handleSalaryUnitChange = (unit: "VND" | "USD") => {
    setAppliedFilters({
      ...appliedFilters,
      salaryUnit: unit,
    });
    setCurrentPage(1);
  };

  const levelOptions = Object.values(JobLevel).map((key) => ({
    value: mapEnumToLevel(key, t),
    key,
  }));

  const experienceOptions = Object.values(ExperienceLevel).map((key) => ({
    value: mapEnumToExperience(key, t),
    key,
  }));

  const educationOptions = Object.values(EducationLevel).map((key) => ({
    value: mapEnumToEducation(key, t),
    key,
  }));

  const jobTypeOptions = Object.values(JobType).map((key) => ({
    value: mapEnumToJobType(key, t),
    key,
  }));

  const datePostedOptions = [
    { value: t("jobSearch.datePostedToday"), days: 1 },
    { value: t("jobSearch.datePosted3Days"), days: 3 },
    { value: t("jobSearch.datePostedWeek"), days: 7 },
    { value: t("jobSearch.datePosted2Weeks"), days: 14 },
    { value: t("jobSearch.datePostedMonth"), days: 30 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      <PageTitle title={t("pageTitles.jobSearch")} />
      <div
        className="relative bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12 border-b border-gray-200"
        style={{ overflow: "visible" }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-5 left-10 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-5 right-10 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl"></div>
        </div>

        <div
          className="relative max-w-7xl mx-auto px-4"
          style={{ overflow: "visible" }}
        >
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
            <div className="flex-1" style={{ overflow: "visible" }}>
              <div className="text-center mb-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  <span className="text-blue-600">
                    {t("jobSearch.heroTitle", { count: totalJobs || 22 })}
                  </span>
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {t("jobSearch.heroDescription")}
                </p>
              </div>

              {/* Search Input */}
              <div
                className="bg-white rounded-xl shadow-lg p-4 flex gap-3 items-center max-w-4xl mx-auto relative"
                style={{ zIndex: 50 }}
              >
                {/* Keyword Input */}
                <div className="flex-1 relative" style={{ zIndex: 60 }}>
                  <Input
                    ref={searchInputRef}
                    placeholder={t("jobSearch.keywordPlaceholder")}
                    value={tempKeyword}
                    onChange={(e) => {
                      setTempKeyword(e.target.value);
                      setShowHistory(true);
                    }}
                    onFocus={() => setShowHistory(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    className="h-12 pl-10 border-gray-200"
                  />
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />

                  {/* Search History Dropdown */}
                  {showHistory && (
                    <div
                      ref={historyDropdownRef}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-80 overflow-y-auto"
                      style={{ zIndex: 100 }}
                    >
                      {searchHistory.length > 0 ? (
                        <>
                          <div className="p-2 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{t("jobSearch.searchHistory.title")}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleClearHistory}
                              className="h-7 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 relative z-10 cursor-pointer"
                              type="button"
                            >
                              {t("jobSearch.searchHistory.clearAll")}
                            </Button>
                          </div>
                          <div className="py-1">
                            {searchHistory.map((item) => (
                              <div
                                key={item.timestamp}
                                onClick={() => handleHistoryItemClick(item)}
                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between group"
                              >
                                <div className="flex-1 min-w-0 cursor-pointer">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {item.keyword}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveHistoryItem(item, e);
                                  }}
                                  className="opacity-70 group-hover:opacity-100 transition-all p-1 hover:bg-red-100 rounded cursor-pointer flex-shrink-0 relative z-10"
                                  title={t("jobSearch.searchHistory.delete")}
                                  type="button"
                                >
                                  <X className="w-4 h-4 text-gray-500 hover:text-red-600 transition-colors pointer-events-none" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-500">
                          {t("jobSearch.searchHistory.noHistory")}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Search Button */}
                <Button
                  type="button"
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-12 w-12 p-0 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0"
                >
                  <Search className="w-5 h-5 pointer-events-none" />
                </Button>
              </div>

              {/* Smart Search Section */}
              <div className="mt-4 max-w-4xl mx-auto">
                {/* Smart Search Toggle Button */}
                <Button
                  type="button"
                  onClick={() => setShowSmartSearch(!showSmartSearch)}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium">
                    {showSmartSearch ? "Hide Smart Search" : "Smart Search"}
                  </span>
                  {showSmartSearch ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>

                {/* Smart Search Textarea - Animated */}
                {showSmartSearch && (
                  <div className="mt-4 animate-fade-in-up transition-all duration-300 ease-in-out">
                    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <Label
                            htmlFor="smart-search"
                            className="text-sm font-medium text-gray-700 mb-2 block"
                          >
                            Describe what you're looking for in detail
                          </Label>
                          <Textarea
                            id="smart-search"
                            placeholder="E.g., I'm looking for a remote software engineer position with 3+ years of experience in React and Node.js, preferably in a startup environment..."
                            className="min-h-[120px] resize-y border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm text-sm"
                            rows={5}
                            value={smartSearchInput}
                            onChange={(e) =>
                              setSmartSearchInput(e.target.value)
                            }
                            disabled={isExtractingParams}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Enter" &&
                                !e.ctrlKey &&
                                !e.metaKey &&
                                !e.shiftKey
                              ) {
                                e.preventDefault();
                                handleSmartSearch();
                              }
                            }}
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            Provide detailed information about your job
                            preferences, skills, and requirements for better
                            search results.
                            {isExtractingParams && (
                              <span className="block mt-1 text-blue-600 font-medium">
                                Extracting search parameters...
                              </span>
                            )}
                          </p>

                          {/* Action Buttons */}
                          <div className="mt-4 flex items-center justify-end gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleClearSmartSearch}
                              disabled={isExtractingParams}
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-gray-300 hover:border-gray-400 transition-all"
                            >
                              <X className="w-4 h-4" />
                              <span>Clear</span>
                            </Button>
                            <Button
                              type="button"
                              onClick={handleSmartSearch}
                              disabled={
                                !smartSearchInput.trim() || isExtractingParams
                              }
                              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Search className="w-4 h-4" />
                              <span>Search</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
      <div className="main-layout relative z-10 pt-20 pb-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm border border-gray-200 p-5 h-fit">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
                  <h2 className="text-base font-semibold text-gray-900">
                    {t("jobSearch.advanceFilter")}
                  </h2>
                  <Button
                    onClick={handleClearFilters}
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm px-2 py-1 h-auto"
                  >
                    {t("jobSearch.reset")}
                  </Button>
                </div>
                <div className="space-y-4">
                  {/* Location Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#1a1f36] text-base">
                      {t("jobSearch.location")}
                    </h3>
                    <MultiSelectDropdown
                      options={provinces.map((p) => ({
                        id: p.id.toString(),
                        name: p.name,
                      }))}
                      selectedIds={appliedFilters.provinceId}
                      onToggle={handleProvinceToggle}
                      placeholder={t("jobSearch.selectLocation")}
                    />
                    <Separator className="my-4" />
                  </div>

                  {/* Industry Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#1a1f36] text-base">
                      {t("jobSearch.industry")}
                    </h3>
                    <MultiSelectDropdown
                      options={industries.map((i) => ({
                        id: i.id.toString(),
                        name: i.name,
                      }))}
                      selectedIds={appliedFilters.industry}
                      onToggle={handleIndustryToggle}
                      placeholder={t("jobSearch.selectIndustry")}
                    />
                    <Separator className="my-4" />
                  </div>

                  {/* Level Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#1a1f36] text-base">
                      {t("jobSearch.position")}
                    </h3>
                    <div className="space-y-3">
                      {levelOptions.map((option) => (
                        <div
                          key={option.key}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`level-${option.key}`}
                            checked={appliedFilters.level.includes(
                              option.value
                            )}
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
                      {t("jobSearch.experienceLevel")}
                    </h3>
                    <div className="space-y-3">
                      {experienceOptions.map((option) => (
                        <div
                          key={option.key}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`experience-${option.key}`}
                            checked={appliedFilters.experience.includes(
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
                      {t("jobSearch.salaryRange")}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Label
                            htmlFor="min-salary"
                            className="text-xs text-gray-600 uppercase"
                          >
                            {t("jobSearch.min")}
                          </Label>
                          <div className="relative">
                            <Input
                              id="min-salary"
                              type="number"
                              value={tempSalaryMin}
                              onChange={(e) => setTempSalaryMin(e.target.value)}
                              onBlur={applySalaryFilter}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.currentTarget.blur();
                                }
                              }}
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
                            {t("jobSearch.max")}
                          </Label>
                          <div className="relative">
                            <Input
                              id="max-salary"
                              type="number"
                              value={tempSalaryMax}
                              onChange={(e) => setTempSalaryMax(e.target.value)}
                              onBlur={applySalaryFilter}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.currentTarget.blur();
                                }
                              }}
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
                          {t("jobSearch.unit")}
                        </Label>
                        <Select
                          value={appliedFilters.salaryUnit}
                          onValueChange={(value) =>
                            handleSalaryUnitChange(value as "VND" | "USD")
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VND">
                              {t("jobSearch.salaryUnitVND")}
                            </SelectItem>
                            <SelectItem value="USD">
                              {t("jobSearch.salaryUnitUSD")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Separator className="my-4" />
                  </div>

                  {/* Education Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#1a1f36] text-base">
                      {t("jobSearch.education")}
                    </h3>
                    <div className="space-y-3">
                      {educationOptions.map((option) => (
                        <div
                          key={option.key}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`education-${option.key}`}
                            checked={appliedFilters.education.includes(
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
                      {t("jobSearch.jobType")}
                    </h3>
                    <div className="space-y-3">
                      {jobTypeOptions.map((option) => (
                        <div
                          key={option.key}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`jobType-${option.key}`}
                            checked={appliedFilters.jobType.includes(
                              option.value
                            )}
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
                      {t("jobSearch.datePosted")}
                    </h3>
                    <div className="space-y-3">
                      {datePostedOptions.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`date-${option.value}`}
                            checked={appliedFilters.datePosted.includes(
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

                  {/* Sort Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#1a1f36] text-base">
                      {t("jobSearch.sortBy")}
                    </h3>
                    <Select
                      value={appliedSort.field}
                      onValueChange={handleSortFieldChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("jobSearch.sortBy")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt">
                          {getSortFieldLabels(t).createdAt}
                        </SelectItem>
                        <SelectItem value="updatedAt">
                          {getSortFieldLabels(t).updatedAt}
                        </SelectItem>
                        <SelectItem value="expirationDate">
                          {getSortFieldLabels(t).expirationDate}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Separator className="my-4" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {/* Results Header */}
            <Card
              ref={jobsSectionRef}
              className="bg-white shadow-sm border border-gray-200 p-4 mb-4"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {!isLoading && totalJobs > 0 && (
                    <span className="font-medium">
                      {t("jobSearch.showingJobsCount", { count: totalJobs })}
                    </span>
                  )}
                  {!isLoading && totalJobs === 0 && (
                    <span className="font-normal">
                      {t("jobSearch.noJobsFound")}
                    </span>
                  )}
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
                    {t("jobSearch.loadJobsError")}
                  </p>
                  <p className="text-red-600 text-sm">
                    {(error as any)?.message ||
                      t("jobSearch.loadJobsDataError")}
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
                      {t("jobSearch.noJobsFoundMessage")}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Job Suggestions Sidebar */}
          <div className="lg:col-span-2">
            <SuggestedJobs jobs={suggestedJobs} onViewAll={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
