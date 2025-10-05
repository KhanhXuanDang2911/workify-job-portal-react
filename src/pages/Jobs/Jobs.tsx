import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ChevronDown, MoreHorizontal, Edit, Eye, CheckCircle, Clock, XCircle, AlertCircle, Download, Plus, RotateCcw, MapPin, Briefcase, Folder } from "lucide-react";
import { mockJobs, statusOptions, type Job, type JobStatus } from "./JobsMockData";
import BaseModal from "@/components/BaseModal";
import Pagination from "@/components/Pagination";

const categoryOptions = ["Accounting / Audit", "Chemical / Biochemical / Food Science", "Construction", "IT - Software"];

const locationOptions = ["Ha Noi", "Da Nang", "Bac Giang"];

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<JobStatus[]>(["Draft", "Active"]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Export modal state
  const [exportStartDate, setExportStartDate] = useState<Date>(new Date("2025-09-20"));
  const [exportEndDate, setExportEndDate] = useState<Date>(new Date("2025-09-27"));
  const [exportCategory, setExportCategory] = useState<string>("");
  const [exportStatus, setExportStatus] = useState<string>("");
  const [exportLocation, setExportLocation] = useState<string>("Da Nang");
  const [exportTab, setExportTab] = useState("job-list");

  const handleStatusChange = (status: JobStatus, checked: boolean) => {
    if (checked) {
      setSelectedStatuses([...selectedStatuses, status]);
    } else {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    }
    handleFiltersChange();
  };

  const resetFilters = () => {
    setSelectedStatuses([]);
    setSelectedCategory("");
    setSelectedLocation("");
    setSearchTerm("");
    handleFiltersChange();
  };

  const resetStatusFilter = () => {
    setSelectedStatuses([]);
    handleFiltersChange();
  };

  const getStatusIcon = (status: JobStatus) => {
    switch (status) {
      case "Draft":
        return <Edit className="w-4 h-4" />;
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Active":
        return <CheckCircle className="w-4 h-4" />;
      case "Expired":
        return <XCircle className="w-4 h-4" />;
      case "Inactive":
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Active":
        return "bg-green-100 text-green-800";
      case "Expired":
        return "bg-red-100 text-red-800";
      case "Inactive":
        return "bg-gray-100 text-gray-600";
    }
  };

  const getProgressTooltip = (progress: number, status: JobStatus) => {
    if (progress === 100) {
      return "Your progress: 100%\nYour job is ready to post";
    } else {
      return `Your progress: ${progress}%\nYour job needs more information`;
    }
  };

  const canPostJob = (job: Job) => {
    return job.status === "Draft" && job.progress === 100;
  };

  const handleFiltersChange = () => {
    setCurrentPage(1);
  };

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(job.status);
    const matchesCategory = !selectedCategory || job.category === selectedCategory;
    const matchesLocation = !selectedLocation || job.location === selectedLocation;

    return matchesSearch && matchesStatus && matchesCategory && matchesLocation;
  });

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
                handleFiltersChange();
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
                        key={category}
                        className="flex items-center space-x-2 p-2 hover:bg-sky-200 hover:text-[#1967d2] rounded-xl  cursor-pointer"
                        onClick={() => {
                          setSelectedCategory(category === selectedCategory ? "" : category);
                          handleFiltersChange();
                        }}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 ${selectedCategory === category ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}>
                          {selectedCategory === category && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                        </div>
                        <span className="text-sm">{category}</span>
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
                        key={location}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => {
                          setSelectedLocation(location === selectedLocation ? "" : location);
                          handleFiltersChange();
                        }}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 ${selectedLocation === location ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}>
                          {selectedLocation === location && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                        </div>
                        <span className="text-sm">{location}</span>
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
                            <SelectItem key={category} value={category} className="focus:bg-sky-200 focus:text-[#1967d2]">
                              {category}
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
                          <SelectItem key={location} value={location} className="focus:bg-sky-200 focus:text-[#1967d2]">
                            {location}
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
                <TableHead className="w-24">Members</TableHead>
                <TableHead className="w-24">Applications</TableHead>
                <TableHead className="w-24">Views</TableHead>
                <TableHead className="w-24 hidden md:table-cell">Display type</TableHead>
                <TableHead className="w-24 hidden lg:table-cell">Refresh</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentJobs.map((job) => (
                <TableRow key={job.id} className="hover:bg-gray-100 ">
                  <TableCell>
                    <Badge className={`${getStatusColor(job.status)} p-2 border-0`}>{job.status.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900 truncate max-w-xs">{job.title}</h3>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center">
                              {job.progress === 100 ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-yellow-600" />}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 text-white p-2 rounded text-xs whitespace-pre-line">{getProgressTooltip(job.progress, job.status)}</TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="text-sm text-gray-500">
                        60 days | {job.createdDate} - {job.endDate}
                      </div>
                      {/* <div className="flex items-center text-sm text-gray-500">
                        <span>Created by</span>
                        <div className="w-6 h-6 bg-gray-300 rounded-full ml-2"></div>
                      </div> */}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 font-medium">{job.applications}</span>
                      <Eye className="w-4 h-4 text-gray-400" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <span className="font-medium">{job.applications}</span>
                      <Folder className="w-8 h-8 text-gray-400" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{job.views}</span>
                      <Eye className="w-4 h-4 text-gray-400" />
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-gray-600">{job.displayType}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm text-gray-500">{job.createdDate}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hidden sm:flex">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="sm:hidden">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={!canPostJob(job)}
                            className={`${canPostJob(job) ? "" : "opacity-50 cursor-not-allowed "} focus:bg-sky-200 focus:text-[#1967d2] hover:bg-sky-200 hover:text-[#1967d2]`}
                          >
                            Post this job
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-sky-200 focus:text-[#1967d2]">Copy</DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-sky-200 focus:text-[#1967d2]">Set Inactive</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:bg-sky-200 ">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
                  setRowsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
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
