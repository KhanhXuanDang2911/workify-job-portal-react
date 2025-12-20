import { useCallback, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreVertical, Edit, Trash2 } from "lucide-react";
import { postService } from "@/services/post.service";
import PostCategoryModal from "@/components/PostCategoryModal";
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
import { RowsPerPageOptions, type RowsPerPage } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Pagination from "@/components/Pagination";
import MultiSortButton from "@/components/MultiSortButton";
import { useTranslation } from "@/hooks/useTranslation";

type SortField = "title" | "createdAt" | "updatedAt";
type SortDirection = "asc" | "desc";

export default function PostCategories() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const [pageNumber, setPageNumber] = useState(
    Number(searchParams.get("pageNumber")) || 1
  );
  const [pageSize, setPageSize] = useState<RowsPerPage>(
    (Number(searchParams.get("pageSize")) as RowsPerPage) || 10
  );
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [searchInput, setSearchInput] = useState(
    searchParams.get("keyword") || ""
  );
  const [sorts, setSorts] = useState<
    { field: SortField; direction: SortDirection }[]
  >(() => {
    const sortsParam = searchParams.get("sorts");
    if (!sortsParam) return [];
    return sortsParam.split(",").map((s) => {
      const [field, direction] = s.split(":");
      return {
        field: field as SortField,
        direction: direction as SortDirection,
      };
    });
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const sortsString = sorts.map((s) => `${s.field}:${s.direction}`).join(",");

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("pageNumber", String(pageNumber));
    params.set("pageSize", String(pageSize));
    if (keyword) params.set("keyword", keyword);
    if (sorts.length > 0) {
      params.set(
        "sorts",
        sorts.map((s) => `${s.field}:${s.direction}`).join(",")
      );
    }
    setSearchParams(params, { replace: true });
  }, [pageNumber, pageSize, keyword, sorts, setSearchParams]);

  const { data: postCategoriesData, isLoading: isLoadingPostCategoriesData } =
    useQuery({
      queryKey: ["post-categories", pageNumber, pageSize, keyword, sortsString],
      queryFn: () =>
        postService.getCategories({
          pageNumber,
          pageSize,
          keyword: keyword || undefined,
          sorts: sortsString || undefined,
        }),
    });

  const deleteMutation = useMutation({
    mutationFn: postService.deleteCategory,
    onSuccess: () => {
      toast.success(t("toast.success.categoryDeleted"));
      queryClient.invalidateQueries({
        queryKey: [
          "post-categories",
          pageNumber,
          pageSize,
          keyword,
          sortsString,
        ],
      });
      setDeleteDialogOpen(false);
      setDeletingId(null);
    },
    onError: () => {
      toast.error(t("toast.error.deleteCategoryFailed"));
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

  const handleSearch = () => {
    setKeyword(searchInput);
    setPageNumber(1);
  };

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const postCategories = postCategoriesData?.data.items || [];
  const totalPages = postCategoriesData?.data.totalPages || 0;
  const totalPostCategories = postCategoriesData?.data.numberOfElements || 0;

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) deleteMutation.mutate(deletingId);
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          {t("admin.postCategoryManagement.title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("admin.postCategoryManagement.description")}
        </p>
      </div>

      {/* Search and Actions */}
      <div className="bg-card rounded-lg border shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t(
                  "admin.postCategoryManagement.searchPlaceholder"
                )}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
              />
            </div>
            <Button
              onClick={handleSearch}
              variant="secondary"
              className="bg-[#4B9D7C] hover:bg-[#4B9D7C]/90 text-white transition-all"
            >
              {t("admin.postCategoryManagement.search")}
            </Button>
          </div>

          {/* Nút mở modal tạo mới */}
          <PostCategoryModal
            trigger={
              <Button className="bg-[#4B9D7C] hover:bg-[#4B9D7C]/90 text-white transition-all ">
                <Plus className="w-4 h-4 mr-2" />
                {t("admin.postCategoryManagement.addNew")}
              </Button>
            }
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full border-collapse text-sm">
          {/* Table Header */}
          <thead>
            <tr className="bg-muted/40 text-left text-gray-700 dark:text-gray-300 border-b">
              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs">
                {t("admin.postCategoryManagement.tableHeaders.title")}
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs">
                <div className="flex items-center gap-2 justify-start">
                  <span>
                    {t("admin.postCategoryManagement.tableHeaders.createdAt")}
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
              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs">
                <div className="flex items-center justify-start gap-2">
                  <span>
                    {t("admin.postCategoryManagement.tableHeaders.updatedAt")}
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
              <th className="px-4 py-3 w-12 text-right"></th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {isLoadingPostCategoriesData ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-10 text-muted-foreground italic"
                >
                  {t("admin.postCategoryManagement.loading")}
                </td>
              </tr>
            ) : postCategories.length === 0 ? (
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
                    {t("admin.postCategoryManagement.noCategoriesFound")}
                  </p>
                </td>
              </tr>
            ) : (
              postCategories.map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-muted/30 border-b last:border-none transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 max-w-[200px] truncate">
                    {category.title}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {new Date(category.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {new Date(category.updatedAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {/* Nút mở modal chỉnh sửa */}
                        <PostCategoryModal
                          trigger={
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="flex items-center"
                            >
                              <Edit className="w-4 h-4 mr-2 text-green-500" />
                              {t("admin.postCategoryManagement.actions.edit")}
                            </DropdownMenuItem>
                          }
                          category={category}
                        />

                        <DropdownMenuItem
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t("admin.postCategoryManagement.actions.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPostCategories > 0 && (
          <div className="flex flex-col items-center justify-between px-3 md:px-6 py-4 border-t">
            {(() => {
              const minOption = Math.min(
                ...RowsPerPageOptions.map((opt) => Number(opt.value))
              );
              if (totalPostCategories < minOption) return null;

              return (
                <div className="flex self-start items-center space-x-2 text-sm text-gray-600">
                  <span>
                    {t("admin.postCategoryManagement.pagination.shows")}
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
                    {t("admin.postCategoryManagement.pagination.rows")}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("admin.postCategoryManagement.deleteDialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.postCategoryManagement.deleteDialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("admin.postCategoryManagement.deleteDialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("admin.postCategoryManagement.deleteDialog.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
