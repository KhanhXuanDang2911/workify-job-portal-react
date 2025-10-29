import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { postService } from "@/services/post.service";
import type { PostFormData } from "@/schemas/admin/post.schema";
import { admin_routes } from "@/routes/routes.const";
import { toast } from "react-toastify";
import PostForm from "@/components/PostForm/PostForm";
import Loading from "@/components/Loading";

export default function CreatePost() {
  const navigate = useNavigate();

  const createPostMutation = useMutation({
    mutationFn: (data: FormData) => postService.createPost(data),
    onSuccess: () => {
      toast.success("Tạo bài viết thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo bài viết");
    },
  });

  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["post-categories-all"],
    queryFn: () => postService.getAllCategories(),
  });

  const handleSubmit = (data: PostFormData) => {
    const formData = new FormData();
    // console.log("tags: ", data.tags);
    
    // const tagsString = Array.isArray(data.tags) ? data.tags.join("|") : data.tags || "";

    const postRequest = {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      categoryId: data.category.id,
      // tags: tagsString,
      status: data.status,
    };

    formData.append("post", new Blob([JSON.stringify(postRequest)], { type: "application/json" }));

    if (data.thumbnail && data.thumbnail instanceof File) {
      formData.append("thumbnail", data.thumbnail);
    }
    console.log("formData: ", { formData });
    createPostMutation.mutate(formData);
  };

  if (isCategoriesLoading) {
    return (
      <div className="p-6 bg-background flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 bg-background h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(`${admin_routes.BASE}/${admin_routes.POSTS}`, { replace: true })} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Tạo bài viết mới</h1>
          <p className="text-muted-foreground mt-1">Điền thông tin để tạo bài viết mới</p>
        </div>

        <div className="bg-card rounded-lg border shadow-sm p-6">
          <PostForm onSubmit={handleSubmit} isSubmitting={createPostMutation.isPending} categoriesData={categoriesData?.data} />
        </div>
      </div>
    </div>
  );
}
