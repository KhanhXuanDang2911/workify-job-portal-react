import http from "@/lib/http";
import type { ApiResponse, Industry, JobsAdvancedSearchParams, PageResponse, Province, CategoryJobResponse } from "@/types";
import type { JobRequest, JobResponse } from "@/types";

export const jobService = {
  createJob: async (data: JobRequest): Promise<ApiResponse<JobResponse>> => {
    const response = await http.post<ApiResponse<JobResponse>>("/jobs", data);
    return response.data;
  },

  getMyJobs: async (pageNumber = 1, pageSize = 10, keyword?: string): Promise<ApiResponse<PageResponse<JobResponse>>> => {
    const response = await http.get<ApiResponse<PageResponse<JobResponse>>>("/jobs/me", {
      params: {
        pageNumber,
        pageSize,
        ...(keyword && { keyword }),
      },
    });
    return response.data;
  },

  getJobById: async (id: number): Promise<ApiResponse<JobResponse>> => {
    const response = await http.get<ApiResponse<JobResponse>>(`/jobs/${id}`);
    return response.data;
  },

  updateJob: async (id: number, data: JobRequest): Promise<ApiResponse<JobResponse>> => {
    const response = await http.put<ApiResponse<JobResponse>>(`/jobs/${id}`, data);
    return response.data;
  },

  closeJob: async (id: number): Promise<ApiResponse> => {
    const response = await http.patch<ApiResponse>(`/jobs/close/${id}`);
    return response.data;
  },

  deleteJob: async (id: number): Promise<ApiResponse> => {
    const response = await http.delete<ApiResponse>(`/jobs/${id}`);
    return response.data;
  },

  searchJobsAdvanced: async (params: JobsAdvancedSearchParams): Promise<ApiResponse<PageResponse<JobResponse>>> => {
    const response = await http.get<ApiResponse<PageResponse<JobResponse>>>("/jobs/advanced", {
      params,
    });
    return response.data;
  },

  getPopularLocations: async (limit = 10): Promise<ApiResponse> => {
    const response = await http.get<ApiResponse>("/jobs/locations/popular", {
      params: { limit },
    });
    return response.data;
  },

  getPopularIndustries: async (limit = 10): Promise<ApiResponse> => {
    const response = await http.get<ApiResponse>("/jobs/industries/popular", {
      params: { limit },
    });
    return response.data;
  },

  getMyCurrentIndustries: async (): Promise<ApiResponse<Industry[]>> => {
    const response = await http.get<ApiResponse<Industry[]>>("/jobs/me/industries/current");
    return response.data;
  },

  getMyCurrentLocations: async (): Promise<ApiResponse<Province[]>> => {
    const response = await http.get<ApiResponse<Province[]>>("/jobs/me/locations/current");
    return response.data;
  },

  getTopAttractiveJobs: async (limit = 10): Promise<ApiResponse<JobResponse[]>> => {
    const response = await http.get<ApiResponse<JobResponse[]>>("/jobs/top-attractive", {
      params: { limit },
    });
    return response.data;
  },

  getCategoriesWithJobCount: async (): Promise<ApiResponse<CategoryJobResponse[]>> => {
    const response = await http.get<ApiResponse<CategoryJobResponse[]>>("/categories-job/industries/job-count");
    return response.data;
  },
};
