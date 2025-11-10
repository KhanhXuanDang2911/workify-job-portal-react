import publicHttp from "@/lib/publicHttp";
import userHttp from "@/lib/userHttp";
import type { ApiResponse, PageResponse } from "@/types";

export interface CategoryJobRequest {
  name: string;
  engName: string;
  description?: string;
}

export interface IndustryJobCount {
  id: number;
  name: string;
  engName: string;
  description: string;
  jobCount: number;
}

export interface CategoryJobResponse {
  id: number;
  name: string;
  engName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  industries?: IndustryJobCount[];
}

export interface CategoryJobsSearchParams {
  pageNumber?: number;
  pageSize?: number;
  sorts?: string;
  keyword?: string;
}

interface Industry {
  id: string;
  name: string;
  engName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const categoryJobService = {
  // GET endpoints are public
  getAllCategoryJobs: async (): Promise<ApiResponse<CategoryJobResponse[]>> => {
    const response = await publicHttp.get<ApiResponse<CategoryJobResponse[]>>("/categories-job/all");
    return response.data;
  },

  getCategoryJobs: async (params: CategoryJobsSearchParams): Promise<ApiResponse<PageResponse<CategoryJobResponse>>> => {
    const response = await publicHttp.get<ApiResponse<PageResponse<CategoryJobResponse>>>("/categories-job", { params });
    return response.data;
  },

  getCategoryJobById: async (id: number): Promise<ApiResponse<CategoryJobResponse>> => {
    const response = await publicHttp.get<ApiResponse<CategoryJobResponse>>(`/categories-job/${id}`);
    return response.data;
  },

  // POST/PUT/DELETE endpoints require ADMIN authentication
  createCategoryJob: async (data: CategoryJobRequest): Promise<ApiResponse<CategoryJobResponse>> => {
    const response = await userHttp.post<ApiResponse<CategoryJobResponse>>("/categories-job", data);
    return response.data;
  },

  updateCategoryJob: async (id: number, data: CategoryJobRequest): Promise<ApiResponse<CategoryJobResponse>> => {
    const response = await userHttp.put<ApiResponse<CategoryJobResponse>>(`/categories-job/${id}`, data);
    return response.data;
  },

  deleteCategoryJob: async (id: number): Promise<ApiResponse> => {
    const response = await userHttp.delete<ApiResponse>(`/categories-job/${id}`);
    return response.data;
  },

  // GET endpoint is public
  getIndustriesWithJobCount: async (): Promise<ApiResponse<CategoryJobResponse[]>> => {
    const response = await publicHttp.get<ApiResponse<CategoryJobResponse[]>>("/categories-job/industries/job-count");
    return response.data;
  },
};