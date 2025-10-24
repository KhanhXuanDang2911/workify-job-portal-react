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

export interface EmployerUpdateRequest {
  companyName?: string
  companySize?: string
  contactPerson?: string
  phoneNumber?: string
  provinceId?: number
  districtId?: number
  detailAddress?: string
  aboutCompany?: string
}

export interface EmployerWebsiteUpdateRequest {
  websiteUrls?: string[]
  facebookUrl?: string
  twitterUrl?: string
  linkedinUrl?: string
  googleUrl?: string
  youtubeUrl?: string
}

export const employerService = {
  // changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse> => {
  //   const response = await http.patch<ApiResponse<{ message: string }>>("/employers/me/password", data);
  //   return response.data;
  // },

  signUp: async (data: EmployerSignUpRequest): Promise<ApiResponse<Employer>> => {
    const response = await http.post<ApiResponse<Employer>>("/employers/sign-up", data);
    return response.data;
  },

  signIn: async (data: { email: string; password: string }): Promise<ApiResponse<{ accessToken: string; refreshToken: string; data: Employer }>> => {
    const response = await http.post<ApiResponse<{ accessToken: string; refreshToken: string; data: Employer }>>("/auth/employers/sign-in", data);
    return response.data;
  },

  getEmployerProfile: async (): Promise<ApiResponse<Employer>> => {
    const response = await http.get<ApiResponse<Employer>>("/employers/me");
    return response.data;
  },

  updateEmployerProfile: async (data: EmployerUpdateRequest): Promise<ApiResponse<Employer>> => {
    const response = await http.put<ApiResponse<Employer>>("/employers/me", data);
    return response.data;
  },

  updateEmployerAvatar: async (file: File): Promise<ApiResponse<Employer>> => {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await http.patch<ApiResponse<Employer>>("/employers/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateEmployerBackground: async (file: File): Promise<ApiResponse<Employer>> => {
    const formData = new FormData();
    formData.append("background", file);
    const response = await http.patch<ApiResponse<Employer>>("/employers/me/background", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateEmployerWebsiteUrls: async (data: EmployerWebsiteUpdateRequest): Promise<ApiResponse<Employer>> => {
    const response = await http.patch<ApiResponse<Employer>>("/employers/me/website-urls", data);
    return response.data;
  },
};
