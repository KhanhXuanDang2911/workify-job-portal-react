import type { SalaryType, SalaryUnit, EducationLevel, ExperienceLevel, JobLevel, JobType, JobGender, AgeType, JobStatus } from "@/constants/job.constant";
import type { CompanySize } from "@/constants/company.constant";
import type { Province, District } from "@/types/location.type";
import type { JobBenefit } from "@/types/benefit.type";

export interface JobLocationRequest {
  provinceId: number;
  districtId: number;
  detailAddress: string;
}

export interface JobLocationResponse extends JobLocationRequest {
  id: number;
  createdAt: string;
  updatedAt: string;
  province: Province;
  district: District;
}

export interface JobContactLocationRequest {
  provinceId: number;
  districtId: number;
  detailAddress: string;
}

export interface JobContactLocationResponse extends JobContactLocationRequest {
  id: number;
  createdAt: string;
  updatedAt: string;
  province: Province;
  district: District;
}

export interface JobRequest {
  companyName: string;
  companySize: CompanySize;
  companyWebsite?: string;
  aboutCompany: string;
  jobTitle: string;
  jobLocations: JobLocationRequest[];
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
  contactLocation: JobContactLocationRequest;
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
  jobLocations: JobLocationResponse[];
  salaryType: SalaryType;
  minSalary?: number;
  maxSalary?: number;
  salaryUnit?: SalaryUnit;
  jobDescription: string;
  requirement: string;
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
  contactLocation: JobContactLocationResponse;
  description?: string;
  expirationDate: string;
  status: JobStatus;
  author: {
    id: number;
    email: string;
    companyName: string;
  };
}
