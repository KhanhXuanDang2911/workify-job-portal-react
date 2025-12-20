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
import {
  postCategorySchema,
  type PostCategoryFormData,
} from "@/schemas/admin/post.schema";
import type { PostCategory } from "@/types/post.type";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface PostCategoryModalProps {
  trigger: React.ReactNode;
  category?: PostCategory | null;
}

export default function PostCategoryModal({
  trigger,
  category,
}: PostCategoryModalProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
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
      toast.success(t("toast.success.categoryCreated"));
      queryClient.invalidateQueries({ queryKey: ["post-categories"] });
      reset();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t("toast.error.createCategoryFailed")
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PostCategoryFormData }) =>
      postService.updateCategory(id, data),
    onSuccess: () => {
      toast.success(t("toast.success.categoryUpdated"));
      queryClient.invalidateQueries({ queryKey: ["post-categories"] });
      reset();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t("toast.error.updateCategoryFailed")
      );
    },
  });

  const onSubmit = (data: PostCategoryFormData, onClose: () => void) => {
    if (isEditing && category) {
      updateMutation.mutate(
        { id: category.id, data },
        { onSuccess: () => onClose() }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => onClose(),
      });
    }
  };

  return (
    <BaseModal
      title={
        isEditing ? t("postCategory.editTitle") : t("postCategory.createTitle")
      }
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
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            className="bg-[#1967d2] w-28 hover:bg-[#1251a3]"
            onClick={handleSubmit((data) => onSubmit(data, onClose))}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {isEditing ? t("common.update") : t("common.create")}
          </Button>
        </>
      )}
    >
      <form id="post-category-form" className="space-y-4 w-[500px]">
        <div className="space-y-2">
          <Label htmlFor="title">
            {t("postCategory.label.title")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            placeholder={t("postCategory.placeholder.title")}
            {...register("title")}
            className={cn(
              "focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] mt-2",
              errors.title && "border-red-500"
            )}
          />
          {errors.title && (
            <p className="text-sm text-red-500">
              {t(errors.title.message as string)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            {t("postCategory.label.description")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder={t("postCategory.placeholder.description")}
            rows={8}
            {...register("description")}
            className={cn(
              "focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] mt-2 h-[260px] overflow-y-auto",
              errors.description && "border-red-500"
            )}
          />
          {errors.description && (
            <p className="text-sm text-red-500">
              {t(errors.description.message as string)}
            </p>
          )}
        </div>
      </form>
    </BaseModal>
  );
}
