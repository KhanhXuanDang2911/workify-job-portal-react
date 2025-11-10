import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { districtService, provinceService } from "@/services";
import { useEffect, useMemo } from "react";

interface AddressSelectorProps {
  provinceId: number;
  districtId: number;
  // wardId: string;
  onProvinceChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
  // onWardChange: (value: string) => void;
  errors?: {
    provinceId?: string;
    districtId?: string;
  };
}

function AddressSelector({
  provinceId,
  districtId,
  // wardId,
  onProvinceChange,
  onDistrictChange,
  // onWardChange,
  errors,
}: AddressSelectorProps) {
  const queryProvinces = useQuery({
    queryKey: ["provinces"],
    queryFn: provinceService.getProvinces,
  });
  console.log(queryProvinces);

  const queryDistricts = useQuery({
    queryKey: ["districts", provinceId],
    queryFn: ({ queryKey }) => {
      const [, provinceId] = queryKey;
      return districtService.getDistrictsByProvinceId(provinceId as number);
    },
    enabled: provinceId >= 1,
  });
  console.log(queryDistricts);

  //bug
  const provinces = queryProvinces.data?.data || [];
  const districts = useMemo(() => queryDistricts.data?.data || [], [queryDistricts.data?.data]);

  //bug
  useEffect(() => {
    if (provinceId > 0 && districtId > 0) {
      const districtExists = districts.some((d) => d.id === districtId);
      if (!districtExists && districts.length > 0) {
        onDistrictChange("0");
      }
    }
  }, [provinceId, districts, districtId, onDistrictChange]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Province/City</Label>
        <Select value={provinceId > 0 ? provinceId.toString() : ""} onValueChange={(value) => onProvinceChange(value)} disabled={queryProvinces.isLoading}>
          <SelectTrigger className={`!h-12 w-full bg-white border border-gray-300 focus:border-[#0A2E5C] focus:ring-1 focus:ring-[#0A2E5C]/20 rounded-none text-sm ${errors?.provinceId ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}>
            <SelectValue placeholder="Select province" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((province) => (
              <SelectItem key={province.id} value={province.id.toString()} className="text-sm focus:bg-blue-50 focus:text-[#0A2E5C]">
                {province.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.provinceId && <p className="text-sm text-red-500">{errors.provinceId}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">District</Label>
        <Select
          value={districtId > 0 ? districtId.toString() : ""}
          onValueChange={(value) => onDistrictChange(value)}
          disabled={!provinceId || provinceId === 0 || queryDistricts.isLoading}
        >
          <SelectTrigger className={`!h-12 w-full bg-white border border-gray-300 focus:border-[#0A2E5C] focus:ring-1 focus:ring-[#0A2E5C]/20 rounded-none text-sm ${errors?.districtId ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}>
            <SelectValue placeholder="Select district" />
          </SelectTrigger>
          <SelectContent>
            {districts.map((district) => (
              <SelectItem key={district.id} value={district.id.toString()} className="text-sm focus:bg-blue-50 focus:text-[#0A2E5C]">
                {district.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.districtId && <p className="text-sm text-red-500">{errors.districtId}</p>}
      </div>
    </div>
  );
}

export default AddressSelector;
