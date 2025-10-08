import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function ProfileTab() {
  const [formData, setFormData] = useState({
    nationality: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    education: "",
    experience: "",
    biography: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile data:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white w-full p-5 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nationality */}
        <div>
          <Label htmlFor="nationality" className="text-sm font-medium text-gray-700 mb-2 block">
            Nationality
          </Label>
          <Select value={formData.nationality} onValueChange={(val) => setFormData({ ...formData, nationality: val })}>
            <SelectTrigger className="focus-visible:ring-1 w-full focus-visible:ring-[#1967d2]">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vietnam" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Vietnam
              </SelectItem>
              <SelectItem value="usa" className="focus:bg-sky-200 focus:text-[#1967d2]">
                United States
              </SelectItem>
              <SelectItem value="uk" className="focus:bg-sky-200 focus:text-[#1967d2]">
                United Kingdom
              </SelectItem>
              <SelectItem value="other" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Other
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date of Birth */}
        <div>
          <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700 mb-2 block">
            Date of Birth
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            placeholder="dd/mm/yyyy"
            className="focus-visible:ring-1 focus-visible:ring-[#1967d2] focus-visible:border-none"
          />
        </div>

        {/* Gender */}
        <div>
          <Label htmlFor="gender" className="text-sm font-medium text-gray-700 mb-2 block">
            Gender
          </Label>
          <Select value={formData.gender} onValueChange={(val) => setFormData({ ...formData, gender: val })}>
            <SelectTrigger className="focus-visible:ring-1 w-full focus-visible:ring-[#1967d2]">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Male
              </SelectItem>
              <SelectItem value="female" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Female
              </SelectItem>
              <SelectItem value="other" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Other
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Marital Status */}
        <div>
          <Label htmlFor="maritalStatus" className="text-sm font-medium text-gray-700 mb-2 block">
            Marital Status
          </Label>
          <Select value={formData.maritalStatus} onValueChange={(val) => setFormData({ ...formData, maritalStatus: val })}>
            <SelectTrigger className="focus-visible:ring-1 w-full focus-visible:ring-[#1967d2]">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Single
              </SelectItem>
              <SelectItem value="married" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Married
              </SelectItem>
              <SelectItem value="divorced" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Divorced
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Education */}
        <div>
          <Label htmlFor="education" className="text-sm font-medium text-gray-700 mb-2 block">
            Education
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

        {/* Experience */}
        <div>
          <Label htmlFor="experience" className="text-sm font-medium text-gray-700 mb-2 block">
            Experience
          </Label>
          <Select value={formData.experience} onValueChange={(val) => setFormData({ ...formData, experience: val })}>
            <SelectTrigger className="focus-visible:ring-1 w-full focus-visible:ring-[#1967d2]">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
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
      </div>

      {/* Biography */}
      <div>
        <Label htmlFor="biography" className="text-sm font-medium text-gray-700 mb-2 block">
          Biography
        </Label>
        <ReactQuill
          theme="snow"
          value={formData.biography}
          onChange={(value) => setFormData({ ...formData, biography: value })}
          placeholder="Write down your biography here. Let the employers know who you are..."
          className="bg-white [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:max-h-[300px] [&_.ql-editor]:overflow-y-auto"
        />
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-center">
        <Button type="submit" className="bg-[#1967d2] hover:bg-[#1557b0] px-12 py-6 text-base">
          Save Changes
        </Button>
      </div>
    </form>
  );
}