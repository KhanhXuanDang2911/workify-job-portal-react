import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/services/job.service";
import type { JobsAdvancedSearchParams } from "@/types";

export const useJobsSearch = (params: JobsAdvancedSearchParams) => {
  return useQuery({
    queryKey: ["jobs-search", params],
    queryFn: () => jobService.searchJobsAdvanced(params),
    staleTime: 5 * 60 * 1000, 
  });
};
