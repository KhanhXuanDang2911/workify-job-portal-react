import employerHttp from "@/lib/employerHttp";
import publicHttp from "@/lib/publicHttp";
import userHttp from "@/lib/userHttp";
import type {
  ApiResponse,
  Employer,
  PageResponse,
  SearchParams,
} from "@/types";
import type { With } from "@/types/common";

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
  companyName?: string;
  companySize?: string;
  contactPerson?: string;
  phoneNumber?: string;
  provinceId?: number;
  districtId?: number;
  detailAddress?: string;
  aboutCompany?: string;
}

export interface EmployerWebsiteUpdateRequest {
  websiteUrls?: string[];
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  googleUrl?: string;
  youtubeUrl?: string;
}

export const employerService = {
  signUp: async (
    data: EmployerSignUpRequest
  ): Promise<ApiResponse<Employer>> => {
    const response = await publicHttp.post<ApiResponse<Employer>>(
      "/employers/sign-up",
      data
    );
    return response.data;
  },

  getEmployerProfile: async (): Promise<ApiResponse<Employer>> => {
    const response =
      await employerHttp.get<ApiResponse<Employer>>("/employers/me");
    return response.data;
  },

  updateEmployerProfile: async (
    data: EmployerUpdateRequest
  ): Promise<ApiResponse<Employer>> => {
    const response = await employerHttp.put<ApiResponse<Employer>>(
      "/employers/me",
      data
    );
    return response.data;
  },

  updateEmployerAvatar: async (file: File): Promise<ApiResponse<Employer>> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await employerHttp.patch<ApiResponse<Employer>>(
      "/employers/me/avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  updateEmployerBackground: async (
    file: File
  ): Promise<ApiResponse<Employer>> => {
    const formData = new FormData();
    formData.append("background", file);

    const response = await employerHttp.patch<ApiResponse<Employer>>(
      "/employers/me/background",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  updateEmployerWebsiteUrls: async (
    data: EmployerWebsiteUpdateRequest
  ): Promise<ApiResponse<Employer>> => {
    const response = await employerHttp.patch<ApiResponse<Employer>>(
      "/employers/me/website-urls",
      data
    );
    return response.data;
  },

  searchEmployers: async (
    params: Record<string, any> = {}
  ): Promise<ApiResponse<any>> => {
    const response = await publicHttp.get<ApiResponse<any>>("/employers", {
      params,
    });
    return response.data;
  },

  getEmployersWithSearchParam: async (
    params: With<SearchParams, { provinceId?: number }>
  ): Promise<ApiResponse<PageResponse<Employer>>> => {
    const response = await publicHttp.get<ApiResponse<PageResponse<Employer>>>(
      "/employers",
      { params }
    );
    return response.data;
  },

  getEmployersForAdmin: async (
    params: With<SearchParams, { provinceId?: number }>
  ): Promise<ApiResponse<PageResponse<Employer>>> => {
    const response = await userHttp.get<ApiResponse<PageResponse<Employer>>>(
      "/employers",
      { params }
    );
    return response.data;
  },

  getEmployerById: async (id: number): Promise<ApiResponse<Employer>> => {
    const response = await publicHttp.get<ApiResponse<Employer>>(
      `/employers/${id}`
    );
    return response.data;
  },

  getEmployerByIdForAdmin: async (
    id: number
  ): Promise<ApiResponse<Employer>> => {
    const response = await userHttp.get<ApiResponse<Employer>>(
      `/employers/${id}`
    );
    return response.data;
  },

  getTopHiringEmployers: async (
    limit = 10
  ): Promise<ApiResponse<Employer[]>> => {
    const response = await publicHttp.get<ApiResponse<Employer[]>>(
      "/employers/top-hiring",
      {
        params: { limit },
      }
    );
    return response.data;
  },

  createEmployer: async (data: FormData): Promise<ApiResponse<Employer>> => {
    const response = await userHttp.post<ApiResponse<Employer>>(
      "/employers",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  updateEmployer: async (
    id: number,
    data: FormData
  ): Promise<ApiResponse<Employer>> => {
    const response = await userHttp.put<ApiResponse<Employer>>(
      `/employers/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteEmployer: async (id: number): Promise<ApiResponse> => {
    const response = await userHttp.delete<ApiResponse>(`/employers/${id}`);
    return response.data;
  },
};
