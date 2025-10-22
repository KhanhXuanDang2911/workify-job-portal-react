import { districtService } from "@/services";
import type { District } from "@/types";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export function useDistrictsByProvinceId(provinceId?: number, options?: { enabled?: boolean; select?: (data: any) => any }): UseQueryResult<District[] | undefined> {
  return useQuery({
    queryKey: ["districts", provinceId],
    queryFn: async () => {
      if (!provinceId) return [];
      const response = await districtService.getDistrictsByProvinceId(provinceId);
      return response.data;
    },
    enabled: !!provinceId,
    staleTime: 1000 * 60 * 30,
    ...options,
  });
}
