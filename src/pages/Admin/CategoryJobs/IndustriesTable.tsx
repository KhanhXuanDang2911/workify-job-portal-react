import { useCallback, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import IndustrySheet from "@/pages/Admin/CategoryJobs/IndustrySheet";
import Pagination from "@/components/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RowsPerPageOptions, type RowsPerPage } from "@/constants";
import type { Industry } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { industryService } from "@/services";
import { toast } from "react-toastify";
import type { With } from "@/types/common";
import { useTranslation } from "@/hooks/useTranslation";
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
import MultiSortButton from "@/components/MultiSortButton";

type SortField = "name" | "engName" | "createdAt" | "updatedAt";
type SortDirection = "asc" | "desc";

export default function IndustriesTable({
  categoryJobId,
}: {
  categoryJobId: number;
}) {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sorts, setSorts] = useState<
    { field: SortField; direction: SortDirection }[]
  >([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState<RowsPerPage>(10);

  const [selectedIndustry, setSelectedIndustry] = useState<With<
    Industry,
    { categoryJobId: number }
  > | null>(null);

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [deleteIndustryId, setDeleteIndustryId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    setPageNumber(1);
    setKeyword("");
    setSearchInput("");
    setSorts([]);
  }, [categoryJobId]);

  const sortsString = sorts.map((s) => `${s.field}:${s.direction}`).join(",");
  const { data: industriesData, isLoading } = useQuery({
    queryKey: [
      "industries",
      categoryJobId,
      pageNumber,
      pageSize,
      keyword,
      sortsString,
    ],
    queryFn: async () => {
      const res = await industryService.getIndustries({
        pageNumber,
        pageSize,
        keyword: keyword || undefined,
        sorts: sortsString || undefined,
        categoryId: categoryJobId,
      });
      return res.data;
    },
    staleTime: 0,
    placeholderData: (previousData) => previousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => industryService.deleteIndustry(id),
    onSuccess: () => {
      toast.success(t("toast.success.industryDeleted"));
      setDeleteIndustryId(null);
      queryClient.invalidateQueries({
        queryKey: [
          "industries",
          categoryJobId,
          pageNumber,
          pageSize,
          keyword,
          sortsString,
        ],
      });
    },
    onError: () => {
      toast.error(t("toast.error.deleteIndustryFailed"));
    },
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

  const industries = industriesData?.items || [];
  const totalPages = industriesData?.totalPages || 0;
  const totalIndustries = industriesData?.numberOfElements || 0;

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
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)",
          }}
        >
          <span className="font-semibold">
            {t("admin.categoryJobManagement.industries.title")}
          </span>
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
            placeholder={t(
              "admin.categoryJobManagement.industries.searchPlaceholder"
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
            {t("admin.categoryJobManagement.industries.search")}
          </Button>
        </div>
        {keyword && (
          <Button
            variant="outline"
            className="border-[#4B9D7C] hover-border-[#4B9D7C] text-[#4B9D7C] hover:bg-[#4B9D7C]/10 hover:text-[#4B9D7C] transition-all"
            size="sm"
            onClick={ClearFilters}
          >
            {t("admin.jobManagement.clearFilters")}
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b text-sm border-gray-200 ">
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span>
                    {t(
                      "admin.categoryJobManagement.industries.tableHeaders.name"
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
                      "admin.categoryJobManagement.industries.tableHeaders.engName"
                    )}
                  </span>
                  <MultiSortButton
                    direction={
                      sorts.find((s) => s.field === "engName")?.direction ??
                      null
                    }
                    onChange={(newDirection) =>
                      handleSortChange("engName", newDirection)
                    }
                  />
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span>
                    {t(
                      "admin.categoryJobManagement.industries.tableHeaders.createdAt"
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
                      "admin.categoryJobManagement.industries.tableHeaders.updatedAt"
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
              <th className="px-4 py-3 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-10 text-muted-foreground italic"
                >
                  {t("admin.categoryJobManagement.industries.loading")}
                </td>
              </tr>
            ) : industries.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-10 text-muted-foreground"
                >
                  <img
                    src="/empty-folder.png"
                    alt="Empty"
                    className="mx-auto w-20 opacity-70"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {t(
                      "admin.categoryJobManagement.industries.noIndustriesFound"
                    )}
                  </p>
                </td>
              </tr>
            ) : (
              industries.map((industry) => (
                <tr
                  key={industry.id}
                  className={cn(
                    "border-b border-gray-200 text-[13px] hover:bg-gray-50 cursor-pointer",
                    selectedIndustry?.id === industry.id && "bg-green-200"
                  )}
                  onClick={() => handleEdit({ ...industry, categoryJobId })}
                >
                  <td className="px-4 py-3">{industry.name}</td>
                  <td className="px-4 py-3">{industry.engName}</td>
                  <td className="px-4 py-3">
                    {new Date(industry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(industry.updatedAt).toLocaleDateString()}
                  </td>
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
            const minOption = Math.min(
              ...RowsPerPageOptions.map((opt) => Number(opt.value))
            );
            if (totalIndustries < minOption) return null;

            return (
              <div className="flex items-center self-start space-x-2 text-sm text-gray-600">
                <span>
                  {t("admin.categoryJobManagement.industries.pagination.shows")}
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
                  {t("admin.categoryJobManagement.industries.pagination.rows")}
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
      <AlertDialog
        open={deleteIndustryId !== null}
        onOpenChange={() => setDeleteIndustryId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("admin.categoryJobManagement.industries.deleteDialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "admin.categoryJobManagement.industries.deleteDialog.description"
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("admin.categoryJobManagement.industries.deleteDialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteIndustryId && handleDelete(deleteIndustryId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("admin.categoryJobManagement.industries.deleteDialog.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
