import http from "@/lib/http";
import type { ApiResponse, PageResponse } from "@/types";
import type { PostCategory, PostCategoryRequest, PostResponse, PostsSearchParams, PostCategoriesSearchParams } from "@/types/";

export const postService = {
  // Post Categories
  getAllCategories: async (): Promise<ApiResponse<PostCategory[]>> => {
    const response = await http.get<ApiResponse<PostCategory[]>>("/categories-post/all");
    return response.data;
  },

  getCategories: async (params: PostCategoriesSearchParams): Promise<ApiResponse<PageResponse<PostCategory>>> => {
    const response = await http.get<ApiResponse<PageResponse<PostCategory>>>("/categories-post", { params });
    return response.data;
  },

  getCategoryById: async (id: number): Promise<ApiResponse<PostCategory>> => {
    const response = await http.get<ApiResponse<PostCategory>>(`/categories-post/${id}`);
    return response.data;
  },

  createCategory: async (data: PostCategoryRequest): Promise<ApiResponse<PostCategory>> => {
    const response = await http.post<ApiResponse<PostCategory>>("/categories-post", data);
    return response.data;
  },

  updateCategory: async (id: number, data: PostCategoryRequest): Promise<ApiResponse<PostCategory>> => {
    const response = await http.put<ApiResponse<PostCategory>>(`/categories-post/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<ApiResponse> => {
    const response = await http.delete<ApiResponse>(`/categories-post/${id}`);
    return response.data;
  },

  // Posts
  getPosts: async (params: PostsSearchParams): Promise<ApiResponse<PageResponse<PostResponse>>> => {
    const response = await http.get<ApiResponse<PageResponse<PostResponse>>>("/posts", { params });
    return response.data;
  },

  getPostById: async (id: number): Promise<ApiResponse<PostResponse>> => {
    const response = await http.get<ApiResponse<PostResponse>>(`/posts/${id}`);
    return response.data;
  },

  createPost: async (data: FormData): Promise<ApiResponse<PostResponse>> => {
    const response = await http.post<ApiResponse<PostResponse>>("/posts", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updatePost: async (id: number, data: FormData): Promise<ApiResponse<PostResponse>> => {
    const response = await http.put<ApiResponse<PostResponse>>(`/posts/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deletePost: async (id: number): Promise<ApiResponse> => {
    const response = await http.delete<ApiResponse>(`/posts/${id}`);
    return response.data;
  },
};
