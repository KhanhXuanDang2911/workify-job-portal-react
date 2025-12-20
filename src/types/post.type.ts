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
  userAuthor?: PostAuthor | null;
  employerAuthor?: {
    id: number;
    email: string;
    backgroundUrl: string | null;
    avatarUrl: string | null;
    companyName: string;
    createdAt?: string;
    updatedAt?: string;
    employerSlug?: string;
  } | null;
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
