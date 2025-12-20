import publicHttp from "@/lib/publicHttp";
import userHttp from "@/lib/userHttp";
import employerHttp from "@/lib/employerHttp";
import type { ApiResponse, PageResponse } from "@/types";
import type {
  PostCategory,
  PostCategoryRequest,
  PostResponse,
  PostsSearchParams,
  PostCategoriesSearchParams,
} from "@/types/";

export const postService = {
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

  getPosts: async (
    params: PostsSearchParams
  ): Promise<ApiResponse<PageResponse<PostResponse>>> => {
    const response = await userHttp.get<
      ApiResponse<PageResponse<PostResponse>>
    >("/posts", { params });
    return response.data;
  },

  /**
   * Employer: Get posts created by the authenticated employer (owner-only list).
   * Note: the backend exposes the same `/posts` endpoint; when called with an
   * employer-specific endpoint `/posts/my` is provided to explicitly return
   * only posts created by the authenticated employer. Use that endpoint here
   * to avoid any ambiguity.
   */
  getEmployerPosts: async (
    params: PostsSearchParams
  ): Promise<ApiResponse<PageResponse<PostResponse>>> => {
    const response = await employerHttp.get<
      ApiResponse<PageResponse<PostResponse>>
    >("/posts/my", { params });
    return response.data;
  },

  getPostById: async (id: number): Promise<ApiResponse<PostResponse>> => {
    const response = await userHttp.get<ApiResponse<PostResponse>>(
      `/posts/${id}`
    );
    return response.data;
  },

  getPostByIdAsEmployer: async (
    id: number
  ): Promise<ApiResponse<PostResponse>> => {
    const response = await employerHttp.get<ApiResponse<PostResponse>>(
      `/posts/${id}`
    );
    return response.data;
  },

  createPost: async (data: FormData): Promise<ApiResponse<PostResponse>> => {
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

  /**
   * Convenience wrapper for employers to create posts. If caller is EMPLOYER,
   * the backend will ignore any `status` field and set the created post to
   * `PENDING`.
   */
  createPostAsEmployer: async (
    data: FormData
  ): Promise<ApiResponse<PostResponse>> => {
    const response = await employerHttp.post<ApiResponse<PostResponse>>(
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

  /**
   * Convenience wrapper for employers to update their own posts. Employers are
   * not allowed to change `status`; backend will ignore `status` if present.
   */
  updatePostAsEmployer: async (
    id: number,
    data: FormData
  ): Promise<ApiResponse<PostResponse>> => {
    const response = await employerHttp.put<ApiResponse<PostResponse>>(
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

  /**
   * Convenience wrapper for employers to delete their own posts.
   */
  deletePostAsEmployer: async (id: number): Promise<ApiResponse> => {
    const response = await employerHttp.delete<ApiResponse>(`/posts/${id}`);
    return response.data;
  },

  patchPostStatus: async (id: number, status: string): Promise<ApiResponse> => {
    const response = await userHttp.patch<ApiResponse>(
      `/posts/${id}/${status}`
    );
    return response.data;
  },

  getPublicPosts: async (
    params: Record<string, any> = {}
  ): Promise<ApiResponse<PageResponse<any>>> => {
    const response = await publicHttp.get<ApiResponse<PageResponse<any>>>(
      "/posts/public",
      { params }
    );
    return response.data;
  },

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
