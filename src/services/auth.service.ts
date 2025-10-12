import axiosInstance from "@/lib/http";
import type { ApiResponse, User } from "@/types";

export const authService = {
  signUp: async (data: { fullName: string; email: string; password: string }): Promise<ApiResponse> => {
    const response = await axiosInstance.post<ApiResponse>("/users/sign-up", data);
    return response.data;
  },

  signIn: async (data: { email: string; password: string }): Promise<ApiResponse<{ accessToken: string; refreshToken: string; data: User }>> => {
    const response = await axiosInstance.post<ApiResponse<{ accessToken: string; refreshToken: string; data: User }>>("/auth/users/sign-in", data);
    return response.data;
  },

  signOut: async (accessToken: string, refreshToken: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.post<ApiResponse<null>>(
      "/auth/sign-out",
      {},
      {
        headers: {
          "X-Token": accessToken,
          "Y-Token": refreshToken,
        },
      }
    );
    return response.data;
  },

  verifyEmail: async (token: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await axiosInstance.patch<ApiResponse<{ message: string }>>(
      "/auth/users/verify-email",
      {},
      {
        headers: {
          "C-Token": token,
        },
      }
    );
    return response.data;
  },

  changePasswordUser: async (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.patch<ApiResponse<null>>("/users/me/password", data);
    return response.data;
  },

  changePasswordEmployer: async (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.patch<ApiResponse<null>>("/employers/me/password", data);
    return response.data;
  },
};
