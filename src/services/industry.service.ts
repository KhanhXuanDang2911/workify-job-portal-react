import type { ApiResponse, Industry, PageResponse, SearchParams } from "@/types";
import { http } from "@/lib/http";
import type { With } from "@/types/common";

export interface IndustryRequest {
  name: string;
  engName: string;
  description?: string;
  categoryJobId: number;
}

export const industryService = {
  getAllIndustries: async (): Promise<ApiResponse<Industry[]>> => {
    const response = await http.get<ApiResponse<Industry[]>>("/industries/all");
    return response.data;
  },

  getIndustries: async (params:With<SearchParams,{categoryJobId:number}>): Promise<ApiResponse<PageResponse<Industry>>> => {
    const response = await http.get<ApiResponse<PageResponse<Industry>>>("/industries", {
      params
    });
    return response.data;
  },

  getIndustryById: async (id: number): Promise<ApiResponse<Industry>> => {
    const response = await http.get<ApiResponse<Industry>>(`/industries/${id}`);
    return response.data;
  },

  createIndustry: async (data: IndustryRequest): Promise<ApiResponse<Industry>> => {
    const response = await http.post<ApiResponse<Industry>>("/industries", data);
    return response.data;
  },

  updateIndustry: async (id:number,data: IndustryRequest): Promise<ApiResponse<Industry>> => {
    const response = await http.put<ApiResponse<Industry>>(`/industries/${id}`, data);
    return response.data;
  },

  deleteIndustry: async (id: number): Promise<ApiResponse> => {
    const response = await http.delete<ApiResponse>(`/industries/${id}`);
    return response.data;
  },
};
