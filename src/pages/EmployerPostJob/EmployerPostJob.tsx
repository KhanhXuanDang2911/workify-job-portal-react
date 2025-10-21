import JobInformation from "@/components/JobInformation";
import { Button } from "@/components/ui/button";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SelectGroup } from "@radix-ui/react-select";
import BaseModal from "@/components/BaseModal";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useRef, useCallback, useEffect } from "react";
import type { JobBenefit } from "@/types/benefit.type";
import { postJobSchema, type PostJobFormData } from "@/schemas/job/job.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobService } from "@/services";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { AgeType, benefitMapVN, CompanySize, EducationLevel, ExperienceLevel, JobGender, JobLevel, JobType, type SalaryType, type SalaryUnit } from "@/constants";
import type { AxiosError } from "axios";
import type { ApiError, Employer, JobLocationRequest } from "@/types";
import { sampleCompanyInfo, sampleJob, sampleJobDescription, sampleQualifications } from "@/pages/EmployerPostJob/EmployerPostJobMockData";
import { useAuth } from "@/context/auth/useAuth";

// type WorkAreaItem = {
//   city: string;
//   district: string;
// };
// type WorkAreasType = WorkAreaItem[];

// type WorkOfficesType = {
//   address: string;
// }[];

// type LocationsType = {
//   workAreas: WorkAreasType;
//   workOffices: WorkOfficesType;
// };

function EmployerPostJob() {
  const mainForm = useForm<PostJobFormData>({
    resolver: zodResolver(postJobSchema),
    mode: "onBlur",
  });

  const { state } = useAuth();
  const employer = state.user as Employer

  useEffect(() => {
    if (employer) {
      mainForm.setValue("companyName", employer.companyName || "");
      mainForm.setValue("companySize", employer.companySize || "");
      mainForm.setValue("companyWebsite", employer.websiteUrls || "");
      mainForm.setValue("aboutCompany", employer.aboutCompany || "");
      mainForm.setValue("contactPerson", employer.contactPerson || "");
      mainForm.setValue("phoneNumber", employer.phoneNumber || "");
    }
  }, [employer, mainForm]);

  const createJobMutation = useMutation({
    mutationFn: async (data: PostJobFormData) => {
      const jobRequest = {
        companyName: data.companyName,
        companySize: data.companySize as CompanySize,
        companyWebsite: data.companyWebsite,
        aboutCompany: data.aboutCompany,
        jobTitle: data.jobTitle,
        jobLocations: data.jobLocations,
        salaryType: data.salaryType as SalaryType,
        minSalary: data.minSalary,
        maxSalary: data.maxSalary,
        salaryUnit: data.salaryUnit as SalaryUnit,
        jobDescription: data.jobDescription,
        requirement: data.requirement,
        jobBenefits: data.jobBenefits,
        educationLevel: data.educationLevel as EducationLevel,
        experienceLevel: data.experienceLevel as ExperienceLevel,
        jobLevel: data.jobLevel as JobLevel,
        jobType: data.jobType as JobType,
        gender: data.gender as JobGender,
        jobCode: data.jobCode,
        industryIds: data.industryIds,
        ageType: data.ageType as AgeType,
        minAge: data.minAge,
        maxAge: data.maxAge,
        contactPerson: data.contactPerson,
        phoneNumber: data.phoneNumber,
        contactLocation: data.contactLocation,
        description: data.description,
        expirationDate: data.expirationDate,
      };
      return jobService.createJob(jobRequest);
    },
    onSuccess: () => {
      toast.success("Job posted successfully!");
      mainForm.reset();
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.message || "Failed to post job";
      toast.error(errorMessage);
    },
  });

  // Modal form cho workAreas location
  // const modalWorkAreasForm = useForm<{ workAreas: WorkAreaItem[] }>({
  //   defaultValues: { workAreas: [] },
  // });
  // const workAreasFieldArray = useFieldArray({
  //   control: modalWorkAreasForm.control,
  //   name: "workAreas",
  // });
  // const modal_workAreas: WorkAreaItem[] = mainForm.watch("workAreas") || [];

  const modalJobLocationsForm = useForm<{ jobLocations: JobLocationRequest[] }>({
    defaultValues: { jobLocations: [] },
  });

  const jobLocationsFieldArray = useFieldArray({
    control: modalJobLocationsForm.control,
    name: "jobLocations",
  });

  const main_jobLocations: JobLocationRequest[] = (mainForm.watch("jobLocations") as any) || [];

  // Modal form cho contact location
  const modalContactLocationForm = useForm<{
    contactLocation: JobLocationRequest;
  }>({
    defaultValues: {
      contactLocation: {},
    },
  });

  const modalBenefitForm = useForm<{ benefits: JobBenefit[] }>({
    defaultValues: { benefits: [] },
  });

  const benefitFieldArray = useFieldArray({
    control: modalBenefitForm.control,
    name: "benefits",
  });

  const main_benefits: JobBenefit[] = (mainForm.watch("jobBenefits") as any) || [];

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

  const onSubmit = async (data: PostJobFormData) => {
    createJobMutation.mutate(data);
  };

  const handleOpenModalEditJobLocations = () => {
    modalJobLocationsForm.reset({
      jobLocations: main_jobLocations.length ? main_jobLocations : [],
    });
  };

  const handleSaveModalJobLocations = async (onClose: () => void) => {
    const valid = await modalJobLocationsForm.trigger();
    if (!valid) return;
    mainForm.setValue("jobLocations", modalJobLocationsForm.getValues("jobLocations") as any, { shouldValidate: true });
    onClose();
  };

  const handleOpenModalEditContactLocation = () => {
    modalContactLocationForm.reset({
      contactLocation: (mainForm.getValues("contactLocation") as any) || {},
    });
  };
  const handleSaveModalContactLocation = async (onClose: () => void) => {
    const valid = await modalContactLocationForm.trigger();
    if (!valid) return;
    mainForm.setValue("contactLocation", modalContactLocationForm.getValues("contactLocation") as any, {
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
    mainForm.setValue("jobBenefits", modalBenefitForm.getValues("benefits").filter((b) => b.description.trim() !== "") as any, { shouldValidate: true });
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

  const getPreviewData = useCallback((formData: any) => {
    const job = {
      ...sampleJob,
      title: formData.jobTitle || sampleJob.title,
      company: formData.companyName || sampleJob.company,
      companySize: formData.companySize || sampleJob.companySize,
      location: formData.jobLocations?.map((loc: JobLocationRequest) => loc.detailAddress).join(", ") || sampleJob.location,
      salary:
        formData.salaryType === "RANGE"
          ? `${formData.minSalary || ""} - ${formData.maxSalary || ""} ${formData.salaryUnit || "VND"}`
          : formData.salaryType === "GREATER_THAN"
          ? `${formData.minSalary || ""} ${formData.salaryUnit || "VND"}+`
          : formData.salaryType === "NEGOTIABLE"
          ? "Negotiable"
          : formData.salaryType === "COMPETITIVE"
          ? "Competitive"
          : sampleJob.salary,
      experience: formData.experienceLevel || sampleJob.experience,
      level: formData.jobLevel || sampleJob.level,
      education: formData.educationLevel || sampleJob.education,
      gender: formData.gender || sampleJob.gender,
      age: formData.ageType || sampleJob.age,
      website: formData.companyWebsite || sampleJob.website,
      workType: formData.jobType || sampleJob.workType,
      address: formData.contactLocation?.detailAddress ? `${formData.contactLocation.detailAddress}` : sampleJob.address,
    };

    const jobDescription = {
      ...sampleJobDescription,
      description: formData.jobDescription || sampleJobDescription.description,
      benefits: formData.jobBenefits?.map((benefit: any) => benefit.description).filter(Boolean) || sampleJobDescription.benefits,
    };

    const qualifications = {
      ...sampleQualifications,
      skillsRequired: formData.requirement || sampleQualifications.skillsRequired,
    };

    const companyInfo = {
      ...sampleCompanyInfo,
      name: formData.companyName || sampleCompanyInfo.name,
      description: formData.aboutCompany || sampleCompanyInfo.description,
    };

    return { job, jobDescription, qualifications, companyInfo };
  }, []);

  const previewData = getPreviewData(watchedValues);

  return (
    <main className="flex flex-col flex-1 bg-sky-50 relative">
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
                    {...mainForm.register("companyName")}
                    placeholder="Company Name"
                    className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                    onFocus={() => handleFieldFocus("company")}
                  />
                  {mainForm.formState.errors.companyName && <span className="text-red-500 text-xs">{mainForm.formState.errors.companyName.message}</span>}
                </div>
                {/*  Company Size */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Company Size <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="companySize"
                    control={mainForm.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="min-w-[250px]" arrowStyle="text-[#1967d2] font-bold size-5" onFocus={() => handleFieldFocus("company")}>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent className="">
                          {Object.entries(CompanySize).map(([key, value]) => (
                            <SelectItem key={value} value={value} className="focus:bg-sky-200 focus:text-[#1967d2]">
                              {key.replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {mainForm.formState.errors.companySize && <span className="text-red-500 text-xs">{mainForm.formState.errors.companySize.message}</span>}
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
                  {mainForm.formState.errors.companyWebsite && <span className="text-red-500 text-xs">{mainForm.formState.errors.companyWebsite.message}</span>}
                </div>
                {/* About Company */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    About Company <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="aboutCompany"
                    control={mainForm.control}
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
                  {mainForm.formState.errors.aboutCompany && <span className="text-red-500 text-xs">{mainForm.formState.errors.aboutCompany.message}</span>}
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
                    {...mainForm.register("jobTitle")}
                    placeholder="Job title"
                    className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                    onFocus={() => handleFieldFocus("description")}
                  />
                  {mainForm.formState.errors.jobTitle && <span className="text-red-500 text-xs">{mainForm.formState.errors.jobTitle.message}</span>}
                </div>
                {/* Location */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="border p-3 rounded space-y-5">
                    <div>
                      <div className="mb-2 text-xs text-gray-500">Choose work locations</div>
                      <BaseModal
                        title="Edit job locations"
                        trigger={
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full flex flex-col items-start justify-start text-left font-normal !h-auto min-h-0 py-2  bg-transparent"
                            onClick={handleOpenModalEditJobLocations}
                            onFocus={() => handleFieldFocus("details")}
                          >
                            {main_jobLocations.length > 0 && main_jobLocations[0].detailAddress ? (
                              main_jobLocations.map((loc: JobLocationRequest, index: number) => <p key={index}>{loc.detailAddress}</p>)
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
                            <Button className="bg-[#1967d2] w-28 hover:bg-[#1251a3]" onClick={() => handleSaveModalJobLocations(onClose)}>
                              Save
                            </Button>
                          </>
                        )}
                      >
                        <div className="min-w-[600px]">
                          <Label htmlFor="modal-location" className="mb-3">
                            Work Location
                          </Label>
                          {jobLocationsFieldArray.fields.map((loc, idx) => (
                            <div key={idx} className="flex gap-2 justify-between mb-3">
                              {/* Select province */}
                              <Controller
                                control={modalJobLocationsForm.control}
                                name={`jobLocations.${idx}.provinceId`}
                                rules={{ required: "Required" }}
                                render={({ field, fieldState }) => (
                                  <div className="flex flex-col gap-2">
                                    <Select value={field.value?.toString() || ""} onValueChange={(val) => field.onChange(Number.parseInt(val))}>
                                      <SelectTrigger className="min-w-[200px] bg-gray-100" arrowStyle="text-[#1967d2] font-bold size-5">
                                        <SelectValue placeholder="Select province" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="1" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                          Hà Nội
                                        </SelectItem>
                                        <SelectItem value="2" className="focus:bg-sky-200 focus:text-[#1967d2]">
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
                                control={modalJobLocationsForm.control}
                                name={`jobLocations.${idx}.districtId`}
                                rules={{ required: "Required" }}
                                render={({ field, fieldState }) => (
                                  <div className="flex flex-col gap-2">
                                    <Select
                                      value={field.value?.toString() || ""}
                                      onValueChange={(val) => field.onChange(Number.parseInt(val))}
                                      disabled={!modalJobLocationsForm.watch(`jobLocations.${idx}.provinceId`)}
                                    >
                                      <SelectTrigger className="min-w-[200px] bg-gray-100" arrowStyle="text-[#1967d2] font-bold size-5">
                                        <SelectValue placeholder="Select district" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {modalJobLocationsForm.watch(`jobLocations.${idx}.provinceId`) === 1 && (
                                          <>
                                            <SelectItem value="1" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                              Ba Đình
                                            </SelectItem>
                                            <SelectItem value="2" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                              Đống Đa
                                            </SelectItem>
                                          </>
                                        )}
                                        {modalJobLocationsForm.watch(`jobLocations.${idx}.provinceId`) === 2 && (
                                          <>
                                            <SelectItem value="3" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                              Quận 1
                                            </SelectItem>
                                            <SelectItem value="4" className="focus:bg-sky-200 focus:text-[#1967d2]">
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
                              {/* Detail Address */}
                              <Controller
                                control={modalJobLocationsForm.control}
                                name={`jobLocations.${idx}.detailAddress`}
                                rules={{ required: "Required" }}
                                render={({ field, fieldState }) => (
                                  <div className="flex flex-col gap-2 flex-1">
                                    <Input
                                      {...field}
                                      placeholder="Detail address"
                                      className="bg-gray-100 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                                    />
                                    {fieldState.error && <span className="text-red-500 text-xs mt-1">{fieldState.error.message || "Required"}</span>}
                                  </div>
                                )}
                              />
                              {/* Xóa location */}
                              {jobLocationsFieldArray.fields.length >= 1 && (
                                <Button variant="secondary" size="icon" className="size-8 hover:bg-red-400" onClick={() => jobLocationsFieldArray.remove(idx)}>
                                  <Trash2 />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            variant="link"
                            className="text-[#1967d2] p-0 h-auto mt-2 text-lg"
                            onClick={() => jobLocationsFieldArray.append({ provinceId: 0, districtId: 0, detailAddress: "" })}
                            disabled={jobLocationsFieldArray.fields.length >= 5}
                          >
                            <Plus strokeWidth={3} /> Add new location
                          </Button>
                        </div>
                      </BaseModal>
                    </div>
                  </div>
                  {mainForm.formState.errors.jobLocations && <span className="text-red-500 text-xs">{mainForm.formState.errors.jobLocations.message}</span>}
                </div>
                {/* Salary */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Salary <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="salaryType"
                    control={mainForm.control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex flex-row justify-between pr-5 gap-6 mb-2 mt-3"
                        onFocus={() => handleFieldFocus("details")}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="RANGE" id="salary-input" />
                          <Label htmlFor="salary-input">Input</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="GREATER_THAN" id="salary-more" />
                          <Label htmlFor="salary-more">More than</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="NEGOTIABLE" id="salary-negotiable" className=""></RadioGroupItem>
                          <Label htmlFor="salary-negotiable">Negotiable</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="COMPETITIVE" id="salary-competitive" />
                          <Label htmlFor="salary-competitive">Competitive</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {/* Hiển thị các ô nhập khi chọn Input */}
                  {mainForm.watch("salaryType") === "RANGE" && (
                    <div className="flex flex-col sm:flex-row items-center gap-2 mt-4">
                      <div className="flex flex-row sm:flex-1 has-focus-visible:ring-1 has-focus-visible:ring-[#1967d2]">
                        <Input
                          {...mainForm.register("minSalary", { valueAsNumber: true })}
                          placeholder="Ex: 10"
                          className="min-w-32 rounded-none focus-visible:border-none focus-visible:ring-0"
                          type="number"
                        />
                        <Controller
                          name="salaryUnit"
                          control={mainForm.control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                              <SelectTrigger className="min-w-36 rounded-none focus-visible:ring-0" arrowStyle="text-[#1967d2] font-bold size-5">
                                <SelectValue placeholder="Select Unit" />
                              </SelectTrigger>
                              <SelectContent className="rounded-none">
                                <SelectGroup>
                                  <SelectItem value="VND" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                    VND
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
                          {...mainForm.register("maxSalary", { valueAsNumber: true })}
                          placeholder="Ex: 10 "
                          className="min-w-32 rounded-none focus-visible:border-none focus-visible:ring-0"
                          type="number"
                        />
                        <Controller
                          name="salaryUnit"
                          control={mainForm.control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                              <SelectTrigger className="min-w-36 rounded-none focus-visible:ring-0" arrowStyle="text-[#1967d2] font-bold size-5">
                                <SelectValue placeholder="Select Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="VND" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                    VND
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
                  {mainForm.watch("salaryType") === "GREATER_THAN" && (
                    <div className="flex justify-between mt-2 has-focus-visible:ring-1 has-focus-visible:ring-[#1967d2]">
                      <Input
                        {...mainForm.register("minSalary", { valueAsNumber: true })}
                        placeholder="Ex: 10 or 10.5"
                        className="rounded-none focus-visible:border-none focus-visible:ring-0"
                        type="number"
                      />
                      <Controller
                        name="salaryUnit"
                        control={mainForm.control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger className="min-w-40 rounded-none focus-visible:ring-0" arrowStyle="text-[#1967d2] font-bold size-5">
                              <SelectValue placeholder="VND" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="VND" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                  VND
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
                  {mainForm.formState.errors.salaryType && <span className="text-red-500 text-xs">{mainForm.formState.errors.salaryType.message}</span>}
                </div>

                {/* Job Description */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Job Description Detail <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="jobDescription"
                    control={mainForm.control}
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
                  {mainForm.formState.errors.jobDescription && <span className="text-red-500 text-xs">{mainForm.formState.errors.jobDescription.message}</span>}
                </div>
                {/* Job Requirement */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Job Requirement <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="requirement"
                    control={mainForm.control}
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
                  {mainForm.formState.errors.requirement && <span className="text-red-500 text-xs">{mainForm.formState.errors.requirement.message}</span>}
                </div>
                {/* Benefits */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Benefits <span className="text-red-500">*</span>
                  </label>
                  <div>
                    {main_benefits.length > 0 && (
                      <ul className="mb-2 space-y-2 ">
                        {main_benefits.map((benefit: JobBenefit, idx: number) => {
                          const Icon = benefitMapVN[benefit.type].icon;
                          return (
                            <li key={idx} className="flex items-center gap-2 border p-1 ">
                              <div className="flex items-center gap-1 self-start">
                                <Icon size={28} strokeWidth={1.8} color="#1967d2" />
                                <span className="font-medium text-sm">{benefitMapVN[benefit.type].label}:</span>
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
                                        const Icon = benefitMapVN[field.value]?.icon;
                                        return Icon ? <Icon size={40} strokeWidth={2.5} className=" text-[#1967d2]" /> : null;
                                      })()}
                                    </SelectTrigger>
                                    <SelectContent>
                                      <div className="grid grid-cols-4 gap-2">
                                        {Object.entries(benefitMapVN).map(([type, { label, icon }]) => {
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
                            const availableTypes = (Object.keys(benefitMapVN) as JobBenefit["type"][]).filter((type) => !selectedTypes.includes(type));
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
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger className="focus-visible:ring-0  w-full" arrowStyle="text-[#1967d2] font-bold size-5" onFocus={() => handleFieldFocus("details")}>
                              <SelectValue placeholder="Please select" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(EducationLevel).map(([key, value]) => (
                                <SelectItem key={value} value={value} className="focus:bg-sky-200 focus:text-[#1967d2]">
                                  {key.replace(/_/g, " ")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {mainForm.formState.errors.educationLevel && <span className="text-red-500 text-xs">{mainForm.formState.errors.educationLevel.message}</span>}
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
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger className="focus-visible:ring-0 w-full" arrowStyle="text-[#1967d2] font-bold size-5" onFocus={() => handleFieldFocus("details")}>
                              <SelectValue placeholder="Please select" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(ExperienceLevel).map(([key, value]) => (
                                <SelectItem key={value} value={value} className="focus:bg-sky-200 focus:text-[#1967d2]">
                                  {key.replace(/_/g, " ")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {mainForm.formState.errors.experienceLevel && <span className="text-red-500 text-xs">{mainForm.formState.errors.experienceLevel.message}</span>}
                    </div>
                  </div>
                </div>
                {/* Job Level */}
                <div className="mb-4">
                  <div className="flex items-center gap-4">
                    <label className="block text-sm mb-1 font-medium w-48 self-start">
                      Job Level <span className="text-red-500">*</span>
                    </label>
                    <div className="flex-1">
                      <Controller
                        name="jobLevel"
                        control={mainForm.control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger className="focus-visible:ring-0 w-full" arrowStyle="text-[#1967d2] font-bold size-5" onFocus={() => handleFieldFocus("details")}>
                              <SelectValue placeholder="Please select" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(JobLevel).map(([key, value]) => (
                                <SelectItem key={value} value={value} className="focus:bg-sky-200 focus:text-[#1967d2]">
                                  {key.replace(/_/g, " ")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {mainForm.formState.errors.jobLevel && <span className="text-red-500 text-xs">{mainForm.formState.errors.jobLevel.message}</span>}
                    </div>
                  </div>
                </div>
                {/* Job Type */}
                <div className="mb-4">
                  <div className="flex items-center gap-4">
                    <label className="block text-sm mb-1 font-medium w-48 self-start">
                      Job Type <span className="text-red-500">*</span>
                    </label>
                    <div className="flex-1">
                      <Controller
                        name="jobType"
                        control={mainForm.control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger className="focus-visible:ring-0 w-full" arrowStyle="text-[#1967d2] font-bold size-5" onFocus={() => handleFieldFocus("details")}>
                              <SelectValue placeholder="Please select" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(JobType).map(([key, value]) => (
                                <SelectItem key={value} value={value} className="focus:bg-sky-200 focus:text-[#1967d2]">
                                  {key.replace(/_/g, " ")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {mainForm.formState.errors.jobType && <span className="text-red-500 text-xs">{mainForm.formState.errors.jobType.message}</span>}
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
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger className="focus-visible:ring-0 w-full" arrowStyle="text-[#1967d2] font-bold size-5" onFocus={() => handleFieldFocus("details")}>
                              <SelectValue placeholder="Please select" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(JobGender).map(([key, value]) => (
                                <SelectItem key={value} value={value} className="focus:bg-sky-200 focus:text-[#1967d2]">
                                  {key.replace(/_/g, " ")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {mainForm.formState.errors.gender && <span className="text-red-500 text-xs">{mainForm.formState.errors.gender.message}</span>}
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

                {/* Industry IDs */}
                <div className="mb-4">
                  <div className="flex items-center gap-4">
                    <label className="block text-sm mb-1 font-medium w-48 self-start">
                      Industries <span className="text-red-500">*</span>
                    </label>
                    <div className="flex-1">
                      <Controller
                        name="industryIds"
                        control={mainForm.control}
                        render={({ field }) => (
                          <Select onValueChange={(val) => field.onChange([...field.value, Number.parseInt(val)])} value="">
                            <SelectTrigger className="focus-visible:ring-0 w-full" arrowStyle="text-[#1967d2] font-bold size-5" onFocus={() => handleFieldFocus("details")}>
                              <SelectValue placeholder="Select industries" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                Technology
                              </SelectItem>
                              <SelectItem value="2" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                Finance
                              </SelectItem>
                              <SelectItem value="3" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                Healthcare
                              </SelectItem>
                              <SelectItem value="4" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                Education
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {mainForm.formState.errors.industryIds && <span className="text-red-500 text-xs">{mainForm.formState.errors.industryIds.message}</span>}
                    </div>
                  </div>
                </div>

                {/* Age Type */}
                <div className="mb-4">
                  <div className="flex items-center gap-4">
                    <label className="block text-sm mb-1 font-medium w-48 self-start">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <div className="flex-1">
                      <Controller
                        name="ageType"
                        control={mainForm.control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger className="focus-visible:ring-0 w-full" arrowStyle="text-[#1967d2] font-bold size-5" onFocus={() => handleFieldFocus("details")}>
                              <SelectValue placeholder="Select age type" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(AgeType).map(([key, value]) => (
                                <SelectItem key={value} value={value} className="focus:bg-sky-200 focus:text-[#1967d2]">
                                  {key.replace(/_/g, " ")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {mainForm.formState.errors.ageType && <span className="text-red-500 text-xs">{mainForm.formState.errors.ageType.message}</span>}
                    </div>
                  </div>
                </div>

                {/* Min Age */}
                {(mainForm.watch("ageType") === "ABOVE" || mainForm.watch("ageType") === "INPUT") && (
                  <div className="mb-4">
                    <div className="flex items-center gap-4">
                      <label className="block text-sm mb-1 font-medium w-48 self-start">
                        Min Age <span className="text-red-500">*</span>
                      </label>
                      <div className="flex-1">
                        <Input
                          {...mainForm.register("minAge", { valueAsNumber: true })}
                          type="number"
                          placeholder="Enter minimum age"
                          className="w-full focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                          onFocus={() => handleFieldFocus("details")}
                        />
                        {mainForm.formState.errors.minAge && <span className="text-red-500 text-xs">{mainForm.formState.errors.minAge.message}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Max Age */}
                {(mainForm.watch("ageType") === "BELOW" || mainForm.watch("ageType") === "INPUT") && (
                  <div className="mb-4">
                    <div className="flex items-center gap-4">
                      <label className="block text-sm mb-1 font-medium w-48 self-start">
                        Max Age <span className="text-red-500">*</span>
                      </label>
                      <div className="flex-1">
                        <Input
                          {...mainForm.register("maxAge", { valueAsNumber: true })}
                          type="number"
                          placeholder="Enter maximum age"
                          className="w-full focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                          onFocus={() => handleFieldFocus("details")}
                        />
                        {mainForm.formState.errors.maxAge && <span className="text-red-500 text-xs">{mainForm.formState.errors.maxAge.message}</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Contact information */}
              <div>
                <label className="block text-2xl text-[#1967d2] font-medium mb-2">Contact information</label>

                {/* Contact Person */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...mainForm.register("contactPerson")}
                    placeholder="Contact Person Name"
                    className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                    onFocus={() => handleFieldFocus("contact")}
                  />
                  {mainForm.formState.errors.contactPerson && <span className="text-red-500 text-xs">{mainForm.formState.errors.contactPerson.message}</span>}
                </div>

                {/* Phone Number */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...mainForm.register("phoneNumber")}
                    placeholder="Contact Phone"
                    className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                    onFocus={() => handleFieldFocus("contact")}
                  />
                  {mainForm.formState.errors.phoneNumber && <span className="text-red-500 text-xs">{mainForm.formState.errors.phoneNumber.message}</span>}
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
                          mainForm.watch("contactLocation")?.detailAddress && mainForm.watch("contactLocation")?.provinceId && mainForm.watch("contactLocation")?.districtId
                            ? `${mainForm.watch("contactLocation").detailAddress}`
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
                            name="contactLocation.provinceId"
                            control={modalContactLocationForm.control}
                            rules={{ required: "Province is required" }}
                            render={({ field, fieldState }) => (
                              <div className="flex flex-col gap-2">
                                <Select
                                  value={field.value?.toString() || ""}
                                  onValueChange={(val) => {
                                    field.onChange(Number.parseInt(val));
                                    modalContactLocationForm.setValue("contactLocation.districtId", 0);
                                  }}
                                >
                                  <SelectTrigger className="w-full bg-gray-100" arrowStyle="text-[#1967d2] font-bold size-5">
                                    <SelectValue placeholder="Select province" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                      Hà Nội
                                    </SelectItem>
                                    <SelectItem value="2" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                      Hồ Chí Minh
                                    </SelectItem>
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
                            name="contactLocation.districtId"
                            control={modalContactLocationForm.control}
                            rules={{ required: "District is required" }}
                            render={({ field, fieldState }) => (
                              <div className=" flex flex-col gap-2">
                                <Select
                                  value={field.value?.toString() || ""}
                                  onValueChange={(val) => field.onChange(Number.parseInt(val))}
                                  disabled={!modalContactLocationForm.watch("contactLocation.provinceId")}
                                >
                                  <SelectTrigger className="w-full bg-gray-100" arrowStyle="text-[#1967d2] font-bold size-5">
                                    <SelectValue placeholder="Select district" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                      Ba Đình
                                    </SelectItem>
                                    <SelectItem value="2" className="focus:bg-sky-200 focus:text-[#1967d2]">
                                      Đống Đa
                                    </SelectItem>
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
                          name="contactLocation.detailAddress"
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
                  {mainForm.formState.errors.contactLocation && <span className="text-red-500 text-xs">{mainForm.formState.errors.contactLocation.message}</span>}
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">Description</label>
                  <Controller
                    name="description"
                    control={mainForm.control}
                    render={({ field }) => (
                      <ReactQuill
                        theme="snow"
                        value={field.value || ""}
                        onChange={field.onChange}
                        className="bg-white [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:max-h-[160px] [&_.ql-editor]:overflow-y-auto"
                        onFocus={() => handleFieldFocus("contact")}
                      />
                    )}
                  />
                </div>
              </div>
              {/* Expiration Date */}
              <div>
                <label className="block text-2xl text-[#1967d2] font-medium mb-2">Expiration Date</label>

                {/* Expiration Date */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 font-medium">
                    Expiration Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...mainForm.register("expirationDate")}
                    placeholder="dd/MM/yyyy"
                    className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                    onFocus={() => handleFieldFocus("details")}
                  />
                  {mainForm.formState.errors.expirationDate && <span className="text-red-500 text-xs">{mainForm.formState.errors.expirationDate.message}</span>}
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
        <Button
          className="w-[60%]  bg-[#1967d2] hover:bg-[#1251a3] disabled:opacity-50"
          variant="default"
          size="lg"
          type="submit"
          form="post-job-form"
          disabled={createJobMutation.isPending}
        >
          {createJobMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            "Post Job"
          )}
        </Button>
      </div>
    </main>
  );
}

export default EmployerPostJob;
