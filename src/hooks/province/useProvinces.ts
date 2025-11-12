import { provinceService } from "@/services";
import type { Province } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useProvinces(options?: {
  enabled?: boolean;
  select?: (data: Province[]) => any;
}) {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: async () => {
      const response = await provinceService.getProvinces();
      return response.data;
    },
    staleTime: 1000 * 60 * 60,
    ...options,
  });
}
