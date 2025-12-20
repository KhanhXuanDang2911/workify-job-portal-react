import userHttp from "@/lib/userHttp";
import employerHttp from "@/lib/employerHttp";
import type { ApiResponse, PageResponse, SearchParams } from "@/types";
import type { ApplicationRequest, ApplicationResponse } from "@/types";
import { ApplicationStatus } from "@/types";

export const applicationService = {
  applyWithFileCV: async (
    data: ApplicationRequest,
    cvFile: File
  ): Promise<ApiResponse<ApplicationResponse>> => {
    const formData = new FormData();

    const applicationJson = JSON.stringify(data);

    formData.append(
      "application",
      new Blob([applicationJson], { type: "application/json" })
    );

    formData.append("cv", cvFile);
    formData.append("cv", cvFile);

    const response = await userHttp.post<ApiResponse<ApplicationResponse>>(
      "/applications",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  applyWithLinkCV: async (
    data: ApplicationRequest
  ): Promise<ApiResponse<ApplicationResponse>> => {
    const response = await userHttp.post<ApiResponse<ApplicationResponse>>(
      "/applications/link",
      data
    );
    return response.data;
  },

  getLatestApplicationByJob: async (
    jobId: number
  ): Promise<ApiResponse<ApplicationResponse | null>> => {
    const response = await userHttp.get<
      ApiResponse<ApplicationResponse | null>
    >(`/applications/latest/${jobId}`);
    return response.data;
  },

  getApplicationById: async (
    id: number
  ): Promise<ApiResponse<ApplicationResponse>> => {
    const response = await userHttp.get<ApiResponse<ApplicationResponse>>(
      `/applications/${id}`
    );
    return response.data;
  },

  getMyApplications: async (
    params?: SearchParams
  ): Promise<ApiResponse<PageResponse<ApplicationResponse>>> => {
    const response = await userHttp.get<
      ApiResponse<PageResponse<ApplicationResponse>>
    >("/applications/me", { params });
    return response.data;
  },

  getApplicationsByJob: async (
    jobId: number,
    params?: {
      pageNumber?: number;
      pageSize?: number;
      receivedWithin?: number;
      status?: string;
    }
  ): Promise<ApiResponse<PageResponse<ApplicationResponse>>> => {
    const response = await employerHttp.get<
      ApiResponse<PageResponse<ApplicationResponse>>
    >(`/applications/job/${jobId}`, { params });
    return response.data;
  },

  changeApplicationStatus: async (
    id: number,
    status: ApplicationStatus
  ): Promise<ApiResponse<ApplicationResponse>> => {
    const response = await employerHttp.patch<ApiResponse<ApplicationResponse>>(
      `/applications/${id}/status`,
      null,
      { params: { status } }
    );
    return response.data;
  },
};
