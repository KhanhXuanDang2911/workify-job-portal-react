import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ChevronDown, MoreHorizontal, Edit, Eye, CheckCircle, AlertCircle, Download, Plus, RotateCcw, MapPin, Briefcase, Folder } from "lucide-react";
import BaseModal from "@/components/BaseModal";
import Pagination from "@/components/Pagination";
import { JobStatus, JobStatusLabelEN, RowsPerPageOptions, type RowsPerPage } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/services";
import type { JobResponse } from "@/types";
import { getStatusColor } from "@/utils/jobStatus.util";
import { useNavigate } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";

export default function Jobs() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [selectedStatuses, setSelectedStatuses] = useState<JobStatus[]>([
    JobStatus.APPROVED,
    JobStatus.PENDING,
    JobStatus.DRAFT,
    JobStatus.EXPIRED,
    JobStatus.REJECTED,
    JobStatus.CLOSED,
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<RowsPerPage>(10);

  // Export modal state
  const [exportStartDate, setExportStartDate] = useState<Date>(new Date("2025-09-20"));
  const [exportEndDate, setExportEndDate] = useState<Date>(new Date("2025-09-27"));
  const [exportCategory, setExportCategory] = useState<string>("");
  const [exportStatus, setExportStatus] = useState<string>("");
  const [exportLocation, setExportLocation] = useState<string>("Da Nang");
  const [exportTab, setExportTab] = useState("job-list");

  const {
    data: jobsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["my-jobs", currentPage, rowsPerPage],
    queryFn: () => jobService.getMyJobs(currentPage, rowsPerPage),
    staleTime: 5 * 60 * 1000,
  });

  const { data: locationsData } = useQuery({
    queryKey: ["my-current-locations"],
    queryFn: async () => {
      const response = await jobService.getMyCurrentLocations();
      return response.data;
    },
    staleTime: 30 * 60 * 1000,
  });

  const { data: industriesData } = useQuery({
    queryKey: ["my-current-industries"],
    queryFn: async () => {
      const response = await jobService.getMyCurrentIndustries();
      return response.data;
    },
    staleTime: 30 * 60 * 1000,
  });

  const locationOptions = useMemo(() => {
    if (locationsData) {
      return locationsData.map((loc: any) => ({
        id: loc.id,
        name: loc.name,
      }));
    }
    return [];
  }, [locationsData]);

  const categoryOptions = useMemo(() => {
    if (industriesData) {
      return industriesData.map((ind: any) => ({
        id: ind.id,
        name: ind.name,
      }));
    }
    return [];
  }, [industriesData]);

  const statusOptions = Object.entries(JobStatusLabelEN).map(([key, label]) => ({
    value: key,
    label,
  }));

  const handleStatusChange = (status: JobStatus, checked: boolean) => {
    if (checked) {
      setSelectedStatuses([...selectedStatuses, status]);
    } else {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    }
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedStatuses([]);
    setSelectedCategory("");
    setSelectedLocation("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const resetStatusFilter = () => {
    setSelectedStatuses([]);
    setCurrentPage(1);
  };

  // const getProgressTooltip = (progress: number, status: JobStatus) => {
  //   if (progress === 100) {
  //     return "Your progress: 100%\nYour job is ready to post";
  //   } else {
  //     return `Your progress: ${progress}%\nYour job needs more information`;
  //   }
  // };

  // const canPostJob = (job: Job) => {
  //   return job.status === "Draft" && job.progress === 100;
  // };

  const filteredJobs = useMemo(() => {
    if (!jobsData?.data?.items) return [];

    return jobsData.data.items.filter((job: JobResponse) => {
      const matchesSearch =
        debouncedSearchTerm.trim() === "" ||
        job.jobTitle.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(job.status);
      const matchesCategory = !selectedCategory || job.industries?.some((ind) => ind.id.toString() === selectedCategory);
      const matchesLocation = !selectedLocation || job.jobLocations?.some((loc) => loc.province.id.toString() === selectedLocation);

      return matchesSearch && matchesStatus && matchesCategory && matchesLocation;
    });
  }, [jobsData, debouncedSearchTerm, selectedStatuses, selectedCategory, selectedLocation]);

  const totalJobs = filteredJobs.length;
  const totalPages = Math.ceil(totalJobs / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  return (
    <div className=" bg-sky-50 min-h-[calc(100vh-64px)] overflow-y-auto flex-1">
      {/* Header */}
      <div className="bg-white flex flex-col border-b py-3 px-5 border-gray-200 sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <h1 className="text-3xl font-medium p-2 text-center text-[#1967d2]">My Jobs ({totalJobs})</h1>
        <Button className="bg-[#1967d2] hover:bg-[#1251a3] text-white w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Post New Jobs
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white mx-4 rounded-lg shadow-sm border p-3 md:p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search jobs"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
            />
          </div>

          {/* Filter buttons - responsive layout */}
          <div className="flex flex-wrap items-center gap-2 lg:gap-4">
            {/* Status Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-between min-w-32 bg-transparent">
                  Status
                  {selectedStatuses.length > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-[#1967d2] text-white">
                      {selectedStatuses.length}
                    </Badge>
                  )}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">Status</span>
                    <Button variant="ghost" size="sm" onClick={resetStatusFilter} className="text-red-600 hover:text-red-700 h-auto p-0">
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {statusOptions.map((status) => (
                      <div key={status.value} className="flex items-center space-x-2 hover:bg-sky-200 hover:text-[#1967d2] rounded-xl p-2">
                        <Checkbox
                          className=" border-gray-300"
                          id={status.value}
                          checked={selectedStatuses.includes(status.value as JobStatus)}
                          onCheckedChange={(checked) => handleStatusChange(status.value as JobStatus, checked as boolean)}
                        />
                        <label htmlFor={status.value} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {status.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Category Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-between min-w-32 bg-transparent">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Category
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <div className="p-4">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Search" className="pl-10 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]" />
                  </div>
                  <div className="space-y-1">
                    {categoryOptions.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center space-x-2 p-2 hover:bg-sky-200 hover:text-[#1967d2] rounded-xl  cursor-pointer"
                        onClick={() => {
                          setSelectedCategory(selectedCategory === category.id.toString() ? "" : category.id.toString());
                          setCurrentPage(1);
                        }}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 ${selectedCategory === category.id.toString() ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}>
                          {selectedCategory === category.id.toString() && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                        </div>
                        <span className="text-sm">{category.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Work Location Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-between min-w-32 bg-transparent">
                  <MapPin className="w-4 h-4 mr-2" />
                  Work location
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0">
                <div className="p-4">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Search" className="pl-10 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]" />
                  </div>
                  <div className="space-y-1">
                    {locationOptions.map((location) => (
                      <div
                        key={location.id}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => {
                          setSelectedLocation(selectedLocation === location.id.toString() ? "" : location.id.toString());
                          setCurrentPage(1);
                        }}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 ${selectedLocation === location.id.toString() ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}>
                          {selectedLocation === location.id.toString() && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                        </div>
                        <span className="text-sm">{location.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Reset All */}
            <Button variant="outline" onClick={resetFilters} className="text-red-600 hover:text-red-700">
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>

            {/* Export Button */}
            <BaseModal
              title="Export My Jobs Report"
              trigger={
                <Button variant="outline" className="border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2]  bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              }
              footer={(onClose) => (
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2] w-28 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button className="bg-[#1967d2] w-28 hover:bg-[#1251a3]">Export report</Button>
                </div>
              )}
              className="!max-w-2xl"
            >
              <div className="space-y-6">
                <p className="text-sm text-gray-600">All data within the selected will be exported</p>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Posted Date</label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="date"
                        value={exportStartDate.toISOString().slice(0, 10)}
                        onChange={(e) => setExportStartDate(new Date(e.target.value))}
                        className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                      />
                      <span>-</span>
                      <Input
                        type="date"
                        value={exportEndDate.toISOString().slice(0, 10)}
                        onChange={(e) => setExportEndDate(new Date(e.target.value))}
                        className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex-1">
                      <label className="text-sm  font-medium text-gray-700 mb-2 block">Job Category</label>
                      <Select value={exportCategory} onValueChange={setExportCategory}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()} className="focus:bg-sky-200 focus:text-[#1967d2]">
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                      <Select value={exportStatus} onValueChange={setExportStatus}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value} className="focus:bg-sky-200 focus:text-[#1967d2]">
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
                    <Select value={exportLocation} onValueChange={setExportLocation}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {locationOptions.map((location) => (
                          <SelectItem key={location.id} value={location.id.toString()} className="focus:bg-sky-200 focus:text-[#1967d2]">
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </BaseModal>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white  mx-4 shadow-sm ">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader className="rounded-tl-lg rounded-tr-lg">
              <TableRow className="bg-[#95b5e1] text-base  hover:bg-[#95b5e1] rounded-tl-lg rounded-tr-lg ">
                <TableHead className="w-16">Status</TableHead>
                <TableHead>Job</TableHead>
                <TableHead className="w-24">Salary</TableHead>
                <TableHead className="w-24">Location</TableHead>
                <TableHead className="w-24 hidden md:table-cell">Type</TableHead>
                <TableHead className="w-24 hidden md:table-cell">Create Date</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentJobs.length > 0 ? (
                currentJobs.map((job: JobResponse) => (
                  <TableRow key={job.id} className="hover:bg-gray-100 hover:cursor-pointer" onClick={() => navigate(`/employer/jobs/${job.id}`)}>
                    <TableCell>
                      <Badge className={`${getStatusColor(job.status)} p-2 border-0`}>{JobStatusLabelEN[job.status as keyof typeof JobStatusLabelEN]}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 truncate max-w-xs">{job.jobTitle}</h3>
                        </div>
                        <div className="text-sm text-gray-500">{job.companyName}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(job.createdAt).toLocaleDateString("vi-VN")} - {new Date(job.expirationDate).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {job.salaryType === "RANGE" ? `${job.minSalary?.toLocaleString()} - ${job.maxSalary?.toLocaleString()} ${job.salaryUnit}` : job.salaryType}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{job.jobLocations?.[0]?.province?.name || "N/A"}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm text-gray-600">{job.jobType}</span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm text-gray-500">{new Date(job.createdAt).toLocaleDateString("vi-VN")}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hidden sm:flex"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/employer/jobs/${job.id}/edit`);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Sửa
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="sm:hidden"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/employer/jobs/${job.id}/edit`);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-sky-200 focus:text-[#1967d2]">Sao chép</DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-sky-200 focus:text-[#1967d2]">Đóng</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:bg-sky-200">Xóa</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-gray-500">Không tìm thấy công việc nào</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalJobs > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-3 md:px-6 py-4 border-t gap-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Shows:</span>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={(value) => {
                  setRowsPerPage(Number(value) as RowsPerPage);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RowsPerPageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>Rows</span>
            </div>

            <div className="w-full sm:w-auto flex justify-center">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
