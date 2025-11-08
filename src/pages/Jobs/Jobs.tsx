import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Edit, Plus, RotateCcw, XIcon, Trash2, LocationEdit } from "lucide-react";
import Pagination from "@/components/Pagination";
import { JobLevelLabelEN, JobStatusColors, JobStatusLabelEN, JobTypeLabelEN, RowsPerPageOptions, SalaryType, SalaryTypeLabelEN, type RowsPerPage } from "@/constants";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jobService } from "@/services";
import {useNavigate } from "react-router-dom";
import { employer_routes } from "@/routes/routes.const";
import MultiSortButton from "@/components/MultiSortButton";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type SortField = "jobTitle" | "status" | "expirationDate" | "createdAt" | "updatedAt";
type SortDirection = "asc" | "desc";

export default function Jobs() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState<RowsPerPage>(10);
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sorts, setSorts] = useState<{ field: SortField; direction: SortDirection }[]>([]);
  const [provinceId, setProvinceId] = useState<number | undefined>(undefined);
  const [industryId, setIndustryId] = useState<number | undefined>(undefined);

  const [searchProvince, setSearchProvince] = useState("");
  const [searchIndustry, setSearchIndustry] = useState("");

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [provincesOptions, setProvincesOptions] = useState<{ id: number; name: string }[]>([]);
  const [industriesOptions, setIndustriesOptions] = useState<{ id: number; name: string }[]>([]);

  const sortsString = sorts.map((s) => `${s.field}:${s.direction}`).join(",");

  const { data: jobsData, isLoading: isLoadingJobsData } = useQuery({
    queryKey: ["my-jobs", pageNumber, pageSize, keyword, provinceId, industryId, sortsString],
    queryFn: async () => {
      const res = await jobService.getMyJobs({
        pageNumber,
        pageSize,
        keyword: keyword || undefined,
        sorts: sortsString || undefined,
        provinceId,
        industryId,
      });
      return res.data;
    },
    staleTime: 60 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const handlePrefetchJob = (jobId: number) => {
    const timeout = setTimeout(() => {
      queryClient.prefetchQuery({
        queryKey: ["job", jobId],
        queryFn: async () => {
          const res = await jobService.getJobById(jobId);
          return res.data;
        },
        staleTime: 60 * 60 * 1000,
      });
    }, 300);
    return () => clearTimeout(timeout);
  };

  const { data: provincesData } = useQuery({
    queryKey: ["my-current-provinces"],
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

  const deleteJobsMutation = useMutation({
    mutationFn: (id: number) => jobService.deleteJob(id),
    onSuccess: () => {
      toast.success("Job(s) deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
      setDeleteDialogOpen(false);
      setDeletingId(null);
    },
    onError: () => {
      toast.error("An error occurred while deleting the job");
    },
  });

  useEffect(() => {
    if (provincesData && provincesData.length > 0) {
      setProvincesOptions(provincesData);
    }
  }, [provincesData]);

  useEffect(() => {
    if (industriesData && industriesData.length > 0) {
      setIndustriesOptions(industriesData);
    }
  }, [industriesData]);

  const handleSortChange = useCallback((field: SortField, newDirection: SortDirection | null) => {
    setSorts((prev) => {
      if (newDirection === null) {
        return prev.filter((s) => s.field !== field);
      }
      const existing = prev.find((s) => s.field === field);
      if (existing) {
        return prev.map((s) => (s.field === field ? { ...s, direction: newDirection } : s));
      }
      return [...prev, { field, direction: newDirection }];
    });
    setPageNumber(1);
  }, []);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const resetFilters = () => {
    setIndustryId(undefined);
    setProvinceId(undefined);
    setKeyword("");
    setSearchInput("");
    setPageNumber(1);
    setPageSize(10);
    setSorts([]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(jobsData?.items.map((item) => item.id) || []);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleEditJob = (id: number) => {
    navigate(`${employer_routes.BASE}/${employer_routes.JOBS}/${id}/edit`);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteJobsMutation.mutate(deletingId);
    }
  };

  const myJobs = jobsData?.items || [];
  const totalPages = jobsData?.totalPages || 0;
  const totalMyJobs = jobsData?.numberOfElements || 0;

  return (
    <div className=" bg-sky-50 min-h-[calc(100vh-64px)] overflow-y-auto flex-1">
      {/* Header */}
      <div className="bg-white flex flex-col border-b py-3 px-5 border-gray-200 sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <h1 className="text-3xl font-medium p-2 text-center text-[#1967d2]">My Jobs ({totalMyJobs})</h1>
        <Button className="bg-[#1967d2] hover:bg-[#1251a3] text-white w-full sm:w-auto" onClick={() => navigate(`${employer_routes.BASE}/${employer_routes.JOB_ADD}`)}>
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
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              className="pl-10 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
            />
          </div>
          <Button
            onClick={() => {
              setKeyword(searchInput);
              setPageNumber(1);
            }}
            variant="secondary"
            className="bg-[#4B9D7C] hover:bg-[#4B9D7C]/90 text-white transition-all"
          >
            Search
          </Button>

          {/* Filter buttons - responsive layout */}
          <div className="flex flex-wrap items-center gap-2 lg:gap-4">
            <Select value={provinceId ? String(provinceId) : ""} onValueChange={(value) => setProvinceId(Number(value) || undefined)}>
              <SelectTrigger className="!text-gray-500 w-64">
                <SelectValue placeholder="Select Province" />
              </SelectTrigger>
              <SelectContent className="w-64 p-0">
                <div className="p-4">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" color="#1967d2" />
                    <Input
                      placeholder="Search"
                      className="pl-10 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] pr-10"
                      value={searchProvince}
                      onChange={(event) => {
                        setSearchProvince(event.target.value);
                        if (event.target.value === "") {
                          setProvincesOptions(provincesData || []);
                          return;
                        }
                        const filtered = provincesData?.filter((option) => option.name.toLowerCase().includes(event.target.value.toLowerCase()));
                        setProvincesOptions(filtered || []);
                      }}
                    />
                    {searchProvince && (
                      <XIcon
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                        color="#1967d2"
                        onClick={() => {
                          setSearchProvince("");
                          setProvincesOptions(provincesData || []);
                        }}
                      />
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {provincesOptions.length > 0 ? (
                      provincesOptions.map((province) => (
                        <SelectItem key={province.id} value={String(province.id)} className="focus:bg-sky-200 focus:text-[#1967d2]">
                          {province.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">No province found.</div>
                    )}
                  </div>
                </div>
              </SelectContent>
            </Select>

            <Select value={industryId ? String(industryId) : ""} onValueChange={(value) => setIndustryId(Number(value) || undefined)}>
              <SelectTrigger className="!text-gray-500 w-64">
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent className="w-64 p-0">
                <div className="p-4">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" color="#1967d2" />
                    <Input
                      placeholder="Search"
                      className="pl-10 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] pr-10"
                      value={searchIndustry}
                      onChange={(event) => {
                        setSearchIndustry(event.target.value);
                        if (event.target.value === "") {
                          setIndustriesOptions(industriesData || []);
                          return;
                        }
                        const filtered = industriesData?.filter((option) => option.name.toLowerCase().includes(event.target.value.toLowerCase()));
                        setIndustriesOptions(filtered || []);
                      }}
                    />
                    {searchProvince && (
                      <XIcon
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                        color="#1967d2"
                        onClick={() => {
                          setSearchIndustry("");
                          setIndustriesOptions(provincesData || []);
                        }}
                      />
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {industriesOptions.length > 0 ? (
                      industriesOptions.map((industry) => (
                        <SelectItem key={industry.id} value={String(industry.id)} className="focus:bg-sky-200 focus:text-[#1967d2]">
                          {industry.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">No industry found.</div>
                    )}
                  </div>
                </div>
              </SelectContent>
            </Select>

            {/* Reset All */}
            <Button variant="outline" onClick={resetFilters} className="text-red-600 hover:text-red-700">
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className="bg-card rounded-lg border mx-4 shadow-sm overflow-x-auto [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-teal-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-teal-500"
      >
        <table className="min-w-screen w-full border-collapse text-sm table-fixed">
          {/* Table Header */}
          <thead>
            <tr className="bg-muted/40 text-left text-gray-700 dark:text-gray-300 border-b">
              <th className="px-3 w-[20px] py-3">
                <Checkbox checked={selectedIds.length === myJobs.length && myJobs.length > 0} onCheckedChange={handleSelectAll} />
              </th>
              <th className="px-4 py-3 w-[280px] font-semibold uppercase tracking-wide text-xs truncate">
                <div className="flex items-center justify-start gap-2">
                  <span>Job Title</span>
                  <MultiSortButton
                    direction={sorts.find((s) => s.field === "jobTitle")?.direction ?? null}
                    onChange={(newDirection) => handleSortChange("jobTitle", newDirection)}
                  />
                </div>
              </th>
              <th className="px-4 py-3 w-[100px] font-semibold uppercase tracking-wide text-xs">
                <div className="flex items-center justify-start gap-2">
                  <span>Status</span>
                  <MultiSortButton direction={sorts.find((s) => s.field === "status")?.direction ?? null} onChange={(newDirection) => handleSortChange("status", newDirection)} />
                </div>
              </th>
              <th className="px-4 py-3 w-[240px] font-semibold uppercase tracking-wide text-xs">Location</th>
              <th className="px-4 py-3 w-[130px] font-semibold uppercase tracking-wide text-xs">
                <div className="flex items-center justify-start gap-2">
                  <span>Expiration Date</span>
                  <MultiSortButton
                    direction={sorts.find((s) => s.field === "expirationDate")?.direction ?? null}
                    onChange={(newDirection) => handleSortChange("expirationDate", newDirection)}
                  />
                </div>
              </th>
              <th className="px-4 py-3 w-[90px] font-semibold uppercase tracking-wide text-xs">Type</th>
              <th className="px-4 py-3 w-[100px] font-semibold uppercase tracking-wide text-xs">Level</th>
              <th className="px-4 py-3 w-[150px] font-semibold uppercase tracking-wide text-xs">Salary</th>
              <th className="px-4 py-3 w-[130px] font-semibold uppercase tracking-wide text-xs">
                <div className="flex items-center justify-start gap-2">
                  <span>Created At</span>
                  <MultiSortButton
                    direction={sorts.find((s) => s.field === "createdAt")?.direction ?? null}
                    onChange={(newDirection) => handleSortChange("createdAt", newDirection)}
                  />
                </div>
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs w-[130px]">
                <div className="flex items-center justify-start gap-2">
                  <span>Updated At</span>
                  <MultiSortButton
                    direction={sorts.find((s) => s.field === "updatedAt")?.direction ?? null}
                    onChange={(newDirection) => handleSortChange("updatedAt", newDirection)}
                  />
                </div>
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs w-[160px]">Contact Person</th>
              <th className="px-4 py-3 w-[100px] font-semibold uppercase tracking-wide text-xs">Phone Number</th>
              <th className="px-4 py-3 text-right w-[120px]"></th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {isLoadingJobsData ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-muted-foreground italic">
                  Loading...
                </td>
              </tr>
            ) : myJobs.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-muted-foreground">
                  <img src="/empty-folder.png" alt="Empty" className="mx-auto w-20 opacity-70" />
                  <p className="mt-2 text-sm text-gray-500">No jobs found</p>
                </td>
              </tr>
            ) : (
              myJobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-muted/30 border-b last:border-none transition-colors"
                  onClick={() => navigate(`${employer_routes.BASE}/${employer_routes.JOBS}/${job.id}`)}
                  onMouseEnter={() => handlePrefetchJob(job.id)}
                >
                  <td className="px-3 py-3 w-[20px]">
                    <Checkbox
                      checked={selectedIds.includes(job.id)}
                      onCheckedChange={(checked) => handleSelectOne(job.id, checked as boolean)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-4 py-3 w-[280px] font-medium  text-gray-900 dark:text-gray-100 truncate">{job.jobTitle}</td>
                  <td className="px-4 py-3 w-[100px]">
                    <Badge variant="outline" className={JobStatusColors[job.status]}>
                      {JobStatusLabelEN[job.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 w-[240px]  truncate">
                    <ul>
                      {job.jobLocations.map((location) => (
                        <li key={location.id} className="flex items-center gap-1">
                          <LocationEdit size={12} className="flex-shrink-0" strokeWidth={1.8} color="#1967d2" />
                          {location.district.name}, {location.province.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 w-[130px]">{new Date(job.expirationDate as string).toLocaleDateString("vi-VN")}</td>
                  <td className="px-4 py-3 w-[90px]">{JobTypeLabelEN[job.jobType]}</td>
                  <td className="px-4 py-3 w-[100px]">{JobLevelLabelEN[job.jobLevel]}</td>
                  <td className="px-4 py-3 w-[150px]">
                    {job.salaryType === SalaryType.RANGE && `${job.minSalary}-${job.maxSalary} ${job.salaryUnit}`}
                    {job.salaryType === SalaryType.GREATER_THAN && `> ${job.minSalary} ${job.salaryUnit}`}
                    {job.salaryType === SalaryType.NEGOTIABLE && SalaryTypeLabelEN[SalaryType.NEGOTIABLE]}
                    {job.salaryType === SalaryType.COMPETITIVE && SalaryTypeLabelEN[SalaryType.COMPETITIVE]}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 w-[130px]">{new Date(job.createdAt as string).toLocaleDateString("vi-VN")}</td>
                  <td className="px-4 py-3 w-[130px]">{new Date(job.updatedAt as string).toLocaleDateString("vi-VN")}</td>
                  <td className="px-4 py-3 w-[160px]">{job.contactPerson}</td>
                  <td className="px-4 py-3 w-[160px]">{job.phoneNumber}</td>
                  <td className="px-4 py-3 text-right w-[120px]">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditJob(job.id);
                        }}
                        onMouseEnter={() => handlePrefetchJob(job.id)}
                        className="bg-green-500"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(job.id);
                        }}
                        onMouseEnter={() => handlePrefetchJob(job.id)}
                        className="bg-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalMyJobs > 0 && (
          <div className="flex flex-col items-center justify-between px-3 md:px-6 py-4 border-t">
            {(() => {
              const minOption = Math.min(...RowsPerPageOptions.map((opt) => Number(opt.value)));
              if (totalMyJobs < minOption) return null;

              return (
                <div className="flex self-start items-center space-x-2 text-sm text-gray-600">
                  <span>Shows:</span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                      setPageSize(Number(value) as RowsPerPage);
                      setPageNumber(1);
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
              );
            })()}

            <div className="w-full sm:w-auto flex justify-center">
              <Pagination currentPage={pageNumber} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete confirmation</AlertDialogTitle>
            <AlertDialogDescription> Are you sure you want to delete this job? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
