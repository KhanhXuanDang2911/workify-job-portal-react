import http from "@/lib/http";
import type { ApiResponse } from "@/types";
import type { ApplicationRequest, ApplicationResponse } from "@/types/application.type";

export const applicationService = {
  // Apply with file CV (multipart/form-data)
  applyWithFileCV: async (data: ApplicationRequest, cvFile: File): Promise<ApiResponse<ApplicationResponse>> => {
    const formData = new FormData();
    
    // Append application data as JSON string directly (like mobile version)
    // Backend Spring Boot expects JSON string in multipart form
    const applicationJson = JSON.stringify(data);
    console.log("Application JSON:", applicationJson);
    console.log("Application data:", data);
    
    // Append JSON string directly (not as Blob) - like mobile version
    formData.append("application", applicationJson);
    
    // Append CV file
    formData.append("cv", cvFile);
    console.log("CV File:", cvFile.name, cvFile.type, cvFile.size);

    // Log FormData entries for debugging
    console.log("FormData entries:");
    for (const [key, value] of formData.entries()) {
      const val = value as any;
      if (val instanceof File) {
        console.log(`  ${key}: File(${val.name}, ${val.type}, ${val.size} bytes)`);
      } else if (val instanceof Blob) {
        console.log(`  ${key}: Blob(${val.type}, ${val.size} bytes)`);
      } else {
        console.log(`  ${key}:`, String(val).substring(0, 100));
      }
    }

    // Don't set Content-Type header - let axios/browser set it automatically with boundary
    const response = await http.post<ApiResponse<ApplicationResponse>>("/applications", formData);
    return response.data;
  },

  // Apply with link CV (application/json)
  applyWithLinkCV: async (data: ApplicationRequest): Promise<ApiResponse<ApplicationResponse>> => {
    const response = await http.post<ApiResponse<ApplicationResponse>>("/applications/link", data);
    return response.data;
  },

  // Get latest application by job ID
  getLatestApplicationByJob: async (jobId: number): Promise<ApiResponse<ApplicationResponse | null>> => {
    const response = await http.get<ApiResponse<ApplicationResponse | null>>(`/applications/latest/${jobId}`);
    return response.data;
  },

  // Get application by ID
  getApplicationById: async (id: number): Promise<ApiResponse<ApplicationResponse>> => {
    const response = await http.get<ApiResponse<ApplicationResponse>>(`/applications/${id}`);
    return response.data;
  },
};

