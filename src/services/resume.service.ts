import userHttp from "@/lib/userHttp";
import type { ApiResponse, PageResponse } from "@/types";
import type { ResumeItem, ResumePayload } from "@/types/resume.type";

const toApiTemplate = (frontendTemplate: string): string => {
  return frontendTemplate.replace(/-/g, "_");
};

const fromApiTemplate = (apiTemplate: string): string => {
  return apiTemplate.replace(/_/g, "-");
};

const toApiBasicInfo = (basicInfo: any) => {
  return {
    position: basicInfo.position || "",
    fullName: basicInfo.fullName || "",
    email: basicInfo.email || "",
    phone: basicInfo.phoneNumber || "",
    location: basicInfo.location || "",
    avatarUrl: basicInfo.profilePhoto || "",
    customFields: basicInfo.customFields || [],
  };
};

const fromApiBasicInfo = (basicInfo: any) => {
  return {
    position: basicInfo.position || "",
    fullName: basicInfo.fullName || "",
    email: basicInfo.email || "",
    phoneNumber: basicInfo.phone || "",
    location: basicInfo.location || "",
    profilePhoto: basicInfo.avatarUrl || "",
    customFields: basicInfo.customFields || [],
  };
};

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

    if (response.data.data) {
      response.data.data = fromApiData(response.data.data);
    }
    return response.data;
  },

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

    if (response.data.data) {
      response.data.data = fromApiData(response.data.data);
    }
    return response.data;
  },

  deleteResume: async (id: number): Promise<ApiResponse<null>> => {
    const response = await userHttp.delete<ApiResponse<null>>(`/resumes/${id}`);
    return response.data;
  },

  getResumeById: async (id: number): Promise<ApiResponse<ResumeItem>> => {
    const response = await userHttp.get<ApiResponse<any>>(`/resumes/${id}`);
    if (response.data.data) {
      response.data.data = fromApiData(response.data.data);
    }
    return response.data;
  },

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

    if (response.data.data && response.data.data.items) {
      response.data.data.items = response.data.data.items.map((item: any) =>
        fromApiData(item)
      );
    }

    return response.data as ApiResponse<PageResponse<ResumeItem>>;
  },

  getDefaultResume: async (): Promise<ApiResponse<ResumeItem>> => {
    const response = await userHttp.get<ApiResponse<any>>("/resumes/default");
    if (response.data.data) {
      response.data.data = fromApiData(response.data.data);
    }
    return response.data;
  },

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

  toggleShareResume: async (
    id: number,
    isShared: boolean
  ): Promise<ApiResponse<ResumeItem>> => {
    const response = await userHttp.patch<ApiResponse<any>>(
      `/resumes/${id}/share?isShared=${isShared}`
    );

    if (response.data.data) {
      response.data.data = fromApiData(response.data.data);
    }
    return response.data;
  },
};
