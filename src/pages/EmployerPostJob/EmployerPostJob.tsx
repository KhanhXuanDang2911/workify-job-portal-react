import JobInformation from "@/components/JobInformation";
import { Button } from "@/components/ui/button";
import { sampleCompanyInfo, sampleJob, sampleJobDescription, sampleQualifications } from "./EmployerPostJobMockData";
import { Controller, useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { SelectGroup } from "@radix-ui/react-select";
import BaseModal from "@/components/BaseModal";
import { Baby, BadgeDollarSign, BookOpen, Building2, Bus, CalendarCheck, Cookie, Gift, HeartPulse, Home, Laptop, Plane, Plus, Shield, Sparkles, Trash2, Users } from "lucide-react";

type WorkAreaItem = {
  city: string;
  district: string;
};
type WorkAreasType = WorkAreaItem[];

type WorkOfficesType = {
  address: string;
}[];

type LocationsType = {
  workAreas: WorkAreasType;
  workOffices: WorkOfficesType;
};

type BenefitItem = {
  type:
    | "TRAVEL_OPPORTUNITIES"
    | "BONUS_GIFTS"
    | "SHUTTLE_BUS"
    | "INSURANCE"
    | "LAPTOP_MONITOR"
    | "HEALTHCARE"
    | "PAID_LEAVE"
    | "REMOTE_FLEXIBLE"
    | "SALARY_REVIEW"
    | "TEAM_BUILDING"
    | "TRAINING"
    | "SNACK_PANTRY"
    | "WORK_ENVIRONMENT"
    | "CHILDCARE"
    | "OTHER";
  description: string;
};

const benefitMap = {
  TRAVEL_OPPORTUNITIES: {
    label: "Travel",
    icon: Plane,
  },
  BONUS_GIFTS: { label: "Bonus", icon: Gift },
  SHUTTLE_BUS: { label: "Shuttle", icon: Bus },
  INSURANCE: { label: "Insurance", icon: Shield },
  LAPTOP_MONITOR: { label: "Laptop", icon: Laptop },
  HEALTHCARE: { label: "Healthcare", icon: HeartPulse },
  PAID_LEAVE: { label: "Paid leave", icon: CalendarCheck },
  REMOTE_FLEXIBLE: { label: "Remote", icon: Home },
  SALARY_REVIEW: { label: "Salary review", icon: BadgeDollarSign },
  TEAM_BUILDING: { label: "Team building", icon: Users },
  TRAINING: { label: "Training", icon: BookOpen },
  SNACK_PANTRY: { label: "Snack", icon: Cookie },
  WORK_ENVIRONMENT: { label: "Environment", icon: Building2 },
  CHILDCARE: { label: "Childcare", icon: Baby },
  OTHER: { label: "Other", icon: Sparkles },
};

function EmployerPostJob() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const [salaryType, setSalaryType] = useState("input");
  const [locations, setLocations] = useState<LocationsType>({
    workAreas: watch("workAreas") || [],
    workOffices: [],
  });
  const [tempWorkAreas, setTempWorkAreas] = useState<WorkAreasType>(locations.workAreas.length ? locations.workAreas : []);

  const [tempBenefits, setTempBenefits] = useState<BenefitItem[]>([]);
  const benefits: BenefitItem[] = watch("benefits") || [];

  const onSubmit = (data: any) => {
    console.log("Job posted:", data);
  };

  const handleOpenModalEditWorkAreas = () => {
    setTempWorkAreas(locations.workAreas.length ? locations.workAreas : []);
  };
  const handleAddWorkAreas = () => {
    setTempWorkAreas([...tempWorkAreas, { city: "", district: "" }]);
  };
  const handleChangeWorkAreas = (idx: number, field: keyof WorkAreaItem, value: string) => {
    const newLocations = [...tempWorkAreas];
    newLocations[idx][field] = value;
    // Nếu chọn lại city thì reset district
    if (field === "city") newLocations[idx]["district"] = "";
    setTempWorkAreas(newLocations);
  };
  const handleRemoveWorkAreas = (idx: number) => {
    setTempWorkAreas(tempWorkAreas.filter((_, i) => i !== idx));
  };
  const handleSaveWorkAreas = (onClose: () => void) => {
    setLocations({ ...locations, workAreas: tempWorkAreas });
    setValue("workAreas", tempWorkAreas, { shouldValidate: true });
    onClose();
  };

  const handleOpenBenefitModal = () => {
    setTempBenefits(benefits.length ? benefits : []);
  };
  const handleAddBenefit = () => {
    if (tempBenefits.length < 10) {
      const selectedTypes = tempBenefits.map((b) => b.type);
      const availableTypes = (Object.keys(benefitMap) as BenefitItem["type"][]).filter((type) => !selectedTypes.includes(type));
      if (availableTypes.length > 0) {
        setTempBenefits([...tempBenefits, { type: availableTypes[0] as BenefitItem["type"], description: "" }]);
      }
    }
  };
  const handleChangeBenefit = (idx: number, field: keyof BenefitItem, value: string) => {
    const arr = [...tempBenefits];
    if (field === "type") {
      arr[idx][field] = value as BenefitItem["type"];
    } else {
      arr[idx][field] = value;
    }
    setTempBenefits(arr);
  };
  const handleRemoveBenefit = (idx: number) => {
    setTempBenefits(tempBenefits.filter((_, i) => i !== idx));
  };

  const handleSaveBenefits = (onClose: () => void) => {
    setValue(
      "benefits",
      tempBenefits.filter((b) => b.description.trim() !== ""),
      { shouldValidate: true }
    );
    onClose();
  };

  return (
    <main className="flex flex-col flex-1 h-screen bg-sky-50 relative overflow-y-scroll">
      {/* Header cố định trên cùng */}
      <div className="w-full bg-white py-3 border-b  border-gray-200 sticky top-0 z-20">
        <h1 className="text-3xl font-medium p-2 text-center text-[#1967d2]">Post Job</h1>
      </div>
      {/* Nội dung  */}
      <div className="w-full p-3 flex gap-4 ">
        {/* Job Information Section */}
        <div className="bg-white rounded shadow overflow-auto w-full lg:w-[60%] xl:w-[50%] flex-shrink-0">
          <div className="bg-white border-b p-4 mb-4">
            <h2 className="text-xl font-semibold text-center text-gray-900 ">Job Information</h2>
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-200px)] px-4">
            <form id="post-job-form" className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Company Information */}
              <div>
                <label className="block text-2xl text-[#1967d2] font-medium mb-2">Company Information</label>
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register("companyName", { required: true })}
                    placeholder="Company Name"
                    defaultValue="Dung Van"
                    className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                  />
                  {errors.companyName && <span className="text-red-500 text-xs">This field is required</span>}
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Number of Employees <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="numberOfEmployees"
                    control={control}
                    defaultValue="25 - 99"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1 - 9">1 - 9</SelectItem>
                          <SelectItem value="10 - 24">10 - 24</SelectItem>
                          <SelectItem value="25 - 99">25 - 99</SelectItem>
                          <SelectItem value="100 - 499">100 - 499</SelectItem>
                          <SelectItem value="500+">500+</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.numberOfEmployees && <span className="text-red-500 text-xs">This field is required</span>}
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">Company Website</label>
                  <Input {...register("companyWebsite")} placeholder="Company Website" className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Company Profile <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="companyProfile"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field }) => (
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        className="bg-white [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:max-h-[160px] [&_.ql-editor]:overflow-y-auto"
                      />
                    )}
                  />
                  {errors.companyProfile && <span className="text-red-500 text-xs">This field is required</span>}
                </div>
              </div>

              {/* Job Information */}
              <div>
                <label className="block text-2xl text-[#1967d2] font-medium mb-2">Job Information</label>
                {/*Job title */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Job title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register("jobTitle", { required: true })}
                    placeholder="Job title"
                    defaultValue="Title"
                    className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                  />
                  {errors.jobTitle && <span className="text-red-500 text-xs">This field is required</span>}
                </div>
                {/* Location */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="border p-3 rounded space-y-5">
                    <div>
                      <div className="mb-2 text-xs text-gray-500">Choose work locations from area options</div>
                      <Input {...register("workAreas", { required: true })} type="hidden" />
                      <BaseModal
                        title="Edit work area"
                        trigger={
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full flex flex-col items-start justify-start text-left font-normal !h-auto min-h-0 py-2 "
                            onClick={handleOpenModalEditWorkAreas}
                          >
                            {locations.workAreas.length > 0 && locations.workAreas[0].city ? (
                              locations.workAreas.map((loc: WorkAreaItem, index: number) => <p key={index}>{loc.city + (loc.district ? " - " + loc.district : "")}</p>)
                            ) : (
                              <span className="text-gray-400">Job location</span>
                            )}
                          </Button>
                        }
                        footer={(onClose) => (
                          <>
                            <Button
                              variant="outline"
                              onClick={onClose}
                              className="border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2] w-28"
                            >
                              Cancel
                            </Button>
                            <Button className="bg-[#1967d2] w-28 hover:bg-[#1251a3]" onClick={() => handleSaveWorkAreas(onClose)}>
                              Save
                            </Button>
                          </>
                        )}
                      >
                        {/* Nội dung modal: add new location */}
                        <div className="min-w-[600px]">
                          <Label htmlFor="modal-location" className="mb-3">
                            Work Location
                          </Label>
                          {tempWorkAreas.map((loc, idx) => (
                            <div key={idx} className="flex gap-2 justify-between mb-3">
                              {/* Select city */}
                              <Select value={loc.city} onValueChange={(val) => handleChangeWorkAreas(idx, "city", val)}>
                                <SelectTrigger className="min-w-[250px] bg-gray-100">
                                  <SelectValue placeholder="Please select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Hanoi">Hà Nội</SelectItem>
                                  <SelectItem value="HCM">Hồ Chí Minh</SelectItem>
                                  {/* ...other cities... */}
                                </SelectContent>
                              </Select>
                              {/* Select district */}
                              <Select value={loc.district} onValueChange={(val) => handleChangeWorkAreas(idx, "district", val)} disabled={!loc.city}>
                                <SelectTrigger className="min-w-[250px] bg-gray-100">
                                  <SelectValue placeholder="All districts" />
                                </SelectTrigger>
                                <SelectContent>
                                  {loc.city === "Hanoi" && (
                                    <>
                                      <SelectItem value="Ba Dinh">Ba Đình</SelectItem>
                                      <SelectItem value="Dong Da">Đống Đa</SelectItem>
                                      {/* ... */}
                                    </>
                                  )}
                                  {loc.city === "HCM" && (
                                    <>
                                      <SelectItem value="District 1">Quận 1</SelectItem>
                                      <SelectItem value="District 3">Quận 3</SelectItem>
                                      {/* ... */}
                                    </>
                                  )}
                                </SelectContent>
                              </Select>
                              {/* Xóa location */}
                              {tempWorkAreas.length >= 1 && (
                                <Button variant="secondary" size="icon" className="size-8 hover:bg-red-400" onClick={() => handleRemoveWorkAreas(idx)}>
                                  <Trash2 />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button variant="link" className="text-[#1967d2] p-0 h-auto mt-2 text-lg" onClick={handleAddWorkAreas}>
                            <Plus strokeWidth={3} /> Add new location
                          </Button>
                        </div>
                      </BaseModal>
                    </div>
                    <div>
                      <div className="mb-2 text-xs text-gray-500">... or, pick from the office list</div>
                      <Button type="button" variant="outline" className="w-full flex flex-col items-start justify-start text-left font-normal !h-auto min-h-0 py-2 ">
                        <span className="text-gray-400">Job location</span>
                      </Button>
                    </div>
                  </div>
                  {(errors.workAreas || errors.workOffices) && <span className="text-red-500 text-xs">This field is required</span>}
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Salary <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="salaryType"
                    control={control}
                    defaultValue="input"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <RadioGroup
                        value={salaryType}
                        onValueChange={(val) => {
                          setSalaryType(val);
                          field.onChange(val);
                        }}
                        className="flex flex-row justify-between pr-5 gap-6 mb-2 mt-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="input" id="salary-input" />
                          <Label htmlFor="salary-input">Input</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="more" id="salary-more" />
                          <Label htmlFor="salary-more">More than</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="negotiable" id="salary-negotiable" className=""></RadioGroupItem>
                          <Label htmlFor="salary-negotiable">Negotiable</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="competitive" id="salary-competitive" />
                          <Label htmlFor="salary-competitive">Competitive</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {/* Hiển thị các ô nhập khi chọn Input */}
                  {salaryType === "input" && (
                    <div className="flex items-center gap-2 mt-4">
                      <div className="flex flex-row has-focus-visible:ring-1 has-focus-visible:ring-[#1967d2]">
                        <Input
                          {...register("salaryMin")}
                          placeholder="Ex: 10 or 10.5"
                          className="w-32 rounded-none focus-visible:border-none focus-visible:ring-0"
                          type="number"
                          step="0.1"
                        />
                        <Select {...register("salaryUnitMin")}>
                          <SelectTrigger className="w-32 rounded-none focus-visible:ring-0">
                            <SelectValue placeholder="Select Unit" />
                          </SelectTrigger>
                          <SelectContent className="rounded-none">
                            <SelectGroup>
                              <SelectItem value="million VND" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                million VND
                              </SelectItem>
                              <SelectItem value="USD" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                USD
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <span>-</span>
                      <div className="flex flex-row has-focus-visible:ring-1 has-focus-visible:ring-[#1967d2]">
                        <Input
                          {...register("salaryMax")}
                          placeholder="Ex: 10 or 10.5"
                          className="w-32 rounded-none focus-visible:border-none focus-visible:ring-0"
                          type="number"
                          step="0.1"
                        />
                        <Select {...register("salaryUnitMax")}>
                          <SelectTrigger className="w-32 rounded-none focus-visible:ring-0">
                            <SelectValue placeholder="million VND" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="million VND" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                million VND
                              </SelectItem>
                              <SelectItem value="USD" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                USD
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  {/*Khi chọn More than */}
                  {salaryType === "more" && (
                    <div className="flex justify-between mt-2 has-focus-visible:ring-1 has-focus-visible:ring-[#1967d2]">
                      <Input
                        {...register("salaryMore")}
                        placeholder="Ex: 10 or 10.5"
                        className="rounded-none focus-visible:border-none focus-visible:ring-0"
                        type="number"
                        step="0.1"
                      />
                      <Select {...register("salaryUnitMore")}>
                        <SelectTrigger className="w-32 rounded-none focus-visible:ring-0">
                          <SelectValue placeholder="million VND" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="million VND" className="focus:bg-sky-200 focus:text-[#1967d2]">
                              million VND
                            </SelectItem>
                            <SelectItem value="USD" className="focus:bg-sky-200 focus:text-[#1967d2]">
                              USD
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {errors.salary && <span className="text-red-500 text-xs">This field is required</span>}
                </div>
                {/* Job Description */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Job Description Detail <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="jobDescription"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field }) => (
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        className="bg-white [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:max-h-[160px] [&_.ql-editor]:overflow-y-auto"
                      />
                    )}
                  />
                  {errors.jobDescription && <span className="text-red-500 text-xs">This field is required</span>}
                </div>
                {/* Job Required */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Job Required <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="jobRequired"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field }) => (
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        className="bg-white [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:max-h-[160px] [&_.ql-editor]:overflow-y-auto"
                      />
                    )}
                  />
                  {errors.jobRequired && <span className="text-red-500 text-xs">This field is required</span>}
                </div>
                {/* Benefits */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Benefits <span className="text-red-500">*</span>
                  </label>
                  <div>
                    {benefits.length > 0 && (
                      <ul className="mb-2 space-y-2 ">
                        {benefits.map((benefit: BenefitItem, idx: number) => {
                          const Icon = benefitMap[benefit.type].icon;
                          return (
                            <li key={idx} className="flex items-center gap-2 border p-1 ">
                              <div className="flex items-center gap-1 self-start">
                                <Icon size={28} strokeWidth={1.8} color="#1967d2" />
                                <span className="font-medium text-sm">{benefitMap[benefit.type].label}:</span>
                              </div>
                              <span className="text-sm">{benefit.description}</span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    <BaseModal
                      title="Job benefit"
                      trigger={
                        <Button type="button" variant="link" className="text-[#1967d2] p-0 h-auto mt-2" onClick={handleOpenBenefitModal}>
                          + Add more (max 10 benefits)
                        </Button>
                      }
                      footer={(onClose) => (
                        <>
                          <Button
                            variant="outline"
                            onClick={onClose}
                            className="border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2] w-28"
                          >
                            Cancel
                          </Button>
                          <Button className="bg-[#1967d2] w-28 hover:bg-[#1251a3]" onClick={() => handleSaveBenefits(onClose)}>
                            Save
                          </Button>
                        </>
                      )}
                    >
                      {/* Nội dung Modal: add benefit */}
                      <div className="min-w-[600px] max-h-[400px] overflow-y- py-4 ">
                        {tempBenefits.map((b, idx) => (
                          <div key={idx} className="mb-4">
                            <div className="flex items-center gap-2 mb-1">
                              {/* Select type */}
                              <Select value={b.type} onValueChange={(val) => handleChangeBenefit(idx, "type", val)}>
                                <SelectTrigger className="min-w-[48px] bg-sky-100 flex items-center justify-center">
                                  {(() => {
                                    const Icon = benefitMap[b.type]?.icon;
                                    return Icon ? <Icon size={40} strokeWidth={2.5} className=" text-[#1967d2]" /> : null;
                                  })()}
                                </SelectTrigger>
                                <SelectContent>
                                  <div className="grid grid-cols-4 gap-2">
                                    {Object.entries(benefitMap).map(([type, { label, icon }]) => {
                                      const Icon = icon;
                                      const isSelected = tempBenefits.some((benefit, i) => benefit.type === type && i !== idx);
                                      const isActive = b.type === type;
                                      return (
                                        <SelectItem key={type} value={type} disabled={isSelected} className={isActive ? "bg-blue-100 text-[#1967d2]" : ""}>
                                          <div className="flex flex-col items-center gap-2 ">
                                            <Icon strokeWidth={2} color={`${isActive ? "#1967d2" : "#262d37"}`} style={{ width: 32, height: 32 }} />
                                            <span>{label}</span>
                                          </div>
                                        </SelectItem>
                                      );
                                    })}
                                  </div>
                                </SelectContent>
                              </Select>
                              <Input
                                value={b.description}
                                placeholder="Ex: A chance to travel 2-3 times a year"
                                onChange={(e) => handleChangeBenefit(idx, "description", e.target.value)}
                                className="flex-1 bg-gray-100 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                              />
                              {tempBenefits.length >= 1 && (
                                <Button type="button" variant="ghost" className="text-gray-500 size-8 hover:bg-red-400" onClick={() => handleRemoveBenefit(idx)}>
                                  <Trash2 size={18} />
                                </Button>
                              )}
                            </div>
                            <div className="mt-4 italic text-gray-700 flex gap-2 items-center">
                              <span className="text-xs">*Suggestion:</span>
                              <Input disabled value="A chance to travel 2-3 times a year" className="w-max h-7 !text-[10px] bg-gray-100" />
                            </div>
                          </div>
                        ))}
                        <Button type="button" variant="link" className="text-[#1967d2] p-0 h-auto mt-2 text-lg" onClick={handleAddBenefit} disabled={tempBenefits.length >= 10}>
                          <Plus size={18} strokeWidth={3} /> Add another benefit
                        </Button>
                      </div>
                    </BaseModal>
                  </div>
                </div>
              </div>
              {/* Job Details */}
              {/* Contact information */}
              {/* Date Of Post */}
              {/* Language for applications*/}
            </form>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded shadow overflow-auto hidden md:block md:flex-1">
          <div className="bg-white border-b p-4 mb-4">
            <h2 className="text-xl font-semibold text-center text-gray-900 ">Preview</h2>
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-200px)] px-2">
            <JobInformation job={sampleJob} jobDescription={sampleJobDescription} qualifications={sampleQualifications} companyInfo={sampleCompanyInfo} />
          </div>
        </div>
      </div>
      {/* Footer cố định dưới cùng */}
      <div className="w-full bg-white py-5 border-t flex gap-4 px-5 bottom-0 border-gray-200   z-20">
        <Button className="w-[40%] border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2]" variant="outline" size="lg">
          Save Job
        </Button>
        <Button className="w-[60%]  bg-[#1967d2] hover:bg-[#1251a3]" variant="default" size="lg" type="submit" form="post-job-form">
          Post Job
        </Button>
      </div>
    </main>
  );
}

export default EmployerPostJob;
