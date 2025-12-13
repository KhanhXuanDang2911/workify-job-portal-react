import FacebookIcon from "@/assets/icons/FacebookIcon";
import GithubIcon from "@/assets/icons/GithubIcon";
import InfoIcon from "@/assets/icons/InfoIcon";
import InstagramIcon from "@/assets/icons/InstagramIcon";
import LinkedinIcon from "@/assets/icons/LinkedinIcon";
import YoutubeIcon from "@/assets/icons/YoutubeIcon";

export type TemplateType =
  | "TEMPLATE-PANDA"
  | "TEMPLATE-RABBIT"
  | "TEMPLATE-LION"
  | "TEMPLATE-DOLPHIN"
  | "TEMPLATE-TIGER"
  | "TEMPLATE-EAGLE"
  | "TEMPLATE-PROFESSIONAL-1"
  | "TEMPLATE-PROFESSIONAL-2"
  | "TEMPLATE-PROFESSIONAL-3"
  | "TEMPLATE-PROFESSIONAL-4"
  | "TEMPLATE-HAVARD-1"
  | "TEMPLATE-HAVARD-2";

export type CustomFieldType =
  | "FACEBOOK"
  | "LINKEDIN"
  | "INSTAGRAM"
  | "YOUTUBE"
  | "GITHUB"
  | "INFO";

export const CUSTOMFIELD_MAP_ICON: Record<
  CustomFieldType,
  React.ComponentType<{ color: string }>
> = {
  FACEBOOK: FacebookIcon,
  LINKEDIN: LinkedinIcon,
  INSTAGRAM: InstagramIcon,
  YOUTUBE: YoutubeIcon,
  GITHUB: GithubIcon,
  INFO: InfoIcon,
};

export interface CustomField {
  type: CustomFieldType;
  value: string;
}

export interface ExperienceItem {
  isHidden: boolean;
  order: number;
  company: string;
  position: string;
  startDate?: string;
  endDate?: string;
  description?: string; // richtext
}

export interface EducationItem {
  isHidden: boolean;
  order: number;
  name: string;
  major: string;
  score?: string;
  startDate?: string;
  endDate?: string;
}

export interface SkillItem {
  isHidden: boolean;
  order: number;
  name: string;
  description?: string;
}

export interface AwardItem {
  isHidden: boolean;
  order: number;
  title: string;
  date?: string;
}

export interface CertificationItem {
  isHidden: boolean;
  order: number;
  name: string;
  date?: string;
}

export interface ProjectItem {
  isHidden: boolean;
  order: number;
  title: string;
  startDate?: string;
  endDate?: string;
  description?: string; // richtext
}
export interface InterestItem {
  isHidden: boolean;
  description: string; // richtext
}
export interface ReferenceItem {
  isHidden: boolean;
  order: number;
  information: string;
  description?: string;
}

export interface ObjectiveItem {
  description: string; // richtext
}
export interface Theme {
  primaryColor: string;
  bgColor: string;
  textColor: string;
}
export interface AdditionalInformationItem {
  description: string; // richtext
}
export interface ResumeData {
  basicInfo: {
    position: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    location: string;
    profilePhoto?: string;
    customFields?: CustomField[];
  };

  objective: ObjectiveItem;

  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  awards: AwardItem[];
  certifications: CertificationItem[];
  interests: InterestItem;
  projects: ProjectItem[];
  references: ReferenceItem[];
  additionalInformation: AdditionalInformationItem;

  theme: Theme;
}
// API Types
export interface ResumeItem {
  id: number;
  title: string;
  template: TemplateType;
  data: ResumeData;
  createdAt: string;
  updatedAt: string;
}

export interface ResumePayload {
  title: string;
  template: TemplateType;
  data: ResumeData;
}

// SectionType includes all resume sections except theme and additionalInformation
export type SectionType = keyof Omit<
  ResumeData,
  "theme" | "additionalInformation"
>;

// EditableSectionType for sections that can be hidden/cleared (excludes basicInfo)
export type EditableSectionType = Exclude<SectionType, "basicInfo">;
