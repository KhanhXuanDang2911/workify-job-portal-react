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

  verifyEmail: async (token: string, role: "users" | "employers"): Promise<ApiResponse<{ message: string }>> => {
    const response = await axiosInstance.patch<ApiResponse<{ message: string }>>(
      `/auth/${role}/verify-email`,
      {},
      {
        headers: {
          "C-Token": token,
        },
      }
    );
    return response.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }, role: "users" | "employers"|"admins"): Promise<ApiResponse<{ message: string }>> => {
    const response = await axiosInstance.patch<ApiResponse<{ message: string }>>(`/${role}/me/password`, data);
    return response.data;
  },

  forgotPassword: async (email: string, role: "users" | "employers"): Promise<ApiResponse<{ message: string }>> => {
    const response = await axiosInstance.post<ApiResponse<{ message: string }>>(`/auth/${role}/forgot-password`, { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string, role: "users" | "employers"): Promise<ApiResponse<{ message: string }>> => {
    const response = await axiosInstance.post<ApiResponse<{ message: string }>>(
      `/auth/${role}/reset-password`,
      { newPassword },
      {
        headers: {
          "R-Token": token,
        },
      }
    );
    return response.data;
  },

  googleLogin: async (authorizationCode: string): Promise<ApiResponse<{ accessToken?: string; refreshToken?: string; data?: User; createPasswordToken?: string }>> => {
    const response = await axiosInstance.post<ApiResponse<{ accessToken?: string; refreshToken?: string; data?: User; createPasswordToken?: string }>>(
      "/auth/authenticate/google",
      {},
      {
        headers: {
          "G-Code": authorizationCode,
        },
      }
    );
    return response.data;
  },

  linkedInLogin: async (authorizationCode: string): Promise<ApiResponse<{ accessToken?: string; refreshToken?: string; data?: User; createPasswordToken?: string }>> => {
    const response = await axiosInstance.post<ApiResponse<{ accessToken?: string; refreshToken?: string; data?: User; createPasswordToken?: string }>>(
      "/auth/authenticate/linkedin",
      {},
      {
        headers: {
          "L-Code": authorizationCode,
        },
      }
    );
    return response.data;
  },

  createPassword: async (token: string, password: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string; data: User }>> => {
    const response = await axiosInstance.post<ApiResponse<{ accessToken: string; refreshToken: string; data: User }>>(
      "/auth/create-password",
      { password },
      {
        headers: {
          "CR-Token": token,
        },
      }
    );
    return response.data;
  },

  getProfile: async () => {
    const res = await axiosInstance.get<ApiResponse<User>>("/users/me");
    return res.data;
  },

  refreshTokenUser: async (refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> => {
    const response = await axiosInstance.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      "/auth/users/refresh-token",
      {},
      {
        headers: {
          "Y-Token": refreshToken,
        },
      }
    );
    return response.data;
  },

  refreshTokenEmployer: async (refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> => {
    const response = await axiosInstance.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      "/auth/employers/refresh-token",
      {},
      {
        headers: {
          "Y-Token": refreshToken,
        },
      }
    );
    return response.data;
  },
};
