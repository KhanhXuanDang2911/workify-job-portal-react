import userHttp from "@/lib/userHttp";
import type { ApiResponse, PageResponse, SearchParams, User } from "@/types";
import type { With } from "@/types/common";

export const userService = {
  getUserProfile: async (): Promise<ApiResponse<User>> => {
    const response = await userHttp.get<ApiResponse<User>>("/users/me");
    return response.data;
  },

  getUsers: async (
    params: With<SearchParams, { provinceId?: number }>
  ): Promise<ApiResponse<PageResponse<User>>> => {
    const response = await userHttp.get<ApiResponse<PageResponse<User>>>(
      "/users",
      { params }
    );
    return response.data;
  },

  getUserById: async (id: number): Promise<ApiResponse<User>> => {
    const response = await userHttp.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: FormData): Promise<ApiResponse<User>> => {
    const response = await userHttp.post<ApiResponse<User>>("/users", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateUser: async (
    id: number,
    data: FormData
  ): Promise<ApiResponse<User>> => {
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

  deleteUser: async (id: number): Promise<ApiResponse> => {
    const response = await userHttp.delete<ApiResponse>(`/users/${id}`);
    return response.data;
  },

  updateUserProfile: async (data: {
    fullName: string;
    phoneNumber?: string | null;
    birthDate?: string | null;
    gender?: "MALE" | "FEMALE" | "OTHER" | null;
    provinceId?: number | null;
    districtId?: number | null;
    detailAddress?: string | null;
    industryId?: number | null;
  }): Promise<ApiResponse<User>> => {
    const response = await userHttp.put<ApiResponse<User>>("/users/me", data);
    return response.data;
  },

  updateUserAvatar: async (avatarFile: File): Promise<ApiResponse<User>> => {
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    const response = await userHttp.patch<ApiResponse<User>>(
      "/users/me/avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
