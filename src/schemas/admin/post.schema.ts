import { PostStatus } from "@/constants/post.constant";
import { z } from "zod";

export const postCategorySchema = z.object({
  title: z
    .string()
    .min(1, "validation.required")
    .max(255, "validation.titleTooLong"),
  description: z
    .string()
    .min(1, "validation.required")
    .max(1000, "validation.descriptionTooLong"),
});

export type PostCategoryFormData = z.infer<typeof postCategorySchema>;

const statusTypeEnum = z.enum(
  Object.keys(PostStatus) as [keyof typeof PostStatus],
  {
    message: "validation.required",
  }
);

export const postSchema = z.object({
  title: z
    .string()
    .min(1, "validation.required")
    .max(500, "validation.titleTooLong"),
  excerpt: z
    .string()
    .min(1, "validation.required")
    .max(1000, "validation.excerptTooLong"),
  content: z.string().min(1, "validation.required"),
  categoryId: z
    .number({ error: "validation.required" })
    .int()
    .positive("validation.invalidCategory"),
  status: statusTypeEnum,
});

export type PostFormData = z.infer<typeof postSchema>;
