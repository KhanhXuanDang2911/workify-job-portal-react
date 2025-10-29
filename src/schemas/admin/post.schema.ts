import { PostStatus } from "@/constants/post.constant";
import { z } from "zod";

export const postCategorySchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc").max(255, "Tiêu đề không được vượt quá 255 ký tự"),
  description: z.string().min(1, "Mô tả là bắt buộc").max(1000, "Mô tả không được vượt quá 1000 ký tự"),
});

export type PostCategoryFormData = z.infer<typeof postCategorySchema>;

export const postSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc").max(500, "Tiêu đề không được vượt quá 500 ký tự"),
  excerpt: z.string().min(1, "Tóm tắt là bắt buộc").max(1000, "Tóm tắt không được vượt quá 1000 ký tự"),
  content: z.string().min(1, "Nội dung là bắt buộc"),
  category: z.object({
    id: z.number({ error: "Danh mục là bắt buộc" }).int().positive("Danh mục không hợp lệ"),
    title: z.string().min(1, "Danh mục là bắt buộc"),
  }),
  // tags: z.array(z.string()).optional(),
  status: z.nativeEnum(PostStatus, { message: "Trạng thái là bắt buộc" }),
  thumbnail: z.preprocess((val) => {
    if (val instanceof FileList) return val[0];
    return val;
  }, z.instanceof(File, { message: "Banner là bắt buộc" })),
});

export type PostFormData = z.infer<typeof postSchema>;
