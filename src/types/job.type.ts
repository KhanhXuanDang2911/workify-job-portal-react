import type { SalaryType, SalaryUnit, EducationLevel, ExperienceLevel, JobLevel, JobType, JobGender, AgeType, JobStatus } from "@/constants/job.constant";
import type { CompanySize } from "@/constants/company.constant";
import type { Province, District } from "@/types/location.type";
import type { JobBenefit } from "@/types/benefit.type";

export interface Location {
  provinceId: number;
  districtId: number;
  provinceName: string;
  districtName: string;
  detailAddress: string;
}

export type LocationRequest = Pick<Location, "provinceId" | "districtId" | "detailAddress">;

export interface LocationResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  province: Province;
  district: District;
  detailAddress: string;
}

export interface JobRequest {
  companyName: string;
  companySize: CompanySize;
  companyWebsite?: string;
  aboutCompany: string;
  jobTitle: string;
  jobLocations: LocationRequest[];
  salaryType: SalaryType;
  minSalary?: number;
  maxSalary?: number;
  salaryUnit?: SalaryUnit;
  jobDescription: string;
  requirement: string;
  jobBenefits: JobBenefit[];
  educationLevel: EducationLevel;
  experienceLevel: ExperienceLevel;
  jobLevel: JobLevel;
  jobType: JobType;
  gender: JobGender;
  jobCode?: string;
  industryIds: number[];
  ageType: AgeType;
  minAge?: number;
  maxAge?: number;
  contactPerson: string;
  phoneNumber: string;
  contactLocation: LocationRequest;
  description?: string;
  expirationDate: string;
}

export interface JobResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  companyName: string;
  companySize: CompanySize;
  companyWebsite?: string;
  aboutCompany: string;
  jobTitle: string;
  jobLocations: LocationResponse[];
  salaryType: SalaryType;
  minSalary?: number;
  maxSalary?: number;
  salaryUnit?: SalaryUnit;
  jobDescription: string;
  requirement: string;
  jobBenefits: JobBenefit[];
  educationLevel: EducationLevel;
  experienceLevel: ExperienceLevel;
  jobLevel: JobLevel;
  jobType: JobType;
  gender: JobGender;
  jobCode?: string;
  industries: Array<{
    id: number;
    name: string;
    engName: string;
  }>;
  ageType: AgeType;
  minAge?: number;
  maxAge?: number;
  contactPerson: string;
  phoneNumber: string;
  contactLocation: LocationResponse;
  description?: string;
  expirationDate: string;
  status: JobStatus;
  author: {
    id: number;
    createdAt: string;
    updatedAt: string;
    email: string;
    companyName: string;
    avatarUrl?: string;
    backgroundUrl?: string;
    employerSlug: string;
  };
}

export interface PageResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  numberOfElements: number;
  items: T[];
}

export interface JobsAdvancedSearchParams {
  keyword?: string;
  industryIds?: number[];
  provinceIds?: number[];
  jobLevels?: string[];
  jobTypes?: string[];
  experienceLevels?: string[];
  educationLevels?: string[];
  postedWithinDays?: number;
  minSalary?: number;
  maxSalary?: number;
  salaryUnit?: string;
  sort?: "createdAt" | "updatedAt" | "expirationDate";
  pageNumber?: number;
  pageSize?: number;
}