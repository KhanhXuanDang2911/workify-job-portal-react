import { useQueries } from "@tanstack/react-query";
import { districtService } from "@/services";
import type { District } from "@/types";

interface Location {
  provinceId?: number;
  [key: string]: any;
}

interface UseDistrictsForLocationsOptions {
  locations: Location[];
  sortFn?: (data: District[]) => District[];
  enabled?: boolean;
}

export function useDistrictsForLocations({
  locations,
  sortFn,
  enabled = true,
}: UseDistrictsForLocationsOptions) {
  const districtQueries = useQueries({
    queries: (locations || []).map((location) => ({
      queryKey: ["districts", location.provinceId],
      queryFn: async () => {
        if (!location.provinceId || location.provinceId === 0) return [];
        const response = await districtService.getDistrictsByProvinceId(
          location.provinceId
        );
        const data = response.data;
        return sortFn ? sortFn(data) : data;
      },
      enabled: enabled && !!location.provinceId && location.provinceId > 0,
      staleTime: 1000 * 60 * 30,
    })),
  });

  const getDistrictsByIndex = (idx: number): District[] => {
    return districtQueries[idx]?.data || [];
  };

  const isLoadingByIndex = (idx: number): boolean => {
    return districtQueries[idx]?.isLoading || false;
  };

  const getErrorByIndex = (idx: number) => {
    return districtQueries[idx]?.error;
  };

  const isAnyLoading = districtQueries.some((query) => query.isLoading);
  const hasAnyError = districtQueries.some((query) => query.isError);

  return {
    districtQueries,
    getDistrictsByIndex,
    isLoadingByIndex,
    getErrorByIndex,
    isAnyLoading,
    hasAnyError,
  };
}
