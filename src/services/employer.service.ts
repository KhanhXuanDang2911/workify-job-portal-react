import http from "@/lib/http";
import type { ApiResponse } from "@/types";

export const employerService = {
  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse> => {
    const response = await http.patch<ApiResponse<{ message: string }>>("/employers/me/password", data);
    return response.data;
  },
};