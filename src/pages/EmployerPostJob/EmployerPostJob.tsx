import JobInformation from "@/components/JobInformation";
import { Button } from "@/components/ui/button";
import {
  ages,
  educationLevels,
  entryLevels,
  experienceLevels,
  genders,
  jobCategories,
  languages,
  positionTypes,
  provinces,
  sampleCompanyInfo,
  sampleJob,
  sampleJobDescription,
  sampleQualifications,
} from "./EmployerPostJobMockData";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SelectGroup } from "@radix-ui/react-select";
import BaseModal from "@/components/BaseModal";
import {
  Baby,
  BadgeDollarSign,
  BookOpen,
  Building2,
  Bus,
  CalendarCheck,
  Cookie,
  Gift,
  HeartPulse,
  Home,
  Laptop,
  Plane,
  Plus,
  Shield,
  Sparkles,
  Trash2,
  Users,
  Loader2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRef, useCallback } from "react";

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
  const mainForm = useForm();

  // Modal form cho workAreas location
  const modalWorkAreasForm = useForm<{ workAreas: WorkAreaItem[] }>({
    defaultValues: { workAreas: [] },
  });
  const workAreasFieldArray = useFieldArray({
    control: modalWorkAreasForm.control,
    name: "workAreas",
  });
  const modal_workAreas: WorkAreaItem[] = mainForm.watch("workAreas") || [];

  // Modal form cho contact location
  const modalContactLocationForm = useForm<{
    contactLocation: WorkAreaItem & { address: string };
  }>({
    defaultValues: {
      contactLocation: {},
    },
  });

  const modalBenefitForm = useForm<{ benefits: BenefitItem[] }>({
    defaultValues: { benefits: [] },
  });
  const benefitFieldArray = useFieldArray({
    control: modalBenefitForm.control,
    name: "benefits",
  });
  const main_benefits: BenefitItem[] = mainForm.watch("benefits") || [];

  const watchedValues = mainForm.watch();

  const previewRef = useRef<HTMLDivElement>(null);

  const jobInfoRef = useRef<{
    scrollToDescription: () => void;
    scrollToBenefits: () => void;
    scrollToSkills: () => void;
    scrollToDetails: () => void;
    scrollToContact: () => void;
    scrollToCompany: () => void;
  }>(null);

  const onSubmit = (data: any) => {
    console.log("Job posted:", data);
  };

  const handleOpenModalEditWorkAreas = () => {
    modalWorkAreasForm.reset({
      workAreas: modal_workAreas.length ? modal_workAreas : [],
    });
  };
  const handleSaveModalWorkAreas = async (onClose: () => void) => {
    const valid = await modalWorkAreasForm.trigger();
    if (!valid) return;
    mainForm.setValue("workAreas", modalWorkAreasForm.getValues("workAreas"), { shouldValidate: true });
    onClose();
  };

  const handleOpenModalEditContactLocation = () => {
    modalContactLocationForm.reset({
      contactLocation: mainForm.getValues("contactLocation") || {},
    });
  };
  const handleSaveModalContactLocation = async (onClose: () => void) => {
    const valid = await modalContactLocationForm.trigger();
    if (!valid) return;
    mainForm.setValue("contactLocation", modalContactLocationForm.getValues("contactLocation"), {
      shouldValidate: true,
    });
    onClose();
  };

  const handleOpenBenefitModal = () => {
    modalBenefitForm.reset({
      benefits: main_benefits.length ? main_benefits : [],
    });
  };
  const handleSaveBenefits = async (onClose: () => void) => {
    const valid = await modalBenefitForm.trigger();
    if (!valid) return;
    mainForm.setValue(
      "benefits",
      modalBenefitForm.getValues("benefits").filter((b) => b.description.trim() !== ""),
      { shouldValidate: true }
    );
    onClose();
  };

  const scrollToPreviewSection = useCallback((section: string) => {
    if (!jobInfoRef.current) return;

    switch (section) {
      case "description":
        jobInfoRef.current.scrollToDescription();
        break;
      case "benefits":
        jobInfoRef.current.scrollToBenefits();
        break;
      case "skills":
        jobInfoRef.current.scrollToSkills();
        break;
      case "details":
        jobInfoRef.current.scrollToDetails();
        break;
      case "contact":
        jobInfoRef.current.scrollToContact();
        break;
      case "company":
        jobInfoRef.current.scrollToCompany();
        break;
    }
  }, []);

  const handleFieldFocus = useCallback(
    (section: string) => {
      scrollToPreviewSection(section);
    },
    [scrollToPreviewSection]
  );

  const getPreviewData = useCallback(
    (formData: any) => {
      // Transform job data
      const job = {
        ...sampleJob,
        title: formData.jobTitle || sampleJob.title,
        company: formData.companyName || sampleJob.company,
        companySize: formData.numberOfEmployees || sampleJob.companySize,
        location: formData.workAreas?.map((area: any) => area.city + (area.district ? ` - ${area.district}` : "")).join(", ") || sampleJob.location,
        salary:
          formData.salaryType === "input"
            ? `${formData.salaryMin || ""} - ${formData.salaryMax || ""} ${formData.salaryUnitMin || "million VND"}`
            : formData.salaryType === "more"
            ? `${formData.salaryMore || ""} ${formData.salaryUnitMore || "million VND"}+`
            : formData.salaryType === "negotiable"
            ? "Negotiable"
            : formData.salaryType === "competitive"
            ? "Competitive"
            : sampleJob.salary,
        experience: formData.experienceLevel || sampleJob.experience,
        level: formData.entryLevel || sampleJob.level,
        education: formData.educationLevel || sampleJob.education,
        gender: formData.gender || sampleJob.gender,
        age: formData.age || sampleJob.age,
        website: formData.companyWebsite || sampleJob.website,
        language: formData.applicationLanguage || sampleJob.language,
        workType: formData.positionType || sampleJob.workType,
        industry: formData.jobCategory || sampleJob.industry,
        address: formData.contactLocation?.address
          ? `${formData.contactLocation.address}, ${formData.contactLocation.district}, ${formData.contactLocation.city}`
          : sampleJob.address,
      };

      // Transform job description
      const jobDescription = {
        ...sampleJobDescription,
        description: formData.jobDescription || sampleJobDescription.description,
        benefits: formData.benefits?.map((benefit: any) => benefit.description).filter(Boolean) || sampleJobDescription.benefits,
      };

      // Transform qualifications
      const qualifications = {
        ...sampleQualifications,
        skillsRequired: formData.jobRequired || sampleQualifications.skillsRequired,
      };

      // Transform company info
      const companyInfo = {
        ...sampleCompanyInfo,
        name: formData.companyName || sampleCompanyInfo.name,
        size: formData.numberOfEmployees || sampleCompanyInfo.size,
        description: formData.companyProfile || sampleCompanyInfo.description,
      };

      return { job, jobDescription, qualifications, companyInfo };
    },
    [mainForm]
  );

  const previewData = getPreviewData(watchedValues);

  return (
    <main className="flex flex-col  bg-sky-50 relative">
      {/* Header cố định trên cùng */}
      <div className=" bg-white py-3 border-b  border-gray-200 sticky top-0 z-20">
        <h1 className="text-3xl font-medium p-2 text-center text-[#1967d2]">Post Job</h1>
      </div>
      {/* Nội dung  */}
      <div className=" p-3 flex gap-4 h-screen ">
        {/* Job Information Section */}
        <div className="bg-white rounded shadow overflow-auto w-full flex-1 lg:w-[60%] xl:w-[50%] flex-shrink-0">
          <div className="border-b p-3 mb-4 bg-white">
            <h2 className="text-xl font-semibold text-center text-gray-900 ">Job Information</h2>
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-330px)] px-4">
            <form id="post-job-form" className="space-y-6" onSubmit={mainForm.handleSubmit(onSubmit)}>
              {/* Company Information */}
              <div>
                <label className="block text-2xl text-[#1967d2] font-medium mb-2">Company Information</label>
                {/*  Company Name */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...mainForm.register("companyName", { required: true })}
                    placeholder="Company Name"
                    defaultValue="Dung Van"
                    className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                    onFocus={() => handleFieldFocus("company")}
                  />
                  {mainForm.formState.errors.companyName && <span className="text-red-500 text-xs">This field is required</span>}
                </div>
                {/*  Number of Employees */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Number of Employees <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="numberOfEmployees"
                    control={mainForm.control}
                    defaultValue="25 - 99"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="min-w-[250px]" arrowStyle="text-[#1967d2] font-bold size-5" onFocus={() => handleFieldFocus("company")}>
                          <SelectValue placeholder="Select number" />
                        </SelectTrigger>
                        <SelectContent className="">
                          <SelectItem value="1 - 9" className="focus:bg-sky-200 focus:text-[#1967d2]">
                            1 - 9
                          </SelectItem>
                          <SelectItem value="10 - 24" className="focus:bg-sky-200 focus:text-[#1967d2]">
                            10 - 24
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
                    )}
                  />
                  {mainForm.formState.errors.numberOfEmployees && <span className="text-red-500 text-xs">This field is required</span>}
                </div>
                {/* Company Website */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">Company Website</label>
                  <Input
                    {...mainForm.register("companyWebsite")}
                    placeholder="Company Website"
                    className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                    onFocus={() => handleFieldFocus("company")}
                  />
                </div>
                {/* Company Profile */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Company Profile <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="companyProfile"
                    control={mainForm.control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field }) => (
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        className="bg-white [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:max-h-[160px] [&_.ql-editor]:overflow-y-auto"
                        onFocus={() => handleFieldFocus("company")}
                      />
                    )}
                  />
                  {mainForm.formState.errors.companyProfile && <span className="text-red-500 text-xs">This field is required</span>}
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
                    {...mainForm.register("jobTitle", { required: true })}
                    placeholder="Job title"
                    defaultValue="Title"
                    className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                    onFocus={() => handleFieldFocus("description")}
                  />
                  {mainForm.formState.errors.jobTitle && <span className="text-red-500 text-xs">This field is required</span>}
                </div>
                {/* Location */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="border p-3 rounded space-y-5">
                    <div>
                      <div className="mb-2 text-xs text-gray-500">Choose work locations from area options</div>
                      <Input {...mainForm.register("jobLocation_workAreas", { required: true })} type="hidden" />
                      <BaseModal
                        title="Edit work area"
                        trigger={
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full flex flex-col items-start justify-start text-left font-normal !h-auto min-h-0 py-2  bg-transparent"
                            onClick={handleOpenModalEditWorkAreas}
                            onFocus={() => handleFieldFocus("details")}
                          >
                            {modal_workAreas.length > 0 && modal_workAreas[0].city ? (
                              modal_workAreas.map((loc: WorkAreaItem, index: number) => <p key={index}>{loc.city + (loc.district ? " - " + loc.district : "")}</p>)
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
                              className="border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2] w-28 bg-transparent"
                            >
                              Cancel
                            </Button>
                            <Button className="bg-[#1967d2] w-28 hover:bg-[#1251a3]" onClick={() => handleSaveModalWorkAreas(onClose)}>
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
                          {workAreasFieldArray.fields.map((loc, idx) => (
                            <div key={idx} className="flex gap-2 justify-between mb-3">
                              {/* Select city */}
                              <Controller
                                control={modalWorkAreasForm.control}
                                name={`workAreas.${idx}.city`}
                                rules={{ required: "Required" }}
                                render={({ field, fieldState }) => (
                                  <div className="flex flex-col gap-2">
                                    <Select value={field.value} onValueChange={field.onChange}>
                                      <SelectTrigger className="min-w-[250px] bg-gray-100" arrowStyle="text-[#1967d2] font-bold size-5">
                                        <SelectValue placeholder="Please select" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Hanoi" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                          Hà Nội
                                        </SelectItem>
                                        <SelectItem value="HCM" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                          Hồ Chí Minh
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    {fieldState.error && <span className="text-red-500 text-xs mt-1">{fieldState.error.message || "Required"}</span>}
                                  </div>
                                )}
                              />
                              {/* Select district */}
                              <Controller
                                control={modalWorkAreasForm.control}
                                name={`workAreas.${idx}.district`}
                                rules={{ required: "Required" }}
                                render={({ field, fieldState }) => (
                                  <div className="flex flex-col gap-2">
                                    <Select value={field.value} onValueChange={field.onChange} disabled={!modalWorkAreasForm.watch(`workAreas.${idx}.city`)}>
                                      <SelectTrigger className="min-w-[250px] bg-gray-100" arrowStyle="text-[#1967d2] font-bold size-5">
                                        <SelectValue placeholder="All districts" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {modalWorkAreasForm.watch(`workAreas.${idx}.city`) === "Hanoi" && (
                                          <>
                                            <SelectItem value="Ba Dinh" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                              Ba Đình
                                            </SelectItem>
                                            <SelectItem value="Dong Da" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                              Đống Đa
                                            </SelectItem>
                                          </>
                                        )}
                                        {modalWorkAreasForm.watch(`workAreas.${idx}.city`) === "HCM" && (
                                          <>
                                            <SelectItem value="District 1" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                              Quận 1
                                            </SelectItem>
                                            <SelectItem value="District 3" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                              Quận 3
                                            </SelectItem>
                                          </>
                                        )}
                                      </SelectContent>
                                    </Select>
                                    {fieldState.error && <span className="text-red-500 text-xs mt-1">{fieldState.error.message || "Required"}</span>}
                                  </div>
                                )}
                              />
                              {/* Xóa location */}
                              {workAreasFieldArray.fields.length >= 1 && (
                                <Button variant="secondary" size="icon" className="size-8 hover:bg-red-400" onClick={() => workAreasFieldArray.remove(idx)}>
                                  <Trash2 />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            variant="link"
                            className="text-[#1967d2] p-0 h-auto mt-2 text-lg"
                            onClick={() => workAreasFieldArray.append({ city: "", district: "" })}
                            disabled={workAreasFieldArray.fields.length >= 5}
                          >
                            <Plus strokeWidth={3} /> Add new location
                          </Button>
                        </div>
                      </BaseModal>
                    </div>
                    <div>
                      <div className="mb-2 text-xs text-gray-500">... or, pick from the office list</div>
                      <Button type="button" variant="outline" className="w-full flex flex-col items-start justify-start text-left font-normal !h-auto min-h-0 py-2  bg-transparent">
                        <span className="text-gray-400">Job location</span>
                      </Button>
                    </div>
                  </div>
                  {(mainForm.formState.errors.workAreas || mainForm.formState.errors.workOffices) && <span className="text-red-500 text-xs">This field is required</span>}
                </div>
                {/* Salary */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Salary <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="salaryType"
                    control={mainForm.control}
                    defaultValue="input"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex flex-row justify-between pr-5 gap-6 mb-2 mt-3"
                        onFocus={() => handleFieldFocus("details")}
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
                  {mainForm.watch("salaryType") === "input" && (
                    <div className="flex flex-col sm:flex-row items-center gap-2 mt-4">
                      <div className="flex flex-row sm:flex-1 has-focus-visible:ring-1 has-focus-visible:ring-[#1967d2]">
                        <Input
                          {...mainForm.register("salaryMin", { required: true })}
                          placeholder="Ex: 10"
                          className="min-w-32 rounded-none focus-visible:border-none focus-visible:ring-0"
                          type="text"
                          inputMode="numeric"
                          onInput={(e) => {
                            (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, "");
                          }}
                        />
                        <Controller
                          name="salaryUnitMin"
                          control={mainForm.control}
                          defaultValue="million VND"
                          render={({ field }) => (
                            <Select
                              onValueChange={(val) => {
                                field.onChange(val);
                                mainForm.setValue("salaryUnitMax", val, { shouldValidate: true });
                              }}
                              value={field.value}
                            >
                              <SelectTrigger className="min-w-36 rounded-none focus-visible:ring-0" arrowStyle="text-[#1967d2] font-bold size-5">
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
                          )}
                        />
                      </div>
                      <span>-</span>
                      <div className="flex flex-row sm:flex-1 has-focus-visible:ring-1 has-focus-visible:ring-[#1967d2]">
                        <Input
                          {...mainForm.register("salaryMax", { required: true })}
                          placeholder="Ex: 10 "
                          className="min-w-32 rounded-none focus-visible:border-none focus-visible:ring-0"
                          type="text"
                          inputMode="numeric"
                          onInput={(e) => {
                            (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, "");
                          }}
                        />
                        <Controller
                          name="salaryUnitMax"
                          control={mainForm.control}
                          defaultValue="million VND"
                          render={({ field }) => (
                            <Select
                              onValueChange={(val) => {
                                field.onChange(val);
                                mainForm.setValue("salaryUnitMin", val, { shouldValidate: true });
                              }}
                              value={field.value}
                            >
                              <SelectTrigger className="min-w-36 rounded-none focus-visible:ring-0" arrowStyle="text-[#1967d2] font-bold size-5">
                                <SelectValue placeholder="Select Unit" />
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
                          )}
                        />
                      </div>
                    </div>
                  )}
                  {/*Khi chọn More than */}
                  {mainForm.watch("salaryType") === "more" && (
                    <div className="flex justify-between mt-2 has-focus-visible:ring-1 has-focus-visible:ring-[#1967d2]">
                      <Input
                        {...mainForm.register("salaryMore", { required: true })}
                        placeholder="Ex: 10 or 10.5"
                        className="rounded-none focus-visible:border-none focus-visible:ring-0"
                        type="text"
                        inputMode="numeric"
                        onInput={(e) => {
                          (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, "");
                        }}
                      />
                      <Controller
                        name="salaryUnitMore"
                        control={mainForm.control}
                        defaultValue="million VND"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="min-w-40 rounded-none focus-visible:ring-0" arrowStyle="text-[#1967d2] font-bold size-5">
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
                        )}
                      />
                    </div>
                  )}
                  {mainForm.formState.errors.salaryType && <span className="text-red-500 text-xs">This field is required</span>}
                </div>

                {/* Job Description */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Job Description Detail <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="jobDescription"
                    control={mainForm.control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field }) => (
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        className="bg-white [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:max-h-[160px] [&_.ql-editor]:overflow-y-auto"
                        onFocus={() => handleFieldFocus("description")}
                      />
                    )}
                  />
                  {mainForm.formState.errors.jobDescription && <span className="text-red-500 text-xs">This field is required</span>}
                </div>
                {/* Job Required */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Job Required <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="jobRequired"
                    control={mainForm.control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field }) => (
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        className="bg-white [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:max-h-[160px] [&_.ql-editor]:overflow-y-auto"
                        onFocus={() => handleFieldFocus("skills")}
                      />
                    )}
                  />
                  {mainForm.formState.errors.jobRequired && <span className="text-red-500 text-xs">This field is required</span>}
                </div>
                {/* Benefits */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Benefits <span className="text-red-500">*</span>
                  </label>
                  <div>
                    {main_benefits.length > 0 && (
                      <ul className="mb-2 space-y-2 ">
                        {main_benefits.map((benefit: BenefitItem, idx: number) => {
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
                        <Button
                          type="button"
                          variant="link"
                          className="text-[#1967d2] p-0 h-auto mt-2"
                          onClick={handleOpenBenefitModal}
                          onFocus={() => handleFieldFocus("benefits")}
                        >
                          + Add more (max 10 benefits)
                        </Button>
                      }
                      footer={(onClose) => (
                        <>
                          <Button
                            variant="outline"
                            onClick={onClose}
                            className="border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2] w-28 bg-transparent"
                          >
                            Cancel
                          </Button>
                          <Button className="bg-[#1967d2] w-28 hover:bg-[#1251a3]" onClick={() => handleSaveBenefits(onClose)}>
                            Save
                          </Button>
                        </>
                      )}
                    >
                      <div className="min-w-[600px] max-h-[400px] overflow-y-auto py-4 ">
                        {benefitFieldArray.fields.map((b, idx) => (
                          <div key={b.id} className="mb-4">
                            <div className="flex items-center gap-2 mb-1">
                              {/* Select type */}
                              <Controller
                                name={`benefits.${idx}.type`}
                                control={modalBenefitForm.control}
                                rules={{ required: "Benefit type is required" }}
                                render={({ field, fieldState }) => (
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="min-w-[48px] bg-sky-100 flex items-center justify-center self-start" arrowStyle="text-[#1967d2] font-bold size-5">
                                      {(() => {
                                        const Icon = benefitMap[field.value]?.icon;
                                        return Icon ? <Icon size={40} strokeWidth={2.5} className=" text-[#1967d2]" /> : null;
                                      })()}
                                    </SelectTrigger>
                                    <SelectContent>
                                      <div className="grid grid-cols-4 gap-2">
                                        {Object.entries(benefitMap).map(([type, { label, icon }]) => {
                                          const Icon = icon;
                                          const isSelected = modalBenefitForm.getValues("benefits").some((benefit, i) => benefit.type === type && i !== idx);
                                          const isActive = field.value === type;
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
                                )}
                              />
                              {/* Description */}
                              <Controller
                                name={`benefits.${idx}.description`}
                                control={modalBenefitForm.control}
                                rules={{ required: "Description is required" }}
                                render={({ field, fieldState }) => (
                                  <div className="gap-2 flex flex-col flex-1">
                                    <Input
                                      {...field}
                                      placeholder="Ex: A chance to travel 2-3 times a year"
                                      className=" bg-gray-100 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                                    />
                                    {(!field.value || field.value.trim() === "") && <span className="text-red-500 text-xs mt-1">Required</span>}
                                  </div>
                                )}
                              />
                              {benefitFieldArray.fields.length >= 1 && (
                                <Button type="button" variant="ghost" className="text-gray-500  self-start size-8 hover:bg-red-400" onClick={() => benefitFieldArray.remove(idx)}>
                                  <Trash2 size={18} />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="link"
                          className="text-[#1967d2] p-0 h-auto mt-2 text-lg"
                          onClick={() => {
                            const watchedBenefits = modalBenefitForm.watch("benefits") || [];
                            const selectedTypes = watchedBenefits.map((b) => b.type);
                            const availableTypes = (Object.keys(benefitMap) as BenefitItem["type"][]).filter((type) => !selectedTypes.includes(type));
                            if (availableTypes.length > 0) {
                              benefitFieldArray.append({ type: availableTypes[0], description: "" });
                            }
                          }}
                          disabled={benefitFieldArray.fields.length >= 10 || modalBenefitForm.watch("benefits")?.some((b) => !b.description || b.description.trim() === "")}
                        >
                          <Plus size={18} strokeWidth={3} /> Add another benefit
                        </Button>
                      </div>
                    </BaseModal>
                  </div>
                </div>
              </div>
              {/* Job Details */}
              <div>
                <label className="block text-2xl text-[#1967d2] font-medium mb-2">Job Details</label>

                {/* Education Level */}
                <div className="mb-4">
                  <div className="flex items-center gap-4">
                    <label className="block text-sm mb-1 font-medium w-48 self-start">
                      Education Level <span className="text-red-500">*</span>
                    </label>
                    <div className="flex-1">
                      <Controller
                        name="educationLevel"
                        control={mainForm.control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="focus-visible:ring-0  w-full" arrowStyle="text-[#1967d2] font-bold size-5" onFocus={() => handleFieldFocus("details")}>
                              <SelectValue placeholder="Please select" />
                            </SelectTrigger>
                            <SelectContent>
                              {educationLevels.map((item) => (
                                <SelectItem key={item.value} value={item.value} className="focus:bg-sky-200 focus:text-[#1967d2]">
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {mainForm.formState.errors.educationLevel && <span className="text-red-500 text-xs">This field is required</span>}
                    </div>
                  </div>
                </div>

                {/* Experience Level */}
                <div className="mb-4">
                  <div className="flex items-center gap-4">
                    <label className="block text-sm mb-1 font-medium w-48 self-start">
                      Experience Level <span className="text-red-500">*</span>
                    </label>
                    <div className="flex-1">
                      <Controller
                        name="experienceLevel"
                        control={mainForm.control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="focus-visible:ring-0 w-full" arrowStyle="text-[#1967d2] font-bold size-5" onFocus={() => handleFieldFocus("details")}>
                              <SelectValue placeholder="Please select" />
                            </SelectTrigger>
                            <SelectContent>
                              {experienceLevels.map((item) => (
                                <SelectItem key={item.value} value={item.value} className="focus:bg-sky-200 focus:text-[#1967d2]">
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {mainForm.formState.errors.experienceLevel && <span className="text-red-500 text-xs">This field is required</span>}
                    </div>
                  </div>
                </div>
                {/* Entry Level */}
                <div className="mb-4">
                  <div className="flex items-center gap-4">
                    <label className="block text-sm mb-1 font-medium w-48 self-start">
                      Entry Level <span className="text-red-500">*</span>
                    </label>
                    <div className="flex-1">
                      <Controller
                        name="entryLevel"
                        control={mainForm.control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="focus-visible:ring-0 w-full" arrowStyle="text-[#1967d2] font-bold size-5" onFocus={() => handleFieldFocus("details")}>
                              <SelectValue placeholder="Please select" />
                            </SelectTrigger>
                            <SelectContent>
                              {entryLevels.map((item) => (
                                <SelectItem key={item.value} value={item.value} className="focus:bg-sky-200 focus:text-[#1967d2]">
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {mainForm.formState.errors.entryLevel && <span className="text-red-500 text-xs">This field is required</span>}
                    </div>
                  </div>
                </div>
                {/* Position Type */}
                <div className="mb-4">
                  <div className="flex items-center gap-4">
                    <label className="block text-sm mb-1 font-medium w-48 self-start">
                      Position Type <span className="text-red-500">*</span>
                    </label>
                    <div className="flex-1">
                      <Controller
                        name="positionType"
                        control={mainForm.control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="focus-visible:ring-0 w-full" arrowStyle="text-[#1967d2] font-bold size-5" onFocus={() => handleFieldFocus("details")}>
                              <SelectValue placeholder="Please select" />
                            </SelectTrigger>
                            <SelectContent>
                              {positionTypes.map((item) => (
                                <SelectItem key={item.value} value={item.value} className="focus:bg-sky-200 focus:text-[#1967d2]">
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {mainForm.formState.errors.positionType && <span className="text-red-500 text-xs">This field is required</span>}
                    </div>
                  </div>
                </div>

                {/* Gender */}
                <div className="mb-4">
                  <div className="flex items-center gap-4">
                    <label className="block text-sm mb-1 font-medium w-48 self-start">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="flex-1">
                      <Controller
                        name="gender"
                        control={mainForm.control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="focus-visible:ring-0 w-full" arrowStyle="text-[#1967d2] font-bold size-5" onFocus={() => handleFieldFocus("details")}>
                              <SelectValue placeholder="Please select" />
                            </SelectTrigger>
                            <SelectContent>
                              {genders.map((item) => (
                                <SelectItem key={item.value} value={item.value} className="focus:bg-sky-200 focus:text-[#1967d2]">
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {mainForm.formState.errors.gender && <span className="text-red-500 text-xs">This field is required</span>}
                    </div>
                  </div>
                </div>

                {/* Job Code */}
                <div className="mb-4">
                  <div className="flex items-center gap-4">
                    <label className="block text-sm mb-1 font-medium w-48 self-start">Job Code</label>
                    <div className="flex-1">
                      <Input
                        {...mainForm.register("jobCode")}
                        placeholder="Enter job code"
                        className="w-full focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                        onFocus={() => handleFieldFocus("details")}
                      />
                    </div>
                  </div>
                </div>

                {/* Job Category */}
                <div className="mb-4">
                  <div className="flex items-center gap-4">
                    <label className="block text-sm mb-1 font-medium w-48 self-start">
                      Job Category <span className="text-red-500">*</span>
                    </label>
                    <div className="flex-1">
                      <Controller
                        name="jobCategory"
                        control={mainForm.control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="focus-visible:ring-0 w-full" arrowStyle="text-[#1967d2] font-bold size-5" onFocus={() => handleFieldFocus("details")}>
                              <SelectValue placeholder="Please select" />
                            </SelectTrigger>
                            <SelectContent>
                              {jobCategories.map((item) => (
                                <SelectItem key={item.value} value={item.value} className="focus:bg-sky-200 focus:text-[#1967d2]">
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {mainForm.formState.errors.jobCategory && <span className="text-red-500 text-xs">This field is required</span>}
                      <Button type="button" variant="link" className="text-[#1967d2] p-0 h-auto mt-2">
                        <Plus size={16} strokeWidth={2} /> Add new job Category
                      </Button>
                    </div>
                  </div>
                </div>
                {/* Job Tags */}
                <div className="mb-4">
                  <div className="flex items-center gap-4">
                    <label className="block text-sm mb-1 font-medium w-48 self-start">Job Tags</label>
                    <div className="flex-1">
                      <Input
                        {...mainForm.register("jobTags")}
                        placeholder="Enter job tags"
                        className="w-full focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                        onFocus={() => handleFieldFocus("details")}
                      />
                    </div>
                  </div>
                </div>

                {/* Age */}
                <div className="mb-4">
                  <div className="flex items-center gap-4">
                    <label className="block text-sm mb-1 font-medium w-48 self-start">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <div className="flex-1">
                      <Controller
                        name="age"
                        control={mainForm.control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="focus-visible:ring-0 w-full" arrowStyle="text-[#1967d2] font-bold size-5" onFocus={() => handleFieldFocus("details")}>
                              <SelectValue placeholder="Empty" />
                            </SelectTrigger>
                            <SelectContent>
                              {ages.map((item) => (
                                <SelectItem key={item.value} value={item.value} className="focus:bg-sky-200 focus:text-[#1967d2]">
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {mainForm.formState.errors.age && <span className="text-red-500 text-xs">This field is required</span>}
                    </div>
                  </div>
                </div>
              </div>
              {/* Contact information */}
              <div>
                <label className="block text-2xl text-[#1967d2] font-medium mb-2">Contact information</label>

                {/* HR's Name */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    HR's Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...mainForm.register("hrName", { required: true })}
                    placeholder="HR's Name"
                    defaultValue="Dung Van"
                    className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                    onFocus={() => handleFieldFocus("contact")}
                  />
                  {mainForm.formState.errors.hrName && <span className="text-red-500 text-xs">This field is required</span>}
                </div>

                {/* Contact Phone */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">Contact Phone</label>
                  <Input
                    {...mainForm.register("contactPhone")}
                    placeholder="Contact Phone"
                    className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                    onFocus={() => handleFieldFocus("contact")}
                    onInput={(e) => {
                      (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, "");
                    }}
                  />
                </div>

                {/* Contact Location */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Contact Location <span className="text-red-500">*</span>
                  </label>
                  <BaseModal
                    title="Edit contact location"
                    trigger={
                      <Input
                        readOnly
                        value={
                          mainForm.watch("contactLocation")?.address && mainForm.watch("contactLocation")?.city && mainForm.watch("contactLocation")?.district
                            ? `${mainForm.watch("contactLocation").address}, ${mainForm.watch("contactLocation").district}, ${mainForm.watch("contactLocation").city}`
                            : ""
                        }
                        placeholder="Contact location"
                        className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] cursor-pointer bg-white text-left"
                        onClick={handleOpenModalEditContactLocation}
                        onFocus={() => handleFieldFocus("contact")}
                      />
                    }
                    footer={(onClose) => (
                      <>
                        <Button
                          variant="outline"
                          onClick={onClose}
                          className="border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2] w-28 bg-transparent"
                        >
                          Cancel
                        </Button>
                        <Button className="bg-[#1967d2] w-28 hover:bg-[#1251a3]" onClick={() => handleSaveModalContactLocation(onClose)}>
                          Save
                        </Button>
                      </>
                    )}
                  >
                    <div className="min-w-[600px]">
                      <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium mb-1">
                            Province <span className="text-red-500">*</span>
                          </label>
                          <Controller
                            name="contactLocation.city"
                            control={modalContactLocationForm.control}
                            rules={{ required: "Province is required" }}
                            render={({ field, fieldState }) => (
                              <div className="flex flex-col gap-2">
                                <Select
                                  value={field.value}
                                  onValueChange={(val) => {
                                    field.onChange(val);
                                    modalContactLocationForm.setValue("contactLocation.district", "");
                                  }}
                                >
                                  <SelectTrigger className="w-full bg-gray-100" arrowStyle="text-[#1967d2] font-bold size-5">
                                    <SelectValue placeholder="Select province" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {provinces.map((p) => (
                                      <SelectItem key={p.value} value={p.value} className="focus:bg-sky-200 focus:text-[#1967d2]">
                                        {p.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {fieldState.error && <span className="text-red-500 text-xs">{fieldState.error.message || "Required"}</span>}
                              </div>
                            )}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium mb-1">
                            District <span className="text-red-500">*</span>
                          </label>
                          <Controller
                            name="contactLocation.district"
                            control={modalContactLocationForm.control}
                            rules={{ required: "District is required" }}
                            render={({ field, fieldState }) => (
                              <div className=" flex flex-col gap-2">
                                <Select value={field.value} onValueChange={field.onChange} disabled={!modalContactLocationForm.watch("contactLocation.city")}>
                                  <SelectTrigger className="w-full bg-gray-100" arrowStyle="text-[#1967d2] font-bold size-5">
                                    <SelectValue placeholder="Select district" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {provinces
                                      .find((p) => p.value === modalContactLocationForm.watch("contactLocation.city"))
                                      ?.districts.map((d) => (
                                        <SelectItem key={d.value} value={d.value} className="focus:bg-sky-200 focus:text-[#1967d2]">
                                          {d.label}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                                {fieldState.error && <span className="text-red-500 text-xs">{fieldState.error.message || "Required"}</span>}
                              </div>
                            )}
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <Controller
                          name="contactLocation.address"
                          control={modalContactLocationForm.control}
                          rules={{ required: "Address is required" }}
                          render={({ field, fieldState }) => (
                            <div className=" flex flex-col gap-2">
                              <Input {...field} className="bg-gray-100 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]" placeholder="Enter address" />
                              {fieldState.error && <span className="text-red-500 text-xs">{fieldState.error.message || "Required"}</span>}
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  </BaseModal>
                  {mainForm.formState.errors.contactLocation && <span className="text-red-500 text-xs">This field is required</span>}
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">Description</label>
                  <Controller
                    name="contactDescription"
                    control={mainForm.control}
                    defaultValue=""
                    render={({ field }) => (
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        className="bg-white [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:max-h-[160px] [&_.ql-editor]:overflow-y-auto"
                        onFocus={() => handleFieldFocus("contact")}
                      />
                    )}
                  />
                </div>
              </div>
              {/* Date Of Post */}
              <div>
                <label className="block text-2xl text-[#1967d2] font-medium mb-2">Date Of Post</label>

                {/* Date of Post */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Date of Post <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...mainForm.register("dateOfPost", { required: true })}
                    type="date"
                    className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                    onFocus={() => handleFieldFocus("details")}
                  />
                  {mainForm.formState.errors.dateOfPost && <span className="text-red-500 text-xs">This field is required</span>}
                </div>

                {/* Expiration Date */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Expiration Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...mainForm.register("expirationDate", { required: true })}
                    type="date"
                    className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                    onFocus={() => handleFieldFocus("details")}
                  />
                  {mainForm.formState.errors.expirationDate && <span className="text-red-500 text-xs">This field is required</span>}
                </div>
              </div>
              {/* Language for applications*/}
              <div>
                <label className="block text-2xl text-[#1967d2] font-medium mb-2">Language for applications</label>

                {/* Language Select */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Application Language <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex flex-col gap-2 flex-auto sm:flex-none">
                      <Controller
                        name="applicationLanguage"
                        control={mainForm.control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger
                              className="focus-visible:ring-0 sm:w-[250px] w-full"
                              arrowStyle="text-[#1967d2] font-bold size-5"
                              onFocus={() => handleFieldFocus("details")}
                            >
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              {languages.map((lang) => (
                                <SelectItem key={lang.value} value={lang.value} className="focus:bg-sky-200 focus:text-[#1967d2]">
                                  {lang.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {mainForm.formState.errors.applicationLanguage && <span className="text-red-500 text-xs">This field is required</span>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="mustBeInLanguage"
                        control={mainForm.control}
                        render={({ field }) => <Checkbox id="mustBeInLanguage" checked={field.value} onCheckedChange={field.onChange} />}
                      />
                      <Label htmlFor="mustBeInLanguage" className="text-sm font-normal">
                        Must be written in this language
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded shadow  overflow-auto hidden  lg:block flex-auto  md:max-w-[620px] " ref={previewRef}>
          <div className="bg-white border-b p-4 mb-4">
            <h2 className="text-xl font-semibold text-center text-gray-900 ">Preview</h2>
          </div>
          <div className="overflow-y-auto job-information-preview max-h-[calc(100vh-330px)] px-2 overflow-x-hidden flex-1">
            <JobInformation ref={jobInfoRef} {...previewData} />
          </div>
        </div>
      </div>
      {/* Footer cố định dưới cùng */}
      <div className=" bg-white py-5 border-t flex gap-4 px-5 sticky bottom-0 border-gray-200   z-20">
        <Button className="w-[40%] border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2] bg-transparent" variant="outline" size="lg">
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
