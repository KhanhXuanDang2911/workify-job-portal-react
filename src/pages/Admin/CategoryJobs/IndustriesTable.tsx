import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import SortButton from "@/components/SortButton/SortButton";
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

type SortField = "name" | "engName" | "createdAt" | "updatedAt";
type SortDirection = "asc" | "desc";

export default function IndustriesTable({ categoryJobId }: { categoryJobId: number }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<RowsPerPage>(10);
  const [selectedIndustry, setSelectedIndustry] = useState<With<Industry, { categoryJobId: number }> | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [deleteIndustryId, setDeleteIndustryId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { data: industriesData, isLoading } = useQuery({
    queryKey: ["industries", categoryJobId, currentPage, rowsPerPage, sortField, sortDirection, searchTerm],
    queryFn: async () => {
      const res = await industryService.getIndustries(currentPage, rowsPerPage, sortField, sortDirection, searchTerm || undefined);
      return res.data;
    },
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => industryService.deleteIndustry(id),
    onSuccess: () => {
      toast.success("Xóa thành công");
      setDeleteIndustryId(null);
      queryClient.invalidateQueries({ queryKey: ["industries"] });
    },
    onError: () => {
      toast.error("Xóa thất bại");
    },
  });

  const industries = industriesData?.items || [];
  const totalPages = industriesData?.totalPages || 0;
  const totalIndustries = industriesData?.numberOfElements || 0;

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
      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-2 px-8 py-2 bg-teal-500 text-white w-fit"
          style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)" }}
        >
          <span className="font-semibold">Industries</span>
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
          <Button variant="secondary" className="bg-gray-800 text-white hover:bg-gray-900">
            Tìm kiếm
          </Button>
        </div>
        <div className="">
          <CreateIndustryModal categoryJobId={categoryJobId} />
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg">
        <table className="w-full overflow-x-hidden">
          <thead>
            <tr className="bg-gray-100 border-b text-sm border-gray-200 overflow-x-hidden">
              <th className="px-4 py-3 text-left">
                <Checkbox />
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
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className="border-b border-gray-200 text-[13px] hover:bg-gray-50 cursor-pointer">
                <td colSpan={5} className="px-4 py-3">
                  Loading...
                </td>
              </tr>
            ) : industries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-3">
                  No industries found
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
                    <Checkbox />
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
        <>
          <div className="mt-4">
            <div className="flex items-center gap-2 text-gray-600 text-sm ">
              <span className="text-sm text-muted-foreground">Show:</span>
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
                    <SelectItem key={option.label} value={option.value.toString()}>
                      {option.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>Rows</span>
            </div>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
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
