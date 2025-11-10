import publicHttp from "@/lib/publicHttp";
import userHttp from "@/lib/userHttp";
import type { ApiResponse, PageResponse } from "@/types";
import type {
  PostCategory,
  PostCategoryRequest,
  PostResponse,
  PostsSearchParams,
  PostCategoriesSearchParams,
} from "@/types/";

export const postService = {
  // Post Categories
  // GET endpoints are public
  getAllCategories: async (): Promise<ApiResponse<PostCategory[]>> => {
    const response = await publicHttp.get<ApiResponse<PostCategory[]>>(
      "/categories-post/all"
    );
    return response.data;
  },

  getCategories: async (
    params: PostCategoriesSearchParams
  ): Promise<ApiResponse<PageResponse<PostCategory>>> => {
    const response = await publicHttp.get<
      ApiResponse<PageResponse<PostCategory>>
    >("/categories-post", { params });
    return response.data;
  },

  getCategoryById: async (id: number): Promise<ApiResponse<PostCategory>> => {
    const response = await publicHttp.get<ApiResponse<PostCategory>>(
      `/categories-post/${id}`
    );
    return response.data;
  },

  // POST/PUT/DELETE endpoints require ADMIN authentication
  createCategory: async (
    data: PostCategoryRequest
  ): Promise<ApiResponse<PostCategory>> => {
    const response = await userHttp.post<ApiResponse<PostCategory>>(
      "/categories-post",
      data
    );
    return response.data;
  },

  updateCategory: async (
    id: number,
    data: PostCategoryRequest
  ): Promise<ApiResponse<PostCategory>> => {
    const response = await userHttp.put<ApiResponse<PostCategory>>(
      `/categories-post/${id}`,
      data
    );
    return response.data;
  },

  deleteCategory: async (id: number): Promise<ApiResponse> => {
    const response = await userHttp.delete<ApiResponse>(
      `/categories-post/${id}`
    );
    return response.data;
  },

  // Posts
  // GET /posts requires ADMIN authentication (5.1)
  getPosts: async (
    params: PostsSearchParams
  ): Promise<ApiResponse<PageResponse<PostResponse>>> => {
    const response = await userHttp.get<
      ApiResponse<PageResponse<PostResponse>>
    >("/posts", { params });
    return response.data;
  },

  // GET /posts/{id} - use userHttp for admin access to all posts including drafts
  getPostById: async (id: number): Promise<ApiResponse<PostResponse>> => {
    const response = await userHttp.get<ApiResponse<PostResponse>>(
      `/posts/${id}`
    );
    return response.data;
  },

  // POST/PUT/DELETE endpoints require ADMIN authentication
  createPost: async (data: FormData): Promise<ApiResponse<PostResponse>> => {
    // Set Content-Type header for multipart/form-data - axios/browser will add boundary automatically
    const response = await userHttp.post<ApiResponse<PostResponse>>(
      "/posts",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  updatePost: async (
    id: number,
    data: FormData
  ): Promise<ApiResponse<PostResponse>> => {
    // Set Content-Type header for multipart/form-data - axios/browser will add boundary automatically
    const response = await userHttp.put<ApiResponse<PostResponse>>(
      `/posts/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deletePost: async (id: number): Promise<ApiResponse> => {
    const response = await userHttp.delete<ApiResponse>(`/posts/${id}`);
    return response.data;
  },

  // Public posts list (only PUBLIC posts) - public endpoint
  getPublicPosts: async (
    params: Record<string, any> = {}
  ): Promise<ApiResponse<PageResponse<any>>> => {
    const response = await publicHttp.get<ApiResponse<PageResponse<any>>>(
      "/posts/public",
      { params }
    );
    return response.data;
  },

  // Latest public posts - public endpoint
  getLatestPublicPosts: async (
    limit?: number
  ): Promise<ApiResponse<PostResponse[]>> => {
    const response = await publicHttp.get<ApiResponse<PostResponse[]>>(
      "/posts/public/latest",
      {
        ...(limit && { params: { limit } }),
      }
    );
    return response.data;
  },

  // Latest posts - public endpoint
  getLatestPosts: async (limit = 8): Promise<ApiResponse<PostResponse[]>> => {
    const response = await publicHttp.get<ApiResponse<PostResponse[]>>(
      "/posts/public/latest",
      {
        params: { limit },
      }
    );
    return response.data;
  },
};
