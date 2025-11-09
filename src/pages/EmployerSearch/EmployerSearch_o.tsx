import React, { useState } from "react";
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
import { Search, MapPin, Trash2, CircleX } from "lucide-react";
import EmployerCard from "@/components/EmployerCard";
import Pagination from "@/components/Pagination";
import {
  mockEmployerSearchData,
  CompanySize,
  CompanyType,
  FoundedPeriod,
  SortOption,
  formatCompanySize,
  formatCompanyType,
  formatFoundedPeriod,
} from "./employerSearchMockData";

interface EmployerSearchFilters {
  companySize: CompanySize[];
  companyType: CompanyType[];
  foundedPeriod: FoundedPeriod[];
}

const locations = [
  "Ho Chi Minh City",
  "Hanoi",
  "Da Nang",
  "Can Tho",
  "Hai Phong",
  "Hue",
  "Nha Trang",
  "Vung Tau",
  "Bien Hoa",
  "Thu Dau Mot",
];

const EmployerSearch = () => {
  // Search state
  const [searchCompany, setSearchCompany] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // Filters state
  const [filters, setFilters] = useState<EmployerSearchFilters>({
    companySize: [],
    companyType: [],
    foundedPeriod: [],
  });

  // Listing state
  const [sortBy, setSortBy] = useState<SortOption>(SortOption.RECENT);
  const [showCount, setShowCount] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = () => {
    console.log("Searching for:", { searchCompany, searchLocation, filters });
    // Implement search logic here
  };

  const handleApplyFilters = () => {
    console.log("Applying filters:", filters);
    // Implement filter application logic here
  };

  const handleClearFilters = () => {
    setFilters({
      companySize: [],
      companyType: [],
      foundedPeriod: [],
    });
  };

  const handleCheckboxChange = (
    category: keyof Pick<
      EmployerSearchFilters,
      "companySize" | "companyType" | "foundedPeriod"
    >,
    value: string,
    checked: boolean
  ) => {
    const currentValues = filters[category] as string[];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((item) => item !== value);

    setFilters({
      ...filters,
      [category]: newValues,
    });
  };

  const totalPages = Math.ceil(
    mockEmployerSearchData.totalEmployers / parseInt(showCount)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-16 w-40 h-40 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full blur-2xl opacity-50 animate-breathe"></div>
        <div className="absolute top-32 right-24 w-28 h-28 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full blur-xl opacity-60 animate-float-gentle"></div>
        <div className="absolute bottom-40 left-1/3 w-36 h-36 bg-gradient-to-r from-teal-200 to-green-200 rounded-full blur-2xl opacity-45 animate-float-gentle-delayed"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full blur-xl opacity-40 animate-breathe"></div>
        <div className="absolute bottom-24 right-16 w-44 h-44 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full blur-3xl opacity-30 animate-float-gentle"></div>
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-white via-emerald-50 to-teal-50 border-b relative overflow-hidden backdrop-blur-sm">
        {/* Enhanced Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-32 bg-gradient-to-l from-teal-200 via-emerald-100 to-transparent opacity-70">
          <div className="absolute top-4 right-8">
            <CircleX className="w-8 h-8 text-teal-400 animate-pulse" />
          </div>
        </div>
        <div className="absolute top-0 left-0 w-64 h-24 bg-gradient-to-r from-cyan-100 to-transparent opacity-50"></div>

        {/* Floating decorative elements */}
        <div className="absolute top-8 left-1/3 w-5 h-5 bg-emerald-400 rounded-full opacity-60 animate-float-gentle"></div>
        <div className="absolute top-14 right-1/4 w-3 h-3 bg-teal-400 rounded-full opacity-50 animate-float-gentle-delayed"></div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Find Top Employers
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <span className="hover:text-emerald-600 cursor-pointer transition-colors">
              Home
            </span>
            <span>→</span>
            <span className="text-emerald-600 font-medium">Employers List</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Search Bar */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 p-4 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 opacity-50"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Company Input */}
              <div className="flex-1 relative">
                <div className="relative">
                  <Input
                    placeholder="Company name or industry"
                    value={searchCompany}
                    onChange={(e) => setSearchCompany(e.target.value)}
                    className="pl-10 h-12 text-gray-700 border-gray-200 focus:border-blue-500"
                  />
                  <Search className="absolute left-3 top-3 h-6 w-6 text-gray-400" />
                </div>
              </div>

              {/* Location Select */}
              <div className="flex-1 relative">
                <Select
                  value={searchLocation}
                  onValueChange={setSearchLocation}
                >
                  <SelectTrigger className="min-h-12 w-full flex items-center gap-2 text-gray-700 border-gray-200 focus:border-blue-500">
                    <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="all">All locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 h-12 font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
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
                  {/* Company Size Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Company Size
                    </h3>
                    <div className="space-y-2">
                      {mockEmployerSearchData.companySizes.map((size) => (
                        <div key={size} className="flex items-center space-x-2">
                          <Checkbox
                            id={`size-${size}`}
                            checked={filters.companySize.includes(
                              size as CompanySize
                            )}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                "companySize",
                                size,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`size-${size}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {formatCompanySize(size as CompanySize)}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                  </div>

                  {/* Company Type Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Company Type
                    </h3>
                    <div className="space-y-2">
                      {mockEmployerSearchData.companyTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`type-${type}`}
                            checked={filters.companyType.includes(
                              type as CompanyType
                            )}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                "companyType",
                                type,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`type-${type}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {formatCompanyType(type as CompanyType)}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                  </div>

                  {/* Founded Period Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Founded
                    </h3>
                    <div className="space-y-2">
                      {mockEmployerSearchData.foundedPeriods.map((period) => (
                        <div
                          key={period}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`founded-${period}`}
                            checked={filters.foundedPeriod.includes(
                              period as FoundedPeriod
                            )}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                "foundedPeriod",
                                period,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`founded-${period}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {formatFoundedPeriod(period as FoundedPeriod)}
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
                    <span className="font-medium">
                      Showing{" "}
                      {mockEmployerSearchData.totalEmployers.toLocaleString()}{" "}
                      employers found
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">Sort By</span>
                      <Select
                        value={sortBy}
                        onValueChange={(value) =>
                          setSortBy(value as SortOption)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={SortOption.RECENT}>
                            Most Recent
                          </SelectItem>
                          <SelectItem value={SortOption.COMPANY_SIZE}>
                            Company Size
                          </SelectItem>
                          <SelectItem value={SortOption.JOBS_COUNT}>
                            Number of Jobs
                          </SelectItem>
                          <SelectItem value={SortOption.RATING}>
                            Rating
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">Show</span>
                      <Select value={showCount} onValueChange={setShowCount}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Employer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockEmployerSearchData.employers.map((employer) => (
                <EmployerCard key={employer.id} employer={employer} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerSearch;
