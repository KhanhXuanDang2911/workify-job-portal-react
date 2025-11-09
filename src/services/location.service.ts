import http from "@/lib/http";
import type { ApiResponse, District, PageResponse, Province, SearchParams } from "@/types";

export const provinceService = {
  getProvinces: async (): Promise<ApiResponse<Province[]>> => {
    const response = await http.get<ApiResponse<Province[]>>("/provinces");
    return response.data;
  },

  getProvincesWithFilters: async (params: SearchParams): Promise<ApiResponse<PageResponse<Province>>> => {
    const response = await http.get<ApiResponse<PageResponse<Province>>>("/provinces", { params });
    return response.data;
  },

  getProvinceById: async (id: number): Promise<ApiResponse<Province>> => {
    const response = await http.get<ApiResponse<Province>>(`/provinces/${id}`);
    return response.data;
  },

  createProvince: async (data: { name: string; engName: string; code: string }): Promise<ApiResponse<Province>> => {
    const response = await http.post<ApiResponse<Province>>("/provinces", data);
    return response.data;
  },

  updateProvince: async (id: number, data: { name?: string; engName?: string; code?: string }): Promise<ApiResponse<Province>> => {
    const response = await http.put<ApiResponse<Province>>(`/provinces/${id}`, data);
    return response.data;
  },

  deleteProvince: async (id: number): Promise<ApiResponse<null>> => {
    const response = await http.delete<ApiResponse<null>>(`/provinces/${id}`);
    return response.data;
  },
};

export const districtService = {
  getDistricts: async (): Promise<ApiResponse<District[]>> => {
    const response = await http.get<ApiResponse<District[]>>("/districts");
    return response.data;
  },

  getDistrictsByProvinceId: async (provinceId: number): Promise<ApiResponse<District[]>> => {
    const response = await http.get<ApiResponse<District[]>>(`/districts/province/${provinceId}`);
    return response.data;
  },

  getDistrictById: async (id: number): Promise<ApiResponse<District>> => {
    const response = await http.get<ApiResponse<District>>(`/districts/${id}`);
    return response.data;
  },

  createDistrict: async (data: { name: string; code: string; provinceId: number }): Promise<ApiResponse<District>> => {
    const response = await http.post<ApiResponse<District>>("/districts", data);
    return response.data;
  },

  updateDistrict: async (id: number, data: { name?: string; code?: string; provinceId?: number }): Promise<ApiResponse<District>> => {
    const response = await http.put<ApiResponse<District>>(`/districts/${id}`, data);
    return response.data;
    },
  
    deleteDistrict: async (id: number): Promise<ApiResponse<null>> => {
        const response = await http.delete<ApiResponse<null>>(`/districts/${id}`);
        return response.data;
    }
};
