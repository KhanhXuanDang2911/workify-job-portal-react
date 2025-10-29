import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PostForm from "@/components/PostForm";
import { postService } from "@/services/post.service";
import type { PostFormData } from "@/schemas/admin/post.schema";
import { admin_routes } from "@/routes/routes.const";
import { toast } from "react-toastify";
import Loading from "@/components/Loading";

export default function EditPost() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  console.log("id edit: ", id);
  const { data, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => await postService.getPostById(Number(id)),
    enabled: !!id,
  });

  const { data: categoriesData,isLoading: isCategoriesLoading } = useQuery({
      queryKey: ["post-categories-all"],
      queryFn: () => postService.getAllCategories(),
    });
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => postService.updatePost(id, data),
    onSuccess: () => {
      toast.success("Cập nhật bài viết thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật bài viết");
    },
  });

  const handleSubmit = (formData: PostFormData) => {
    if (!id) return;

    const data = new FormData();

    const postRequest = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      categoryId: formData.category.id,
      // tags: formData.tags || "",
      status: formData.status,
    };

    data.append("post", new Blob([JSON.stringify(postRequest)], { type: "application/json" }));

    if (formData.thumbnail && formData.thumbnail instanceof File) {
      data.append("thumbnail", formData.thumbnail);
    }

    updateMutation.mutate({ id: Number(id), data });
  };

  if (isLoading || isCategoriesLoading) {
    return (
      <div className="p-6 bg-background flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="p-6 bg-background h-screen ">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-muted-foreground">Không tìm thấy bài viết</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(`${admin_routes.BASE}/${admin_routes.POSTS}`)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Chỉnh sửa bài viết</h1>
          <p className="text-muted-foreground mt-1">Cập nhật thông tin bài viết</p>
        </div>

        <div className="bg-card rounded-lg border shadow-sm p-6">
          <PostForm post={data.data} onSubmit={handleSubmit} isSubmitting={updateMutation.isPending} categoriesData={categoriesData?.data}/>
        </div>
      </div>
    </div>
  );
}
