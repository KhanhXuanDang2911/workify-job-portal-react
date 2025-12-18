import { PostStatus } from "@/constants/post.constant";
import { z } from "zod";

export const postCategorySchema = z.object({
  title: z
    .string()
    .min(1, "validation.postCategoryTitleRequired")
    .max(255, "validation.titleTooLong"),
  description: z
    .string()
    .min(1, "validation.postCategoryDescriptionRequired")
    .max(1000, "validation.descriptionTooLong"),
});

export type PostCategoryFormData = z.infer<typeof postCategorySchema>;

const statusTypeEnum = z.enum(
  Object.keys(PostStatus) as [keyof typeof PostStatus],
  {
    message: "validation.statusRequired",
  }
);

export const postSchema = z.object({
  title: z
    .string()
    .min(1, "validation.postTitleRequired")
    .max(500, "validation.titleTooLong"),
  excerpt: z
    .string()
    .min(1, "validation.postExcerptRequired")
    .max(1000, "validation.excerptTooLong"),
  content: z.string().min(1, "validation.postContentRequired"),
  categoryId: z
    .number({ error: "validation.postCategoryRequired" })
    .int()
    .positive("validation.invalidCategory"),
  status: statusTypeEnum,
});

export type PostFormData = z.infer<typeof postSchema>;
