import type { CompanySize, UserStatus } from "@/constants";
import type { District, Province } from "@/types/location.type";

export interface Employer {
  id: number;
  createdAt: string;
  updatedAt: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  companySize: CompanySize;
  contactPerson: string;
  avatarUrl: string | null;
  backgroundUrl: string | null;
  employerSlug: string;
  aboutCompany: string | null;
  websiteUrls: string[] | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  googleUrl: string | null;
  youtubeUrl: string | null;
  status: UserStatus;
  province: Province | null;
  district: District | null;
  detailAddress: string;
  numberOfHiringJobs: number;
}
