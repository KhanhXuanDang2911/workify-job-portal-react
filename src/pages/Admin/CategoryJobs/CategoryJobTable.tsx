import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import SortButton from "@/components/SortButton/SortButton";
import Pagination from "@/components/Pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RowsPerPageOptions, type RowsPerPage } from "@/constants";
import { categoryJobService, type CategoryJobResponse } from "@/services/categoryJobs.service";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import CreateCategoryJobModal from "@/pages/Admin/CategoryJobs/CreateCategoryJobModal";

interface CategoryJobTableProps {
  onSelectJob: (job: CategoryJobResponse) => void;
  selectedCategoryJob: CategoryJobResponse | null;
}

type SortField = "name" | "engName" | "createdAt" | "updatedAt";
type SortDirection = "asc" | "desc";

export default function CategoryJobTable({ onSelectJob, selectedCategoryJob }: CategoryJobTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<RowsPerPage>(10);

  const { data: categoryJobsData, isLoading: isLoadingCategoryJobs } = useQuery({
    queryKey: ["categoryJobs", currentPage, rowsPerPage, sortField, sortDirection, searchTerm],
    queryFn: async () => {
      const sorts = `${sortField}:${sortDirection}`;
      const res = await categoryJobService.getCategoryJobs({
        pageNumber: currentPage,
        pageSize: rowsPerPage,
        sorts,
        keyword: searchTerm || undefined,
      });
      return res.data;
    },
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });

  const categoryJobs = categoryJobsData?.items || [];
  const totalPages = categoryJobsData?.totalPages || 0;
  const totalJobs = categoryJobsData?.numberOfElements || 0;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value) as RowsPerPage);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-8 py-2 bg-teal-500 text-white w-fit"
          style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)" }}
        >
          <span className="font-semibold">Category Jobs</span>
        </div>
        <div className="flex-1 flex gap-2">
          <Input
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
          <Button variant="secondary" className="bg-gray-800 text-white hover:bg-gray-900" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </div>
        <div className="">
          <CreateCategoryJobModal />
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg">
        <table className="w-full overflow-x-auto">
          <thead>
            <tr className="bg-gray-100 border-b text-sm border-gray-200">
              <th className="px-4 py-3 text-left">
                <Checkbox />
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
                  <SortButton isActive={sortField === "engName"} direction={sortDirection} onClick={() => handleSort("engName")} />
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span>Created Date</span>
                  <SortButton isActive={sortField === "createdAt"} direction={sortDirection} onClick={() => handleSort("createdAt")} />
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span>Update Date</span>
                  <SortButton isActive={sortField === "updatedAt"} direction={sortDirection} onClick={() => handleSort("updatedAt")} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoadingCategoryJobs ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : categoryJobs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Không tìm thấy dữ liệu
                </td>
              </tr>
            ) : (
              categoryJobs.map((job) => (
                <tr
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className={cn("border-b border-gray-200 text-[13px] hover:bg-gray-50 cursor-pointer", job.id === selectedCategoryJob?.id && "bg-green-200")}
                >
                  <td className="px-4 py-3">
                    <Checkbox onClick={(e) => e.stopPropagation()} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{job.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-full bg-gray-100">{job.engName}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(job.createdAt)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(job.updatedAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalJobs > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-3 md:px-6 py-4 border-t gap-4">
          {(() => {
            const minOption = Math.min(...RowsPerPageOptions.map((opt) => Number(opt.value)));
            if (totalJobs < minOption) return null;

            return (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Shows:</span>
                <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
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
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        </div>
      )}
    </div>
  );
}
