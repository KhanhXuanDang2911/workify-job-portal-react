import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil } from "lucide-react";
import BaseModal from "@/components/BaseModal/BaseModal";

export default function CompanyInformationModal() {
  const [formData, setFormData] = useState({
    companyName: "Dung Van",
    numberOfEmployers: "25 - 99",
    city: "Da Nang",
    district: "Hai Chau District",
    address: "130 Nguyễn Sinh Sắc",
    contactName: "",
    contactPhone: "",
  });

  return (
    <BaseModal
      title="Company information"
      trigger={
        <Button variant="ghost" size="sm" className="border border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2]">
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      }
      className="!max-w-2xl"
      footer={(onClose) => (
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2] w-28 bg-transparent"
          >
            Cancel
          </Button>
          <Button className="bg-[#1967d2] hover:bg-[#1557b0]" onClick={onClose}>
            Update
          </Button>
        </div>
      )}
    >
      <div className="space-y-4 max-h-[60vh] overflow-y-auto px-2 py-3">
        <div>
          <Label htmlFor="companyName">
            Company name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] mt-2"
          />
        </div>

        <div>
          <Label htmlFor="numberOfEmployers">
            Number of employers <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.numberOfEmployers} onValueChange={(value) => setFormData({ ...formData, numberOfEmployers: value })}>
            <SelectTrigger className="mt-2 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1 - 24" className="focus:bg-sky-200 focus:text-[#1967d2]">
                1 - 24
              </SelectItem>
              <SelectItem value="25 - 99" className="focus:bg-sky-200 focus:text-[#1967d2]">
                25 - 99
              </SelectItem>
              <SelectItem value="100 - 499" className="focus:bg-sky-200 focus:text-[#1967d2]">
                100 - 499
              </SelectItem>
              <SelectItem value="500+" className="focus:bg-sky-200 focus:text-[#1967d2]">
                500+
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>
            Contact address <span className="text-red-500">*</span>
          </Label>
          <div className="flex flex-row gap-2 mt-2">
            <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Da Nang" className="focus:bg-sky-200 focus:text-[#1967d2]">
                  Da Nang
                </SelectItem>
                <SelectItem value="Ha Noi" className="focus:bg-sky-200 focus:text-[#1967d2]">
                  Ha Noi
                </SelectItem>
                <SelectItem value="Ho Chi Minh" className="focus:bg-sky-200 focus:text-[#1967d2]">
                  Ho Chi Minh
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={formData.district} onValueChange={(value) => setFormData({ ...formData, district: value })}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hai Chau District" className="focus:bg-sky-200 focus:text-[#1967d2]">
                  Hai Chau District
                </SelectItem>
                <SelectItem value="Thanh Khe District" className="focus:bg-sky-200 focus:text-[#1967d2]">
                  Thanh Khe District
                </SelectItem>
                <SelectItem value="Son Tra District" className="focus:bg-sky-200 focus:text-[#1967d2]">
                  Son Tra District
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] mt-4"
            placeholder="Street address"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600 italic">
          *The info you fill below will be used as each job entry default contact. You can also modify these contact info per job basis
        </div>

        <div>
          <Label htmlFor="contactName">Contact Name</Label>
          <Input
            id="contactName"
            value={formData.contactName}
            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
            className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] mt-2"
          />
        </div>

        <div>
          <Label htmlFor="contactPhone">
            Contact Phone <span className="text-red-500">*</span>
          </Label>
          <Input
            id="contactPhone"
            value={formData.contactPhone}
            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] mt-2"
          />
        </div>
      </div>
    </BaseModal>
  );
};