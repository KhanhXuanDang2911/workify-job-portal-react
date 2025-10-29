import type { PostStatus } from "@/constants/post.constant";

export interface PostCategory {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  slug: string;
}

export interface PostCategoryRequest {
  title: string;
  description: string;
}

export interface PostAuthor {
  id: number;
  fullName: string;
  avatarUrl: string | null;
  email: string;
  role: string;
}

export interface PostRequest {
  title: string;
  excerpt: string;
  content: string;
  categoryId: number;
  // tags?: string;
  status: PostStatus;
}

export interface PostResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  excerpt: string;
  content: string;
  contentText: string;
  thumbnailUrl: string | null;
  tags: string;
  slug: string;
  readingTimeMinutes: number;
  category: PostCategory;
  author: PostAuthor;
  status: PostStatus;
}

export interface PostsSearchParams {
  pageNumber?: number;
  pageSize?: number;
  sorts?: string;
  keyword?: string;
  categoryId?: number;
}

export interface PostCategoriesSearchParams {
  pageNumber?: number;
  pageSize?: number;
  sorts?: string;
  keyword?: string;
}
