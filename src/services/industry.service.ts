import type { ApiResponse, Industry } from "@/types";
import { http } from "@/lib/http";

export const industryService = {
  getAllIndustries: async (): Promise<ApiResponse<Industry[]>> => {
    const response = await http.get<ApiResponse<Industry[]>>("/industries/all");
    return response.data;
  },

  getIndustries: async (pageNumber = 1, pageSize = 10, keyword?: string): Promise<ApiResponse<any>> => {
    const response = await http.get<ApiResponse<any>>("/industries", {
      params: {
        pageNumber,
        pageSize,
        ...(keyword && { keyword }),
      },
    });
    console.log(response.data);
    return response.data;
  },

  getIndustryById: async (id: number): Promise<ApiResponse<Industry>> => {
    const response = await http.get<ApiResponse<Industry>>(`/industries/${id}`);
    return response.data;
  },
};
