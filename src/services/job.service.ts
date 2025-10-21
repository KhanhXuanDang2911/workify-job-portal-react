import http from "@/lib/http";
import type { ApiResponse } from "@/types";
import type { JobRequest, JobResponse } from "@/types";

export const jobService = {
  createJob: async (data: JobRequest): Promise<ApiResponse<JobResponse>> => {
    const response = await http.post<ApiResponse<JobResponse>>("/jobs", data);
    return response.data;
  },

  getMyJobs: async (pageNumber = 1, pageSize = 10, keyword?: string): Promise<ApiResponse> => {
    const response = await http.get<ApiResponse>("/jobs/me", {
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
};
