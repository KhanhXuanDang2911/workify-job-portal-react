import { useCallback, useEffect, useState, useRef, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Edit,
  Plus,
  RotateCcw,
  XIcon,
  Trash2,
  LocationEdit,
  Users,
} from "lucide-react";
import Pagination from "@/components/Pagination";
import {
  JobLevelLabelEN,
  JobStatusColors,
  JobStatusLabelEN,
  JobTypeLabelEN,
  RowsPerPageOptions,
  SalaryType,
  SalaryTypeLabelEN,
  type RowsPerPage,
} from "@/constants";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { jobService } from "@/services";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
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
import { useTranslation } from "@/hooks/useTranslation";
import { useWebSocket } from "@/context/WebSocket/WebSocketContext";
import { ResponsiveContext } from "@/context/ResponsiveContext";

type SortField =
  | "jobTitle"
  | "status"
  | "expirationDate"
  | "createdAt"
  | "updatedAt";
type SortDirection = "asc" | "desc";

export default function Jobs() {
  const { t } = useTranslation();
  const { device } = useContext(ResponsiveContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { notifications } = useWebSocket();
  const prevNotificationsLengthRef = useRef(0);

  const pageNumber = Number(searchParams.get("pageNumber")) || 1;
  const pageSize = (Number(searchParams.get("pageSize")) || 10) as RowsPerPage;
  const keyword = searchParams.get("keyword") || "";
  const provinceId = searchParams.get("provinceId")
    ? Number(searchParams.get("provinceId"))
    : undefined;
  const industryId = searchParams.get("industryId")
    ? Number(searchParams.get("industryId"))
    : undefined;
  const sortsParam = searchParams.get("sorts") || "";

  const [searchInput, setSearchInput] = useState(keyword);
  const [sorts, setSorts] = useState<
    { field: SortField; direction: SortDirection }[]
  >(() => {
    if (!sortsParam) return [];
    return sortsParam.split(",").map((s) => {
      const [field, direction] = s.split(":");
      return {
        field: field as SortField,
        direction: direction as SortDirection,
      };
    });
  });

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

  const updateURLParams = useCallback(
    (updates: {
      pageNumber?: number;
      pageSize?: number;
      keyword?: string;
      provinceId?: number | null;
      industryId?: number | null;
      sorts?: { field: SortField; direction: SortDirection }[];
    }) => {
      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams);

        const finalPageNumber =
          updates.pageNumber ?? Number(prevParams.get("pageNumber") || 1);
        const finalPageSize =
          updates.pageSize ?? Number(prevParams.get("pageSize") || 10);
        const finalKeyword =
          updates.keyword !== undefined
            ? updates.keyword
            : prevParams.get("keyword") || "";
        const finalProvinceId =
          updates.provinceId !== undefined
            ? updates.provinceId
            : prevParams.get("provinceId")
              ? Number(prevParams.get("provinceId"))
              : null;
        const finalIndustryId =
          updates.industryId !== undefined
            ? updates.industryId
            : prevParams.get("industryId")
              ? Number(prevParams.get("industryId"))
              : null;

        let finalSorts = sorts;
        if (updates.sorts !== undefined) {
          finalSorts = updates.sorts;
        } else if (prevParams.get("sorts")) {
          const sortsParam = prevParams.get("sorts") || "";
          finalSorts = sortsParam.split(",").map((s) => {
            const [field, direction] = s.split(":");
            return {
              field: field as SortField,
              direction: direction as SortDirection,
            };
          });
        }

        if (finalPageNumber !== 1) {
          newParams.set("pageNumber", finalPageNumber.toString());
        } else {
          newParams.delete("pageNumber");
        }

        if (finalPageSize !== 10) {
          newParams.set("pageSize", finalPageSize.toString());
        } else {
          newParams.delete("pageSize");
        }

        if (finalKeyword) {
          newParams.set("keyword", finalKeyword);
        } else {
          newParams.delete("keyword");
        }

        if (finalProvinceId) {
          newParams.set("provinceId", finalProvinceId.toString());
        } else {
          newParams.delete("provinceId");
        }

        if (finalIndustryId) {
          newParams.set("industryId", finalIndustryId.toString());
        } else {
          newParams.delete("industryId");
        }

        if (finalSorts.length > 0) {
          const sortsString = finalSorts
            .map((s) => `${s.field}:${s.direction}`)
            .join(",");
          newParams.set("sorts", sortsString);
        } else {
          newParams.delete("sorts");
        }

        return newParams;
      });
    },
    [sorts, setSearchParams]
  );

  const { data: jobsData, isLoading: isLoadingJobsData } = useQuery({
    queryKey: [
      "my-jobs",
      pageNumber,
      pageSize,
      keyword,
      provinceId,
      industryId,
      sortsString,
    ],
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
    staleTime: 0,
    placeholderData: keepPreviousData,
  });

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
      toast.success(t("employer.jobs.jobDeletedSuccess"));
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
      setDeleteDialogOpen(false);
      setDeletingId(null);
    },
    onError: () => {
      toast.error(t("employer.jobs.jobDeleteError"));
    },
  });

  useEffect(() => {
    setSearchInput(keyword);
  }, [keyword]);

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

  useEffect(() => {
    const isOnJobsPage =
      location.pathname === `${employer_routes.BASE}/${employer_routes.JOBS}`;

    if (!isOnJobsPage) {
      return;
    }

    if (notifications.length > prevNotificationsLengthRef.current) {
      const latestNotification = notifications[0];

      if (latestNotification?.jobId) {
        queryClient.invalidateQueries({
          queryKey: ["my-jobs"],
        });
      }

      prevNotificationsLengthRef.current = notifications.length;
    }
  }, [notifications, location.pathname, queryClient]);

  const handleSortChange = useCallback(
    (field: SortField, newDirection: SortDirection | null) => {
      let newSorts: { field: SortField; direction: SortDirection }[] = [];

      setSorts((prev) => {
        if (newDirection === null) {
          newSorts = prev.filter((s) => s.field !== field);
        } else {
          const existing = prev.find((s) => s.field === field);
          if (existing) {
            newSorts = prev.map((s) =>
              s.field === field ? { ...s, direction: newDirection } : s
            );
          } else {
            newSorts = [...prev, { field, direction: newDirection }];
          }
        }
        return newSorts;
      });

      updateURLParams({ pageNumber: 1, sorts: newSorts });
    },
    [updateURLParams]
  );

  const handlePageChange = (page: number) => {
    updateURLParams({ pageNumber: page });
  };

  const resetFilters = () => {
    setSearchInput("");
    setSorts([]);
    updateURLParams({
      industryId: null,
      provinceId: null,
      keyword: "",
      pageNumber: 1,
      pageSize: 10,
      sorts: [],
    });
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
        <h1 className="text-3xl font-medium p-2 text-center text-[#1967d2]">
          {t("employer.jobs.myJobs", { count: totalMyJobs })}
        </h1>
        <Button
          className="bg-[#1967d2] hover:bg-[#1251a3] text-white w-full sm:w-auto"
          onClick={() =>
            navigate(`${employer_routes.BASE}/${employer_routes.JOB_ADD}`)
          }
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("employer.jobs.postNewJobs")}
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white mx-4 rounded-lg shadow-sm border p-3 md:p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={t("employer.jobs.searchJobs")}
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              className="pl-10 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
            />
          </div>
          <Button
            onClick={() => {
              updateURLParams({ keyword: searchInput, pageNumber: 1 });
            }}
            variant="secondary"
            className="bg-[#4B9D7C] hover:bg-[#4B9D7C]/90 text-white transition-all"
          >
            {t("common.search")}
          </Button>

          {/* Filter buttons - responsive layout */}
          <div className="flex flex-wrap items-center gap-2 lg:gap-4">
            <Select
              value={provinceId ? String(provinceId) : ""}
              onValueChange={(value) => {
                const newProvinceId = Number(value) || null;
                updateURLParams({ provinceId: newProvinceId, pageNumber: 1 });
              }}
            >
              <SelectTrigger className="!text-gray-500 w-64">
                <SelectValue placeholder={t("employer.jobs.selectProvince")} />
              </SelectTrigger>
              <SelectContent className="w-64 p-0">
                <div className="p-4">
                  <div className="relative mb-3">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                      color="#1967d2"
                    />
                    <Input
                      placeholder={t("common.search")}
                      className="pl-10 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] pr-10"
                      value={searchProvince}
                      onChange={(event) => {
                        setSearchProvince(event.target.value);
                        if (event.target.value === "") {
                          setProvincesOptions(provincesData || []);
                          return;
                        }
                        const filtered = provincesData?.filter((option) =>
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
                          setProvincesOptions(provincesData || []);
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
                        {t("employer.jobs.noProvinceFound")}
                      </div>
                    )}
                  </div>
                </div>
              </SelectContent>
            </Select>

            <Select
              value={industryId ? String(industryId) : ""}
              onValueChange={(value) => {
                const newIndustryId = Number(value) || null;
                updateURLParams({ industryId: newIndustryId, pageNumber: 1 });
              }}
            >
              <SelectTrigger className="!text-gray-500 w-64">
                <SelectValue placeholder={t("employer.jobs.selectIndustry")} />
              </SelectTrigger>
              <SelectContent className="w-64 p-0">
                <div className="p-4">
                  <div className="relative mb-3">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                      color="#1967d2"
                    />
                    <Input
                      placeholder={t("common.search")}
                      className="pl-10 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] pr-10"
                      value={searchIndustry}
                      onChange={(event) => {
                        setSearchIndustry(event.target.value);
                        if (event.target.value === "") {
                          setIndustriesOptions(industriesData || []);
                          return;
                        }
                        const filtered = industriesData?.filter((option) =>
                          option.name
                            .toLowerCase()
                            .includes(event.target.value.toLowerCase())
                        );
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
                        {t("employer.jobs.noIndustryFound")}
                      </div>
                    )}
                  </div>
                </div>
              </SelectContent>
            </Select>

            {/* Reset All */}
            <Button
              variant="outline"
              onClick={resetFilters}
              className="text-red-600 hover:text-red-700"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              {t("common.reset")}
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border mx-4 shadow-sm overflow-hidden">
        {device === "desktop" ? (
          <div className="overflow-x-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-teal-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-teal-500">
            <table className="min-w-screen w-full border-collapse text-sm table-fixed">
              {/* Table Header */}
              <thead>
                <tr className="bg-muted/40 text-left text-gray-700 dark:text-gray-300 border-b">
                  <th className="px-4 py-3 w-[280px] font-semibold uppercase tracking-wide text-xs truncate">
                    <div className="flex items-center justify-start gap-2">
                      <span>{t("employer.jobs.table.jobTitle")}</span>
                      <MultiSortButton
                        direction={
                          sorts.find((s) => s.field === "jobTitle")
                            ?.direction ?? null
                        }
                        onChange={(newDirection) =>
                          handleSortChange("jobTitle", newDirection)
                        }
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 w-[100px] font-semibold uppercase tracking-wide text-xs">
                    <div className="flex items-center justify-start gap-2">
                      <span>{t("employer.jobs.table.status")}</span>
                      <MultiSortButton
                        direction={
                          sorts.find((s) => s.field === "status")?.direction ??
                          null
                        }
                        onChange={(newDirection) =>
                          handleSortChange("status", newDirection)
                        }
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 w-[240px] font-semibold uppercase tracking-wide text-xs">
                    {t("employer.jobs.table.location")}
                  </th>
                  <th className="px-4 py-3 w-[130px] font-semibold uppercase tracking-wide text-xs">
                    <div className="flex items-center justify-start gap-2">
                      <span>{t("employer.jobs.table.expirationDate")}</span>
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
                  <th className="px-4 py-3 w-[90px] font-semibold uppercase tracking-wide text-xs">
                    {t("employer.jobs.table.type")}
                  </th>
                  <th className="px-4 py-3 w-[100px] font-semibold uppercase tracking-wide text-xs">
                    {t("employer.jobs.table.level")}
                  </th>
                  <th className="px-4 py-3 w-[150px] font-semibold uppercase tracking-wide text-xs">
                    {t("employer.jobs.table.salary")}
                  </th>
                  <th className="px-4 py-3 w-[130px] font-semibold uppercase tracking-wide text-xs">
                    <div className="flex items-center justify-start gap-2">
                      <span>{t("employer.jobs.table.createdAt")}</span>
                      <MultiSortButton
                        direction={
                          sorts.find((s) => s.field === "createdAt")
                            ?.direction ?? null
                        }
                        onChange={(newDirection) =>
                          handleSortChange("createdAt", newDirection)
                        }
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs w-[130px]">
                    <div className="flex items-center justify-start gap-2">
                      <span>{t("employer.jobs.table.updatedAt")}</span>
                      <MultiSortButton
                        direction={
                          sorts.find((s) => s.field === "updatedAt")
                            ?.direction ?? null
                        }
                        onChange={(newDirection) =>
                          handleSortChange("updatedAt", newDirection)
                        }
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs w-[160px]">
                    {t("employer.jobs.table.contactPerson")}
                  </th>
                  <th className="px-4 py-3 w-[100px] font-semibold uppercase tracking-wide text-xs">
                    {t("employer.jobs.table.phoneNumber")}
                  </th>
                  <th className="px-4 py-3 text-right w-[180px]">
                    {t("employer.jobs.table.action")}
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {isLoadingJobsData ? (
                  <tr>
                    <td
                      colSpan={12}
                      className="text-center py-10 text-muted-foreground italic"
                    >
                      {t("common.loading")}
                    </td>
                  </tr>
                ) : myJobs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={12}
                      className="text-center py-10 text-muted-foreground"
                    >
                      <img
                        src="/empty-folder.png"
                        alt="Empty"
                        className="mx-auto w-20 opacity-70"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        {t("employer.jobs.noJobsFound")}
                      </p>
                    </td>
                  </tr>
                ) : (
                  myJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="hover:bg-muted/30 border-b last:border-none transition-colors"
                    >
                      <td className="px-4 py-3 w-[280px] font-medium  text-gray-900 dark:text-gray-100 truncate">
                        {job.jobTitle}
                      </td>
                      <td className="px-4 py-3 w-[100px]">
                        <Badge
                          variant="outline"
                          className={JobStatusColors[job.status]}
                        >
                          {JobStatusLabelEN[job.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 w-[240px]  truncate">
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
                        {new Date(
                          job.expirationDate as string
                        ).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-4 py-3 w-[90px]">
                        {JobTypeLabelEN[job.jobType]}
                      </td>
                      <td className="px-4 py-3 w-[100px]">
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
                      <td className="px-4 py-3 w-[160px]">
                        {job.contactPerson}
                      </td>
                      <td className="px-4 py-3 w-[160px]">{job.phoneNumber}</td>
                      <td className="px-4 py-3 text-right w-[180px] whitespace-nowrap">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `${employer_routes.BASE}/${employer_routes.APPLICATIONS}/${job.id}`
                              );
                            }}
                            className="bg-blue-500 flex-shrink-0 p-2"
                          >
                            <Users className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditJob(job.id);
                            }}
                            className="bg-green-500 flex-shrink-0 p-2"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(job.id);
                            }}
                            className="bg-red-500 flex-shrink-0 p-2"
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
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-4">
            {isLoadingJobsData ? (
              <div className="text-center py-8">{t("common.loading")}</div>
            ) : myJobs.length === 0 ? (
              <div className="text-center py-8">
                <img
                  src="/empty-folder.png"
                  alt="Empty"
                  className="mx-auto w-20 opacity-70"
                />
                <p className="mt-2 text-sm text-gray-500">
                  {t("employer.jobs.noJobsFound")}
                </p>
              </div>
            ) : (
              myJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold truncate">
                        {job.jobTitle}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <Badge
                          variant="outline"
                          className={JobStatusColors[job.status]}
                        >
                          {JobStatusLabelEN[job.status]}
                        </Badge>
                        <span className="truncate">
                          {job.jobLocations
                            .map(
                              (l) => `${l.district.name}, ${l.province.name}`
                            )
                            .join(" • ")}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        {t("employer.jobs.table.expirationDate")} :{" "}
                        {new Date(
                          job.expirationDate as string
                        ).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {JobTypeLabelEN[job.jobType]} •{" "}
                        {JobLevelLabelEN[job.jobLevel]} •{" "}
                        {job.salaryType === SalaryType.RANGE
                          ? `${job.minSalary}-${job.maxSalary} ${job.salaryUnit}`
                          : job.salaryType === SalaryType.GREATER_THAN
                            ? `> ${job.minSalary} ${job.salaryUnit}`
                            : SalaryTypeLabelEN[job.salaryType]}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-sm text-gray-500">
                        {new Date(job.updatedAt as string).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `${employer_routes.BASE}/${employer_routes.APPLICATIONS}/${job.id}`
                            );
                          }}
                          className="bg-blue-500"
                        >
                          <Users className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditJob(job.id);
                          }}
                          className="bg-green-500"
                        >
                          <Edit className="w-4 h-4" />
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
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {totalMyJobs > 0 && (
          <div className="flex flex-col items-center justify-between px-3 md:px-6 py-4 border-t">
            {(() => {
              const minOption = Math.min(
                ...RowsPerPageOptions.map((opt) => Number(opt.value))
              );
              if (totalMyJobs < minOption) return null;

              return (
                <div className="flex self-start items-center space-x-2 text-sm text-gray-600">
                  <span>Shows:</span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                      updateURLParams({
                        pageSize: Number(value) as RowsPerPage,
                        pageNumber: 1,
                      });
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
            <AlertDialogTitle>
              {t("employer.jobs.deleteConfirmation")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("employer.jobs.deleteConfirmationDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
