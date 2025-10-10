import axiosInstance from "@/lib/http";
import type { ApiResponse } from "@/types";

export const authService = {
  signUp: async (data: { fullName: string; email: string; password: string }): Promise<ApiResponse> => {
    const response = await axiosInstance.post<ApiResponse>("/users/sign-up", data);
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
};
