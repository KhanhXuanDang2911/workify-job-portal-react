import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import EmployerCard from "@/components/EmployerCard";
import Pagination from "@/components/Pagination";
import Loading from "@/components/Loading";
import { useQuery } from "@tanstack/react-query";
import { employerService } from "@/services";
import { provinceService } from "@/services/location.service";
import { CompanySize, CompanySizeLabelVN } from "@/constants/company.constant";
import type { Province } from "@/types/location.type";
import type { Employer } from "@/types/employer.type";
import { useTranslation } from "@/hooks/useTranslation";

// Sort field display names mapping
const getSortFieldLabels = (
  t: (key: string) => string
): Record<string, string> => ({
  companyName: t("employerSearch.companyName"),
  companySize: t("employerSearch.companySize"),
  createdAt: t("jobSearch.newest"),
  updatedAt: t("jobSearch.newlyUpdated"),
  "province.name": t("employerSearch.province"),
  "district.name": t("employerSearch.district"),
});

// Sort order display names
const getSortOrderLabels = (
  t: (key: string) => string
): Record<"asc" | "desc", string> => ({
  asc: t("jobSearch.ascending"),
  desc: t("jobSearch.descending"),
});

const EmployerSearch = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read from URL params on mount
  const keywordFromUrl = searchParams.get("keyword") || "";
  const provinceIdFromUrl = searchParams.get("provinceId");
  const companySizeFromUrl = searchParams.get("companySize") || "";
  const sortsFromUrl = searchParams.get("sorts") || "createdAt:desc";
  const pageFromUrl = searchParams.get("page");

  // Parse sorts from URL (format: "field:asc|desc" or "field1:asc,field2:desc")
  const parseSortsFromUrl = (
    sortsString: string
  ): { field: string; direction: "asc" | "desc" }[] => {
    if (!sortsString) return [{ field: "createdAt", direction: "desc" }];
    return sortsString.split(",").map((sort) => {
      const [field, direction] = sort.split(":");
      return {
        field: field || "createdAt",
        direction: (direction as "asc" | "desc") || "desc",
      };
    });
  };

  const initialSorts = parseSortsFromUrl(sortsFromUrl);
  const primarySort = initialSorts[0] || {
    field: "createdAt",
    direction: "desc",
  };

  // Applied filters (from URL - used for API calls) - auto-apply, no temp filters
  const [appliedKeyword, setAppliedKeyword] = useState(keywordFromUrl);
  const [appliedProvinceId, setAppliedProvinceId] = useState<number | null>(
    provinceIdFromUrl ? Number(provinceIdFromUrl) : null
  );
  const [appliedCompanySize, setAppliedCompanySize] =
    useState<string>(companySizeFromUrl);
  const [appliedSorts, setAppliedSorts] =
    useState<{ field: string; direction: "asc" | "desc" }[]>(initialSorts);
  const [currentPage, setCurrentPage] = useState(
    pageFromUrl ? Number(pageFromUrl) : 1
  );

  const pageSize = 10; // Fixed page size

  // Build sorts string for API (format: "field:asc|desc" or "field1:asc,field2:desc")
  const buildSortsString = (
    sorts: { field: string; direction: "asc" | "desc" }[]
  ): string => {
    return sorts.map((s) => `${s.field}:${s.direction}`).join(",");
  };

  const sortsString = buildSortsString(appliedSorts);

  // Update URL params when applied filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (appliedKeyword) {
      params.set("keyword", appliedKeyword);
    }

    if (appliedProvinceId) {
      params.set("provinceId", appliedProvinceId.toString());
    }

    if (appliedCompanySize && appliedCompanySize !== "all") {
      params.set("companySize", appliedCompanySize);
    }

    // Set sorts param (format: "field:asc|desc" or "field1:asc,field2:desc")
    const sortsParam = buildSortsString(appliedSorts);
    if (sortsParam !== "createdAt:desc") {
      params.set("sorts", sortsParam);
    }

    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }

    setSearchParams(params, { replace: true });
  }, [
    appliedKeyword,
    appliedProvinceId,
    appliedCompanySize,
    appliedSorts,
    currentPage,
    setSearchParams,
  ]);

  // Read from URL params when URL changes
  useEffect(() => {
    const keywordParam = searchParams.get("keyword") || "";
    const provinceIdParam = searchParams.get("provinceId");
    const companySizeParam = searchParams.get("companySize") || "";
    const sortsParam = searchParams.get("sorts") || "createdAt:desc";
    const pageParam = searchParams.get("page");

    const parsedSorts = parseSortsFromUrl(sortsParam);
    const primarySort = parsedSorts[0] || {
      field: "createdAt",
      direction: "desc",
    };

    setAppliedKeyword(keywordParam);
    setAppliedProvinceId(provinceIdParam ? Number(provinceIdParam) : null);
    setAppliedCompanySize(companySizeParam);
    setAppliedSorts(parsedSorts);
    setCurrentPage(pageParam ? Number(pageParam) : 1);
  }, [searchParams]);

  // Reset to page 1 when applied filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [appliedKeyword, appliedProvinceId, appliedCompanySize, sortsString]);

  // Fetch provinces
  const { data: provincesResponse } = useQuery({
    queryKey: ["provinces"],
    queryFn: () => provinceService.getProvinces(),
    staleTime: 10 * 60 * 1000,
  });

  const provinces: Province[] = provincesResponse?.data || [];

  // Fetch employers from API
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "employers",
      currentPage,
      pageSize,
      sortsString,
      appliedKeyword,
      appliedProvinceId,
      appliedCompanySize,
    ],
    queryFn: () =>
      employerService.searchEmployers({
        pageNumber: currentPage,
        pageSize: pageSize,
        sorts: sortsString,
        ...(appliedKeyword && { keyword: appliedKeyword }),
        ...(appliedProvinceId && { provinceId: appliedProvinceId }),
        ...(appliedCompanySize &&
          appliedCompanySize !== "all" && { companySize: appliedCompanySize }),
      }),
    staleTime: 5 * 60 * 1000,
    retry: false, // Don't retry on error to show error message immediately
  });

  const employers: Employer[] = Array.isArray(apiResponse?.data?.items)
    ? apiResponse.data.items
    : [];
  const totalPages = apiResponse?.data?.totalPages || 0;
  const numberOfElements = apiResponse?.data?.numberOfElements || 0;

  // Map Employer to EmployerCard format
  const mapEmployerToCard = (employer: Employer) => {
    const provinceName = employer.province?.name || "";
    const districtName = employer.district?.name || "";
    const location = [provinceName, districtName].filter(Boolean).join(", ");

    // Fallback images from public URLs
    const defaultAvatar =
      "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg";
    const defaultBackground =
      "https://marketplace.canva.com/EAGZ0XPzFoE/1/0/1600w/canva-blue-and-white-line-modern-corporate-business-banner-Cvux46kBPZ8.jpg";

    return {
      id: employer.id,
      name: employer.companyName,
      logo: employer.avatarUrl || defaultAvatar,
      coverImage: employer.backgroundUrl || defaultBackground,
      openJobs: 0, // API might not return this
      location: location || "N/A",
      description: employer.aboutCompany || "",
      featured: employer.status === "ACTIVE",
    };
  };

  const mappedEmployers = employers.map(mapEmployerToCard);

  // Auto-apply handlers
  const handleProvinceChange = (value: string) => {
    setAppliedProvinceId(value === "all" ? null : Number(value));
    setCurrentPage(1);
  };

  const handleCompanySizeChange = (value: string) => {
    setAppliedCompanySize(value === "all" ? "" : value);
    setCurrentPage(1);
  };

  const handleSortFieldChange = (field: string) => {
    // Auto-set direction based on field type
    let direction: "asc" | "desc" = "desc";
    if (field === "createdAt" || field === "updatedAt") {
      direction = "desc"; // Mới nhất/Mới cập nhật = desc
    } else {
      // Keep current direction for other fields, or default to desc
      direction = appliedSorts[0]?.direction || "desc";
    }
    setAppliedSorts([{ field, direction }]);
    setCurrentPage(1);
  };

  const handleSortOrderChange = (direction: "asc" | "desc") => {
    setAppliedSorts([
      { field: appliedSorts[0]?.field || "createdAt", direction },
    ]);
    setCurrentPage(1);
  };

  // Check if sort order selector should be shown
  const shouldShowSortOrder = () => {
    const currentField = appliedSorts[0]?.field || "createdAt";
    return currentField !== "createdAt" && currentField !== "updatedAt";
  };

  const handleClearFilters = () => {
    setAppliedKeyword("");
    setAppliedProvinceId(null);
    setAppliedCompanySize("");
    setAppliedSorts([{ field: "createdAt", direction: "desc" }]);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-16 w-40 h-40 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full blur-2xl opacity-50 animate-breathe"></div>
        <div className="absolute top-32 right-24 w-28 h-28 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full blur-xl opacity-60 animate-float-gentle"></div>
        <div className="absolute bottom-40 left-1/3 w-36 h-36 bg-gradient-to-r from-teal-200 to-green-200 rounded-full blur-2xl opacity-45 animate-float-gentle-delayed"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full blur-xl opacity-40 animate-breathe"></div>
        <div className="absolute bottom-24 right-16 w-44 h-44 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full blur-3xl opacity-30 animate-float-gentle"></div>
      </div> */}

      {/* Header Section */}
      {/* <div className="bg-gradient-to-r from-white via-emerald-50 to-teal-50 border-b relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-96 h-32 bg-gradient-to-l from-teal-200 via-emerald-100 to-transparent opacity-70"></div>
        <div className="absolute top-0 left-0 w-64 h-24 bg-gradient-to-r from-cyan-100 to-transparent opacity-50"></div>
        <div className="absolute top-8 left-1/3 w-5 h-5 bg-emerald-400 rounded-full opacity-60 animate-float-gentle"></div>
        <div className="absolute top-14 right-1/4 w-3 h-3 bg-teal-400 rounded-full opacity-50 animate-float-gentle-delayed"></div>
        <div className="container mx-auto px-4 py-8 relative z-10">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            {t("employerSearch.findTopEmployers")}
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
            className="text-white drop-shadow-lg"
            style={{
              marginBottom: 0,
              fontWeight: 500,
              lineHeight: "60px",
              fontSize: "40px",
            }}
          >
            {t("employerSearch.heroTitle")}
          </h1>
          <p
            className="text-white mt-4"
            style={{
              color: "#fff",
              fontSize: "18px",
              lineHeight: "28px",
              fontWeight: 400,
              opacity: 0.95,
            }}
          >
            {t("employerSearch.heroDescription")}
          </p>
        </div>
      </div>

      <div className="main-layout relative z-10 pt-20 pb-8">
        {/* Search Bar */}
        <Card className="bg-white shadow-sm border border-gray-200 p-4 mb-8">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Keyword Input */}
              <div className="flex-1 relative">
                <div className="relative">
                  <Input
                    placeholder={t("employerSearch.companyNamePlaceholder")}
                    value={appliedKeyword}
                    onChange={(e) => {
                      setAppliedKeyword(e.target.value);
                      setCurrentPage(1);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setCurrentPage(1);
                      }
                    }}
                    className="pl-10 h-12 text-gray-700 border-gray-200 focus:border-blue-500"
                  />
                  <Search className="absolute left-3 top-3 h-6 w-6 text-gray-400" />
                </div>
              </div>

              {/* Search Button */}
              <Button
                onClick={() => setCurrentPage(1)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Search className="w-5 h-5 mr-2" />
                {t("employerSearch.searchEmployers")}
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm border border-gray-200 p-5 h-fit">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
                  <h2 className="text-base font-semibold text-gray-900">
                    {t("employerSearch.advanceFilter")}
                  </h2>
                  <Button
                    onClick={handleClearFilters}
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm px-2 py-1 h-auto"
                  >
                    {t("employerSearch.reset")}
                  </Button>
                </div>
                <div className="space-y-4">
                  {/* Location Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#1a1f36] text-base">
                      {t("employerSearch.location")}
                    </h3>
                    <Select
                      value={
                        appliedProvinceId ? appliedProvinceId.toString() : "all"
                      }
                      onValueChange={handleProvinceChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("employerSearch.allProvinces")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {t("employerSearch.allProvinces")}
                        </SelectItem>
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
                    <Separator className="my-4" />
                  </div>

                  {/* Company Size Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#1a1f36] text-base">
                      {t("employerSearch.companySize")}
                    </h3>
                    <RadioGroup
                      value={appliedCompanySize || "all"}
                      onValueChange={handleCompanySizeChange}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="size-all" />
                          <Label
                            htmlFor="size-all"
                            className="text-sm text-gray-700 cursor-pointer font-normal"
                          >
                            {t("employerSearch.allSizes")}
                          </Label>
                        </div>
                        {Object.entries(CompanySize).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem value={value} id={`size-${key}`} />
                            <Label
                              htmlFor={`size-${key}`}
                              className="text-sm text-gray-700 cursor-pointer font-normal"
                            >
                              {t(`companySize.${key}`)}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <Separator className="my-4" />
                  </div>

                  {/* Sort Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#1a1f36] text-base">
                      {t("employerSearch.sortBy")}
                    </h3>
                    <Select
                      value={appliedSorts[0]?.field || "createdAt"}
                      onValueChange={handleSortFieldChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("employerSearch.selectSortCriteria")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt">
                          {getSortFieldLabels(t).createdAt}
                        </SelectItem>
                        <SelectItem value="updatedAt">
                          {getSortFieldLabels(t).updatedAt}
                        </SelectItem>
                        <SelectItem value="companyName">
                          {getSortFieldLabels(t).companyName}
                        </SelectItem>
                        <SelectItem value="companySize">
                          {getSortFieldLabels(t).companySize}
                        </SelectItem>
                        <SelectItem value="province.name">
                          {getSortFieldLabels(t)["province.name"]}
                        </SelectItem>
                        <SelectItem value="district.name">
                          {getSortFieldLabels(t)["district.name"]}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {shouldShowSortOrder() && (
                      <Select
                        value={appliedSorts[0]?.direction || "desc"}
                        onValueChange={handleSortOrderChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t("employerSearch.selectOrder")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="desc">
                            {getSortOrderLabels(t).desc}
                          </SelectItem>
                          <SelectItem value="asc">
                            {getSortOrderLabels(t).asc}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    <Separator className="my-4" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6">
            {/* Results Header */}
            <Card className="bg-white shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {!isLoading && (
                    <span className="font-medium">
                      {t("employerSearch.showingEmployers", {
                        count: numberOfElements,
                      })}
                    </span>
                  )}
                </div>
              </div>
            </Card>

            {/* Loading state */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loading variant="spinner" size="lg" />
              </div>
            )}

            {/* Error state */}
            {isError &&
              (() => {
                let errorMessage = t("employerSearch.loadEmployersDataError");
                let fieldErrors: Array<{ fieldName: string; message: string }> =
                  [];

                if (
                  error &&
                  typeof error === "object" &&
                  "response" in error &&
                  error.response &&
                  typeof error.response === "object" &&
                  "data" in error.response &&
                  error.response.data &&
                  typeof error.response.data === "object"
                ) {
                  const errorData = error.response.data as {
                    message?: string;
                    errors?: Array<{ fieldName: string; message: string }>;
                  };
                  errorMessage = errorData.message || errorMessage;
                  if (
                    Array.isArray(errorData.errors) &&
                    errorData.errors.length > 0
                  ) {
                    fieldErrors = errorData.errors;
                  }
                }

                return (
                  <div className="text-center py-12">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                      <p className="text-red-800 font-medium mb-2">
                        {t("employerSearch.loadEmployersError")}
                      </p>
                      <p className="text-red-600 text-sm">{errorMessage}</p>
                      {fieldErrors.length > 0 && (
                        <div className="mt-2 text-left">
                          <ul className="list-disc list-inside text-red-600 text-xs space-y-1">
                            {fieldErrors.map((err, idx) => (
                              <li key={idx}>
                                <span className="font-medium">
                                  {err.fieldName}:
                                </span>{" "}
                                {err.message}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

            {/* Employer Cards */}
            {!isLoading && !isError && (
              <>
                {mappedEmployers.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mappedEmployers.map((employer) => (
                        <EmployerCard key={employer.id} employer={employer} />
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
                      {t("employerSearch.noEmployersFound")}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerSearch;
