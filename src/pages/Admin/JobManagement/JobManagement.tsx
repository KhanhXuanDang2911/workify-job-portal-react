import { useCallback, useEffect, useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Trash2,
  XIcon,
  LocationEdit,
  ScanEye,
  Factory,
} from "lucide-react";
import { admin_routes } from "@/routes/routes.const";
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
import { toast } from "react-toastify";
import {
  JobLevelLabelEN,
  JobStatus,
  JobTypeLabelEN,
  RowsPerPageOptions,
  SalaryType,
  SalaryTypeLabelEN,
  type RowsPerPage,
} from "@/constants";
import Pagination from "@/components/Pagination";
import MultiSortButton from "@/components/MultiSortButton";
import { industryService, jobService, provinceService } from "@/services";
import { JobStatusTooltip } from "@/components/JobStatusTooltip/JobStatusTooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getNameInitials } from "@/utils";

type SortField =
  | "jobTitle"
  | "status"
  | "expirationDate"
  | "createdAt"
  | "updatedAt";
type SortDirection = "asc" | "desc";

export default function JobManagement() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState<RowsPerPage>(10);
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sorts, setSorts] = useState<
    { field: SortField; direction: SortDirection }[]
  >([]);
  const [provinceId, setProvinceId] = useState<number | undefined>(undefined);
  const [industryId, setIndustryId] = useState<number | undefined>(undefined);

  const [searchProvince, setSearchProvince] = useState("");
  const [searchIndustry, setSearchIndustry] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [provincesOptions, setProvincesOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [industriesOptions, setIndustriesOptions] = useState<
    { id: number; name: string }[]
  >([]);

  const sortsString = sorts.map((s) => `${s.field}:${s.direction}`).join(",");

  const { data: jobsData, isLoading: isLoadingJobsData } = useQuery({
    queryKey: [
      "jobs",
      "all",
      pageNumber,
      pageSize,
      keyword,
      provinceId,
      industryId,
      sortsString,
    ],
    queryFn: async () => {
      const res = await jobService.getAllJobs({
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
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const deleteMutation = useMutation({
    mutationFn: jobService.deleteJobAsAdmin,
    onSuccess: () => {
      toast.success("Job deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [
          "jobs",
          "all",
          pageNumber,
          pageSize,
          keyword,
          provinceId,
          industryId,
          sortsString,
        ],
      });
      setDeleteDialogOpen(false);
      setDeletingId(null);
    },
    onError: () => {
      toast.error("An error occurred while deleting the job");
    },
  });

  const updateJobStatusMutation = useMutation({
    mutationFn: ({
      jobId,
      newStatus,
    }: {
      jobId: number;
      newStatus: JobStatus;
    }) => jobService.updateJobStatusAsAdmin(jobId, newStatus),
    onSuccess: () => {
      toast.success("Job status updated successfully");
      queryClient.invalidateQueries({
        queryKey: [
          "jobs",
          "all",
          pageNumber,
          pageSize,
          keyword,
          provinceId,
          industryId,
          sortsString,
        ],
      });
    },
    onError: () => {
      toast.error("An error occurred while updating the job status");
    },
  });

  const handleChangeStatus = useCallback(
    (jobId: number, newStatus: JobStatus) => {
      updateJobStatusMutation.mutate({ jobId, newStatus });
    },
    [updateJobStatusMutation]
  );

  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: async () => {
      const res = await provinceService.getProvinces();
      return res.data;
    },
    select: (data) =>
      data?.map((province: { id: number; name: string }) => ({
        id: province.id,
        name: province.name,
      })),
    staleTime: 60 * 60 * 1000,
  });

  const { data: industries } = useQuery({
    queryKey: ["industries"],
    queryFn: async () => {
      const res = await industryService.getAllIndustries();
      return res.data;
    },
    select: (data) =>
      data?.map((industry: { id: number; name: string }) => ({
        id: industry.id,
        name: industry.name,
      })),
    staleTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    if (provinces && provinces.length > 0) {
      setProvincesOptions(provinces);
    }
  }, [provinces]);

  useEffect(() => {
    if (industries && industries.length > 0) {
      setIndustriesOptions(industries);
    }
  }, [industries]);

  const handleSortChange = useCallback(
    (field: SortField, newDirection: SortDirection | null) => {
      setSorts((prev) => {
        if (newDirection === null) {
          return prev.filter((s) => s.field !== field);
        }
        const existing = prev.find((s) => s.field === field);
        if (existing) {
          return prev.map((s) =>
            s.field === field ? { ...s, direction: newDirection } : s
          );
        }
        return [...prev, { field, direction: newDirection }];
      });

      setPageNumber(1);
    },
    []
  );

  const handleSearch = () => {
    setKeyword(searchInput);
    setPageNumber(1);
  };

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const jobs = jobsData?.items || [];
  const totalPages = jobsData?.totalPages || 0;
  const totalJobs = jobsData?.numberOfElements || 0;

  const ClearFilters = () => {
    setKeyword("");
    setSearchInput("");
    setPageNumber(1);
    setPageSize(10);
    setIndustryId(undefined);
    setProvinceId(undefined);
    setSorts([]);
  };

  const handleView = (id: number) => {
    navigate(`${admin_routes.BASE}/${admin_routes.JOBS}/${id}`);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId);
    }
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Job Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage all jobs in the system
        </p>
      </div>

      {/* Search and Actions */}
      <div className="bg-card rounded-lg border shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 ">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by job title, company name, job description, requirement..."
                value={searchInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchInput(value);
                  if (value === "") {
                    setKeyword("");
                  }
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
              />
            </div>
            <Button
              onClick={handleSearch}
              variant="secondary"
              className="bg-[#4B9D7C] hover:bg-[#4B9D7C]/90 text-white transition-all"
            >
              Search
            </Button>

            <Select
              value={provinceId ? String(provinceId) : ""}
              onValueChange={(value) =>
                setProvinceId(Number(value) || undefined)
              }
            >
              <SelectTrigger className="!text-gray-500 w-64">
                <SelectValue placeholder="Select Province" />
              </SelectTrigger>
              <SelectContent className="w-64 p-0">
                <div className="p-4">
                  <div className="relative mb-3">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                      color="#1967d2"
                    />
                    <Input
                      placeholder="Search"
                      className="pl-10 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] pr-10"
                      value={searchProvince}
                      onChange={(event) => {
                        setSearchProvince(event.target.value);
                        if (event.target.value === "") {
                          setProvincesOptions(provinces || []);
                          return;
                        }
                        const filtered = provinces?.filter((option) =>
                          option.name
                            .toLowerCase()
                            .includes(event.target.value.toLowerCase())
                        );
                        setProvincesOptions(filtered || []);
                      }}
                    />
                    {searchProvince && (
                      <XIcon
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                        color="#1967d2"
                        onClick={() => {
                          setSearchProvince("");
                          setProvincesOptions(provinces || []);
                        }}
                      />
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {provincesOptions.length > 0 ? (
                      provincesOptions.map((province) => (
                        <SelectItem
                          key={province.id}
                          value={String(province.id)}
                          className="focus:bg-sky-200 focus:text-[#1967d2]"
                        >
                          {province.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">
                        No province found.
                      </div>
                    )}
                  </div>
                </div>
              </SelectContent>
            </Select>

            <Select
              value={industryId ? String(industryId) : ""}
              onValueChange={(value) =>
                setIndustryId(Number(value) || undefined)
              }
            >
              <SelectTrigger className="!text-gray-500 w-64">
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent className="w-64 p-0">
                <div className="p-4">
                  <div className="relative mb-3">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                      color="#1967d2"
                    />
                    <Input
                      placeholder="Search"
                      className="pl-10 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] pr-10"
                      value={searchIndustry}
                      onChange={(event) => {
                        setSearchIndustry(event.target.value);
                        if (event.target.value === "") {
                          setIndustriesOptions(industries || []);
                          return;
                        }
                        const filtered = industries?.filter((option) =>
                          option.name
                            .toLowerCase()
                            .includes(event.target.value.toLowerCase())
                        );
                        setIndustriesOptions(filtered || []);
                      }}
                    />
                    {searchIndustry && (
                      <XIcon
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                        color="#1967d2"
                        onClick={() => {
                          setSearchIndustry("");
                          setIndustriesOptions(industries || []);
                        }}
                      />
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {industriesOptions.length > 0 ? (
                      industriesOptions.map((industry) => (
                        <SelectItem
                          key={industry.id}
                          value={String(industry.id)}
                          className="focus:bg-sky-200 focus:text-[#1967d2]"
                        >
                          {industry.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">
                        No province found.
                      </div>
                    )}
                  </div>
                </div>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="border-[#4B9D7C] hover-border-[#4B9D7C] text-[#4B9D7C] hover:bg-[#4B9D7C]/10 hover:text-[#4B9D7C] transition-all"
            size="sm"
            onClick={ClearFilters}
          >
            Clear filters
          </Button>
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
              <th className="px-4 py-3 w-[280px] font-semibold uppercase tracking-wide text-xs truncate">
                <div className="flex items-center justify-start gap-2">
                  <span>Job Title</span>
                  <MultiSortButton
                    direction={
                      sorts.find((s) => s.field === "jobTitle")?.direction ??
                      null
                    }
                    onChange={(newDirection) =>
                      handleSortChange("jobTitle", newDirection)
                    }
                  />
                </div>
              </th>
              <th className="px-4 py-3 w-[100px] font-semibold uppercase tracking-wide text-xs">
                <div className="flex items-center justify-start gap-2">
                  <span>Status</span>
                  <MultiSortButton
                    direction={
                      sorts.find((s) => s.field === "status")?.direction ?? null
                    }
                    onChange={(newDirection) =>
                      handleSortChange("status", newDirection)
                    }
                  />
                </div>
              </th>
              <th className="px-4 py-3 w-[280px] font-semibold uppercase tracking-wide text-xs">
                Location
              </th>
              <th className="px-4 py-3 w-[130px] font-semibold uppercase tracking-wide text-xs">
                <div className="flex items-center justify-start gap-2">
                  <span>Expiration Date</span>
                  <MultiSortButton
                    direction={
                      sorts.find((s) => s.field === "expirationDate")
                        ?.direction ?? null
                    }
                    onChange={(newDirection) =>
                      handleSortChange("expirationDate", newDirection)
                    }
                  />
                </div>
              </th>
              <th className="px-4 py-3 w-[120px] font-semibold uppercase tracking-wide text-xs">
                Type
              </th>
              <th className="px-4 py-3 w-[140px] font-semibold uppercase tracking-wide text-xs">
                Level
              </th>
              <th className="px-4 py-3 w-[150px] font-semibold uppercase tracking-wide text-xs">
                Salary
              </th>
              <th className="px-4 py-3 w-[330px] font-semibold uppercase tracking-wide text-xs">
                Industries
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs w-[160px]">
                Contact Person
              </th>
              <th className="px-4 py-3 w-[100px] font-semibold uppercase tracking-wide text-xs">
                Phone Number
              </th>
              <th className="px-4 py-3 w-[130px] font-semibold uppercase tracking-wide text-xs">
                <div className="flex items-center justify-start gap-2">
                  <span>Created At</span>
                  <MultiSortButton
                    direction={
                      sorts.find((s) => s.field === "createdAt")?.direction ??
                      null
                    }
                    onChange={(newDirection) =>
                      handleSortChange("createdAt", newDirection)
                    }
                  />
                </div>
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs w-[130px]">
                <div className="flex items-center justify-start gap-2">
                  <span>Updated At</span>
                  <MultiSortButton
                    direction={
                      sorts.find((s) => s.field === "updatedAt")?.direction ??
                      null
                    }
                    onChange={(newDirection) =>
                      handleSortChange("updatedAt", newDirection)
                    }
                  />
                </div>
              </th>
              <th className="px-4 py-3 w-[280px] font-semibold uppercase tracking-wide text-xs">
                Author Name
              </th>
              <th className="px-4 py-3 w-[260px] font-semibold uppercase tracking-wide text-xs">
                Author Email
              </th>
              <th className="px-4 py-3 text-right w-[120px]"></th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {isLoadingJobsData ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-10 text-muted-foreground italic"
                >
                  Loading...
                </td>
              </tr>
            ) : jobs.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-10 text-muted-foreground"
                >
                  <img
                    src="/empty-folder.png"
                    alt="Empty"
                    className="mx-auto w-20 opacity-70"
                  />
                  <p className="mt-2 text-sm text-gray-500">No jobs found</p>
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-muted/30 border-b last:border-none transition-colors"
                >
                  <td className="px-4 py-3 w-[280px] font-medium  text-gray-900 dark:text-gray-100 break-words whitespace-normal">
                    {job.jobTitle}
                  </td>
                  <td className="px-4 py-3 w-[100px]">
                    <JobStatusTooltip
                      status={job.status}
                      onChangeStatus={(newStatus) =>
                        handleChangeStatus(job.id, newStatus)
                      }
                    />
                  </td>
                  <td className="px-4 py-3 w-[280px]  truncate">
                    <ul>
                      {job.jobLocations.map((location) => (
                        <li
                          key={location.id}
                          className="flex items-center gap-1"
                        >
                          <LocationEdit
                            size={12}
                            className="flex-shrink-0"
                            strokeWidth={1.8}
                            color="#1967d2"
                          />
                          {location.district.name}, {location.province.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 w-[130px]">
                    {new Date(job.expirationDate as string).toLocaleDateString(
                      "vi-VN"
                    )}
                  </td>
                  <td className="px-4 py-3 w-[120px]">
                    {JobTypeLabelEN[job.jobType]}
                  </td>
                  <td className="px-4 py-3 w-[140px]">
                    {JobLevelLabelEN[job.jobLevel]}
                  </td>
                  <td className="px-4 py-3 w-[150px]">
                    {job.salaryType === SalaryType.RANGE &&
                      `${job.minSalary}-${job.maxSalary} ${job.salaryUnit}`}
                    {job.salaryType === SalaryType.GREATER_THAN &&
                      `> ${job.minSalary} ${job.salaryUnit}`}
                    {job.salaryType === SalaryType.NEGOTIABLE &&
                      SalaryTypeLabelEN[SalaryType.NEGOTIABLE]}
                    {job.salaryType === SalaryType.COMPETITIVE &&
                      SalaryTypeLabelEN[SalaryType.COMPETITIVE]}
                  </td>
                  <td className="px-4 py-3 dark:text-gray-400 w-[330px] truncate">
                    <ol>
                      {job.industries.map((industry) => (
                        <li
                          key={industry.id}
                          className="flex items-center gap-1"
                        >
                          <Factory
                            size={12}
                            className="flex-shrink-0"
                            strokeWidth={1.8}
                            color="#1967d2"
                          />
                          {industry.name}
                        </li>
                      ))}
                    </ol>
                  </td>
                  <td className="px-4 py-3 w-[160px]">{job.contactPerson}</td>
                  <td className="px-4 py-3 w-[160px]">{job.phoneNumber}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 w-[130px]">
                    {new Date(job.createdAt as string).toLocaleDateString(
                      "vi-VN"
                    )}
                  </td>
                  <td className="px-4 py-3 w-[130px]">
                    {new Date(job.updatedAt as string).toLocaleDateString(
                      "vi-VN"
                    )}
                  </td>
                  <td className="px-4 py-3 w-[280px] break-words whitespace-normal">
                    <div className="w-full flex items-center gap-1.5">
                      <Avatar className="w-9 h-9">
                        <AvatarImage
                          src={job.author.avatarUrl || ""}
                          alt={job.author.companyName || "user"}
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
                          {getNameInitials(job.author.companyName)}
                        </AvatarFallback>
                      </Avatar>
                      <p>{job.author.companyName}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 w-[260px] break-words whitespace-normal">
                    {job.author.email}
                  </td>
                  <td className="px-4 py-3 text-right w-[120px]">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(job.id);
                        }}
                        className="bg-green-500"
                      >
                        <ScanEye className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(job.id);
                        }}
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

        {totalJobs > 0 && (
          <div className="flex flex-col items-center justify-between px-3 md:px-6 py-4 border-t">
            {(() => {
              const minOption = Math.min(
                ...RowsPerPageOptions.map((opt) => Number(opt.value))
              );
              if (totalJobs < minOption) return null;

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
                        <SelectItem
                          key={option.value}
                          value={option.value.toString()}
                        >
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
              <Pagination
                currentPage={pageNumber}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              {" "}
              Are you sure you want to delete this job? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
