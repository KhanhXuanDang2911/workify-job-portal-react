import http from "@/lib/http";
import type { ApiResponse, Employer } from "@/types";

export interface EmployerSignUpRequest {
  email: string;
  password: string;
  companyName: string;
  companySize: string;
  contactPerson: string;
  phoneNumber: string;
  provinceId: number;
  districtId: number;
  detailAddress?: string;
}

export const employerService = {
  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse> => {
    const response = await http.patch<ApiResponse<{ message: string }>>("/employers/me/password", data);
    return response.data;
  },

  signUp: async (data: EmployerSignUpRequest): Promise<ApiResponse<Employer>> => {
    const response = await http.post<ApiResponse<Employer>>("/employers/sign-up", data);
    return response.data;
  },
};