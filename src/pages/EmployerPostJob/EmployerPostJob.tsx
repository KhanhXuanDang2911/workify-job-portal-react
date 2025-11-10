import JobInformation from "@/components/JobInformation";
import { Button } from "@/components/ui/button";
import {
  Controller,
  useFieldArray,
  useForm,
  type Resolver,
} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import BaseModal from "@/components/BaseModal";
import { Plus, Trash2, Loader2, MapPin } from "lucide-react";
import {
  useRef,
  useCallback,
  useState,
  useLayoutEffect,
  useEffect,
} from "react";
import type { JobBenefit } from "@/types/benefit.type";
import {
  jobBenefitSchema,
  locationSchema,
  postJobSchema,
  type JobBenefitFormData,
  type LocationFormData,
  type PostJobFormData,
} from "@/schemas/job/job.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobService, provinceService } from "@/services";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AgeType,
  AgeTypeLabelVN,
  benefitMapVN,
  CompanySize,
  CompanySizeLabel,
  CompanySizeLabelVN,
  EducationLevel,
  EducationLevelLabelVN,
  ExperienceLevel,
  ExperienceLevelLabelVN,
  JobGender,
  JobGenderLabelVN,
  JobLevel,
  JobLevelLabelVN,
  JobType,
  JobTypeLabelVN,
  SalaryType,
  SalaryUnit,
} from "@/constants";
import { AxiosError } from "axios";
import type {
  ApiError,
  District,
  Employer,
  JobRequest,
  Province,
} from "@/types";
import { useEmployerAuth } from "@/context/employer-auth";
import { useIndustries } from "@/hooks/industry/useIndustries";
import { useProvinces } from "@/hooks/province/useProvinces";
import { useDistrictsByProvinceId } from "@/hooks/district/useDistrictsByProvinceId";
import { formatDate, sortByName } from "@/utils";
import z from "zod";
import { useDistrictsForLocations } from "@/hooks/district/useDistrictsForLocations";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/components/Loading";
import type {
  JobInformationProps,
  JobInformationRef,
  JobProp,
} from "@/components/JobInformation/JobInformation";
import { employer_routes } from "@/routes/routes.const";

type SectionType =
  | "header"
  | "description"
  | "benefits"
  | "requirements"
  | "jobDetails"
  | "contact"
  | "companyInformation";

function EmployerPostJob() {
  const renderCount = useRef(0);

  const { jobId } = useParams<{ jobId?: string }>();

  const navigate = useNavigate();

  const isEditMode = !!jobId;

  const queryClient = useQueryClient();

  const { data: industries, isFetching: isFetchingIndustries } =
    useIndustries();

  const { data: provinces, isFetching: isFetchingProvinces } = useProvinces({
    enabled: false,
    select: sortByName,
  });

  const { state } = useEmployerAuth();
  const employer = state.employer;

  // Calculate expiration date: 2 months from today
  const getExpirationDate = (): string => {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setMonth(today.getMonth() + 2);
    return formatDate(expirationDate);
  };

  const {
    data: jobData,
    isLoading: isLoadingJob,
    error,
  } = useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => {
      const res = await jobService.getJobById(Number(jobId));
      return res.data;
    },
    enabled: isEditMode && !!jobId,
    staleTime: 30 * 60 * 1000,
    retry: false,
  });

  const mainForm = useForm<PostJobFormData>({
    resolver: zodResolver(postJobSchema) as Resolver<PostJobFormData>,
    mode: "onSubmit",
    defaultValues: {
      // --- Company Information ---
      companyName: "",
      companySize: jobData?.companySize,
      companyWebsite: "",
      aboutCompany: "",

      // --- Job Info ---
      jobTitle: "",
      jobLocations: [],
      salaryType: jobData?.salaryType,
      minSalary: undefined,
      maxSalary: undefined,
      salaryUnit: jobData?.salaryUnit,
      jobDescription: "",
      requirement: "",
      jobBenefits: [],

      // --- Job Details ---
      educationLevel: jobData?.educationLevel,
      experienceLevel: jobData?.experienceLevel,
      jobLevel: jobData?.jobLevel,
      jobType: jobData?.jobType,
      gender: jobData?.gender,
      jobCode: "",
      industries: [],
      ageType: jobData?.ageType,
      minAge: undefined,
      maxAge: undefined,

      // --- Contact ---
      contactPerson: "",
      phoneNumber: "",
      contactLocation: {
        provinceId: undefined,
        districtId: undefined,
        provinceName: "",
        districtName: "",
        detailAddress: "",
      },
      description: "",

      // --- Other ---
      expirationDate: getExpirationDate(),
    },
  });

  useEffect(() => {
    if (error instanceof AxiosError && error.response?.status === 404) {
      toast.error("Job not found");
      navigate(`${employer_routes.BASE}/${employer_routes.JOBS}`);
    }
  }, [error, navigate]);

  // Tạo job
  const createJobMutation = useMutation({
    mutationFn: async (data: JobRequest) => {
      return jobService.createJob(data);
    },
    onSuccess: () => {
      toast.success("Job posted successfully! =))");
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
      navigate(`${employer_routes.BASE}/${employer_routes.JOBS}`);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error("Failed to post job");
    },
  });
  // Cập nhật job
  const updateJobMutation = useMutation({
    mutationFn: async (data: JobRequest) => {
      return jobService.updateJob(Number(jobId), data);
    },
    onSuccess: () => {
      toast.success("Job updated successfully! =))");
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      navigate(`${employer_routes.BASE}/${employer_routes.JOBS}`);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error("Failed to update job");
    },
  });

  // Modal form cho job locations
  const modalJobLocationsForm = useForm<{
    jobLocations: LocationFormData[];
  }>({
    resolver: zodResolver(
      z.object({
        jobLocations: z.array(locationSchema),
      })
    ),
    defaultValues: { jobLocations: [] },
    mode: "onChange",
  });

  const jobLocationsFieldArray = useFieldArray({
    control: modalJobLocationsForm.control,
    name: "jobLocations",
  });

  const main_jobLocations: LocationFormData[] =
    mainForm.watch("jobLocations") || [];

  // Modal form cho contact location
  const modalContactLocationForm = useForm<{
    contactLocation: LocationFormData;
  }>({
    resolver: zodResolver(
      z.object({
        contactLocation: locationSchema,
      })
    ),
    mode: "onChange",
  });
  // Modal form cho benefits
  const modalBenefitForm = useForm<{ benefits: JobBenefitFormData[] }>({
    resolver: zodResolver(
      z.object({
        benefits: z.array(jobBenefitSchema),
      })
    ),
    defaultValues: { benefits: [] },
    mode: "onBlur",
  });

  const watchedJobLocations = modalJobLocationsForm.watch("jobLocations");

  const { getDistrictsByIndex, isLoadingByIndex } = useDistrictsForLocations({
    locations: watchedJobLocations || [],
    sortFn: sortByName,
  });
  const selectedProvinceIdContact = modalContactLocationForm.watch(
    "contactLocation.provinceId"
  );

  const { data: districtsByContactProvince } = useDistrictsByProvinceId(
    selectedProvinceIdContact,
    { select: sortByName }
  );

  const benefitFieldArray = useFieldArray({
    control: modalBenefitForm.control,
    name: "benefits",
  });

  const main_benefits: JobBenefit[] =
    (mainForm.watch("jobBenefits") as any) || [];

  const handlePrefetchProvinces = () => {
    const cached = queryClient.getQueryData(["provinces"]);
    if (!cached) {
      queryClient.prefetchQuery({
        queryKey: ["provinces"],
        queryFn: async () => {
          const response = await provinceService.getProvinces();
          return response.data;
        },
        staleTime: 1000 * 60 * 60,
      });
    }
  };
  //1234
  useLayoutEffect(() => {
    if (isEditMode && jobData) {
      const job = jobData;
      console.log("RESET FORM with jobData:", jobData);
      mainForm.reset({
        companyName: job.companyName,
        companySize: job.companySize,
        companyWebsite: job.companyWebsite,
        aboutCompany: job.aboutCompany,
        jobTitle: job.jobTitle,
        jobLocations:
          job.jobLocations?.map((loc) => ({
            provinceId: loc.province?.id,
            districtId: loc.district?.id,
            detailAddress: loc.detailAddress,
            provinceName: loc.province?.name,
            districtName: loc.district?.name,
          })) || [],
        salaryType: job.salaryType as SalaryType,
        minSalary: job.minSalary,
        maxSalary: job.maxSalary,
        salaryUnit: job.salaryUnit,
        jobDescription: job.jobDescription,
        requirement: job.requirement,
        jobBenefits: job.jobBenefits || [],
        educationLevel: job.educationLevel,
        experienceLevel: job.experienceLevel,
        jobLevel: job.jobLevel,
        jobType: job.jobType,
        gender: job.gender,
        jobCode: job.jobCode,
        industries:
          job.industries?.map((ind) => ({ id: ind.id, name: ind.name })) || [],
        ageType: job.ageType,
        minAge: job.minAge,
        maxAge: job.maxAge,
        contactPerson: job.contactPerson,
        phoneNumber: job.phoneNumber,
        contactLocation: {
          provinceId: job.contactLocation?.province?.id,
          districtId: job.contactLocation?.district?.id,
          provinceName: job.contactLocation?.province?.name,
          districtName: job.contactLocation?.district?.name,
          detailAddress: job.contactLocation?.detailAddress,
        },
        description: job.description,
        expirationDate: formatDate(new Date(job.expirationDate)),
      });
    }
  }, [isEditMode, jobData, mainForm]);

  useEffect(() => {
    if (isEditMode) return;
    if (employer) {
      console.log("createMODE");

      mainForm.setValue("companyName", employer.companyName);
      mainForm.setValue("companySize", employer.companySize);
      mainForm.setValue(
        "companyWebsite",
        employer.websiteUrls?.[0] || undefined
      );
      mainForm.setValue("aboutCompany", employer.aboutCompany || "");
    }
  }, [isEditMode, employer, mainForm]);

  const watchedValues = mainForm.watch();

  const previewRef = useRef<HTMLDivElement>(null);

  const jobInfoRef = useRef<JobInformationRef>(null);

  const onSubmit = async (data: PostJobFormData) => {
    console.log("date: ", data.expirationDate);
    const jobRequest: JobRequest = {
      companyName: data.companyName,
      companySize: data.companySize as CompanySize,
      companyWebsite: data.companyWebsite,
      aboutCompany: data.aboutCompany,
      jobTitle: data.jobTitle,
      jobLocations: data.jobLocations.map((loc) => ({
        provinceId: loc.provinceId,
        districtId: loc.districtId,
        detailAddress: loc.detailAddress,
      })),
      salaryType: data.salaryType as SalaryType,
      minSalary: data.minSalary ?? undefined,
      maxSalary: data.maxSalary ?? undefined,
      salaryUnit: data.salaryUnit,
      jobDescription: data.jobDescription,
      requirement: data.requirement,
      jobBenefits: data.jobBenefits,
      educationLevel: data.educationLevel as EducationLevel,
      experienceLevel: data.experienceLevel as ExperienceLevel,
      jobLevel: data.jobLevel as JobLevel,
      jobType: data.jobType as JobType,
      gender: data.gender as JobGender,
      jobCode: data.jobCode,
      industryIds: data.industries.map((ind) => ind.id),
      ageType: data.ageType as AgeType,
      minAge: data.minAge ?? undefined,
      maxAge: data.maxAge ?? undefined,
      contactPerson: data.contactPerson,
      phoneNumber: data.phoneNumber,
      contactLocation: {
        provinceId: data.contactLocation.provinceId,
        districtId: data.contactLocation.districtId,
        detailAddress: data.contactLocation.detailAddress,
      },
      description: data.description,
      expirationDate: data.expirationDate,
    };
    console.log("job: ", jobRequest);

    if (isEditMode) {
      updateJobMutation.mutate(jobRequest);
    } else {
      createJobMutation.mutate(jobRequest);
    }
  };

  const onError = (errors: any) => {
    console.error("Form validation failed!");
    console.error("Errors:", errors);
  };
  const handleOpenModalEditJobLocations = () => {
    modalJobLocationsForm.reset({
      jobLocations: main_jobLocations.length ? main_jobLocations : [],
    });
  };

  const handleSaveModalJobLocations = async (onClose: () => void) => {
    const valid = await modalJobLocationsForm.trigger();
    if (!valid) return;

    mainForm.setValue(
      "jobLocations",
      modalJobLocationsForm.getValues("jobLocations"),
      {
        shouldValidate: true,
      }
    );
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

    mainForm.setValue(
      "contactLocation",
      modalContactLocationForm.getValues("contactLocation"),
      {
        shouldValidate: true,
      }
    );
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
      "jobBenefits",
      modalBenefitForm
        .getValues("benefits")
        .filter((b) => b.description.trim() !== "") as any,
      { shouldValidate: true }
    );
    onClose();
  };

  const scrollToPreviewSection = useCallback((section: SectionType) => {
    if (!jobInfoRef.current) return;

    switch (section) {
      case "header":
        jobInfoRef.current.scrollToHeader();
        break;
      case "description":
        jobInfoRef.current.scrollToDescription();
        break;
      case "benefits":
        jobInfoRef.current.scrollToBenefits();
        break;
      case "requirements":
        jobInfoRef.current.scrollToRequirements();
        break;
      case "jobDetails":
        jobInfoRef.current.scrollToJobDetails();
        break;
      case "contact":
        jobInfoRef.current.scrollToContact();
        break;
      case "companyInformation":
        jobInfoRef.current.scrollToCompanyInformation();
        break;
    }
  }, []);

  const handleFieldFocus = useCallback(
    (section: SectionType) => {
      scrollToPreviewSection(section);
    },
    [scrollToPreviewSection]
  );

  const getPreviewData = (
    formData: PostJobFormData
  ): { job: JobProp; hideActionButtons: boolean } => {
    const job: JobProp = {
      //header
      isNew: true,
      companyBanner:
        employer?.backgroundUrl ||
        "https://marketplace.canva.com/EAGZ0XPzFoE/1/0/1600w/canva-blue-and-white-line-modern-corporate-business-banner-Cvux46kBPZ8.jpg",
      companyLogo:
        employer?.avatarUrl ||
        "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg",
      jobTitle: formData.jobTitle || "Tiêu đề Job",
      companyName: formData.companyName || "Company Name",
      jobLocation:
        formData.jobLocations?.map((location, index) => ({
          province: {
            id: location.provinceId,
            name: location.provinceName,
          } as Province,
          district: {
            id: location.districtId,
            name: location.districtName,
          } as District,
          detailAddress: location.detailAddress,
        })) || [],
      companyWebsite: formData.companyWebsite || "",
      salary: {
        salaryType: formData.salaryType,
        minSalary: formData.minSalary,
        maxSalary: formData.maxSalary,
        salaryUnit: formData.salaryUnit,
      },
      expirationDate: formData.expirationDate,

      // Description
      jobDescription: formData.jobDescription,

      // Benefit
      jobBenefits: formData.jobBenefits,

      // Requirement
      requirement: formData.requirement,

      // Job details
      jobType: formData.jobType,
      jobLevel: formData.jobLevel,
      educationLevel: formData.educationLevel,
      experienceLevel: formData.experienceLevel,
      gender: formData.gender,
      age: {
        ageType: formData.ageType as AgeType,
        minAge: formData.minAge ?? undefined,
        maxAge: formData.maxAge ?? undefined,
      },
      industries: formData.industries,

      // Contact
      contactPerson: formData.contactPerson || "Contact Person",
      phoneNumber: formData.phoneNumber || "Phone Number",
      contactLocation: {
        province: {
          id: formData.contactLocation?.provinceId || 0,
          code: "",
          name: formData.contactLocation?.provinceName || "",
          engName: "",
        } as Province,
        district: {
          id: formData.contactLocation?.districtId || 0,
          code: "",
          name: formData.contactLocation?.districtName || "",
        } as District,
        detailAddress: formData.contactLocation?.detailAddress || "",
      },
      description: formData.description,

      // Company Information
      companySize: formData.companySize,
      aboutCompany: formData.aboutCompany || "About Company",
    };

    return { job, hideActionButtons: true };
  };
  // const previewData = getPreviewData(watchedValues);

  // console.log("previewData: ",previewData);
  console.log("formData: ", mainForm.getValues());
  renderCount.current += 1;
  console.log("EmployerPostJob render count:", renderCount.current);

  return (
    <main className="relative flex flex-col flex-1 bg-sky-50 min-h-screen">
      {/* Header cố định trên cùng */}
      <div className="sticky top-0 z-20 py-3 bg-white border-b border-gray-200 flex-shrink-0">
        <h1 className="text-3xl font-medium p-2 text-center text-[#1967d2]">
          {isEditMode ? "Edit Job" : "Post Job"}
        </h1>
      </div>
      {/* Nội dung  */}
      <div className="flex flex-1 gap-4 p-3 flex-col lg:flex-row overflow-hidden">
        {/* Job Information Section */}
        <div className="bg-white rounded shadow overflow-hidden w-full lg:w-[55%] xl:w-[50%] flex-shrink-0 flex flex-col">
          <div className="p-3 mb-4 bg-white border-b flex-shrink-0">
            <h2 className="text-xl font-semibold text-center text-gray-900 ">
              Job Information
            </h2>
          </div>
          <div className="overflow-y-auto flex-1 px-4 pb-4">
            {isEditMode && isLoadingJob ? (
              <div className="mt-[200px] ">
                <Loading />
              </div>
            ) : (
              <form
                id="post-job-form"
                className="space-y-6"
                onSubmit={mainForm.handleSubmit(onSubmit, onError)}
              >
                {/* Company Information */}
                <div>
                  <label className="block text-2xl text-[#1967d2] font-medium mb-2">
                    Company Information
                  </label>
                  {/*  Company Name */}
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...mainForm.register("companyName")}
                      // disabled
                      placeholder="Company Name"
                      className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                      onFocus={() => handleFieldFocus("companyInformation")}
                    />
                    {mainForm.formState.errors.companyName && (
                      <span className="text-xs text-red-500">
                        {mainForm.formState.errors.companyName.message}
                      </span>
                    )}
                  </div>
                  {/*  Company Size */}
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">
                      Company Size <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="companySize"
                      control={mainForm.control}
                      render={({ field }) => (
                        <Select
                          key={field.value}
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                        >
                          <SelectTrigger
                            className="min-w-[250px]"
                            arrowStyle="text-[#1967d2] font-bold size-5"
                            onFocus={() =>
                              handleFieldFocus("companyInformation")
                            }
                          >
                            <SelectValue placeholder="Select company size" />
                          </SelectTrigger>
                          <SelectContent className="">
                            {Object.entries(CompanySize).map(([key, value]) => (
                              <SelectItem
                                key={value}
                                value={value}
                                className="focus:bg-sky-200 focus:text-[#1967d2]"
                              >
                                {CompanySizeLabelVN[key as CompanySize]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {mainForm.formState.errors.companySize && (
                      <span className="text-xs text-red-500">
                        {mainForm.formState.errors.companySize.message}
                      </span>
                    )}
                  </div>
                  {/* Company Website */}
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">
                      Company Website
                    </label>
                    <Input
                      {...mainForm.register("companyWebsite")}
                      // disabled
                      placeholder="Company Website"
                      className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                      onFocus={() => handleFieldFocus("header")}
                    />
                    {mainForm.formState.errors.companyWebsite && (
                      <span className="text-xs text-red-500">
                        {mainForm.formState.errors.companyWebsite.message}
                      </span>
                    )}
                  </div>
                  {/* About Company */}
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">
                      About Company <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="aboutCompany"
                      control={mainForm.control}
                      render={({ field }) => (
                        <ReactQuill
                          theme="snow"
                          // readOnly
                          value={field.value}
                          onChange={field.onChange}
                          className="bg-white [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:max-h-[160px] [&_.ql-editor]:overflow-y-auto"
                          onFocus={() => handleFieldFocus("companyInformation")}
                        />
                      )}
                    />
                    {mainForm.formState.errors.aboutCompany && (
                      <span className="text-xs text-red-500">
                        {mainForm.formState.errors.aboutCompany.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Job Information */}
                <div>
                  <label className="block text-2xl text-[#1967d2] font-medium mb-2">
                    Job Information
                  </label>
                  {/*Job title */}
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">
                      Job title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...mainForm.register("jobTitle")}
                      placeholder="Job title"
                      className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                      onFocus={() => handleFieldFocus("header")}
                    />
                    {mainForm.formState.errors.jobTitle && (
                      <span className="text-xs text-red-500">
                        {mainForm.formState.errors.jobTitle.message}
                      </span>
                    )}
                  </div>
                  {/* Location */}
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <div className="p-3 space-y-5 border rounded">
                      <div>
                        <div className="mb-2 text-xs text-gray-500">
                          Choose work locations
                        </div>
                        <BaseModal
                          title="Edit job locations"
                          trigger={
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full flex flex-col items-start justify-start text-left font-normal !h-auto min-h-0 py-2   bg-transparent"
                              onClick={handleOpenModalEditJobLocations}
                              onMouseEnter={handlePrefetchProvinces}
                              onFocus={() => handleFieldFocus("header")}
                            >
                              {main_jobLocations.length > 0 &&
                              main_jobLocations[0].detailAddress ? (
                                main_jobLocations.map(
                                  (loc: LocationFormData, index: number) => (
                                    <div
                                      className="max-w-[500px] flex items-center gap-2 mt-2"
                                      key={index}
                                    >
                                      <MapPin className="self-start text-[#1967d2]" />
                                      <p className="text-sm break-words whitespace-normal leading-relaxed">
                                        <>
                                          {console.log(
                                            "district:",
                                            loc.districtName
                                          )}
                                        </>
                                        {loc.detailAddress}, {loc.districtName},{" "}
                                        {loc.provinceName}
                                      </p>
                                    </div>
                                  )
                                )
                              ) : (
                                <span className="text-gray-400">
                                  Job location
                                </span>
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
                              <Button
                                className="bg-[#1967d2] w-28 hover:bg-[#1251a3]"
                                onClick={() =>
                                  handleSaveModalJobLocations(onClose)
                                }
                              >
                                Save
                              </Button>
                            </>
                          )}
                          className=""
                        >
                          <div className="!w-[800px]">
                            <Label htmlFor="modal-location" className="mb-3">
                              Work Location
                            </Label>
                            {jobLocationsFieldArray.fields.map((loc, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between gap-2 mb-3"
                              >
                                {/* Select province */}
                                <Controller
                                  control={modalJobLocationsForm.control}
                                  rules={{ required: "Required" }}
                                  name={`jobLocations.${idx}.provinceId`}
                                  render={({ field, fieldState }) => (
                                    <div className="flex flex-col gap-2">
                                      <Select
                                        key={field.value}
                                        value={
                                          field.value && field.value !== 0
                                            ? field.value.toString()
                                            : ""
                                        }
                                        onValueChange={(val) => {
                                          const provinceId =
                                            Number.parseInt(val);
                                          const selectedProvince =
                                            provinces?.find(
                                              (p: Province) =>
                                                p.id === provinceId
                                            );
                                          field.onChange(provinceId);
                                          if (selectedProvince) {
                                            modalJobLocationsForm.setValue(
                                              `jobLocations.${idx}.provinceName`,
                                              selectedProvince.name
                                            );
                                          }
                                          modalJobLocationsForm.setValue(
                                            `jobLocations.${idx}.districtId`,
                                            0
                                          );
                                        }}
                                      >
                                        <SelectTrigger
                                          className="min-w-[200px] bg-gray-100"
                                          arrowStyle="text-[#1967d2] font-bold size-5"
                                        >
                                          <SelectValue placeholder="Select province" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {isFetchingProvinces ? (
                                            <SelectItem
                                              value="loading"
                                              disabled
                                            >
                                              Loading...
                                            </SelectItem>
                                          ) : (
                                            provinces?.map(
                                              (province: Province) => (
                                                <SelectItem
                                                  key={province.id}
                                                  value={province.id.toString()}
                                                  className="focus:bg-sky-200 focus:text-[#1967d2]"
                                                >
                                                  {province.name}
                                                </SelectItem>
                                              )
                                            )
                                          )}
                                        </SelectContent>
                                      </Select>
                                      {fieldState.error && (
                                        <span className="mt-1 text-xs text-red-500">
                                          {fieldState.error.message ||
                                            "Required"}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                />
                                {/* Select district */}
                                <Controller
                                  control={modalJobLocationsForm.control}
                                  name={`jobLocations.${idx}.districtId`}
                                  render={({ field, fieldState }) => {
                                    const currentDistricts =
                                      getDistrictsByIndex(idx);
                                    const currentProvinceId =
                                      watchedJobLocations?.[idx]?.provinceId ||
                                      0;
                                    const isLoading = isLoadingByIndex(idx);

                                    return (
                                      <div className="flex flex-col gap-2">
                                        <Select
                                          key={field.value}
                                          value={
                                            field.value && field.value !== 0
                                              ? field.value.toString()
                                              : ""
                                          }
                                          onValueChange={(val) => {
                                            const districtId =
                                              Number.parseInt(val);
                                            const selectedDistrict =
                                              currentDistricts?.find(
                                                (d) => d.id === districtId
                                              );

                                            field.onChange(districtId);
                                            if (selectedDistrict) {
                                              modalJobLocationsForm.setValue(
                                                `jobLocations.${idx}.districtName`,
                                                selectedDistrict.name
                                              );
                                            }
                                          }}
                                          disabled={
                                            !currentProvinceId ||
                                            currentProvinceId === 0
                                          }
                                        >
                                          <SelectTrigger
                                            className="min-w-[200px] bg-gray-100"
                                            arrowStyle="text-[#1967d2] font-bold size-5"
                                          >
                                            <SelectValue placeholder="Select district" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {isLoading ? (
                                              <SelectItem
                                                value="loading"
                                                disabled
                                              >
                                                Loading...
                                              </SelectItem>
                                            ) : currentDistricts.length === 0 &&
                                              currentProvinceId > 0 ? (
                                              <SelectItem
                                                value="no-data"
                                                disabled
                                              >
                                                No districts
                                              </SelectItem>
                                            ) : (
                                              currentDistricts.map(
                                                (district) => (
                                                  <SelectItem
                                                    key={district.id}
                                                    value={district.id.toString()}
                                                    className="focus:bg-sky-200 focus:text-[#1967d2]"
                                                  >
                                                    {district.name}
                                                  </SelectItem>
                                                )
                                              )
                                            )}
                                          </SelectContent>
                                        </Select>
                                        {fieldState.error && (
                                          <span className="mt-1 text-xs text-red-500">
                                            {fieldState.error.message ||
                                              "Required"}
                                          </span>
                                        )}
                                      </div>
                                    );
                                  }}
                                />
                                {/* Detail Address */}
                                <Controller
                                  control={modalJobLocationsForm.control}
                                  name={`jobLocations.${idx}.detailAddress`}
                                  render={({ field, fieldState }) => (
                                    <div className="flex flex-col flex-1 gap-2">
                                      <Input
                                        {...field}
                                        placeholder="Detail address"
                                        className="bg-gray-100 !w-[330px] focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                                      />
                                      {fieldState.error && (
                                        <span className="mt-1 text-xs text-red-500">
                                          {fieldState.error.message ||
                                            "Required"}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                />
                                {/* Xóa location */}
                                {jobLocationsFieldArray.fields.length >= 1 && (
                                  <Button
                                    variant="secondary"
                                    size="icon"
                                    className="size-8 hover:bg-red-400"
                                    onClick={() =>
                                      jobLocationsFieldArray.remove(idx)
                                    }
                                  >
                                    <Trash2 />
                                  </Button>
                                )}
                              </div>
                            ))}
                            <Button
                              variant="link"
                              className="text-[#1967d2] p-0 h-auto mt-2 text-lg"
                              onClick={() =>
                                jobLocationsFieldArray.append({
                                  provinceId: 0,
                                  districtId: 0,
                                  detailAddress: "",
                                })
                              }
                              disabled={
                                jobLocationsFieldArray.fields.length >= 5
                              }
                            >
                              <Plus strokeWidth={3} /> Add new location
                            </Button>
                          </div>
                        </BaseModal>
                      </div>
                    </div>
                    {mainForm.formState.errors.jobLocations && (
                      <span className="text-xs text-red-500">
                        {mainForm.formState.errors.jobLocations.message}
                      </span>
                    )}
                  </div>
                  {/* Salary */}
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">
                      Salary <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="salaryType"
                      control={mainForm.control}
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value ?? ""}
                          onValueChange={(val) => {
                            field.onChange(val);

                            if (
                              val === SalaryType.NEGOTIABLE ||
                              val === SalaryType.COMPETITIVE
                            ) {
                              mainForm.setValue("minSalary", undefined, {
                                shouldValidate: false,
                              });
                              mainForm.setValue("maxSalary", undefined, {
                                shouldValidate: false,
                              });
                              mainForm.setValue("salaryUnit", undefined, {
                                shouldValidate: false,
                              });
                              mainForm.clearErrors([
                                "minSalary",
                                "maxSalary",
                                "salaryUnit",
                              ]);
                            } else if (val === "RANGE") {
                              mainForm.setValue("minSalary", undefined);
                              mainForm.setValue("maxSalary", undefined);
                              mainForm.setValue("salaryUnit", undefined);
                            } else if (val === "GREATER_THAN") {
                              mainForm.setValue("maxSalary", undefined);
                              mainForm.setValue("salaryUnit", undefined);
                            }
                          }}
                          className="flex flex-row justify-between gap-6 pr-5 mt-3 mb-2"
                          onFocus={() => handleFieldFocus("header")}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="RANGE" id="salary-input" />
                            <Label htmlFor="salary-input">Input</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="GREATER_THAN"
                              id="salary-more"
                            />
                            <Label htmlFor="salary-more">More than</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="NEGOTIABLE"
                              id="salary-negotiable"
                              className=""
                            ></RadioGroupItem>
                            <Label htmlFor="salary-negotiable">
                              Negotiable
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="COMPETITIVE"
                              id="salary-competitive"
                            />
                            <Label htmlFor="salary-competitive">
                              Competitive
                            </Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                    {/* Hiển thị các ô nhập khi chọn Input */}
                    {mainForm.watch("salaryType") === "RANGE" && (
                      <div className="flex flex-col items-center gap-2 mt-4 sm:flex-row">
                        {/* Min salary */}
                        <div className="flex flex-col sm:flex-1">
                          <div className="flex flex-row has-focus-visible:ring-1 has-focus-visible:ring-[#1967d2]">
                            <Input
                              {...mainForm.register("minSalary", {
                                valueAsNumber: true,
                              })}
                              placeholder="Ex: 10"
                              className="rounded-none min-w-32 focus-visible:ring-0"
                              type="number"
                              onBlur={() => {
                                const minSalary =
                                  mainForm.getValues("minSalary");
                                const maxSalary =
                                  mainForm.getValues("maxSalary");
                                if (
                                  maxSalary !== undefined &&
                                  minSalary !== undefined &&
                                  minSalary > maxSalary
                                ) {
                                  mainForm.setError("minSalary", {
                                    type: "manual",
                                    message: "Invalid range",
                                  });
                                } else {
                                  mainForm.clearErrors("minSalary");
                                }
                              }}
                            />
                            <Controller
                              name="salaryUnit"
                              control={mainForm.control}
                              render={({ field }) => (
                                <Select
                                  key={field.value}
                                  onValueChange={field.onChange}
                                  value={field.value || ""}
                                >
                                  <SelectTrigger
                                    className="rounded-none min-w-36 focus-visible:ring-0"
                                    arrowStyle="text-[#1967d2] font-bold size-5"
                                  >
                                    <SelectValue placeholder="Select Unit" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(SalaryUnit).map(
                                      ([key, value]) => (
                                        <SelectItem
                                          key={value}
                                          value={value}
                                          className="focus:bg-sky-200 focus:text-[#1967d2]"
                                        >
                                          {key}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>
                          <div className="flex flex-row justify-between mt-1 items-center h-[24px]">
                            <span className="text-xs text-red-500">
                              {mainForm.formState.errors.minSalary
                                ? mainForm.formState.errors.minSalary.message
                                : " "}
                            </span>
                            <span className="text-xs text-red-500">
                              {mainForm.formState.errors.salaryUnit
                                ? mainForm.formState.errors.salaryUnit.message
                                : " "}
                            </span>
                          </div>
                        </div>

                        <span className="text-gray-500">-</span>

                        {/* Max salary */}
                        <div className="flex flex-col sm:flex-1">
                          <div className="flex flex-row has-focus-visible:ring-1 has-focus-visible:ring-[#1967d2]">
                            <Input
                              {...mainForm.register("maxSalary", {
                                valueAsNumber: true,
                              })}
                              placeholder="Ex: 20"
                              className="rounded-none min-w-32 focus-visible:ring-0"
                              type="number"
                              onBlur={() => {
                                const minSalary =
                                  mainForm.getValues("minSalary");
                                const maxSalary =
                                  mainForm.getValues("maxSalary");
                                if (
                                  maxSalary !== undefined &&
                                  minSalary !== undefined &&
                                  minSalary > maxSalary
                                ) {
                                  mainForm.setError("minSalary", {
                                    type: "manual",
                                    message: "Invalid range",
                                  });
                                } else {
                                  mainForm.clearErrors("minSalary");
                                }
                              }}
                            />
                            <Controller
                              name="salaryUnit"
                              control={mainForm.control}
                              render={({ field }) => (
                                <Select
                                  key={field.value}
                                  onValueChange={field.onChange}
                                  value={
                                    field.value ? field.value.toString() : ""
                                  }
                                >
                                  <SelectTrigger
                                    className="rounded-none min-w-36 focus-visible:ring-0"
                                    arrowStyle="text-[#1967d2] font-bold size-5"
                                  >
                                    <SelectValue placeholder="Select Unit" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(SalaryUnit).map(
                                      ([key, value]) => (
                                        <SelectItem
                                          key={value}
                                          value={value}
                                          className="focus:bg-sky-200 focus:text-[#1967d2]"
                                        >
                                          {key}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>
                          <div className="flex flex-row justify-between mt-1 items-center h-[24px]">
                            <span className="text-xs text-red-500">
                              {" "}
                              {mainForm.formState.errors.maxSalary
                                ? mainForm.formState.errors.maxSalary.message
                                : " "}
                            </span>
                            <span className="text-xs text-red-500">
                              {mainForm.formState.errors.salaryUnit
                                ? mainForm.formState.errors.salaryUnit.message
                                : " "}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/*Khi chọn More than */}
                    {mainForm.watch("salaryType") === "GREATER_THAN" && (
                      <div className="flex flex-col gap-1 mt-2">
                        <div className="flex justify-between has-focus-visible:ring-1 has-focus-visible:ring-[#1967d2]">
                          <Input
                            {...mainForm.register("minSalary", {
                              valueAsNumber: true,
                            })}
                            placeholder="Ex: 10 or 10.5"
                            className="rounded-none focus-visible:ring-0"
                            type="number"
                          />
                          <Controller
                            name="salaryUnit"
                            control={mainForm.control}
                            render={({ field }) => (
                              <Select
                                key={field.value}
                                onValueChange={field.onChange}
                                value={
                                  field.value ? field.value.toString() : ""
                                }
                              >
                                <SelectTrigger
                                  className="rounded-none min-w-40 focus-visible:ring-0"
                                  arrowStyle="text-[#1967d2] font-bold size-5"
                                >
                                  <SelectValue placeholder="Select Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(SalaryUnit).map(
                                    ([key, value]) => (
                                      <SelectItem
                                        key={value}
                                        value={value}
                                        className="focus:bg-sky-200 focus:text-[#1967d2]"
                                      >
                                        {key}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <div className="flex flex-row justify-between mt-1 items-center h-[24px]">
                          <span className="text-xs text-red-500">
                            {mainForm.formState.errors.minSalary
                              ? mainForm.formState.errors.minSalary.message
                              : " "}
                          </span>
                          <span className="text-xs text-red-500">
                            {" "}
                            {mainForm.formState.errors.salaryUnit
                              ? mainForm.formState.errors.salaryUnit.message
                              : " "}
                          </span>
                        </div>
                      </div>
                    )}

                    {mainForm.formState.errors.salaryType && (
                      <span className="text-xs text-red-500">
                        {mainForm.formState.errors.salaryType.message}
                      </span>
                    )}
                  </div>

                  {/* Job Description */}
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">
                      Job Description Detail{" "}
                      <span className="text-red-500">*</span>
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
                    {mainForm.formState.errors.jobDescription && (
                      <span className="text-xs text-red-500">
                        {mainForm.formState.errors.jobDescription.message}
                      </span>
                    )}
                  </div>
                  {/* Job Requirement */}
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">
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
                          onFocus={() => handleFieldFocus("requirements")}
                        />
                      )}
                    />
                    {mainForm.formState.errors.requirement && (
                      <span className="text-xs text-red-500">
                        {mainForm.formState.errors.requirement.message}
                      </span>
                    )}
                  </div>
                  {/* Benefits */}
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">
                      Benefits <span className="text-red-500">*</span>
                    </label>
                    <div>
                      {main_benefits.length > 0 && (
                        <ul className="mb-2 space-y-2 ">
                          {main_benefits.map(
                            (benefit: JobBenefit, idx: number) => {
                              const Icon = benefitMapVN[benefit.type].icon;
                              return (
                                <li
                                  key={idx}
                                  className="flex items-center gap-2 p-1 border "
                                >
                                  <div className="flex items-center self-start gap-1">
                                    <Icon
                                      size={22}
                                      className="flex-shrink-0"
                                      strokeWidth={1.8}
                                      color="#1967d2"
                                    />
                                    <span className="text-sm  font-medium">
                                      {benefitMapVN[benefit.type].label}:
                                    </span>
                                  </div>
                                  <span className="text-sm">
                                    {benefit.description}
                                  </span>
                                </li>
                              );
                            }
                          )}
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
                            <Button
                              className="bg-[#1967d2] w-28 hover:bg-[#1251a3]"
                              onClick={() => handleSaveBenefits(onClose)}
                            >
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
                                  rules={{
                                    required: "Benefit type is required",
                                  }}
                                  render={({ field, fieldState }) => (
                                    <Select
                                      key={field.value}
                                      value={field.value}
                                      onValueChange={field.onChange}
                                    >
                                      <SelectTrigger
                                        className="min-w-[48px] bg-sky-100 flex items-center justify-center self-start"
                                        arrowStyle="text-[#1967d2] font-bold size-5"
                                      >
                                        {(() => {
                                          const Icon =
                                            benefitMapVN[field.value]?.icon;
                                          return Icon ? (
                                            <Icon
                                              size={40}
                                              strokeWidth={2.5}
                                              className=" text-[#1967d2]"
                                            />
                                          ) : null;
                                        })()}
                                      </SelectTrigger>
                                      <SelectContent>
                                        <div className="grid grid-cols-4 gap-2">
                                          {Object.entries(benefitMapVN).map(
                                            ([type, { label, icon }]) => {
                                              const Icon = icon;
                                              const isSelected =
                                                modalBenefitForm
                                                  .getValues("benefits")
                                                  .some(
                                                    (benefit, i) =>
                                                      benefit.type === type &&
                                                      i !== idx
                                                  );
                                              const isActive =
                                                field.value === type;
                                              return (
                                                <SelectItem
                                                  key={type}
                                                  value={type}
                                                  disabled={isSelected}
                                                  className={
                                                    isActive
                                                      ? "bg-blue-100 text-[#1967d2]"
                                                      : ""
                                                  }
                                                >
                                                  <div className="flex flex-col items-center gap-2 ">
                                                    <Icon
                                                      strokeWidth={2}
                                                      color={`${
                                                        isActive
                                                          ? "#1967d2"
                                                          : "#262d37"
                                                      }`}
                                                      style={{
                                                        width: 32,
                                                        height: 32,
                                                      }}
                                                    />
                                                    <span>{label}</span>
                                                  </div>
                                                </SelectItem>
                                              );
                                            }
                                          )}
                                        </div>
                                      </SelectContent>
                                    </Select>
                                  )}
                                />
                                {/* Description */}
                                <Controller
                                  name={`benefits.${idx}.description`}
                                  control={modalBenefitForm.control}
                                  render={({ field, fieldState }) => (
                                    <div className="flex flex-col flex-1 gap-2">
                                      <Input
                                        {...field}
                                        placeholder="Ex: A chance to travel 2-3 times a year"
                                        className=" bg-gray-100 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                                      />
                                      {fieldState.error && (
                                        <span className="mt-1 text-xs text-red-500">
                                          {fieldState.error.message ||
                                            "Required"}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                />
                                {benefitFieldArray.fields.length >= 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    className="self-start text-gray-500 size-8 hover:bg-red-400"
                                    onClick={() =>
                                      benefitFieldArray.remove(idx)
                                    }
                                  >
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
                              const watchedBenefits =
                                modalBenefitForm.watch("benefits") || [];
                              const selectedTypes = watchedBenefits.map(
                                (b) => b.type
                              );
                              const availableTypes = (
                                Object.keys(
                                  benefitMapVN
                                ) as JobBenefit["type"][]
                              ).filter((type) => !selectedTypes.includes(type));
                              if (availableTypes.length > 0) {
                                benefitFieldArray.append({
                                  type: availableTypes[0],
                                  description: "",
                                });
                              }
                            }}
                            disabled={
                              benefitFieldArray.fields.length >= 10 ||
                              modalBenefitForm
                                .watch("benefits")
                                ?.some(
                                  (b) =>
                                    !b.description ||
                                    b.description.trim() === ""
                                )
                            }
                          >
                            <Plus size={18} strokeWidth={3} /> Add another
                            benefit
                          </Button>
                        </div>
                      </BaseModal>
                    </div>
                    {mainForm.formState.errors.jobBenefits && (
                      <span className="text-xs text-red-500">
                        {mainForm.formState.errors.jobBenefits.message}
                      </span>
                    )}
                  </div>
                </div>
                {/* Job Details */}
                <div>
                  <label className="block text-2xl text-[#1967d2] font-medium mb-2">
                    Job Details
                  </label>

                  {/* Education Level */}
                  <div className="mb-4">
                    <div className="flex items-center gap-4">
                      <label className="self-start block w-48 mb-1 text-sm font-medium">
                        Education Level <span className="text-red-500">*</span>
                      </label>
                      <div className="flex-1">
                        <Controller
                          name="educationLevel"
                          control={mainForm.control}
                          render={({ field }) => (
                            <Select
                              key={field.value}
                              onValueChange={field.onChange}
                              value={field.value ? field.value.toString() : ""}
                            >
                              <SelectTrigger
                                className="w-full focus-visible:ring-0"
                                arrowStyle="text-[#1967d2] font-bold size-5"
                                onFocus={() => handleFieldFocus("jobDetails")}
                                onBlur={() => handleFieldFocus("jobDetails")}
                                onMouseEnter={() =>
                                  handleFieldFocus("jobDetails")
                                }
                              >
                                <SelectValue placeholder="Please select" />
                              </SelectTrigger>

                              <SelectContent
                                onFocus={() => handleFieldFocus("jobDetails")}
                              >
                                {Object.entries(EducationLevel).map(
                                  ([key, value]) => (
                                    <SelectItem
                                      key={value}
                                      value={value}
                                      className="focus:bg-sky-200 focus:text-[#1967d2]"
                                    >
                                      {EducationLevelLabelVN[value]}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {mainForm.formState.errors.educationLevel && (
                          <span className="text-xs text-red-500">
                            {mainForm.formState.errors.educationLevel.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div className="mb-4">
                    <div className="flex items-center gap-4">
                      <label className="self-start block w-48 mb-1 text-sm font-medium">
                        Experience Level <span className="text-red-500">*</span>
                      </label>
                      <div className="flex-1">
                        <Controller
                          name="experienceLevel"
                          control={mainForm.control}
                          render={({ field }) => (
                            <Select
                              key={field.value}
                              onValueChange={field.onChange}
                              value={field.value ? field.value.toString() : ""}
                            >
                              <SelectTrigger
                                className="w-full focus-visible:ring-0"
                                arrowStyle="text-[#1967d2] font-bold size-5"
                                onFocus={() => handleFieldFocus("jobDetails")}
                                onMouseEnter={() =>
                                  handleFieldFocus("jobDetails")
                                }
                              >
                                <SelectValue placeholder="Please select" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(ExperienceLevel).map(
                                  ([key, value]) => (
                                    <SelectItem
                                      key={value}
                                      value={value}
                                      className="focus:bg-sky-200 focus:text-[#1967d2]"
                                    >
                                      {ExperienceLevelLabelVN[value]}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {mainForm.formState.errors.experienceLevel && (
                          <span className="text-xs text-red-500">
                            {mainForm.formState.errors.experienceLevel.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Job Level */}
                  <div className="mb-4">
                    <div className="flex items-center gap-4">
                      <label className="self-start block w-48 mb-1 text-sm font-medium">
                        Job Level <span className="text-red-500">*</span>
                      </label>
                      <div className="flex-1">
                        <Controller
                          name="jobLevel"
                          control={mainForm.control}
                          render={({ field }) => (
                            <Select
                              key={field.value}
                              onValueChange={field.onChange}
                              value={field.value ? field.value.toString() : ""}
                            >
                              <SelectTrigger
                                className="w-full focus-visible:ring-0"
                                arrowStyle="text-[#1967d2] font-bold size-5"
                                onFocus={() => handleFieldFocus("jobDetails")}
                                onMouseEnter={() =>
                                  handleFieldFocus("jobDetails")
                                }
                              >
                                <SelectValue placeholder="Please  " />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(JobLevel).map(
                                  ([key, value]) => (
                                    <SelectItem
                                      key={value}
                                      value={value}
                                      className="focus:bg-sky-200 focus:text-[#1967d2]"
                                    >
                                      {JobLevelLabelVN[value]}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {mainForm.formState.errors.jobLevel && (
                          <span className="text-xs text-red-500">
                            {mainForm.formState.errors.jobLevel.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Job Type */}
                  <div className="mb-4">
                    <div className="flex items-center gap-4">
                      <label className="self-start block w-48 mb-1 text-sm font-medium">
                        Job Type <span className="text-red-500">*</span>
                      </label>
                      <div className="flex-1">
                        <Controller
                          name="jobType"
                          control={mainForm.control}
                          render={({ field }) => (
                            <Select
                              key={field.value}
                              onValueChange={field.onChange}
                              value={field.value ? field.value.toString() : ""}
                            >
                              <SelectTrigger
                                className="w-full focus-visible:ring-0"
                                arrowStyle="text-[#1967d2] font-bold size-5"
                                onFocus={() => handleFieldFocus("jobDetails")}
                                onMouseEnter={() =>
                                  handleFieldFocus("jobDetails")
                                }
                              >
                                <SelectValue placeholder="Please select" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(JobType).map(([key, value]) => (
                                  <SelectItem
                                    key={value}
                                    value={value}
                                    className="focus:bg-sky-200 focus:text-[#1967d2]"
                                  >
                                    {JobTypeLabelVN[value]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {mainForm.formState.errors.jobType && (
                          <span className="text-xs text-red-500">
                            {mainForm.formState.errors.jobType.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="mb-4">
                    <div className="flex items-center gap-4">
                      <label className="self-start block w-48 mb-1 text-sm font-medium">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <div className="flex-1">
                        <Controller
                          name="gender"
                          control={mainForm.control}
                          render={({ field }) => (
                            <Select
                              key={field.value}
                              onValueChange={field.onChange}
                              value={field.value ? field.value.toString() : ""}
                            >
                              <SelectTrigger
                                className="w-full focus-visible:ring-0"
                                arrowStyle="text-[#1967d2] font-bold size-5"
                                onFocus={() => handleFieldFocus("jobDetails")}
                                onMouseEnter={() =>
                                  handleFieldFocus("jobDetails")
                                }
                              >
                                <SelectValue placeholder="Please select" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(JobGender).map(
                                  ([key, value]) => (
                                    <SelectItem
                                      key={value}
                                      value={value}
                                      className="focus:bg-sky-200 focus:text-[#1967d2]"
                                    >
                                      {JobGenderLabelVN[value]}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {mainForm.formState.errors.gender && (
                          <span className="text-xs text-red-500">
                            {mainForm.formState.errors.gender.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Job Code */}
                  <div className="mb-4">
                    <div className="flex items-center gap-4">
                      <label className="self-start block w-48 mb-1 text-sm font-medium">
                        Job Code
                      </label>
                      <div className="flex-1">
                        <Input
                          {...mainForm.register("jobCode")}
                          placeholder="Enter job code"
                          onFocus={() => handleFieldFocus("jobDetails")}
                          className="w-full focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Industry IDs */}
                  <div className="mb-4">
                    <div className="flex items-center gap-4">
                      <label className="self-start block w-48 mb-1 text-sm font-medium">
                        Industries <span className="text-red-500">*</span>
                      </label>
                      <div className="flex-1">
                        <Controller
                          name="industries"
                          control={mainForm.control}
                          render={({ field }) => (
                            <div className="space-y-2">
                              {field.value && field.value.length > 0 && (
                                <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto mb-2">
                                  {field.value.map((industryItem) => {
                                    return (
                                      <div
                                        key={industryItem.id}
                                        className="bg-sky-100 text-[#1967d2] px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                      >
                                        {industryItem?.name ||
                                          `Industry ${industryItem.id}`}
                                        <button
                                          type="button"
                                          onClick={() =>
                                            field.onChange(
                                              (field.value ?? []).filter(
                                                (industry) =>
                                                  industry.id !==
                                                  industryItem.id
                                              )
                                            )
                                          }
                                          className="text-lg leading-none hover:text-red-500"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              <Select
                                onValueChange={(val) => {
                                  const id = Number.parseInt(val);
                                  const current = field.value ?? [];
                                  if (!current.some((item) => item.id === id)) {
                                    field.onChange([
                                      ...current,
                                      {
                                        id,
                                        name:
                                          industries?.find(
                                            (ind) => Number(ind.id) === id
                                          )?.name || "",
                                      },
                                    ]);
                                  }
                                }}
                                value=""
                              >
                                <SelectTrigger
                                  className="w-full focus-visible:ring-0"
                                  arrowStyle="text-[#1967d2] font-bold size-5"
                                  onFocus={() => handleFieldFocus("jobDetails")}
                                  onMouseEnter={() =>
                                    handleFieldFocus("jobDetails")
                                  }
                                >
                                  <SelectValue placeholder="Select industries" />
                                </SelectTrigger>
                                <SelectContent>
                                  {isFetchingIndustries ? (
                                    <SelectItem value="loading" disabled>
                                      Loading...
                                    </SelectItem>
                                  ) : (
                                    industries?.map((industry) => (
                                      <SelectItem
                                        key={industry.id}
                                        value={industry.id.toString()}
                                        className="focus:bg-sky-200 focus:text-[#1967d2]"
                                        disabled={field.value?.some(
                                          (item) => item.id === industry.id
                                        )}
                                      >
                                        {industry.name}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        />
                        {mainForm.formState.errors.industries && (
                          <span className="text-xs text-red-500">
                            {mainForm.formState.errors.industries.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Age Type */}
                  <div className="mb-4">
                    <div className="flex items-center gap-4">
                      <label className="self-start block w-48 mb-1 text-sm font-medium">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <div className="flex-1">
                        <Controller
                          name="ageType"
                          control={mainForm.control}
                          render={({ field }) => (
                            <Select
                              key={field.value}
                              onValueChange={field.onChange}
                              value={field.value ? field.value.toString() : ""}
                            >
                              <SelectTrigger
                                className="w-full focus-visible:ring-0"
                                arrowStyle="text-[#1967d2] font-bold size-5"
                                onFocus={() => handleFieldFocus("jobDetails")}
                                onMouseEnter={() =>
                                  handleFieldFocus("jobDetails")
                                }
                              >
                                <SelectValue placeholder="Select age type" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(AgeType).map(([key, value]) => (
                                  <SelectItem
                                    key={value}
                                    value={value}
                                    className="focus:bg-sky-200 focus:text-[#1967d2]"
                                  >
                                    {AgeTypeLabelVN[value]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {mainForm.formState.errors.ageType && (
                          <span className="text-xs text-red-500">
                            {mainForm.formState.errors.ageType.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Min Age */}
                  {(mainForm.watch("ageType") === "ABOVE" ||
                    mainForm.watch("ageType") === "INPUT") && (
                    <div className="mb-4">
                      <div className="flex items-center gap-4">
                        <label className="self-start block w-48 mb-1 text-sm font-medium">
                          Min Age <span className="text-red-500">*</span>
                        </label>
                        <div className="flex-1">
                          <Input
                            {...mainForm.register("minAge", {
                              valueAsNumber: true,
                            })}
                            type="number"
                            placeholder="Enter minimum age"
                            onFocus={() => handleFieldFocus("jobDetails")}
                            className="w-full focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                          />
                          {mainForm.formState.errors.minAge && (
                            <span className="text-xs text-red-500">
                              {mainForm.formState.errors.minAge.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Max Age */}
                  {(mainForm.watch("ageType") === "BELOW" ||
                    mainForm.watch("ageType") === "INPUT") && (
                    <div className="mb-4">
                      <div className="flex items-center gap-4">
                        <label className="self-start block w-48 mb-1 text-sm font-medium">
                          Max Age <span className="text-red-500">*</span>
                        </label>
                        <div className="flex-1">
                          <Input
                            {...mainForm.register("maxAge", {
                              valueAsNumber: true,
                            })}
                            type="number"
                            placeholder="Enter maximum age"
                            onFocus={() => handleFieldFocus("jobDetails")}
                            className="w-full focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                          />
                          {mainForm.formState.errors.maxAge && (
                            <span className="text-xs text-red-500">
                              {mainForm.formState.errors.maxAge.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Contact information */}
                <div>
                  <label className="block text-2xl text-[#1967d2] font-medium mb-2">
                    Contact information
                  </label>

                  {/* Contact Person */}
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">
                      Contact Person <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...mainForm.register("contactPerson")}
                      placeholder="Contact Person Name"
                      className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                      onFocus={() => handleFieldFocus("contact")}
                    />
                    {mainForm.formState.errors.contactPerson && (
                      <span className="text-xs text-red-500">
                        {mainForm.formState.errors.contactPerson.message}
                      </span>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...mainForm.register("phoneNumber")}
                      placeholder="Contact Phone"
                      className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                      onFocus={() => handleFieldFocus("contact")}
                    />
                    {mainForm.formState.errors.phoneNumber && (
                      <span className="text-xs text-red-500">
                        {mainForm.formState.errors.phoneNumber.message}
                      </span>
                    )}
                  </div>

                  {/* Contact Location */}
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">
                      Contact Location <span className="text-red-500">*</span>
                    </label>
                    <BaseModal
                      title="Edit contact location"
                      trigger={
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full flex flex-col items-start justify-start text-left font-normal !h-auto min-h-0 py-2   bg-transparent"
                          onClick={handleOpenModalEditContactLocation}
                          onMouseEnter={handlePrefetchProvinces}
                          onFocus={() => handleFieldFocus("contact")}
                        >
                          {mainForm.watch("contactLocation")?.detailAddress &&
                          mainForm.watch("contactLocation")?.provinceId &&
                          mainForm.watch("contactLocation")?.districtId ? (
                            <div className="max-w-[500px] flex items-center gap-2 mt-2">
                              <MapPin className="self-start text-[#1967d2]" />
                              <p className="text-sm break-words whitespace-normal leading-relaxed">
                                {
                                  mainForm.watch("contactLocation")
                                    ?.detailAddress
                                }
                                ,{" "}
                                {
                                  mainForm.watch("contactLocation")
                                    ?.districtName
                                }
                                ,
                                {
                                  mainForm.watch("contactLocation")
                                    ?.provinceName
                                }
                              </p>
                            </div>
                          ) : (
                            <span className="text-gray-400">
                              {" "}
                              Select contact location
                            </span>
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
                          <Button
                            className="bg-[#1967d2] w-28 hover:bg-[#1251a3]"
                            onClick={() =>
                              handleSaveModalContactLocation(onClose)
                            }
                          >
                            Save
                          </Button>
                        </>
                      )}
                    >
                      <div className="min-w-[600px]">
                        <div className="flex gap-4 mb-4">
                          <div className="flex-1">
                            <label className="block mb-1 text-sm font-medium">
                              Province <span className="text-red-500">*</span>
                            </label>
                            <Controller
                              name="contactLocation.provinceId"
                              control={modalContactLocationForm.control}
                              rules={{ required: "Required" }}
                              render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-2">
                                  <Select
                                    value={field.value?.toString() || ""}
                                    onValueChange={(val) => {
                                      const provinceId = Number.parseInt(val);
                                      const selectedProvince = provinces?.find(
                                        (p: Province) => p.id === provinceId
                                      );

                                      field.onChange(provinceId);
                                      if (selectedProvince) {
                                        modalContactLocationForm.setValue(
                                          "contactLocation.provinceName",
                                          selectedProvince.name
                                        );
                                      }

                                      modalContactLocationForm.setValue(
                                        "contactLocation.districtId",
                                        0
                                      );
                                      modalContactLocationForm.setValue(
                                        "contactLocation.districtName",
                                        ""
                                      );
                                    }}
                                  >
                                    <SelectTrigger
                                      className="w-full bg-gray-100"
                                      arrowStyle="text-[#1967d2] font-bold size-5"
                                    >
                                      <SelectValue placeholder="Select province" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {isFetchingProvinces ? (
                                        <SelectItem value="loading" disabled>
                                          Loading...
                                        </SelectItem>
                                      ) : (
                                        provinces?.map((province: Province) => (
                                          <SelectItem
                                            key={province.id}
                                            value={province.id.toString()}
                                            className="focus:bg-sky-200 focus:text-[#1967d2]"
                                          >
                                            {province.name}
                                          </SelectItem>
                                        ))
                                      )}
                                    </SelectContent>
                                  </Select>
                                  {fieldState.error && (
                                    <span className="text-xs text-red-500">
                                      {fieldState.error.message || "Required"}
                                    </span>
                                  )}
                                </div>
                              )}
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block mb-1 text-sm font-medium">
                              District <span className="text-red-500">*</span>
                            </label>
                            <Controller
                              name="contactLocation.districtId"
                              control={modalContactLocationForm.control}
                              rules={{ required: "Required" }}
                              render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-2 ">
                                  <Select
                                    value={field.value?.toString() || ""}
                                    onValueChange={(val) => {
                                      const districtId = Number.parseInt(val);
                                      const selectedDistrict =
                                        districtsByContactProvince?.find(
                                          (d) => d.id === districtId
                                        );
                                      field.onChange(districtId);

                                      field.onChange(districtId);

                                      if (selectedDistrict) {
                                        modalContactLocationForm.setValue(
                                          "contactLocation.districtName",
                                          selectedDistrict.name
                                        );
                                      }
                                    }}
                                    disabled={
                                      !modalContactLocationForm.watch(
                                        "contactLocation.provinceId"
                                      )
                                    }
                                  >
                                    <SelectTrigger
                                      className="w-full bg-gray-100"
                                      arrowStyle="text-[#1967d2] font-bold size-5"
                                    >
                                      <SelectValue placeholder="Select district" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {districtsByContactProvince?.map(
                                        (district) => (
                                          <SelectItem
                                            key={district.id}
                                            value={district.id.toString()}
                                            className="focus:bg-sky-200 focus:text-[#1967d2]"
                                          >
                                            {district.name}
                                          </SelectItem>
                                        )
                                      )}
                                    </SelectContent>
                                  </Select>
                                  {fieldState.error && (
                                    <span className="text-xs text-red-500">
                                      {fieldState.error.message || "Required"}
                                    </span>
                                  )}
                                </div>
                              )}
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block mb-1 text-sm font-medium">
                            Address <span className="text-red-500">*</span>
                          </label>
                          <Controller
                            name="contactLocation.detailAddress"
                            control={modalContactLocationForm.control}
                            rules={{ required: "Required" }}
                            render={({ field, fieldState }) => (
                              <div className="flex flex-col gap-2 ">
                                <Input
                                  {...field}
                                  className="bg-gray-100 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                                  placeholder="Enter address"
                                />
                                {fieldState.error && (
                                  <span className="text-xs text-red-500">
                                    {fieldState.error.message || "Required"}
                                  </span>
                                )}
                              </div>
                            )}
                          />
                        </div>
                      </div>
                    </BaseModal>
                    {mainForm.formState.errors.contactLocation && (
                      <span className="text-xs text-red-500">
                        {mainForm.formState.errors.contactLocation.message}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">
                      Description
                    </label>
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
                  <label className="block text-2xl text-[#1967d2] font-medium mb-2">
                    Expiration Date
                  </label>

                  {/* Expiration Date */}
                  <div className="mb-4">
                    <Label htmlFor="date" className="px-1">
                      Expiration Date <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex flex-col gap-2">
                      <Controller
                        name="expirationDate"
                        control={mainForm.control}
                        render={({ field }) => {
                          return (
                            <Input
                              id="date"
                              value={field.value || ""}
                              readOnly
                              className="w-48 mt-3 bg-gray-50 cursor-not-allowed"
                              onFocus={() => handleFieldFocus("header")}
                            />
                          );
                        }}
                      />
                      {mainForm.formState.errors.expirationDate && (
                        <span className="text-xs text-red-500">
                          {mainForm.formState.errors.expirationDate.message}
                        </span>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Expiration date is automatically set to 2 months from
                        today
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Preview Section */}
        <div
          className="bg-white rounded shadow overflow-hidden hidden lg:block lg:w-[45%] xl:w-[50%] lg:min-w-[350px] xl:min-w-[400px] flex-shrink-0 flex flex-col"
          ref={previewRef}
        >
          <div className="p-4 mb-4 bg-white border-b flex-shrink-0">
            <h2 className="text-xl font-semibold text-center text-gray-900 ">
              Preview
            </h2>
          </div>
          <div className="overflow-y-auto job-information-preview flex-1 px-2 overflow-x-hidden pb-4">
            <JobInformation
              ref={jobInfoRef}
              {...getPreviewData(watchedValues)}
            />
          </div>
        </div>
      </div>
      {/* Footer cố định dưới cùng */}
      <div className="sticky bottom-0 z-20 flex gap-4 px-5 py-5 bg-white border-t border-gray-200 flex-shrink-0">
        <Button
          className="w-[40%] border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2] bg-transparent"
          variant="outline"
          size="lg"
          onClick={() => {
            if (isEditMode) {
              navigate(`${employer_routes.BASE}/${employer_routes.JOBS}`);
            }
          }}
        >
          {isEditMode ? "Cancel" : "Save Job"}
        </Button>
        <Button
          className="w-[60%]  bg-[#1967d2] hover:bg-[#1251a3] disabled:opacity-50"
          variant="default"
          size="lg"
          type="submit"
          form="post-job-form"
          disabled={
            isEditMode
              ? updateJobMutation.isPending
              : createJobMutation.isPending
          }
        >
          {isEditMode ? (
            updateJobMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Job"
            )
          ) : createJobMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
