import FacebookIcon from "@/assets/icons/FacebookIcon";
import GithubIcon from "@/assets/icons/GithubIcon";
import InfoIcon from "@/assets/icons/InfoIcon";
import InstagramIcon from "@/assets/icons/InstagramIcon";
import LinkedinIcon from "@/assets/icons/LinkedinIcon";
import YoutubeIcon from "@/assets/icons/YoutubeIcon";

export type TemplateType = "TEMPLATE-PANDA" | "TEMPLATE-RABBIT";

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
  order: number;
  company: string;
  position: string;
  duration: string;
  location?: string;
  summary?: string; // richtext
}

export interface EducationItem {
  order: number;
  institution: string;
  score?: string;
  studyType?: string;
  dateRange?: string;
  website?: string;
}

export interface SkillItem {
  order: number;
  name: string;
  description?: string;
}

export interface AwardItem {
  order: number;
  title: string;
  date?: string;
}

export interface CertificationItem {
  order: number;
  name: string;
  date?: string;
}

export interface ProjectItem {
  order: number;
  title: string;
  startDate?: string;
  endDate?: string;
  description?: string; // richtext
}

export interface ReferenceItem {
  order: number;
  information: string;
  description?: string;
}

export interface Theme {
  primaryColor: string;
  bgColor: string;
  textColor: string;
}

export interface ResumeData {
  basicInfo: {
    position?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    avatarUrl?: string;
    customFields?: CustomField[];
  };

  objective?: {
    description: string; // richtext
  };

  experience: ExperienceItem[];
  education?: EducationItem[];
  skills?: SkillItem[];
  awards?: AwardItem[];
  certifications?: CertificationItem[];
  interests?: string; // richtext
  projects?: ProjectItem[];
  references?: ReferenceItem[];
  additionalInformation?: string; // richtext

  theme: Theme;
}
