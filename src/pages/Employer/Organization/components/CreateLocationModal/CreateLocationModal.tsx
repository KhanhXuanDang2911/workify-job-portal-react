import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import BaseModal from "@/components/BaseModal/BaseModal";

interface CreateLocationModalProps {
  onAddLocation: (location: { officeName: string; officeAddress: string }) => void;
}

export default function CreateLocationModal({ onAddLocation }: CreateLocationModalProps) {
  const [formData, setFormData] = useState({
    officeName: "",
    province: "",
    district: "",
    address: "",
  });

  const handleUpdate = (onClose: () => void) => {
    if (formData.officeName && formData.address) {
      const fullAddress = `${formData.address}, ${formData.province}`;
      onAddLocation({
        officeName: formData.officeName,
        officeAddress: fullAddress,
      });
      setFormData({
        officeName: "",
        province: "",
        district: "",
        address: "",
      });
      onClose();
    }
  };

  return (
    <BaseModal
      title="Create Location"
      trigger={
        <Button variant="ghost" className="text-[#1967d2] hover:text-[#1557b0] -ml-2">
          <Plus className="h-4 w-4 mr-2" />
          Add new location
        </Button>
      }
      footer={(onClose) => (
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2] w-28 bg-transparent"
          >
            Cancel
          </Button>
          <Button className="bg-[#1967d2] w-28 hover:bg-[#1251a3]" onClick={() => handleUpdate(onClose)}>
            Update
          </Button>
        </div>
      )}
      className="!min-w-xl"
    >
      <div className="space-y-4 max-h-[60vh] overflow-y-auto py-4 px-2 ">
        <div>
          <Label htmlFor="officeName">
            Office name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="officeName"
            placeholder="Office name"
            value={formData.officeName}
            onChange={(e) => setFormData({ ...formData, officeName: e.target.value })}
            className=" bg-white focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] mt-2"
          />
        </div>

        <div>
          <Label htmlFor="province">
            Province <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.province} onValueChange={(value) => setFormData({ ...formData, province: value })}>
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder="Please select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ho Chi Minh" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Ho Chi Minh
              </SelectItem>
              <SelectItem value="Ha Noi" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Ha Noi
              </SelectItem>
              <SelectItem value="Da Nang" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Da Nang
              </SelectItem>
              <SelectItem value="Can Tho" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Can Tho
              </SelectItem>
              <SelectItem value="Hai Phong" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Hai Phong
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="province">
            District <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.district} onValueChange={(value) => setFormData({ ...formData, district: value })}>
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder="Please select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ho Chi Minh" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Ho Chi Minh
              </SelectItem>
              <SelectItem value="Ha Noi" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Ha Noi
              </SelectItem>
              <SelectItem value="Da Nang" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Da Nang
              </SelectItem>
              <SelectItem value="Can Tho" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Can Tho
              </SelectItem>
              <SelectItem value="Hai Phong" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Hai Phong
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="address">
            Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className=" bg-white focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] mt-2"
          />
        </div>

        {/* Map Placeholder */}
        <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
          <img
            src="https://plus.unsplash.com/premium_photo-1681488098851-e3913f3b1908?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFwfGVufDB8fDB8fHww"
            alt="Map"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          {/* Zoom Controls */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            <Button size="icon" variant="outline" className="bg-white">
              +
            </Button>
            <Button size="icon" variant="outline" className="bg-white">
              −
            </Button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
