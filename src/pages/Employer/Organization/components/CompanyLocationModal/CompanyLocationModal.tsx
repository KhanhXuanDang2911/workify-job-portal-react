import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, MoreVertical } from "lucide-react";
import BaseModal from "@/components/BaseModal/BaseModal";
import CreateLocationModal from "@/pages/Employer/Organization/components/CreateLocationModal";

interface Location {
  id: string;
  officeName: string;
  officeAddress: string;
}

export default function CompanyLocationModal() {
  const [locations, setLocations] = useState<Location[]>([
    {
      id: "1",
      officeName: "Dung Van Technology",
      officeAddress: "130 Nguyễn Chí Thanh, Hai Chau District, Da Nang",
    },
    {
      id: "2",
      officeName: "FPT Building",
      officeAddress: "số 17 Duy Tân, Cầu Giấy, Hà Nội, Cau Giay District, Ha Noi",
    },
  ]);

  const handleAddLocation = (newLocation: Omit<Location, "id">) => {
    setLocations([...locations, { ...newLocation, id: Date.now().toString() }]);
  };

  return (
    <BaseModal
      title="Company Location"
      trigger={
        <Button variant="ghost" size="sm" className="border border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2]">
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      }
      className="!max-w-3xl"
    >
      <div className="space-y-4 ">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_3fr_auto] gap-4 pb-2 border-b bg-[#1967d2] px-4 py-2 rounded-t-lg">
          <div className="font-medium text-white">Office name</div>
          <div className="font-medium text-white">Office address</div>
          <div className="w-8"></div>
        </div>

        {/* Table Rows */}
        {locations.map((location) => (
          <div key={location.id} className="grid grid-cols-[2fr_3fr_auto] gap-4 items-center px-4 py-2 hover:bg-sky-50 rounded">
            <div className="text-[#1967d2] font-medium">{location.officeName}</div>
            <div className="text-gray-700">{location.officeAddress}</div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {/* Add New Location */}
        <CreateLocationModal onAddLocation={handleAddLocation} />
      </div>
    </BaseModal>
  );
}
