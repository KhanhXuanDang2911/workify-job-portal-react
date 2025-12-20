import { useState, useEffect } from "react";
import { PageTitle } from "@/components/PageTitle/PageTitle";
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

const getSortOrderLabels = (
  t: (key: string) => string
): Record<"asc" | "desc", string> => ({
  asc: t("jobSearch.ascending"),
  desc: t("jobSearch.descending"),
});

const EmployerSearch = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const keywordFromUrl = searchParams.get("keyword") || "";
  const provinceIdFromUrl = searchParams.get("provinceId");
  const companySizeFromUrl = searchParams.get("companySize") || "";
  const sortsFromUrl = searchParams.get("sorts") || "createdAt:desc";
  const pageFromUrl = searchParams.get("page");
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

  const [searchInput, setSearchInput] = useState(keywordFromUrl);

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

  const pageSize = 10;

  const buildSortsString = (
    sorts: { field: string; direction: "asc" | "desc" }[]
  ): string => {
    return sorts.map((s) => `${s.field}:${s.direction}`).join(",");
  };

  const sortsString = buildSortsString(appliedSorts);

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

    setSearchInput(keywordParam);
    setAppliedKeyword(keywordParam);
    setAppliedProvinceId(provinceIdParam ? Number(provinceIdParam) : null);
    setAppliedCompanySize(companySizeParam);
    setAppliedSorts(parsedSorts);
    setCurrentPage(pageParam ? Number(pageParam) : 1);
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedKeyword, appliedProvinceId, appliedCompanySize, sortsString]);

  const { data: provincesResponse } = useQuery({
    queryKey: ["provinces"],
    queryFn: () => provinceService.getProvinces(),
    staleTime: 10 * 60 * 1000,
  });

  const provinces: Province[] = provincesResponse?.data || [];

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
    retry: false,
  });

  const employers: Employer[] = Array.isArray(apiResponse?.data?.items)
    ? apiResponse.data.items
    : [];
  const totalPages = apiResponse?.data?.totalPages || 0;
  const numberOfElements = apiResponse?.data?.numberOfElements || 0;

  const mapEmployerToCard = (employer: Employer) => {
    const provinceName = employer.province?.name || "";
    const districtName = employer.district?.name || "";
    const location = [provinceName, districtName].filter(Boolean).join(", ");

    const defaultAvatar =
      "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg";
    const defaultBackground =
      "https://marketplace.canva.com/EAGZ0XPzFoE/1/0/1600w/canva-blue-and-white-line-modern-corporate-business-banner-Cvux46kBPZ8.jpg";

    return {
      id: employer.id,
      name: employer.companyName,
      logo: employer.avatarUrl || defaultAvatar,
      coverImage: employer.backgroundUrl || defaultBackground,
      openJobs: 0,
      location: location || "N/A",
      description: employer.aboutCompany || "",
      featured: employer.status === "ACTIVE",
    };
  };

  const mappedEmployers = employers.map(mapEmployerToCard);

  const handleProvinceChange = (value: string) => {
    setAppliedProvinceId(value === "all" ? null : Number(value));
    setCurrentPage(1);
  };

  const handleCompanySizeChange = (value: string) => {
    setAppliedCompanySize(value === "all" ? "" : value);
    setCurrentPage(1);
  };

  const handleSortFieldChange = (field: string) => {
    let direction: "asc" | "desc" = "desc";
    if (field === "createdAt" || field === "updatedAt") {
      direction = "desc";
    } else {
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

  const shouldShowSortOrder = () => {
    const currentField = appliedSorts[0]?.field || "createdAt";
    return currentField !== "createdAt" && currentField !== "updatedAt";
  };

  const handleSearch = () => {
    setAppliedKeyword(searchInput);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput("");
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
      <PageTitle title={t("pageTitles.employerSearch")} />
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
        <Card className="bg-white shadow-sm border border-gray-200 p-4 mb-8">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="relative">
                  <Input
                    placeholder={t("employerSearch.companyNamePlaceholder")}
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                    }}
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

              <Button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Search className="w-5 h-5 mr-2" />
                {t("employerSearch.searchEmployers")}
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
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

          <div className="lg:col-span-6">
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

            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loading variant="spinner" size="lg" />
              </div>
            )}

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

            {!isLoading && !isError && (
              <>
                {mappedEmployers.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mappedEmployers.map((employer) => (
                        <EmployerCard key={employer.id} employer={employer} />
                      ))}
                    </div>

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
