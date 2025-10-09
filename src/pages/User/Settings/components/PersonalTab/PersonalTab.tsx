import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";

export default function PersonalTab() {
  const [formData, setFormData] = useState<{
    profilePicture: string;
    profileFile: File | null;
    fullName: string;
    title: string;
    experience: string;
    education: string;
    website: string;
  }>({
    profilePicture: "",
    profileFile: null,
    fullName: "",
    title: "",
    experience: "",
    education: "",
    website: "",
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleProfileClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      alert("File quá lớn. Kích thước tối đa 5 MB.");
      e.currentTarget.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, profilePicture: reader.result as string, profileFile: file }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Personal data:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture */}
          <div className="lg:col-span-1">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Profile Picture</Label>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleProfileChange} className="hidden" />

            <div
              role="button"
              tabIndex={0}
              onClick={handleProfileClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleProfileClick();
                }
              }}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-white hover:border-[#1967d2] hover:bg-[#e3eefc] group transition-colors cursor-pointer"
            >
              {formData.profilePicture ? (
                <img src={formData.profilePicture} alt="Profile preview" className="w-24 h-24 rounded-full object-cover mb-2" />
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mb-2 group-hover:text-[#1967d2]" />
                  <p className="text-sm font-medium text-gray-700 mb-1">Browse photo or drop here</p>
                  <p className="text-xs text-gray-500 text-center">A photo larger than 400 pixels work best. Max photo size 5 MB.</p>
                </>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-2 space-y-4">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 mb-1 block">
                Full name
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="focus-visible:ring-1 focus-visible:ring-[#1967d2] focus-visible:border-none"
              />
            </div>

            {/* Title/Headline */}
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-1 block">
                Tittle/headline
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="focus-visible:ring-1 focus-visible:ring-[#1967d2] focus-visible:border-none"
              />
            </div>

            {/* Experience and Education */}
            <div className="flex flex-row items-center justify-between gap-4">
              <div className="flex-1 flex flex-col">
                <Label htmlFor="experience" className="text-sm font-medium text-gray-700 mb-1 block">
                  Experience
                </Label>
                <Select value={formData.experience} onValueChange={(val) => setFormData({ ...formData, experience: val })}>
                  <SelectTrigger className="focus-visible:ring-1 w-full  focus-visible:ring-[#1967d2]">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="self-stretch flex-1">
                    <SelectItem value="0-1" className="focus:bg-sky-200 focus:text-[#1967d2]">
                      0-1 years
                    </SelectItem>
                    <SelectItem value="1-3" className="focus:bg-sky-200 focus:text-[#1967d2]">
                      1-3 years
                    </SelectItem>
                    <SelectItem value="3-5" className="focus:bg-sky-200 focus:text-[#1967d2]">
                      3-5 years
                    </SelectItem>
                    <SelectItem value="5+" className="focus:bg-sky-200 focus:text-[#1967d2]">
                      5+ years
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Label htmlFor="education" className="text-sm font-medium text-gray-700 mb-1 block">
                  Educations
                </Label>
                <Select value={formData.education} onValueChange={(val) => setFormData({ ...formData, education: val })}>
                  <SelectTrigger className="focus-visible:ring-1 w-full focus-visible:ring-[#1967d2]">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school" className="focus:bg-sky-200 focus:text-[#1967d2]">
                      High School
                    </SelectItem>
                    <SelectItem value="bachelor" className="focus:bg-sky-200 focus:text-[#1967d2]">
                      Bachelor's Degree
                    </SelectItem>
                    <SelectItem value="master" className="focus:bg-sky-200 focus:text-[#1967d2]">
                      Master's Degree
                    </SelectItem>
                    <SelectItem value="phd" className="focus:bg-sky-200 focus:text-[#1967d2]">
                      PhD
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Personal Website */}
            <div>
              <Label htmlFor="website" className="text-sm font-medium text-gray-700 mb-1 block">
                Personal Website
              </Label>
              <div className="relative">
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="Website url..."
                  className="focus-visible:ring-1 focus-visible:ring-[#1967d2] focus-visible:border-none pl-8"
                />
                <svg className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1967d2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-center">
          <Button type="submit" className="bg-[#1967d2] hover:bg-[#1557b0] px-12 py-6 text-base">
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
}
