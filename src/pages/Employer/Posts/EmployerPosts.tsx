import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/services";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { employer_routes } from "@/routes/routes.const";
import { useState, useEffect } from "react";
import { showToast } from "@/utils/toast";
import BaseModal from "@/components/BaseModal/BaseModal";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { Badge } from "@/components/ui/badge";
import {
  PostStatus,
  PostStatusLabelVN,
  PostStatusColors,
} from "@/constants/post.constant";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Search } from "lucide-react";
import Pagination from "@/components/Pagination";
import { useTranslation } from "@/hooks/useTranslation";

export default function EmployerPosts() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const [pageNumber, setPageNumber] = useState(
    Number(searchParams.get("pageNumber")) || 1
  );
  const [pageSize] = useState(10);

  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [searchInput, setSearchInput] = useState(
    searchParams.get("keyword") || ""
  );
  const debouncedKeyword = useDebounce(keyword, 400);
  const initialCategory = "all";
  const [categoryFilter, setCategoryFilter] = useState<string>(
    searchParams.get("categoryId") || initialCategory
  );

  const { t } = useTranslation();

  const { data: postsPage, isLoading } = useQuery({
    queryKey: [
      "employer-posts",
      pageNumber,
      pageSize,
      debouncedKeyword,
      categoryFilter,
    ],
    queryFn: () =>
      postService.getEmployerPosts({
        pageNumber,
        pageSize,
        keyword: debouncedKeyword || undefined,
        categoryId:
          categoryFilter === initialCategory
            ? undefined
            : Number(categoryFilter),
      }),
    select: (res) => res.data,
  });

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("pageNumber", String(pageNumber));
    params.set("pageSize", String(pageSize));
    if (keyword) params.set("keyword", keyword);
    if (categoryFilter && categoryFilter !== initialCategory)
      params.set("categoryId", categoryFilter);
    setSearchParams(params, { replace: true });
  }, [pageNumber, pageSize, keyword, categoryFilter, setSearchParams]);

  const data = postsPage;

  const items = data?.items ?? [];

  const [deleteCandidateId, setDeleteCandidateId] = useState<number | null>(
    null
  );

  const deleteMutation = useMutation({
    mutationFn: (id: number) => postService.deletePostAsEmployer(id),
    onSuccess: () => {
      showToast.success("toast.success.postDeleted");
      queryClient.invalidateQueries({ queryKey: ["employer-posts"] });
    },
    onError: () => showToast.error("toast.error.deletePostFailed"),
  });

  const { data: postCategoriesData, isLoading: isLoadingPostCategories } =
    useQuery({
      queryKey: ["post-categories", "all"],
      queryFn: () => postService.getAllCategories(),
      staleTime: 30 * 60 * 1000,
    });

  const postCategories = postCategoriesData?.data || [];

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {t("admin.postManagement.title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("admin.postManagement.description")}
        </p>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex items-center gap-2 flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t("admin.postManagement.searchPlaceholder")}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  (setKeyword(searchInput), setPageNumber(1))
                }
                className="pl-10 flex-1"
              />
              <Button
                onClick={() => {
                  setKeyword(searchInput);
                  setPageNumber(1);
                }}
                variant="secondary"
                className="bg-[#4B9D7C] hover:bg-[#4B9D7C]/90 text-white transition-all"
              >
                <Search className="w-4 h-4 mr-2" />
                {t("admin.postManagement.search")}
              </Button>
            </div>
          </div>
          <Button
            onClick={() =>
              navigate(`${employer_routes.BASE}/${employer_routes.POST_ADD}`)
            }
            className="bg-[#4B9D7C] hover:bg-[#4B9D7C]/90 text-white transition-all"
          >
            {t("employer.sidebar.createPost")}
          </Button>
        </div>
        {/* Filters (category) */}
        <div className="flex items-center gap-4 mb-4">
          <Select
            value={categoryFilter}
            onValueChange={(value) => {
              setCategoryFilter(value);
              setPageNumber(1);
            }}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={initialCategory}>All categories</SelectItem>
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

          {(keyword || categoryFilter !== initialCategory) && (
            <Button
              variant="outline"
              className="border-[#4B9D7C] hover-border-[#4B9D7C] text-[#4B9D7C] hover:bg-[#4B9D7C]/10 hover:text-[#4B9D7C] transition-all"
              size="sm"
              onClick={() => {
                setKeyword("");
                setCategoryFilter(initialCategory);
                setPageNumber(1);
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/40 text-left text-gray-700 border-b">
                <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs">
                  {t("admin.postManagement.tableHeaders.title")}
                </th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs">
                  {t("admin.postManagement.tableHeaders.category")}
                </th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs">
                  {t("admin.postManagement.tableHeaders.status")}
                </th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs">
                  {t("admin.postManagement.tableHeaders.createdAt")}
                </th>
                <th className="px-4 py-3 w-12 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-muted-foreground italic"
                  >
                    {t("admin.postManagement.loading")}
                  </td>
                </tr>
              ) : items.length === 0 ? (
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
                      {t("admin.postManagement.noPostsFound")}
                    </p>
                  </td>
                </tr>
              ) : (
                items.map((post: any) => (
                  <tr
                    key={post.id}
                    className="hover:bg-muted/30 border-b last:border-none transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[240px] truncate">
                      {post.title}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{post.category?.title}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {/* Colored status badge for quick scanning */}
                      <div className="inline-block">
                        <span
                          className={`px-2 py-1 rounded text-xs ${PostStatusColors[post.status as keyof typeof PostStatus] ?? "bg-gray-200 text-gray-800"}`}
                        >
                          {PostStatusLabelVN[
                            post.status as keyof typeof PostStatus
                          ] ?? post.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString("vi-VN")}
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
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(
                                `${employer_routes.BASE}/${employer_routes.POST_EDIT.replace(":id", String(post.id))}`
                              )
                            }
                          >
                            <Edit className="w-4 h-4 mr-2 text-green-500" />
                            {t("admin.postManagement.actions.edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteCandidateId(post.id)}
                            className="text-red-600"
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

          {/* Pagination */}
          <div className="flex items-center justify-between px-3 md:px-6 py-4 border-t">
            <div />
            <div className="w-full sm:w-auto flex justify-center">
              <Pagination
                currentPage={pageNumber}
                totalPages={data?.totalPages || 0}
                onPageChange={(p) => setPageNumber(p)}
              />
            </div>
          </div>
        </div>
      </div>

      <BaseModal
        title="Confirm delete"
        open={deleteCandidateId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteCandidateId(null);
        }}
        footer={(onClose) => (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteCandidateId) {
                  deleteMutation.mutate(deleteCandidateId);
                }
                onClose();
              }}
            >
              Delete
            </Button>
          </div>
        )}
      >
        {() => (
          <div>
            <p>Are you sure you want to delete this post?</p>
          </div>
        )}
      </BaseModal>
    </div>
  );
}
