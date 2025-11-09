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
import { Search, Trash2 } from "lucide-react";
import EmployerCard from "@/components/EmployerCard";
import Pagination from "@/components/Pagination";
import Loading from "@/components/Loading";
import { useQuery } from "@tanstack/react-query";
import { employerService } from "@/services";
import { provinceService } from "@/services/location.service";
import { CompanySize, CompanySizeLabelVN } from "@/constants/company.constant";
import type { Province } from "@/types/location.type";
import type { Employer } from "@/types/employer.type";

const EmployerSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Read from URL params on mount
  const keywordFromUrl = searchParams.get("keyword") || "";
  const provinceIdFromUrl = searchParams.get("provinceId");
  const companySizeFromUrl = searchParams.get("companySize") || "";
  const sortFieldFromUrl = searchParams.get("sortField") || "createdAt";
  const sortOrderFromUrl = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
  const pageFromUrl = searchParams.get("page");

  // Applied filters (from URL)
  const [appliedKeyword, setAppliedKeyword] = useState(keywordFromUrl);
  const [appliedProvinceId, setAppliedProvinceId] = useState<number | null>(
    provinceIdFromUrl ? Number(provinceIdFromUrl) : null
  );
  const [appliedCompanySize, setAppliedCompanySize] = useState<string>(companySizeFromUrl);
  const [sortField, setSortField] = useState(sortFieldFromUrl);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(sortOrderFromUrl);
  const [currentPage, setCurrentPage] = useState(pageFromUrl ? Number(pageFromUrl) : 1);

  // Temp filters (before applying)
  const [tempKeyword, setTempKeyword] = useState<string>(keywordFromUrl);
  const [tempProvinceId, setTempProvinceId] = useState<string>(
    provinceIdFromUrl || "all"
  );
  const [tempCompanySize, setTempCompanySize] = useState<string>(companySizeFromUrl || "all");

  const pageSize = 4; // Fixed page size

  // Combine sortField and sortOrder
  const sort = `${sortField}:${sortOrder}`;

  // Update URL params when applied filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (appliedKeyword) {
      params.set("keyword", appliedKeyword);
    }
    
    if (appliedProvinceId) {
      params.set("provinceId", appliedProvinceId.toString());
    }
    
    if (appliedCompanySize) {
      params.set("companySize", appliedCompanySize);
    }
    
    if (sortField !== "createdAt") {
      params.set("sortField", sortField);
    }
    
    if (sortOrder !== "desc") {
      params.set("sortOrder", sortOrder);
    }
    
    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }

    setSearchParams(params, { replace: true });
  }, [appliedKeyword, appliedProvinceId, appliedCompanySize, sortField, sortOrder, currentPage, setSearchParams]);

  // Read from URL params when URL changes
  useEffect(() => {
    const keywordParam = searchParams.get("keyword") || "";
    const provinceIdParam = searchParams.get("provinceId");
    const companySizeParam = searchParams.get("companySize") || "";
    const sortFieldParam = searchParams.get("sortField") || "createdAt";
    const sortOrderParam = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
    const pageParam = searchParams.get("page");

    setAppliedKeyword(keywordParam);
    setAppliedProvinceId(provinceIdParam ? Number(provinceIdParam) : null);
    setAppliedCompanySize(companySizeParam);
    setSortField(sortFieldParam);
    setSortOrder(sortOrderParam);
    setCurrentPage(pageParam ? Number(pageParam) : 1);
    
    // Update temp values
    setTempKeyword(keywordParam);
    setTempProvinceId(provinceIdParam || "all");
    setTempCompanySize(companySizeParam || "all");
  }, [searchParams]);

  // Reset to page 1 when applied filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [appliedKeyword, appliedProvinceId, appliedCompanySize, sortField, sortOrder]);

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
    queryKey: ["employers", currentPage, pageSize, sort, appliedKeyword, appliedProvinceId, appliedCompanySize],
    queryFn: () =>
      employerService.searchEmployers({
        pageNumber: currentPage,
        pageSize: pageSize,
        sorts: sort,
        ...(appliedKeyword && { keyword: appliedKeyword }),
        ...(appliedProvinceId && { provinceId: appliedProvinceId }),
        ...(appliedCompanySize && appliedCompanySize !== "all" && { companySize: appliedCompanySize }),
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
    const defaultAvatar = "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg";
    const defaultBackground = "https://marketplace.canva.com/EAGZ0XPzFoE/1/0/1600w/canva-blue-and-white-line-modern-corporate-business-banner-Cvux46kBPZ8.jpg";

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

  const handleApplyFilters = () => {
    setAppliedKeyword(tempKeyword);
    setAppliedProvinceId(tempProvinceId === "all" ? null : Number(tempProvinceId));
    setAppliedCompanySize(tempCompanySize === "all" ? "" : tempCompanySize);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setTempKeyword("");
    setTempProvinceId("all");
    setTempCompanySize("all");
    setAppliedKeyword("");
    setAppliedProvinceId(null);
    setAppliedCompanySize("");
    setSortField("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setAppliedKeyword(tempKeyword);
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
            Find Top Employers
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

      <div className="main-layout relative z-10 pt-20 pb-8">
        {/* Search Bar */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 p-4 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 opacity-50"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Keyword Input */}
              <div className="flex-1 relative">
                <div className="relative">
                  <Input
                    placeholder="Company name or email"
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
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 h-12 font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Employers
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/30 p-6 h-fit relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 opacity-60"></div>
              <div className="relative z-10">
                <div className="space-y-4">
                  {/* Location Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Location
                    </h3>
                    <Select
                      value={tempProvinceId}
                      onValueChange={setTempProvinceId}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All provinces" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All provinces</SelectItem>
                        {provinces.map((province) => (
                          <SelectItem key={province.id} value={province.id.toString()}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Separator className="my-4" />
                  </div>

                  {/* Company Size Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Company Size
                    </h3>
                    <RadioGroup
                      value={tempCompanySize}
                      onValueChange={setTempCompanySize}
                    >
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="size-all" />
                          <Label
                            htmlFor="size-all"
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            All sizes
                          </Label>
                        </div>
                        {Object.entries(CompanySize).map(([key, value]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <RadioGroupItem
                              value={value}
                              id={`size-${key}`}
                          />
                          <Label
                              htmlFor={`size-${key}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                              {CompanySizeLabelVN[key as CompanySize]}
                          </Label>
                        </div>
                      ))}
                    </div>
                    </RadioGroup>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 space-y-3">
                    <Button
                      onClick={handleApplyFilters}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
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
              <div className="absolute inset-0 bg-gradient-to-r from-teal-50/40 to-emerald-50/40 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {!isLoading && (
                      <span className="font-medium">
                        Hiển thị {numberOfElements} nhà tuyển dụng
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">Sort By</span>
                      <Select
                        value={sortField} 
                        onValueChange={(value) => {
                          setSortField(value);
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="companyName">Company Name</SelectItem>
                          <SelectItem value="companySize">Company Size</SelectItem>
                          <SelectItem value="status">Status</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="createdAt">Created At</SelectItem>
                          <SelectItem value="updatedAt">Updated At</SelectItem>
                          <SelectItem value="province.name">Province</SelectItem>
                          <SelectItem value="district.name">District</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">Order</span>
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
                          <SelectItem value="asc">Ascending</SelectItem>
                          <SelectItem value="desc">Descending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
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
            {isError && (() => {
              let errorMessage = "Không thể tải danh sách nhà tuyển dụng. Vui lòng thử lại sau.";
              let fieldErrors: Array<{ fieldName: string; message: string }> = [];

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
                if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
                  fieldErrors = errorData.errors;
                }
              }

              return (
                <div className="text-center py-12">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-red-800 font-medium mb-2">Lỗi khi tải danh sách nhà tuyển dụng</p>
                    <p className="text-red-600 text-sm">{errorMessage}</p>
                    {fieldErrors.length > 0 && (
                      <div className="mt-2 text-left">
                        <ul className="list-disc list-inside text-red-600 text-xs space-y-1">
                          {fieldErrors.map((err, idx) => (
                            <li key={idx}>
                              <span className="font-medium">{err.fieldName}:</span> {err.message}
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
                      Không có nhà tuyển dụng nào
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
