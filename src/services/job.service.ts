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

  getJobByIdAsEmployer: async (
    id: number
  ): Promise<ApiResponse<JobResponse>> => {
    const response = await employerHttp.get<ApiResponse<JobResponse>>(
      `/jobs/${id}`
    );
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

  getJobById: async (id: number): Promise<ApiResponse<JobResponse>> => {
    const response = await publicHttp.get<ApiResponse<JobResponse>>(
      `/jobs/${id}`
    );
    return response.data;
  },

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
    limit = 10,
    options?: { industryId?: number }
  ): Promise<ApiResponse<JobResponse[]>> => {
    try {
      if (options?.industryId) {
        const response = await publicHttp.get<ApiResponse<JobResponse[]>>(
          "/jobs/top-attractive",
          {
            params: { limit, industryId: options.industryId },
          }
        );

        if (
          response.data &&
          Array.isArray((response.data as any).data) &&
          ((response.data as any).data as JobResponse[]).length > 0
        ) {
          return response.data as ApiResponse<JobResponse[]>;
        }
      }

      const fallback = await publicHttp.get<ApiResponse<JobResponse[]>>(
        "/jobs/top-attractive",
        {
          params: { limit },
        }
      );
      return fallback.data;
    } catch (e) {
      throw e;
    }
  },

  getPersonalized: async (limit = 10): Promise<ApiResponse<JobResponse[]>> => {
    const response = await userHttp.get<ApiResponse<JobResponse[]>>(
      "/jobs/personalized",
      {
        params: { limit },
      }
    );
    return response.data;
  },

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

  checkSavedJob: async (jobId: number): Promise<ApiResponse<boolean>> => {
    const response = await userHttp.get<ApiResponse<boolean>>(
      `/saved-jobs/check/${jobId}`
    );
    return response.data;
  },

  toggleSavedJob: async (jobId: number): Promise<ApiResponse> => {
    const response = await userHttp.post<ApiResponse>(
      `/saved-jobs/toggle/${jobId}`
    );
    return response.data;
  },

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

  getTotalJobCount: async (): Promise<ApiResponse<number>> => {
    const response = await publicHttp.get<ApiResponse<number>>("/jobs/count");
    return response.data;
  },
};
