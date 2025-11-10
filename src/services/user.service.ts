import userHttp from "@/lib/userHttp";
import type { ApiResponse, PageResponse, SearchParams, User } from "@/types";
import type { With } from "@/types/common";

export const userService = {
  // User: Get current user profile
  getUserProfile: async (): Promise<ApiResponse<User>> => {
    const response = await userHttp.get<ApiResponse<User>>("/users/me");
    return response.data;
  },

  // Admin: Get users list
  getUsers: async (
    params: With<SearchParams, { provinceId?: number }>
  ): Promise<ApiResponse<PageResponse<User>>> => {
    const response = await userHttp.get<ApiResponse<PageResponse<User>>>(
      "/users",
      { params }
    );
    return response.data;
  },

  // Get user by ID - use userHttp for admin access
  getUserById: async (id: number): Promise<ApiResponse<User>> => {
    const response = await userHttp.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  // Admin: Create user
  createUser: async (data: FormData): Promise<ApiResponse<User>> => {
    // Set Content-Type header for multipart/form-data - axios/browser will add boundary automatically
    const response = await userHttp.post<ApiResponse<User>>("/users", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Admin: Update user
  updateUser: async (
    id: number,
    data: FormData
  ): Promise<ApiResponse<User>> => {
    // Set Content-Type header for multipart/form-data - axios/browser will add boundary automatically
    const response = await userHttp.put<ApiResponse<User>>(
      `/users/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Admin: Delete user
  deleteUser: async (id: number): Promise<ApiResponse> => {
    const response = await userHttp.delete<ApiResponse>(`/users/${id}`);
    return response.data;
  },
};
