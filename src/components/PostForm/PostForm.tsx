import type React from "react";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PostCategory, PostResponse } from "@/types/post.type";
import { Upload, X, ImageIcon } from "lucide-react";
import TiptapEditor from "@/components/TiptapEditor";
import { PostStatus, PostStatusLabelEN } from "@/constants/post.constant";
import { cn } from "@/lib/utils";
import { postSchema, type PostFormData } from "@/schemas/admin/post.schema";

interface PostFormProps {
  post?: PostResponse | null;
  onSubmit: (data: PostFormData) => void;
  isSubmitting: boolean;
  categoriesData: PostCategory[] | undefined;
}

export default function PostForm({ post, onSubmit, isSubmitting, categoriesData }: PostFormProps) {
  const isEditing = !!post;
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(post?.thumbnailUrl || null);
  const [formReady, setFormReady] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    getValues,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema) as Resolver<PostFormData>,
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      category: undefined,
      // tags: undefined,
      status: undefined,
    },
  });

  useLayoutEffect(() => {
    if (post && categoriesData) {
      reset({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category ? { id: post.category.id, title: post.category.title } : undefined,
        // tags: post.tags ? post.tags.split("|").map((tag) => tag.trim()) : [],
        status: post.status,
      });
      setThumbnailPreview(post.thumbnailUrl);
      setFormReady((formReady) => !formReady);
    }
    console.log("after reset:", getValues("category"));
  }, [post, reset, categoriesData, getValues]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnailPreview(null);
    const fileInput = document.getElementById("thumbnail") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const categories = categoriesData || [];

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

  const onError = (errors: any) => {
    console.error("Form validation failed!");
    console.error("Errors:", errors);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Tiêu đề <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Nhập tiêu đề bài viết"
          {...register("title")}
          className={cn("focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]", errors.title && "border-red-500")}
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <Label htmlFor="excerpt">
          Tóm tắt <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="excerpt"
          placeholder="Nhập tóm tắt bài viết"
          rows={10}
          {...register("excerpt")}
          className={cn(
            "focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C] max-h-[160px] overflow-y-auto py-4 scroll-py-[10px]",
            errors.excerpt && "border-red-500"
          )}
        />
        {errors.excerpt && <p className="text-sm text-red-500">{errors.excerpt.message}</p>}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="content">
          Nội dung <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TiptapEditor content={field.value} onChange={field.onChange} placeholder="Nhập nội dung bài viết..." className={errors.content ? "border-red-500" : ""} />
          )}
        />
        {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
      </div>

      {/* Category and Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoryId">
            Danh mục <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                key={`${post?.id || "new"}`}
                value={field.value?.id?.toString() ?? ""}
                onValueChange={(value) => {
                  const selected = categories.find((c) => c.id.toString() === value);
                  field.onChange(selected ? { id: selected.id, title: selected.title } : undefined);
                  console.log("Select value:", field.value);
                  console.log("Categories:", categories);
                }}
              >
                <SelectTrigger className={cn("w-full", errors.category && "border-red-500")}>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">
            Trạng thái <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select key={`${post?.id || "new"}`} value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger className={cn("w-full", errors.status && "border-red-500")}>
                  <SelectValue placeholder="Chọn trạng thái" />
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
          {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
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
        <Label htmlFor="thumbnail">Banner</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
          {thumbnailPreview ? (
            <div className="relative">
              <img src={thumbnailPreview || "/placeholder.svg"} alt="Thumbnail preview" className="max-h-64 mx-auto rounded-lg mb-5" />
              <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={removeThumbnail}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Tải lên banner cho bài viết</p>
              <p className="text-xs text-gray-500 mb-4">Hỗ trợ định dạng JPG, PNG có kích thước dưới 5MB</p>
            </>
          )}
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            {...register("thumbnail")}
            onChange={(e) => {
              register("thumbnail").onChange(e);
              handleThumbnailChange(e);
            }}
            className="hidden"
          />
          <label htmlFor="thumbnail">
            <Button type="button" variant="outline" className="cursor-pointer bg-transparent" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Chọn ảnh
              </span>
            </Button>
          </label>
        </div>
        {errors.thumbnail && <p className="text-sm text-red-500">{errors.thumbnail.message}</p>}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting} className="bg-[#4B9D7C] hover:bg-[#4B9D7C]/90 text-white transition-all min-w-[120px]">
          {isSubmitting ? "Đang xử lý..." : isEditing ? "Cập nhật" : "Tạo mới"}
        </Button>
      </div>
    </form>
  );
}
