import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import IndustrySheet from "@/pages/Admin/CategoryJobs/IndustrySheet";
import Pagination from "@/components/Pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RowsPerPageOptions, type RowsPerPage } from "@/constants";
import type { Industry } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { industryService } from "@/services";
import { toast } from "react-toastify";
import type { With } from "@/types/common";
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
import { cn } from "@/lib/utils";
import CreateIndustryModal from "@/pages/Admin/CategoryJobs/CreateIndustryModal";
import { Badge } from "@/components/ui/badge";
import SortButton from "@/components/SortButton";

type SortField = "name" | "engName" | "createdAt" | "updatedAt";
type SortDirection = "asc" | "desc";

export default function IndustriesTable({ categoryJobId }: { categoryJobId: number }) {
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState<RowsPerPage>(10);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [selectedIndustry, setSelectedIndustry] = useState<With<Industry, { categoryJobId: number }> | null>(null);

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [deleteIndustryId, setDeleteIndustryId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { data: industriesData, isLoading } = useQuery({
    queryKey: ["industries", categoryJobId, pageNumber, pageSize, keyword, sortField, sortDirection],
    queryFn: async () => {
      const res = await industryService.getIndustries(pageNumber, pageSize, sortField, sortDirection, keyword || undefined);
      return res.data;
    },
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => industryService.deleteIndustry(id),
    onSuccess: () => {
      toast.success("Delete successful");
      setDeleteIndustryId(null);
      queryClient.invalidateQueries({ queryKey: ["industries", categoryJobId, pageNumber, pageSize, keyword, sortField, sortDirection] });
    },
    onError: () => {
      toast.error("Delete failed");
    },
  });

  const industries = industriesData?.items || [];
  const totalPages = industriesData?.totalPages || 0;
  const totalIndustries = industriesData?.numberOfElements || 0;

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
      setSelectedIds(industries?.map((item) => item.id) || []);
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

  const handleEdit = (industry: With<Industry, { categoryJobId: number }>) => {
    setSelectedIndustry(industry);
    setIsSheetOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div
          className="flex items-center gap-2 px-8 py-2 bg-teal-500 text-white w-fit"
          style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)" }}
        >
          <span className="font-semibold">Industries</span>
        </div>

        <div className="">
          <CreateIndustryModal categoryJobId={categoryJobId} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 flex gap-2">
          <Input
            type="text"
            placeholder="Search by name or eng name, created at, updated at..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 focus-visible:border-none bg-white focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
          <Button variant="secondary" className="bg-gray-800 text-white hover:bg-gray-900">
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
            <tr className="bg-gray-100 border-b text-sm border-gray-200 ">
              <th className="px-4 py-3 text-left">
                <Checkbox checked={selectedIds.length === industries.length && industries.length > 0} onCheckedChange={handleSelectAll} />
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span>Name</span>
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
                  <span>Created At</span>
                  <SortButton isActive={sortField === "createdAt"} direction={sortDirection} onClick={() => handleSort("createdAt")} />
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span>Updated At</span>
                  <SortButton isActive={sortField === "updatedAt"} direction={sortDirection} onClick={() => handleSort("updatedAt")} />
                </div>
              </th>
              <th className="px-4 py-3 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-muted-foreground italic">
                  Loading...
                </td>
              </tr>
            ) : industries.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-muted-foreground">
                  <img src="/empty-folder.png" alt="Empty" className="mx-auto w-20 opacity-70" />
                  <p className="mt-2 text-sm text-gray-500">No industries found</p>
                </td>
              </tr>
            ) : (
              industries.map((industry) => (
                <tr
                  key={industry.id}
                  className={cn("border-b border-gray-200 text-[13px] hover:bg-gray-50 cursor-pointer", selectedIndustry?.id === industry.id && "bg-green-200")}
                  onClick={() => handleEdit({ ...industry, categoryJobId })}
                >
                  <td className="px-4 py-3">
                    <Checkbox
                      onClick={(e) => e.stopPropagation()}
                      checked={selectedIds.includes(industry.id)}
                      onCheckedChange={(checked) => handleSelectOne(industry.id, checked as boolean)}
                    />
                  </td>
                  <td className="px-4 py-3">{industry.name}</td>
                  <td className="px-4 py-3">{industry.engName}</td>
                  <td className="px-4 py-3">{new Date(industry.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{new Date(industry.updatedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteIndustryId(industry.id);
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalIndustries > 0 && (
        <div className="flex flex-col items-center justify-between px-3 md:px-6 py-4 border-t">
          {(() => {
            const minOption = Math.min(...RowsPerPageOptions.map((opt) => Number(opt.value)));
            if (totalIndustries < minOption) return null;

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

      {/* Industry Sheet */}
      {selectedIndustry && (
        <IndustrySheet
          industry={selectedIndustry}
          isOpen={isSheetOpen}
          onClose={() => {
            setIsSheetOpen(false);
            setSelectedIndustry(null);
          }}
          categoryJobId={categoryJobId}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteIndustryId !== null} onOpenChange={() => setDeleteIndustryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this industry. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteIndustryId && handleDelete(deleteIndustryId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
