import type React from "react";
import { useEffect, useState } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PostResponse } from "@/types/post.type";
import { Upload, X, ImageIcon } from "lucide-react";
import TiptapEditor from "@/components/TiptapEditor";
import { PostStatus, PostStatusLabelEN } from "@/constants/post.constant";
import { cn } from "@/lib/utils";
import { postSchema, type PostFormData } from "@/schemas/admin/post.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { postService } from "@/services";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { admin_routes } from "@/routes/routes.const";
interface PostFormProps {
  isEditing: boolean;
}

export default function PostForm({ isEditing }: PostFormProps) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);

  const { data: post } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => await postService.getPostById(Number(id)),
    select: (data): PostResponse => data.data,
    enabled: isEditing && !!id,
    staleTime: 10 * 60 * 1000,
  });

  const { data: postCategoriesData, isLoading: isLoadingPostCategories } =
    useQuery({
      queryKey: ["post-categories", "all"],
      queryFn: () => postService.getAllCategories(),
      staleTime: 60 * 60 * 1000,
    });

  const createPostMutation = useMutation({
    mutationFn: (data: FormData) => postService.createPost(data),
    onSuccess: () => {
      toast.success("Post created successfully");
      navigate(`${admin_routes.BASE}/${admin_routes.POSTS}`);
    },
    onError: () => {
      toast.error("An error occurred while creating the post");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      postService.updatePost(id, data),
    onSuccess: () => {
      toast.success("Post updated successfully");
      navigate(`${admin_routes.BASE}/${admin_routes.POSTS}`);
    },
    onError: () => {
      toast.error("An error occurred while updating the post");
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    getValues,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema) as Resolver<PostFormData>,
    defaultValues: {
      title: post?.title || "",
      excerpt: post?.excerpt || "",
      content: post?.content || "",
      categoryId: post?.category.id || undefined,
      status: post?.status || undefined,
    },
  });

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        categoryId: post.category.id,
        status: post.status,
      });
      setThumbnailPreview(post.thumbnailUrl);
    }
  }, [post, reset, getValues]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setBanner(file);
      setBannerError(null);
    }
  };

  const removeThumbnail = () => {
    setThumbnailPreview(null);
    setBanner(null);
    setBannerError("Required");
    const fileInput = document.getElementById("thumbnail") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const postCategories = postCategoriesData?.data || [];

  // const [tagInputValue, setTagInputValue] = useState("");

  // const handleTagKeyDown = useCallback(
  //   (e: React.KeyboardEvent<HTMLInputElement>, field: any) => {
  //     if (e.key === "Enter" && tagInputValue.trim()) {
  //       e.preventDefault();
  //       const newTag = tagInputValue.trim();

  //       if (!field.value.includes(newTag)) {
  //         field.onChange([...field.value, newTag]);
  //       }

  //       setTagInputValue("");
  //     }
  //   },
  //   [tagInputValue]
  // );

  // const handleRemoveTag = useCallback((tag: string, field: any) => {
  //   field.onChange(field.value.filter((t: string) => t !== tag));
  // }, []);

  const onError = (errors: any) => {};

  const onSubmit = (data: PostFormData) => {
    const formData = new FormData();

    if (thumbnailPreview === null) {
      setBannerError("Required");
      return;
    } else {
      if (banner && banner instanceof File) {
        formData.append("thumbnail", banner);
      }
    }

    const postRequest = {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      categoryId: data.categoryId,
      status: data.status,
    };

    formData.append(
      "post",
      new Blob([JSON.stringify(postRequest)], { type: "application/json" })
    );

    if (isEditing && id) {
      updateMutation.mutate({ id: Number(id), data: formData });
    } else {
      createPostMutation.mutate(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Enter post title"
          {...register("title")}
          className={cn(
            "focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]",
            errors.title && "border-red-500"
          )}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <Label htmlFor="excerpt">
          Excerpt <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="excerpt"
          placeholder="Enter post excerpt"
          rows={10}
          {...register("excerpt")}
          className={cn(
            "focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C] max-h-[160px] overflow-y-auto py-4 scroll-py-[10px]",
            errors.excerpt && "border-red-500"
          )}
        />
        {errors.excerpt && (
          <p className="text-sm text-red-500">{errors.excerpt.message}</p>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="content">
          Content <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TiptapEditor
              content={field.value}
              onChange={field.onChange}
              placeholder="Enter post content..."
              className={errors.content ? "border-red-500" : ""}
            />
          )}
        />
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      {/* Category and Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoryId">
            Category <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value?.toString() ?? undefined}
                onValueChange={(value) => {
                  field.onChange(Number(value));
                }}
              >
                <SelectTrigger
                  className={cn(
                    "w-full",
                    errors.categoryId && "border-red-500"
                  )}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {postCategories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.categoryId && (
            <p className="text-sm text-red-500">{errors.categoryId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ?? undefined}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  className={cn("w-full", errors.status && "border-red-500")}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PostStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {PostStatusLabelEN[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <p className="text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Tags */}
      {/*
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (nhấn Enter để thêm)</Label>

        <Controller
          name="tags"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <>
              <Input
                id="tags"
                placeholder="Nhập tag rồi nhấn Enter"
                value={tagInputValue}
                onChange={(e) => setTagInputValue(e.target.value)}
                onKeyDown={(e) => handleTagKeyDown(e, field)}
                className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
              />

              <div className="flex flex-wrap gap-2 mt-3">
                {field.value?.map((tag: string) => (
                  <div key={tag} className="flex items-center bg-[#E6F5EF] text-[#4B9D7C] px-3 py-1 rounded-full text-sm">
                    <span>{tag}</span>
                    <button type="button" onClick={() => handleRemoveTag(tag, field)} className="ml-2 text-[#4B9D7C] hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {errors.tags && <p className="text-sm text-red-500">{errors.tags.message}</p>}
            </>
          )}
        />
      </div>
    */}
      {/* Thumbnail */}
      <div className="space-y-2">
        <Label htmlFor="thumbnail">
          Banner <span className="text-red-500">*</span>
        </Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
          {thumbnailPreview ? (
            <div className="relative">
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="max-h-64 mx-auto rounded-lg mb-5"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={removeThumbnail}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Upload a banner for the post
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Supports JPG, PNG formats under 5MB
              </p>
            </>
          )}
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            onChange={(e) => {
              handleThumbnailChange(e);
            }}
            className="hidden"
          />
          <label htmlFor="thumbnail">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer bg-transparent"
              asChild
            >
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </span>
            </Button>
          </label>
        </div>
        {bannerError && <p className="text-sm text-red-500">{bannerError}</p>}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          type="submit"
          disabled={createPostMutation.isPending || updateMutation.isPending}
          className="bg-[#4B9D7C] hover:bg-[#4B9D7C]/90 text-white transition-all min-w-[120px]"
        >
          {createPostMutation.isPending || updateMutation.isPending
            ? "Processing..."
            : isEditing
              ? "Update"
              : "Create"}
        </Button>
      </div>
    </form>
  );
}
