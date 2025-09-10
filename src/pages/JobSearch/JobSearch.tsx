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
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Cross, Trash2 } from "lucide-react";
import JobCard from "@/components/JobCard";
import Pagination from "@/components/Pagination";
import { mockJobSearchData } from "./jobSearchMockData";
import SuggestedJobs from "@/components/SuggestedJob";

interface JobSearchFilters {
  industry: string;
  level: string[];
  experience: string[];
  salaryMin: number;
  salaryMax: number;
  education: string[];
  jobType: string[];
  datePosted: string[];
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

const JobSearch = () => {
  // Search state
  const [searchPosition, setSearchPosition] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // Filters state
  const [filters, setFilters] = useState<JobSearchFilters>({
    industry: "",
    level: [],
    experience: [],
    salaryMin: 1,
    salaryMax: 100,
    education: [],
    jobType: [],
    datePosted: [],
  });

  // Listing state
  const [sortBy, setSortBy] = useState("recent");
  const [showCount, setShowCount] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = () => {
    console.log("Searching for:", { searchPosition, searchLocation, filters });
    // Implement search logic here
  };

  const handleApplyFilters = () => {
    console.log("Applying filters:", filters);
    // Implement filter application logic here
  };

  const handleClearFilters = () => {
    setFilters({
      industry: "",
      level: [],
      experience: [],
      salaryMin: 1,
      salaryMax: 100,
      education: [],
      jobType: [],
      datePosted: [],
    });
  };

  const handleCheckboxChange = (
    category: keyof Pick<
      JobSearchFilters,
      "level" | "experience" | "education" | "jobType" | "datePosted"
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
    mockJobSearchData.totalJobs / parseInt(showCount)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full blur-xl opacity-60 animate-float-gentle"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-lg opacity-50 animate-float-gentle-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-2xl opacity-40 animate-breathe"></div>
        <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full blur-xl opacity-45 animate-float-gentle"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full blur-2xl opacity-35 animate-breathe"></div>
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-white via-blue-50 to-indigo-50 border-b relative overflow-hidden backdrop-blur-sm">
        {/* Enhanced Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-32 bg-gradient-to-l from-cyan-200 via-blue-100 to-transparent opacity-70">
          <div className="absolute top-4 right-8">
            <Cross className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>
        </div>
        <div className="absolute top-0 left-0 w-64 h-24 bg-gradient-to-r from-purple-100 to-transparent opacity-50"></div>

        {/* Floating decorative elements */}
        <div className="absolute top-6 left-1/4 w-4 h-4 bg-blue-400 rounded-full opacity-60 animate-float-gentle"></div>
        <div className="absolute top-12 right-1/3 w-3 h-3 bg-purple-400 rounded-full opacity-50 animate-float-gentle-delayed"></div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Find Your Dream Job
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">
              Home
            </span>
            <span>→</span>
            <span className="text-blue-600 font-medium">Jobs List</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Search Bar */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 p-4 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-50"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Position Input */}
              <div className="flex-1 relative">
                <div className="relative">
                  <Input
                    placeholder="Job title or position"
                    value={searchPosition}
                    onChange={(e) => setSearchPosition(e.target.value)}
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
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 h-12 font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
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
                  {/* Industry Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Industry
                    </h3>
                    <div className="space-y-2">
                      <Select
                        value={filters.industry}
                        onValueChange={(value) =>
                          setFilters({ ...filters, industry: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All industries</SelectItem>
                          {mockJobSearchData.industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Separator className="my-4" />
                  </div>

                  {/* Level Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Level
                    </h3>
                    <div className="space-y-2">
                      {mockJobSearchData.levels.map((level) => (
                        <div
                          key={level}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`level-${level}`}
                            checked={filters.level.includes(level)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                "level",
                                level,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`level-${level}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {level}
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
                      {mockJobSearchData.experiences.map((experience) => (
                        <div
                          key={experience}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`experience-${experience}`}
                            checked={filters.experience.includes(experience)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                "experience",
                                experience,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`experience-${experience}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {experience}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                  </div>

                  {/* Salary Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Salary (Million VND/month)
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
                              value={filters.salaryMin}
                              onChange={(e) =>
                                setFilters({
                                  ...filters,
                                  salaryMin: Math.max(
                                    1,
                                    parseInt(e.target.value) || 1
                                  ),
                                })
                              }
                              className="text-sm"
                              min="1"
                              max="100"
                              step="1"
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
                              value={filters.salaryMax}
                              onChange={(e) =>
                                setFilters({
                                  ...filters,
                                  salaryMax: Math.max(
                                    1,
                                    parseInt(e.target.value) || 1
                                  ),
                                })
                              }
                              className="text-sm"
                              min="1"
                              max="100"
                              step="1"
                            />
                          </div>
                        </div>
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
                      {mockJobSearchData.educations.map((education) => (
                        <div
                          key={education}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`education-${education}`}
                            checked={filters.education.includes(education)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                "education",
                                education,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`education-${education}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {education}
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
                      {mockJobSearchData.jobTypes.map((jobType) => (
                        <div
                          key={jobType}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`jobType-${jobType}`}
                            checked={filters.jobType.includes(jobType)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                "jobType",
                                jobType,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`jobType-${jobType}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {jobType}
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
                      {mockJobSearchData.datePosted.map((date) => (
                        <div key={date} className="flex items-center space-x-2">
                          <Checkbox
                            id={`date-${date}`}
                            checked={filters.datePosted.includes(date)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                "datePosted",
                                date,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`date-${date}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {date}
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
                      Showing {mockJobSearchData.totalJobs.toLocaleString()}{" "}
                      jobs
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">Sort By</span>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recent">Most Recent</SelectItem>
                          <SelectItem value="salary">Salary</SelectItem>
                          <SelectItem value="relevance">Relevance</SelectItem>
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

            {/* Job Cards */}
            <div className="space-y-4">
              {mockJobSearchData.jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Job Suggestions Sidebar */}
          <div className="lg:col-span-2">
            <SuggestedJobs
              jobs={mockJobSearchData.suggestedJobs}
              onViewAll={() => console.log("View all suggestions")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
