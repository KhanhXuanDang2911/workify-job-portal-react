import userHttp from "@/lib/userHttp";
import type { ApiResponse, PageResponse } from "@/types";
import type { ResumeItem, ResumePayload } from "@/types/resume.type";

// --- Helper Functions for Data Transformation ---

// Convert Frontend Template Type to API Template Type (replace hyphen with underscore)
const toApiTemplate = (frontendTemplate: string): string => {
  return frontendTemplate.replace(/-/g, "_"); // TEMPLATE-PANDA -> TEMPLATE_PANDA
};

// Convert API Template Type back to Frontend Template Type (replace underscore with hyphen)
const fromApiTemplate = (apiTemplate: string): string => {
  return apiTemplate.replace(/_/g, "-"); // TEMPLATE_PANDA -> TEMPLATE-PANDA
};

// Convert Frontend field names to API field names in basicInfo
const toApiBasicInfo = (basicInfo: any) => {
  return {
    position: basicInfo.position || "",
    fullName: basicInfo.fullName || "",
    email: basicInfo.email || "",
    phone: basicInfo.phoneNumber || "", // phoneNumber -> phone
    location: basicInfo.location || "",
    avatarUrl: basicInfo.profilePhoto || "", // profilePhoto -> avatarUrl
    customFields: basicInfo.customFields || [],
  };
};

// Convert API field names back to Frontend field names in basicInfo
const fromApiBasicInfo = (basicInfo: any) => {
  return {
    position: basicInfo.position || "",
    fullName: basicInfo.fullName || "",
    email: basicInfo.email || "",
    phoneNumber: basicInfo.phone || "", // phone -> phoneNumber
    location: basicInfo.location || "",
    profilePhoto: basicInfo.avatarUrl || "", // avatarUrl -> profilePhoto
    customFields: basicInfo.customFields || [],
  };
};

// Transform Frontend Payload -> API Payload
const toApiPayload = (payload: ResumePayload): any => {
  return {
    title: payload.title,
    template: toApiTemplate(payload.template),
    fontFamily: payload.fontFamily,
    data: {
      ...payload.data,
      basicInfo: toApiBasicInfo(payload.data.basicInfo),
    },
  };
};

// Transform API Response -> Frontend Data
const fromApiData = (apiItem: any): ResumeItem => {
  return {
    ...apiItem,
    template: fromApiTemplate(apiItem.template),
    data: {
      ...apiItem.data,
      basicInfo: fromApiBasicInfo(apiItem.data.basicInfo),
    },
  };
};

export const resumeService = {
  // Create Resume with optional avatar image
  createResume: async (
    payload: ResumePayload,
    avatarFile?: File | null
  ): Promise<ApiResponse<ResumeItem>> => {
    const apiPayload = toApiPayload(payload);

    const formData = new FormData();
    formData.append(
      "request",
      new Blob([JSON.stringify(apiPayload)], { type: "application/json" })
    );

    if (avatarFile) {
      formData.append("image", avatarFile);
    }

    const response = await userHttp.post<ApiResponse<any>>(
      "/resumes",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // Transform response back to frontend model
    if (response.data.data) {
      response.data.data = fromApiData(response.data.data);
    }
    return response.data;
  },

  // Update Resume with optional avatar image
  updateResume: async (
    id: number,
    payload: ResumePayload,
    avatarFile?: File | null
  ): Promise<ApiResponse<ResumeItem>> => {
    const apiPayload = toApiPayload(payload);

    const formData = new FormData();
    formData.append(
      "request",
      new Blob([JSON.stringify(apiPayload)], { type: "application/json" })
    );

    if (avatarFile) {
      formData.append("image", avatarFile);
    }

    const response = await userHttp.put<ApiResponse<any>>(
      `/resumes/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // Transform response back
    if (response.data.data) {
      response.data.data = fromApiData(response.data.data);
    }
    return response.data;
  },

  // Delete Resume
  deleteResume: async (id: number): Promise<ApiResponse<null>> => {
    const response = await userHttp.delete<ApiResponse<null>>(`/resumes/${id}`);
    return response.data;
  },

  // Get Resume Details
  getResumeById: async (id: number): Promise<ApiResponse<ResumeItem>> => {
    const response = await userHttp.get<ApiResponse<any>>(`/resumes/${id}`);
    if (response.data.data) {
      response.data.data = fromApiData(response.data.data);
    }
    return response.data;
  },

  // Get My Resumes (List with Pagination)
  getMyResumes: async (
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PageResponse<ResumeItem>>> => {
    const response = await userHttp.get<ApiResponse<PageResponse<any>>>(
      "/resumes",
      {
        params: {
          pageNumber,
          pageSize,
        },
      }
    );

    // Transform items in the list
    if (response.data.data && response.data.data.items) {
      response.data.data.items = response.data.data.items.map((item: any) =>
        fromApiData(item)
      );
    }

    return response.data as ApiResponse<PageResponse<ResumeItem>>;
  },

  // Get Default Resume
  getDefaultResume: async (): Promise<ApiResponse<ResumeItem>> => {
    const response = await userHttp.get<ApiResponse<any>>("/resumes/default");
    if (response.data.data) {
      response.data.data = fromApiData(response.data.data);
    }
    return response.data;
  },

  // Get Public Resume
  getPublicResume: async (
    id: string | number
  ): Promise<ApiResponse<ResumeItem>> => {
    const response = await userHttp.get<ApiResponse<any>>(
      `/resumes/public/${id}`
    );
    if (response.data.data) {
      response.data.data = fromApiData(response.data.data);
    }
    return response.data;
  },

  // Share/Unshare Resume
  toggleShareResume: async (
    id: number,
    isShared: boolean
  ): Promise<ApiResponse<ResumeItem>> => {
    const response = await userHttp.patch<ApiResponse<any>>(
      `/resumes/${id}/share?isShared=${isShared}`
    );
    // Note: The response data might just be the resume object or wrapped.
    // Assuming standard ApiResponse structure where data is the ResumeItem.
    if (response.data.data) {
      response.data.data = fromApiData(response.data.data);
    }
    return response.data;
  },
};
