import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreVertical, Edit, Trash2, Star } from "lucide-react";
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

export default function PostCategories() {
  const queryClient = useQueryClient();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["post-categories", pageNumber, pageSize, keyword],
    queryFn: () =>
      postService.getCategories({
        pageNumber,
        pageSize,
        keyword: keyword || undefined,
        sorts: "createdAt:desc",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: postService.deleteCategory,
    onSuccess: () => {
      toast.success("Xóa danh mục thành công");
      queryClient.invalidateQueries({ queryKey: ["post-categories"] });
      setDeleteDialogOpen(false);
      setDeletingId(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa danh mục");
    },
  });

  const handleSearch = () => {
    setKeyword(searchInput);
    setPageNumber(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(data?.data.items.map((item) => item.id) || []);
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

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) deleteMutation.mutate(deletingId);
  };

  const categories = data?.data.items || [];
  const totalPages = data?.data.totalPages || 0;

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Quản lý danh mục bài viết</h1>
        <p className="text-muted-foreground mt-1">Quản lý danh mục cho các bài viết</p>
      </div>

      {/* Search and Actions */}
      <div className="bg-card rounded-lg border shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề hoặc mô tả..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
              />
            </div>
            <Button onClick={handleSearch} variant="secondary" className="bg-[#4B9D7C] hover:bg-[#4B9D7C]/90 text-white transition-all">
              Tìm kiếm
            </Button>
          </div>

          {/* Nút mở modal tạo mới */}
          <PostCategoryModal
            trigger={
              <Button className="bg-[#4B9D7C] hover:bg-[#4B9D7C]/90 text-white transition-all ">
                <Plus className="w-4 h-4 mr-2" />
                Thêm mới
              </Button>
            }
          />
        </div>

        {selectedIds.length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="secondary">{selectedIds.length} đã chọn</Badge>
            <Button variant="outline" size="sm" onClick={() => setDeleteDialogOpen(true)} className="text-red-600 border-red-600 hover:bg-red-600/10">
              Xóa mục đã chọn
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">
                <Checkbox checked={selectedIds.length === categories.length && categories.length > 0} onCheckedChange={handleSelectAll} />
              </TableHead>
              <TableHead className="w-12"></TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Checkbox checked={selectedIds.includes(category.id)} onCheckedChange={(checked) => handleSelectOne(category.id, checked as boolean)} />
                  </TableCell>
                  <TableCell>
                    <Star className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-yellow-500" />
                  </TableCell>
                  <TableCell className="font-medium">{category.title}</TableCell>
                  <TableCell className="max-w-md truncate">{category.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{category.slug}</Badge>
                  </TableCell>
                  <TableCell>{new Date(category.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>
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
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center">
                              <Edit className="w-4 h-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                          }
                          category={category}
                        />

                        <DropdownMenuItem onClick={() => handleDelete(category.id)} className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Trang {pageNumber} / {totalPages}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={pageNumber === 1} onClick={() => setPageNumber(pageNumber - 1)}>
                Trước
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button key={page} variant={pageNumber === page ? "default" : "outline"} size="sm" onClick={() => setPageNumber(page)}>
                    {page}
                  </Button>
                );
              })}
              <Button variant="outline" size="sm" disabled={pageNumber === totalPages} onClick={() => setPageNumber(pageNumber + 1)}>
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialog xác nhận xóa */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>Bạn có chắc chắn muốn xóa các danh mục này? Hành động này không thể hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
