import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import BaseModal from "@/components/BaseModal/BaseModal";
import { postService } from "@/services/post.service";
import { postCategorySchema, type PostCategoryFormData } from "@/schemas/admin/post.schema";
import type { PostCategory } from "@/types/post.type";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

interface PostCategoryModalProps {
  trigger: React.ReactNode;
  category?: PostCategory | null;
}

export default function PostCategoryModal({ trigger, category }: PostCategoryModalProps) {
  const queryClient = useQueryClient();
  const isEditing = !!category;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostCategoryFormData>({
    resolver: zodResolver(postCategorySchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        title: category.title,
        description: category.description,
      });
    } else {
      reset({
        title: "",
        description: "",
      });
    }
  }, [category, reset]);

  const createMutation = useMutation({
    mutationFn: postService.createCategory,
    onSuccess: () => {
      toast.success("Tạo danh mục thành công");
      queryClient.invalidateQueries({ queryKey: ["post-categories"] });
      reset();
      
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo danh mục");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PostCategoryFormData }) => postService.updateCategory(id, data),
    onSuccess: () => {
      toast.success("Cập nhật danh mục thành công");
      queryClient.invalidateQueries({ queryKey: ["post-categories"] });
      reset(); 
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật danh mục");
    },
  });

  const onSubmit =  (data: PostCategoryFormData, onClose: () => void)=> {
    if (isEditing && category) {
      updateMutation.mutate(
        { id: category.id, data },
        { onSuccess: () => onClose() }, 

      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => onClose(),
      });
    }
  };

  return (
    <BaseModal
      title={isEditing ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
      trigger={trigger}
      className="sm:max-w-[500px]"
      footer={(onClose) => (
        <>
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              reset();
            }}
            className="border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2] w-28 bg-transparent"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            Hủy
          </Button>
          <Button type="submit" className="bg-[#1967d2] w-28 hover:bg-[#1251a3]"  onClick={handleSubmit((data) => onSubmit(data, onClose))} disabled={createMutation.isPending || updateMutation.isPending}>
            {isEditing ? "Cập nhật" : "Tạo mới"}
          </Button>
        </>
      )}
    >
      <form id="post-category-form" className="space-y-4 w-[500px]">
        <div className="space-y-2">
          <Label htmlFor="title">
            Tiêu đề <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Nhập tiêu đề danh mục"
            {...register("title")}
            className={cn("focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] mt-2", errors.title && "border-red-500")}
          />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Mô tả <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Nhập mô tả danh mục"
            rows={8}
            {...register("description")}
            className={cn("focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] mt-2 h-[260px] overflow-y-auto", errors.description && "border-red-500")}
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
        </div>
      </form>
    </BaseModal>
  );
}
