import http from "@/lib/http";
import type { ApiResponse } from "@/types";

export const userService = {
  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse> => {
    const response = await http.patch<ApiResponse<{ message: string }>>("/users/me/password", data);
    return response.data;
  },
};
