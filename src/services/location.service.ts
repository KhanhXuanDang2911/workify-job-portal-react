import publicHttp from "@/lib/publicHttp";
import userHttp from "@/lib/userHttp";
import type {
  ApiResponse,
  District,
  PageResponse,
  Province,
  SearchParams,
} from "@/types";

export const provinceService = {
  // Public: Get all provinces
  getProvinces: async (): Promise<ApiResponse<Province[]>> => {
    const response = await publicHttp.get<ApiResponse<Province[]>>(
      "/provinces"
    );
    return response.data;
  },

  // Public: Get provinces with filters
  getProvincesWithFilters: async (
    params: SearchParams
  ): Promise<ApiResponse<PageResponse<Province>>> => {
    const response = await publicHttp.get<ApiResponse<PageResponse<Province>>>(
      "/provinces",
      { params }
    );
    return response.data;
  },

  // Public: Get province by ID
  getProvinceById: async (id: number): Promise<ApiResponse<Province>> => {
    const response = await publicHttp.get<ApiResponse<Province>>(
      `/provinces/${id}`
    );
    return response.data;
  },

  // Admin: Create province
  createProvince: async (data: {
    name: string;
    engName: string;
    code: string;
  }): Promise<ApiResponse<Province>> => {
    const response = await userHttp.post<ApiResponse<Province>>(
      "/provinces",
      data
    );
    return response.data;
  },

  // Admin: Update province
  updateProvince: async (
    id: number,
    data: { name?: string; engName?: string; code?: string }
  ): Promise<ApiResponse<Province>> => {
    const response = await userHttp.put<ApiResponse<Province>>(
      `/provinces/${id}`,
      data
    );
    return response.data;
  },

  // Admin: Delete province
  deleteProvince: async (id: number): Promise<ApiResponse<null>> => {
    const response = await userHttp.delete<ApiResponse<null>>(
      `/provinces/${id}`
    );
    return response.data;
  },
};

export const districtService = {
  // Public: Get all districts
  getDistricts: async (): Promise<ApiResponse<District[]>> => {
    const response = await publicHttp.get<ApiResponse<District[]>>(
      "/districts"
    );
    return response.data;
  },

  // Public: Get districts by province ID
  getDistrictsByProvinceId: async (
    provinceId: number
  ): Promise<ApiResponse<District[]>> => {
    const response = await publicHttp.get<ApiResponse<District[]>>(
      `/districts/province/${provinceId}`
    );
    return response.data;
  },

  // Public: Get district by ID
  getDistrictById: async (id: number): Promise<ApiResponse<District>> => {
    const response = await publicHttp.get<ApiResponse<District>>(
      `/districts/${id}`
    );
    return response.data;
  },

  // Admin: Create district
  createDistrict: async (data: {
    name: string;
    code: string;
    provinceId: number;
  }): Promise<ApiResponse<District>> => {
    const response = await userHttp.post<ApiResponse<District>>(
      "/districts",
      data
    );
    return response.data;
  },

  // Admin: Update district
  updateDistrict: async (
    id: number,
    data: { name?: string; code?: string; provinceId?: number }
  ): Promise<ApiResponse<District>> => {
    const response = await userHttp.put<ApiResponse<District>>(
      `/districts/${id}`,
      data
    );
    return response.data;
  },

  // Admin: Delete district
  deleteDistrict: async (id: number): Promise<ApiResponse<null>> => {
    const response = await userHttp.delete<ApiResponse<null>>(
      `/districts/${id}`
    );
    return response.data;
  },
};
