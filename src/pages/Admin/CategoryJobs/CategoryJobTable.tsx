import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RowsPerPageOptions, type RowsPerPage } from "@/constants";
import {
  categoryJobService,
  type CategoryJobResponse,
} from "@/services/categoryJobs.service";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import CreateCategoryJobModal from "@/pages/Admin/CategoryJobs/CreateCategoryJobModal";
import { Badge } from "@/components/ui/badge";
import MultiSortButton from "@/components/MultiSortButton";
import { useTranslation } from "@/hooks/useTranslation";

interface CategoryJobTableProps {
  onSelectJob: (job: CategoryJobResponse) => void;
  selectedCategoryJob: CategoryJobResponse | null;
}

type SortField = "name" | "createdAt" | "updatedAt";
type SortDirection = "asc" | "desc";

export default function CategoryJobTable({
  onSelectJob,
  selectedCategoryJob,
}: CategoryJobTableProps) {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sorts, setSorts] = useState<
    { field: SortField; direction: SortDirection }[]
  >([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState<RowsPerPage>(10);

  const sortsString = sorts.map((s) => `${s.field}:${s.direction}`).join(",");

  const { data: jobCategoriesData, isLoading: isLoadingJobCategoriesData } =
    useQuery({
      queryKey: ["categoryJobs", pageNumber, pageSize, keyword, sortsString],
      queryFn: async () => {
        const res = await categoryJobService.getCategoryJobs({
          pageNumber,
          pageSize,
          sorts: sortsString || undefined,
          keyword: keyword || undefined,
        });
        return res.data;
      },
      refetchOnWindowFocus: false,
      placeholderData: (previousData) => previousData,
    });

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

  const jobCategories = jobCategoriesData?.items || [];
  const totalPages = jobCategoriesData?.totalPages || 0;
  const totalCategories = jobCategoriesData?.numberOfElements || 0;

  const ClearFilters = () => {
    setKeyword("");
    setSearchInput("");
    setPageNumber(1);
  };

  const handleSearch = () => {
    setKeyword(searchInput);
    setPageNumber(1);
  };

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div
          className="flex items-center gap-2 px-8 py-2 bg-teal-500 text-white w-fit"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)",
          }}
        >
          <span className="font-semibold">
            {t("admin.categoryJobManagement.categoryJobs.title")}
          </span>
        </div>

        <div className="">
          <CreateCategoryJobModal />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 flex gap-2">
          <Input
            type="text"
            placeholder={t(
              "admin.categoryJobManagement.categoryJobs.searchPlaceholder"
            )}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 focus-visible:border-none bg-white focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
          <Button
            variant="secondary"
            className="bg-gray-800 text-white hover:bg-gray-900"
            onClick={handleSearch}
          >
            {t("admin.categoryJobManagement.categoryJobs.search")}
          </Button>
        </div>
        {keyword && (
          <Button
            variant="outline"
            className="border-[#4B9D7C] hover-border-[#4B9D7C] text-[#4B9D7C] hover:bg-[#4B9D7C]/10 hover:text-[#4B9D7C] transition-all"
            size="sm"
            onClick={ClearFilters}
          >
            {t("admin.categoryJobManagement.categoryJobs.clearFilters")}
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b text-sm border-gray-200">
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="">
                    {t(
                      "admin.categoryJobManagement.categoryJobs.tableHeaders.name"
                    )}
                  </span>
                  <MultiSortButton
                    direction={
                      sorts.find((s) => s.field === "name")?.direction ?? null
                    }
                    onChange={(newDirection) =>
                      handleSortChange("name", newDirection)
                    }
                  />
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span>
                    {t(
                      "admin.categoryJobManagement.categoryJobs.tableHeaders.engName"
                    )}
                  </span>
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span>
                    {t(
                      "admin.categoryJobManagement.categoryJobs.tableHeaders.createdAt"
                    )}
                  </span>
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
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span>
                    {t(
                      "admin.categoryJobManagement.categoryJobs.tableHeaders.updatedAt"
                    )}
                  </span>
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
            </tr>
          </thead>
          <tbody>
            {isLoadingJobCategoriesData ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-10 text-muted-foreground italic"
                >
                  {t("admin.categoryJobManagement.categoryJobs.loading")}
                </td>
              </tr>
            ) : jobCategories.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-10 text-muted-foreground"
                >
                  <img
                    src="/empty-folder.png"
                    alt="Empty"
                    className="mx-auto w-20 opacity-70"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {t(
                      "admin.categoryJobManagement.categoryJobs.noCategoriesFound"
                    )}
                  </p>
                </td>
              </tr>
            ) : (
              jobCategories.map((category) => (
                <tr
                  key={category.id}
                  onClick={() => onSelectJob(category)}
                  className={cn(
                    "border-b border-gray-200 text-[13px] hover:bg-gray-50 cursor-pointer",
                    category.id === selectedCategoryJob?.id && "bg-green-200"
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-full bg-gray-100">
                      {category.engName}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(category.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(category.updatedAt).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalCategories > 0 && (
        <div className="flex flex-col items-center justify-between px-3 md:px-6 py-4 border-t">
          {(() => {
            const minOption = Math.min(
              ...RowsPerPageOptions.map((opt) => Number(opt.value))
            );
            if (totalCategories < minOption) return null;

            return (
              <div className="flex items-center self-start space-x-2 text-sm text-gray-600">
                <span>
                  {t(
                    "admin.categoryJobManagement.categoryJobs.pagination.shows"
                  )}
                </span>
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
                <span>
                  {t(
                    "admin.categoryJobManagement.categoryJobs.pagination.rows"
                  )}
                </span>
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
  );
}
