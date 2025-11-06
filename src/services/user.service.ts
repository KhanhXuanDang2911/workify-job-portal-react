import http from "@/lib/http";
import type { ApiResponse, PageResponse, SearchParams, User } from "@/types";

export const userService = {
  getUsers: async (params: SearchParams): Promise<ApiResponse<PageResponse<User>>> => {
    const response = await http.get<ApiResponse<PageResponse<User>>>("/users", { params });
    return response.data;
  },

  getUserById: async (id: number): Promise<ApiResponse<User>> => {
    const response = await http.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: FormData): Promise<ApiResponse<User>> => {
    const response = await http.post<ApiResponse<User>>("/users", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateUser: async (id: number, data: FormData): Promise<ApiResponse<User>> => {
    const response = await http.put<ApiResponse<User>>(`/users/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteUser: async (id: number): Promise<ApiResponse> => {
    const response = await http.delete<ApiResponse>(`/users/${id}`);
    return response.data;
  },
};
