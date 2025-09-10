import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddressSelectorProps {
  province: string;
  district: string;
  ward: string;
  onProvinceChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
  onWardChange: (value: string) => void;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  province,
  district,
  ward,
  onProvinceChange,
  onDistrictChange,
  onWardChange,
}) => {
  // Mock data for Vietnam locations
  const provinces = [
    "Ho Chi Minh City",
    "Hanoi",
    "Da Nang",
    "Can Tho",
    "Hai Phong",
    "An Giang",
    "Ba Ria-Vung Tau",
    "Bac Giang",
    "Bac Kan",
    "Bac Lieu",
    "Bac Ninh",
    "Ben Tre",
    "Binh Dinh",
    "Binh Duong",
    "Binh Phuoc",
    "Binh Thuan",
    "Ca Mau",
    "Cao Bang",
    "Dak Lak",
    "Dak Nong",
  ];

  const getDistrictsByProvince = (selectedProvince: string) => {
    const districtMap: { [key: string]: string[] } = {
      "Ho Chi Minh City": [
        "District 1",
        "District 2",
        "District 3",
        "District 4",
        "District 5",
        "District 7",
        "District 10",
        "Thu Duc City",
        "Binh Thanh",
        "Tan Binh",
      ],
      Hanoi: [
        "Ba Dinh",
        "Hoan Kiem",
        "Hai Ba Trung",
        "Dong Da",
        "Tay Ho",
        "Cau Giay",
        "Thanh Xuan",
        "Hoang Mai",
        "Long Bien",
        "Nam Tu Liem",
      ],
      "Da Nang": [
        "Hai Chau",
        "Thanh Khe",
        "Son Tra",
        "Ngu Hanh Son",
        "Lien Chieu",
        "Cam Le",
        "Hoa Vang",
      ],
    };
    return (
      districtMap[selectedProvince] || [
        "District 1",
        "District 2",
        "District 3",
        "District 4",
        "District 5",
      ]
    );
  };

  const getWardsByDistrict = (selectedDistrict: string) => {
    const wardMap: { [key: string]: string[] } = {
      "District 1": [
        "Ben Nghe Ward",
        "Ben Thanh Ward",
        "Co Giang Ward",
        "Da Kao Ward",
        "Nguyen Cu Trinh Ward",
        "Nguyen Thai Binh Ward",
        "Pham Ngu Lao Ward",
        "Tan Dinh Ward",
      ],
      "District 2": [
        "An Khanh Ward",
        "An Loi Dong Ward",
        "An Phu Ward",
        "Binh An Ward",
        "Binh Khanh Ward",
        "Binh Trung Dong Ward",
        "Binh Trung Tay Ward",
        "Cat Lai Ward",
      ],
      "Thu Duc City": [
        "Linh Chieu Ward",
        "Linh Dong Ward",
        "Linh Tay Ward",
        "Linh Trung Ward",
        "Linh Xuan Ward",
        "Tam Binh Ward",
        "Tam Phu Ward",
        "Truong Tho Ward",
      ],
    };
    return (
      wardMap[selectedDistrict] || [
        "Ward 1",
        "Ward 2",
        "Ward 3",
        "Ward 4",
        "Ward 5",
      ]
    );
  };

  const districts = getDistrictsByProvince(province);
  const wards = getWardsByDistrict(district);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Province/City
        </Label>
        <Select value={province} onValueChange={onProvinceChange}>
          <SelectTrigger className="h-11 border-gray-200 focus:border-[#1967d2] focus:ring-[#1967d2] text-sm">
            <SelectValue placeholder="Select province" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((prov) => (
              <SelectItem key={prov} value={prov} className="text-sm">
                {prov}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">District</Label>
        <Select
          value={district}
          onValueChange={onDistrictChange}
          disabled={!province}
        >
          <SelectTrigger className="h-11 border-gray-200 focus:border-[#1967d2] focus:ring-[#1967d2] text-sm">
            <SelectValue placeholder="Select district" />
          </SelectTrigger>
          <SelectContent>
            {districts.map((dist) => (
              <SelectItem key={dist} value={dist} className="text-sm">
                {dist}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Ward</Label>
        <Select value={ward} onValueChange={onWardChange} disabled={!district}>
          <SelectTrigger className="h-11 border-gray-200 focus:border-[#1967d2] focus:ring-[#1967d2] text-sm">
            <SelectValue placeholder="Select ward" />
          </SelectTrigger>
          <SelectContent>
            {wards.map((w) => (
              <SelectItem key={w} value={w} className="text-sm">
                {w}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AddressSelector;
