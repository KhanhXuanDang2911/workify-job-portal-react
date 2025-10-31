import { useQuery } from "@tanstack/react-query";
import { industryService } from "@/services/industry.service";
import type { Industry } from "@/types";

export function useIndustries(options?: { enabled?: boolean; select?: (data: any) => Industry[] }) {
  return useQuery({
    queryKey: ["industries"],
    queryFn: async () => {
      const response = await industryService.getAllIndustries();
      return response.data;
    },
    staleTime: 1000 * 60 * 30,
    ...options,
  });
}
