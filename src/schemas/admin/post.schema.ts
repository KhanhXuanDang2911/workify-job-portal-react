import { PostStatus } from "@/constants/post.constant";
import { z } from "zod";

export const postCategorySchema = z.object({
  title: z.string().min(1, "Required").max(255, "Title must not exceed 255 characters"),
  description: z.string().min(1, "Required").max(1000, "Description must not exceed 1000 characters"),
});

export type PostCategoryFormData = z.infer<typeof postCategorySchema>;

const statusTypeEnum = z.enum(Object.keys(PostStatus) as [keyof typeof PostStatus], {
  message: "Required",
});

export const postSchema = z.object({
  title: z.string().min(1, "Required").max(500, "Title must not exceed 500 characters"),
  excerpt: z.string().min(1, "Required").max(1000, "Excerpt must not exceed 1000 characters"),
  content: z.string().min(1, "Required"),
  categoryId: z.number({ error: "Required" }).int().positive("Invalid category"),
  status: statusTypeEnum,
});

export type PostFormData = z.infer<typeof postSchema>;
