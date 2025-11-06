import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Pagination from "@/components/Pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RowsPerPageOptions, type RowsPerPage } from "@/constants";
import { categoryJobService, type CategoryJobResponse } from "@/services/categoryJobs.service";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import CreateCategoryJobModal from "@/pages/Admin/CategoryJobs/CreateCategoryJobModal";
import { Badge } from "@/components/ui/badge";
import SortButton from "@/components/SortButton";

interface CategoryJobTableProps {
  onSelectJob: (job: CategoryJobResponse) => void;
  selectedCategoryJob: CategoryJobResponse | null;
}

type SortField = "name" | "createdAt" | "updatedAt";
type SortDirection = "asc" | "desc";

export default function CategoryJobTable({ onSelectJob, selectedCategoryJob }: CategoryJobTableProps) {
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState<RowsPerPage>(10);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data: jobCategoriesData, isLoading: isLoadingJobCategoriesData } = useQuery({
    queryKey: ["categoryJobs", pageNumber, pageSize, keyword, sortField, sortDirection],
    queryFn: async () => {
      const res = await categoryJobService.getCategoryJobs({
        pageNumber,
        pageSize,
        sorts: `${sortField}:${sortDirection}`,
        keyword: keyword || undefined,
      });
      return res.data;
    },
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });

  const jobCategories = jobCategoriesData?.items || [];
  const totalPages = jobCategoriesData?.totalPages || 0;
  const totalCategories = jobCategoriesData?.numberOfElements || 0;

  const ClearFilters = () => {
    setKeyword("");
    setSearchInput("");
    setPageNumber(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPageNumber(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(jobCategories?.map((item) => item.id) || []);
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
          style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)" }}
        >
          <span className="font-semibold">Category Jobs</span>
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
            placeholder="Search by name, updated at, created at..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 focus-visible:border-none bg-white focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
          <Button variant="secondary" className="bg-gray-800 text-white hover:bg-gray-900" onClick={handleSearch}>
            Search
          </Button>
        </div>
        {keyword && (
          <Button
            variant="outline"
            className="border-[#4B9D7C] hover-border-[#4B9D7C] text-[#4B9D7C] hover:bg-[#4B9D7C]/10 hover:text-[#4B9D7C] transition-all"
            size="sm"
            onClick={ClearFilters}
          >
            Clear filters
          </Button>
        )}
      </div>

      {selectedIds.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <Badge variant="secondary">{selectedIds.length} selected</Badge>
          <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-600/10">
            Delete selected
          </Button>
        </div>
      )}
      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b text-sm border-gray-200">
              <th className="px-4 py-3 text-left">
                <Checkbox checked={selectedIds.length === jobCategories.length && jobCategories.length > 0} onCheckedChange={handleSelectAll} />
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="">Name</span>
                  <SortButton isActive={sortField === "name"} direction={sortDirection} onClick={() => handleSort("name")} />
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span>Eng Name</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span>Created At</span>
                  <SortButton isActive={sortField === "createdAt"} direction={sortDirection} onClick={() => handleSort("createdAt")} />
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span>Update At</span>
                  <SortButton isActive={sortField === "updatedAt"} direction={sortDirection} onClick={() => handleSort("updatedAt")} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoadingJobCategoriesData ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-muted-foreground italic">
                  Loading...
                </td>
              </tr>
            ) : jobCategories.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-muted-foreground">
                  <img src="/empty-folder.png" alt="Empty" className="mx-auto w-20 opacity-70" />
                  <p className="mt-2 text-sm text-gray-500">No job categories found</p>
                </td>
              </tr>
            ) : (
              jobCategories.map((category) => (
                <tr
                  key={category.id}
                  onClick={() => onSelectJob(category)}
                  className={cn("border-b border-gray-200 text-[13px] hover:bg-gray-50 cursor-pointer", category.id === selectedCategoryJob?.id && "bg-green-200")}
                >
                  <td className="px-4 py-3">
                    <Checkbox
                      onClick={(e) => e.stopPropagation()}
                      checked={selectedIds.includes(category.id)}
                      onCheckedChange={(checked) => handleSelectOne(category.id, checked as boolean)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-full bg-gray-100">{category.engName}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{new Date(category.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(category.updatedAt).toLocaleDateString("vi-VN")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalCategories > 0 && (
        <div className="flex flex-col items-center justify-between px-3 md:px-6 py-4 border-t">
          {(() => {
            const minOption = Math.min(...RowsPerPageOptions.map((opt) => Number(opt.value)));
            if (totalCategories < minOption) return null;

            return (
              <div className="flex items-center self-start space-x-2 text-sm text-gray-600">
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
  );
}
