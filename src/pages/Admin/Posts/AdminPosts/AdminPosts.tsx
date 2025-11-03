import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, MoreVertical, Edit, Trash2, Star, Eye } from "lucide-react";
import { postService } from "@/services/post.service";
import { PostStatusColors, PostStatusLabelEN } from "@/constants/post.constant";
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

export default function AdminPosts() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["posts", pageNumber, pageSize, keyword, categoryFilter],
    queryFn: () =>
      postService.getPosts({
        pageNumber,
        pageSize,
        keyword: keyword || undefined,
        categoryId: categoryFilter === "all" ? undefined : Number(categoryFilter),
        sorts: "createdAt:desc",
      }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["post-categories-all"],
    queryFn: () => postService.getAllCategories(),
  });

  const deleteMutation = useMutation({
    mutationFn: postService.deletePost,
    onSuccess: () => {
      toast.success("Xóa bài viết thành công");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setDeleteDialogOpen(false);
      setDeletingId(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa bài viết");
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

  const handleEdit = (id: number) => {
    navigate(`${admin_routes.BASE}/${admin_routes.POSTS}/edit/${id}`, { replace: true });
  };

  const handleView = (id: number) => {
    navigate(`${admin_routes.BASE}/${admin_routes.POSTS}/${id}`, { replace: true });
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

  const handleAddNew = () => {
    navigate(`${admin_routes.BASE}/${admin_routes.POSTS}/create`);
  };

  const posts = data?.data.items || [];
  const totalPages = data?.data.totalPages || 0;
  const categories = categoriesData?.data || [];

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Quản lý bài viết</h1>
        <p className="text-muted-foreground mt-1">Quản lý tất cả bài viết trên hệ thống</p>
      </div>

      {/* Search and Actions */}
      <div className="bg-card rounded-lg border shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề, nội dung hoặc tác giả..."
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
          <Button onClick={handleAddNew} className="bg-[#4B9D7C] hover:bg-[#4B9D7C]/90 text-white transition-all">
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Lọc theo danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem> 
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(keyword || categoryFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setKeyword("");
                setSearchInput("");
                setCategoryFilter("all"); 
                setPageNumber(1);
              }}
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>

        {selectedIds.length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="secondary">{selectedIds.length} đã chọn</Badge>
            <Button variant="outline" size="sm">
              Xóa đã chọn
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
                <Checkbox checked={selectedIds.length === posts.length && posts.length > 0} onCheckedChange={handleSelectAll} />
              </TableHead>
              <TableHead className="w-12"></TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Tác giả</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Checkbox checked={selectedIds.includes(post.id)} onCheckedChange={(checked) => handleSelectOne(post.id, checked as boolean)} />
                  </TableCell>
                  <TableCell>
                    <Star className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-yellow-500" />
                  </TableCell>
                  <TableCell className="font-medium max-w-md truncate">{post.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{post.category.title}</Badge>
                  </TableCell>
                  <TableCell>{post.author.fullName}</TableCell>
                  <TableCell>
                    <Badge className={PostStatusColors[post.status]}>{PostStatusLabelEN[post.status]}</Badge>
                  </TableCell>
                  <TableCell>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(post.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(post.id)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(post.id)} className="text-red-600">
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.</AlertDialogDescription>
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
