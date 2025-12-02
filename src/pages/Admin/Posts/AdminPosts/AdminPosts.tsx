import { useCallback, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Star,
  Eye,
} from "lucide-react";
import { postService } from "@/services/post.service";
import {
  PostStatusColors,
  PostStatusLabelEN,
  PostStatus,
} from "@/constants/post.constant";
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
import { RowsPerPageOptions, type RowsPerPage } from "@/constants";
import Pagination from "@/components/Pagination";
import MultiSortButton from "@/components/MultiSortButton";
import { useTranslation } from "@/hooks/useTranslation";

type SortField = "createdAt" | "updatedAt";
type SortDirection = "asc" | "desc";
const initialCategoryFilter: string = "all";

export default function AdminPosts() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const queryClient = useQueryClient();

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
    // default to newest first when no sorts provided
    if (!sortsParam) return [{ field: "createdAt", direction: "desc" }];
    return sortsParam.split(",").map((s) => {
      const [field, direction] = s.split(":");
      return {
        field: field as SortField,
        direction: direction as SortDirection,
      };
    });
  });
  const [categoryFilter, setCategoryFilter] = useState<string>(
    searchParams.get("categoryId") || initialCategoryFilter
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const sortsString = sorts.map((s) => `${s.field}:${s.direction}`).join(",");

  useEffect(() => {
    if (location.state?.refresh) {
      ClearFilters();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Sync state to URL params
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
    if (categoryFilter !== initialCategoryFilter)
      params.set("categoryId", categoryFilter);
    setSearchParams(params, { replace: true });
  }, [pageNumber, pageSize, keyword, sorts, categoryFilter, setSearchParams]);

  const { data: postsData, isLoading: isLoadingPosts } = useQuery({
    queryKey: [
      "posts",
      pageNumber,
      pageSize,
      keyword,
      sortsString,
      categoryFilter,
    ],
    queryFn: () =>
      postService.getPosts({
        pageNumber,
        pageSize,
        keyword: keyword || undefined,
        categoryId:
          categoryFilter === initialCategoryFilter
            ? undefined
            : Number(categoryFilter),
        sorts: sortsString || undefined,
      }),
    staleTime: 0,
    placeholderData: (previousData) => previousData,
  });

  const { data: postCategoriesData, isLoading: isLoadingPostCategories } =
    useQuery({
      queryKey: ["post-categories", initialCategoryFilter],
      queryFn: () => postService.getAllCategories(),
      staleTime: 30 * 60 * 1000, // 30 minutes
    });

  const deleteMutation = useMutation({
    mutationFn: postService.deletePost,
    onSuccess: () => {
      toast.success(t("toast.success.postDeleted"));
      queryClient.invalidateQueries({
        queryKey: [
          "posts",
          pageNumber,
          pageSize,
          keyword,
          sortsString,
          categoryFilter,
        ],
      });
      setDeleteDialogOpen(false);
      setDeletingId(null);
    },
    onError: () => {
      toast.error(t("toast.error.deletePostFailed"));
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      postService.patchPostStatus(id, status),
    onSuccess: () => {
      toast.success(t("toast.success.postStatusUpdated"));
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
    onError: () => {
      toast.error(t("toast.error.updatePostStatusFailed"));
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

  const posts = postsData?.data.items || [];
  const totalPages = postsData?.data.totalPages || 0;
  const totalPosts = postsData?.data.numberOfElements || 0;
  const postCategories = postCategoriesData?.data || [];
  console.log(totalPosts);

  const ClearFilters = () => {
    setKeyword("");
    setSearchInput("");
    setCategoryFilter("all");
    setPageNumber(1);
  };

  const handleView = (id: number) => {
    navigate(`${admin_routes.BASE}/${admin_routes.POSTS}/${id}`);
  };

  const handleAddNew = () => {
    navigate(`${admin_routes.BASE}/${admin_routes.POSTS}/create`);
  };

  const handleEdit = (id: number) => {
    navigate(`${admin_routes.BASE}/${admin_routes.POSTS}/edit/${id}`);
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
        <h1 className="text-3xl font-bold text-foreground">
          {t("admin.postManagement.title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("admin.postManagement.description")}
        </p>
      </div>

      {/* Search and Actions */}
      <div className="bg-card rounded-lg border shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t("admin.postManagement.searchPlaceholder")}
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
              {t("admin.postManagement.search")}
            </Button>
          </div>
          <Button
            onClick={handleAddNew}
            className="bg-[#4B9D7C] hover:bg-[#4B9D7C]/90 text-white transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("admin.postManagement.addNew")}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select
            value={categoryFilter}
            onValueChange={(value) => {
              setCategoryFilter(value);
              setPageNumber(1);
            }}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue
                placeholder={t("admin.postManagement.allCategories")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={initialCategoryFilter}>
                {t("admin.postManagement.allCategories")}
              </SelectItem>
              {isLoadingPostCategories
                ? null
                : postCategories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.title}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>

          {(keyword || categoryFilter !== initialCategoryFilter) && (
            <Button
              variant="outline"
              className="border-[#4B9D7C] hover-border-[#4B9D7C] text-[#4B9D7C] hover:bg-[#4B9D7C]/10 hover:text-[#4B9D7C] transition-all"
              size="sm"
              onClick={ClearFilters}
            >
              {t("admin.postManagement.clearFilters")}
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full border-collapse text-sm">
          {/* Table Header */}
          <thead>
            <tr className="bg-muted/40 text-left text-gray-700 dark:text-gray-300 border-b">
              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs">
                {t("admin.postManagement.tableHeaders.title")}
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs">
                {t("admin.postManagement.tableHeaders.category")}
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs">
                {t("admin.postManagement.tableHeaders.author")}
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs">
                {t("admin.postManagement.tableHeaders.status")}
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs">
                <div className="flex items-center gap-2 justify-start">
                  <span>
                    {t("admin.postManagement.tableHeaders.createdAt")}
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
                    {t("admin.postManagement.tableHeaders.updatedAt")}
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
            {isLoadingPosts ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-10 text-muted-foreground italic"
                >
                  {t("admin.postManagement.loading")}
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-10 text-muted-foreground"
                >
                  <img
                    src="/empty-folder.png"
                    alt="Empty"
                    className="mx-auto w-20 opacity-70"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {t("admin.postManagement.noPostsFound")}
                  </p>
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-muted/30 border-b last:border-none transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 max-w-[200px] truncate">
                    {post.title}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{post.category.title}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {post.userAuthor?.fullName ||
                      post.userAuthor?.email ||
                      post.employerAuthor?.companyName ||
                      post.employerAuthor?.email}
                  </td>
                  <td className="px-4 py-3">
                    <div className="max-w-[200px]">
                      <Select
                        value={post.status}
                        onValueChange={(value) => {
                          if (value && post.id) {
                            updateStatusMutation.mutate({
                              id: post.id,
                              status: value,
                            });
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(PostStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              <div className="flex items-center gap-2">
                                <Badge className={PostStatusColors[status]}>
                                  &nbsp;
                                </Badge>
                                <span>{PostStatusLabelEN[status]}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {new Date(post.updatedAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-muted rounded-full"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => handleView(post.id)}>
                          <Eye className="w-4 h-4 mr-2 text-blue-500" />
                          {t("admin.postManagement.actions.viewDetails")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(post.id)}>
                          <Edit className="w-4 h-4 mr-2 text-green-500" />
                          {t("admin.postManagement.actions.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 focus:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t("admin.postManagement.actions.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPosts > 0 && (
          <div className="flex flex-col items-center justify-between px-3 md:px-6 py-4 border-t">
            {(() => {
              const minOption = Math.min(
                ...RowsPerPageOptions.map((opt) => Number(opt.value))
              );
              if (totalPosts < minOption) return null;

              return (
                <div className="flex self-start items-center space-x-2 text-sm text-gray-600">
                  <span>{t("admin.postManagement.pagination.shows")}</span>
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
                  <span>{t("admin.postManagement.pagination.rows")}</span>
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
              {t("admin.postManagement.deleteDialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.postManagement.deleteDialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("admin.postManagement.deleteDialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("admin.postManagement.deleteDialog.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
