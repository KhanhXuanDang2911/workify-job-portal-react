import DistrictsTable from "@/pages/Admin/LocationManagement/DistrictsTable";
import ProvinceDetails from "@/pages/Admin/LocationManagement/ProvinceDetail";
import ProvincesTable from "@/pages/Admin/LocationManagement/ProvincesTable";
import { provinceService } from "@/services";
import type { Province } from "@/types";
import { useQuery } from "@tanstack/react-query";

import { useEffect, useState } from "react";

export default function LocationManagement() {
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);

  const { data: provincesData, isLoading: isLoadingProvinces } = useQuery({
    queryKey: ["provinces", "all"],
      queryFn: async () => provinceService.getProvinces(),
    staleTime: 30 * 60 * 1000,
  });

useEffect(() => {
  if (provincesData && provincesData.data?.length > 0 && !selectedProvince) {
    setSelectedProvince(provincesData.data[0]);
  }
}, [provincesData, selectedProvince]);
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/*  Province List */}
      <div className="w-1/2 border-r border-gray-200 bg-white overflow-y-auto">
        <ProvincesTable onSelectProvince={setSelectedProvince} selectedProvince={selectedProvince} />
      </div>

      {/* Details and Districts */}
      {selectedProvince ? (
        <div className="w-1/2 overflow-y-auto">
          <ProvinceDetails province={selectedProvince} />
          <div className="border-t border-gray-200">
            <DistrictsTable provinceId={selectedProvince.id} />
          </div>
        </div>
      ) : (
        <div className="w-1/2 flex items-center justify-center bg-gray-50">
          <p className="text-gray-400 text-lg">Select a province to view details</p>
        </div>
      )}
    </div>
  );
}
