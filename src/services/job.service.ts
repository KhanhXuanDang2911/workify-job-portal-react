import type { JobStatus } from "@/constants";
import publicHttp from "@/lib/publicHttp";
import employerHttp from "@/lib/employerHttp";
import userHttp from "@/lib/userHttp";

import type {
  ApiResponse,
  Industry,
  JobsAdvancedSearchParams,
  PageResponse,
  Province,
  CategoryJobResponse,
  SearchParams,
} from "@/types";

import type { JobRequest, JobResponse } from "@/types";
import type { With } from "@/types/common";

export const jobService = {
  // ====== EMPLOYER APIs (require employer authentication) ======
  createJob: async (data: JobRequest): Promise<ApiResponse<JobResponse>> => {
    const response = await employerHttp.post<ApiResponse<JobResponse>>(
      "/jobs",
      data
    );
    return response.data;
  },

  getMyJobs: async (
    params: With<SearchParams, { provinceId?: number; industryId?: number }>
  ): Promise<ApiResponse<PageResponse<JobResponse>>> => {
    const response = await employerHttp.get<
      ApiResponse<PageResponse<JobResponse>>
    >("/jobs/me", {
      params,
    });
    return response.data;
  },

  updateJob: async (
    id: number,
    data: JobRequest
  ): Promise<ApiResponse<JobResponse>> => {
    const response = await employerHttp.put<ApiResponse<JobResponse>>(
      `/jobs/${id}`,
      data
    );
    return response.data;
  },

  closeJob: async (id: number): Promise<ApiResponse> => {
    const response = await employerHttp.patch<ApiResponse>(`/jobs/close/${id}`);
    return response.data;
  },

  deleteJob: async (id: number): Promise<ApiResponse> => {
    const response = await employerHttp.delete<ApiResponse>(`/jobs/${id}`);
    return response.data;
  },

  getMyCurrentIndustries: async (): Promise<ApiResponse<Industry[]>> => {
    const response = await employerHttp.get<ApiResponse<Industry[]>>(
      "/jobs/me/industries/current"
    );
    return response.data;
  },

  getMyCurrentLocations: async (): Promise<ApiResponse<Province[]>> => {
    const response = await employerHttp.get<ApiResponse<Province[]>>(
      "/jobs/me/locations/current"
    );
    return response.data;
  },

  updateJobStatus: async (
    id: number,
    status: JobStatus
  ): Promise<ApiResponse> => {
    const response = await employerHttp.patch<ApiResponse>(
      `/jobs/status/${id}?status=${status}`
    );
    return response.data;
  },

  // ====== PUBLIC APIs (no authentication required) ======
  getJobById: async (id: number): Promise<ApiResponse<JobResponse>> => {
    const response = await publicHttp.get<ApiResponse<JobResponse>>(
      `/jobs/${id}`
    );
    return response.data;
  },

  // Get job by ID with authentication (for admin to view all statuses)
  getJobByIdWithAuth: async (id: number): Promise<ApiResponse<JobResponse>> => {
    const response = await userHttp.get<ApiResponse<JobResponse>>(
      `/jobs/${id}`
    );
    return response.data;
  },

  searchJobsAdvanced: async (
    params: JobsAdvancedSearchParams
  ): Promise<ApiResponse<PageResponse<JobResponse>>> => {
    const response = await publicHttp.get<
      ApiResponse<PageResponse<JobResponse>>
    >("/jobs/advanced", {
      params,
    });
    return response.data;
  },

  getPopularLocations: async (limit = 10): Promise<ApiResponse> => {
    const response = await publicHttp.get<ApiResponse>(
      "/jobs/locations/popular",
      {
        params: { limit },
      }
    );
    return response.data;
  },

  getPopularIndustries: async (limit = 10): Promise<ApiResponse> => {
    const response = await publicHttp.get<ApiResponse>(
      "/jobs/industries/popular",
      {
        params: { limit },
      }
    );
    return response.data;
  },

  getTopAttractiveJobs: async (
    limit = 10
  ): Promise<ApiResponse<JobResponse[]>> => {
    const response = await publicHttp.get<ApiResponse<JobResponse[]>>(
      "/jobs/top-attractive",
      {
        params: { limit },
      }
    );
    return response.data;
  },

  // ====== ADMIN APIs (require admin authentication) ======
  // Get all jobs (ADMIN only)
  getAllJobs: async (
    params?: With<SearchParams, { provinceId?: number; industryId?: number }>
  ): Promise<ApiResponse<PageResponse<JobResponse>>> => {
    const response = await userHttp.get<ApiResponse<PageResponse<JobResponse>>>(
      "/jobs/all",
      {
        params,
      }
    );
    return response.data;
  },

  // Update job status (ADMIN only)
  updateJobStatusAsAdmin: async (
    id: number,
    status: JobStatus
  ): Promise<ApiResponse> => {
    const response = await userHttp.patch<ApiResponse>(
      `/jobs/status/${id}`,
      null,
      {
        params: { status },
      }
    );
    return response.data;
  },

  // Delete job (ADMIN only)
  deleteJobAsAdmin: async (id: number): Promise<ApiResponse> => {
    const response = await userHttp.delete<ApiResponse>(`/jobs/${id}`);
    return response.data;
  },

  getCategoriesWithJobCount: async (): Promise<
    ApiResponse<CategoryJobResponse[]>
  > => {
    const response = await publicHttp.get<ApiResponse<CategoryJobResponse[]>>(
      "/categories-job/industries/job-count"
    );
    return response.data;
  },

  // Get jobs by employer id (public)
  getJobsByEmployerId: async (
    employerId: number,
    pageNumber = 1,
    pageSize = 10
  ): Promise<ApiResponse<PageResponse<JobResponse>>> => {
    const response = await publicHttp.get<
      ApiResponse<PageResponse<JobResponse>>
    >(`/jobs/openings/${employerId}`, {
      params: {
        pageNumber,
        pageSize,
      },
    });
    return response.data;
  },

  // ====== USER/JOB SEEKER APIs (require user authentication) ======
  // Check if job is saved
  checkSavedJob: async (jobId: number): Promise<ApiResponse<boolean>> => {
    const response = await userHttp.get<ApiResponse<boolean>>(
      `/saved-jobs/check/${jobId}`
    );
    return response.data;
  },

  // Toggle save/unsave job
  toggleSavedJob: async (jobId: number): Promise<ApiResponse> => {
    const response = await userHttp.post<ApiResponse>(
      `/saved-jobs/toggle/${jobId}`
    );
    return response.data;
  },

  // Get saved jobs with pagination
  getSavedJobs: async (
    pageNumber = 1,
    pageSize = 10
  ): Promise<ApiResponse<PageResponse<JobResponse>>> => {
    const response = await userHttp.get<ApiResponse<PageResponse<JobResponse>>>(
      "/saved-jobs",
      {
        params: {
          pageNumber,
          pageSize,
        },
      }
    );
    return response.data;
  },
};
