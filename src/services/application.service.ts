import userHttp from "@/lib/userHttp";
import employerHttp from "@/lib/employerHttp";
import type { ApiResponse, PageResponse, SearchParams } from "@/types";
import type { ApplicationRequest, ApplicationResponse } from "@/types";
import { ApplicationStatus } from "@/types";

export const applicationService = {
  // Apply with file CV (multipart/form-data)
  applyWithFileCV: async (
    data: ApplicationRequest,
    cvFile: File
  ): Promise<ApiResponse<ApplicationResponse>> => {
    const formData = new FormData();

    // Append application data as Blob with application/json type
    // Backend Spring Boot expects JSON in multipart form with proper Content-Type
    const applicationJson = JSON.stringify(data);

    // Append JSON as Blob with application/json Content-Type
    formData.append(
      "application",
      new Blob([applicationJson], { type: "application/json" })
    );

    // Append CV file
    formData.append("cv", cvFile);
    formData.append("cv", cvFile);

    // Set Content-Type header for multipart/form-data - axios/browser will add boundary automatically
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

  // Apply with link CV (application/json)
  applyWithLinkCV: async (
    data: ApplicationRequest
  ): Promise<ApiResponse<ApplicationResponse>> => {
    const response = await userHttp.post<ApiResponse<ApplicationResponse>>(
      "/applications/link",
      data
    );
    return response.data;
  },

  // Get latest application by job ID
  getLatestApplicationByJob: async (
    jobId: number
  ): Promise<ApiResponse<ApplicationResponse | null>> => {
    const response = await userHttp.get<
      ApiResponse<ApplicationResponse | null>
    >(`/applications/latest/${jobId}`);
    return response.data;
  },

  // Get application by ID
  getApplicationById: async (
    id: number
  ): Promise<ApiResponse<ApplicationResponse>> => {
    const response = await userHttp.get<ApiResponse<ApplicationResponse>>(
      `/applications/${id}`
    );
    return response.data;
  },

  // Get my applications (JOB_SEEKER, ADMIN)
  getMyApplications: async (
    params?: SearchParams
  ): Promise<ApiResponse<PageResponse<ApplicationResponse>>> => {
    const response = await userHttp.get<
      ApiResponse<PageResponse<ApplicationResponse>>
    >("/applications/me", { params });
    return response.data;
  },

  // Get applications by job ID (EMPLOYER)
  getApplicationsByJob: async (
    jobId: number,
    params?: {
      pageNumber?: number;
      pageSize?: number;
      receivedWithin?: number; // days
      status?: string; // ApplicationStatus
    }
  ): Promise<ApiResponse<PageResponse<ApplicationResponse>>> => {
    const response = await employerHttp.get<
      ApiResponse<PageResponse<ApplicationResponse>>
    >(`/applications/job/${jobId}`, { params });
    return response.data;
  },

  // Change application status (EMPLOYER)
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
