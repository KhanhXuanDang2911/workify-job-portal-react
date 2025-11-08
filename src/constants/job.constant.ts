import { Baby, BadgeDollarSign, BookOpen, Building2, Bus, CalendarCheck, Cookie, Gift, HeartPulse, Home, Laptop, Plane, Shield, Sparkles, Users, type LucideProps } from "lucide-react";

export const SalaryType = {
  RANGE: "RANGE",
  GREATER_THAN: "GREATER_THAN",
  NEGOTIABLE: "NEGOTIABLE",
  COMPETITIVE: "COMPETITIVE",
} as const;

export type SalaryType = keyof typeof SalaryType;

export const SalaryTypeLabelEN: Record<SalaryType, string> = {
  [SalaryType.RANGE]: "Input",
  [SalaryType.GREATER_THAN]: "More Than",
  [SalaryType.NEGOTIABLE]: "Negotiable",
  [SalaryType.COMPETITIVE]: "Competitive",
};

export const SalaryUnit = {
  VND: "VND",
  USD: "USD",
} as const;

export type SalaryUnit = keyof typeof SalaryUnit;

export const SalaryUnitLabelEN: Record<SalaryUnit, string> = {
  [SalaryUnit.VND]: "VND",
  [SalaryUnit.USD]: "USD",
};

export const EducationLevel = {
  HIGH_SCHOOL: "HIGH_SCHOOL",
  COLLEGE: "COLLEGE",
  UNIVERSITY: "UNIVERSITY",
  POSTGRADUATE: "POSTGRADUATE",
  MASTER: "MASTER",
  DOCTORATE: "DOCTORATE",
  OTHER: "OTHER",
} as const;

export type EducationLevel = keyof typeof EducationLevel;

export const EducationLevelLabelVN: Record<EducationLevel, string> = {
  [EducationLevel.HIGH_SCHOOL]: "THPT",
  [EducationLevel.COLLEGE]: "Cao đẳng",
  [EducationLevel.UNIVERSITY]: "Đại học",
  [EducationLevel.POSTGRADUATE]: "Sau đại học",
  [EducationLevel.MASTER]: "Thạc sĩ",
  [EducationLevel.DOCTORATE]: "Tiến sĩ",
  [EducationLevel.OTHER]: "Khác",
};

export const ExperienceLevel = {
  LESS_THAN_ONE_YEAR: "LESS_THAN_ONE_YEAR",
  ONE_TO_TWO_YEARS: "ONE_TO_TWO_YEARS",
  TWO_TO_FIVE_YEARS: "TWO_TO_FIVE_YEARS",
  FIVE_TO_TEN_YEARS: "FIVE_TO_TEN_YEARS",
  MORE_THAN_TEN_YEARS: "MORE_THAN_TEN_YEARS",
} as const;

export type ExperienceLevel = keyof typeof ExperienceLevel;

export const ExperienceLevelLabelVN: Record<ExperienceLevel, string> = {
  [ExperienceLevel.LESS_THAN_ONE_YEAR]: "Dưới 1 năm",
  [ExperienceLevel.ONE_TO_TWO_YEARS]: "1–2 năm",
  [ExperienceLevel.TWO_TO_FIVE_YEARS]: "2–5 năm",
  [ExperienceLevel.FIVE_TO_TEN_YEARS]: "5–10 năm",
  [ExperienceLevel.MORE_THAN_TEN_YEARS]: "Trên 10 năm",
};

export const JobLevel = {
  INTERN: "INTERN",
  ENTRY_LEVEL: "ENTRY_LEVEL",
  STAFF: "STAFF",
  ENGINEER: "ENGINEER",
  SUPERVISOR: "SUPERVISOR",
  MANAGER: "MANAGER",
  DIRECTOR: "DIRECTOR",
  SENIOR_MANAGER: "SENIOR_MANAGER",
  EXECUTIVE: "EXECUTIVE",
} as const;

export type JobLevel = keyof typeof JobLevel;

export const JobLevelLabelVN: Record<JobLevel, string> = {
  [JobLevel.INTERN]: "Thực tập",
  [JobLevel.ENTRY_LEVEL]: "Mới ra trường/Junior",
  [JobLevel.STAFF]: "Nhân viên",
  [JobLevel.ENGINEER]: "Kỹ sư",
  [JobLevel.SUPERVISOR]: "Giám sát",
  [JobLevel.MANAGER]: "Quản lý",
  [JobLevel.DIRECTOR]: "Giám đốc",
  [JobLevel.SENIOR_MANAGER]: "Quản lý cấp cao",
  [JobLevel.EXECUTIVE]: "Lãnh đạo cấp cao",
};

export const JobLevelLabelEN: Record<JobLevel, string> = {
  [JobLevel.INTERN]: "Intern",
  [JobLevel.ENTRY_LEVEL]: "Entry Level",
  [JobLevel.STAFF]: "Staff",
  [JobLevel.ENGINEER]: "Engineer",
  [JobLevel.SUPERVISOR]: "Supervisor",
  [JobLevel.MANAGER]: "Manager",
  [JobLevel.DIRECTOR]: "Director",
  [JobLevel.SENIOR_MANAGER]: "Senior Manager",
  [JobLevel.EXECUTIVE]: "Executive",
};

export const JobType = {
  FULL_TIME: "FULL_TIME",
  TEMPORARY_FULL_TIME: "TEMPORARY_FULL_TIME",
  PART_TIME: "PART_TIME",
  TEMPORARY_PART_TIME: "TEMPORARY_PART_TIME",
  CONTRACT: "CONTRACT",
  OTHER: "OTHER",
} as const;

export type JobType = keyof typeof JobType;

export const JobTypeLabelVN: Record<JobType, string> = {
  [JobType.FULL_TIME]: "Toàn thời gian",
   [JobType.TEMPORARY_FULL_TIME]: "Toàn thời gian thời vụ",
   [JobType.PART_TIME]: "Bán thời gian",
   [JobType.TEMPORARY_PART_TIME]: "Bán thời gian thời vụ",
   [JobType.CONTRACT]: "Hợp đồng",
   [JobType.OTHER]: "Khác",
};
export const JobTypeLabelEN: Record<JobType, string> = {
  [JobType.FULL_TIME]: "Full-time",
  [JobType.TEMPORARY_FULL_TIME]: "Temporary Full-time",
  [JobType.PART_TIME]: "Part-time",
  [JobType.TEMPORARY_PART_TIME]: "Temporary Part-time",
  [JobType.CONTRACT]: "Contract",
  [JobType.OTHER]: "Other",
};
export const JobGender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  ANY: "ANY",
} as const;

export type JobGender = keyof typeof JobGender;

export const JobGenderLabelVN: Record<JobGender, string> = {
  [JobGender.MALE]: "Nam",
  [JobGender.FEMALE]: "Nữ",
  [JobGender.ANY]: "Bất kỳ",
};

export const AgeType = {
  NONE: "NONE",
  ABOVE: "ABOVE",
  BELOW: "BELOW",
  INPUT: "INPUT",
} as const;

export type AgeType = keyof typeof AgeType;

export const AgeTypeLabelVN: Record<AgeType, string> = {
  [AgeType.NONE]: "Không yêu cầu độ tuổi",
  [AgeType.ABOVE]: "Trên một độ tuổi",
  [AgeType.BELOW]: "Dưới một độ tuổi",
  [AgeType.INPUT]: "Trong khoảng",
};

export const JobStatus = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CLOSED: "CLOSED",
  EXPIRED: "EXPIRED",
} as const;

export type JobStatus = keyof typeof JobStatus;

export const JobStatusLabelVN: Record<JobStatus, string> = {
  [JobStatus.DRAFT]: "Nháp",
  [JobStatus.PENDING]: "Chờ duyệt",
  [JobStatus.APPROVED]: "Đã duyệt",
  [JobStatus.REJECTED]: "Bị từ chối",
  [JobStatus.CLOSED]: "Đã đóng",
  [JobStatus.EXPIRED]: "Hết hạn",
};

export const JobStatusLabelEN: Record<JobStatus, string> = {
  [JobStatus.APPROVED]: "Approved",
  [JobStatus.REJECTED]: "Rejected",
  [JobStatus.CLOSED]: "Closed",
  [JobStatus.PENDING]: "Pending",
  [JobStatus.DRAFT]: "Draft",
  [JobStatus.EXPIRED]: "Expired",
};

export const JobStatusColors : Record<JobStatus, string> = {
  [JobStatus.DRAFT]: "border-gray-500 text-gray-500",
  [JobStatus.PENDING]: "border-yellow-500 text-yellow-500",
  [JobStatus.APPROVED]: "border-green-500 text-green-500",
  [JobStatus.REJECTED]: "border-red-500 text-red-500",
  [JobStatus.CLOSED]: "border-blue-500 text-blue-500",
  [JobStatus.EXPIRED]: "border-muted text-muted-foreground",
};

export const BenefitType = {
  TRAVEL_OPPORTUNITY: "TRAVEL_OPPORTUNITY",
  BONUS_GIFT: "BONUS_GIFT",
  SHUTTLE_BUS: "SHUTTLE_BUS",
  INSURANCE: "INSURANCE",
  LAPTOP_MONITOR: "LAPTOP_MONITOR",
  HEALTH_CARE: "HEALTH_CARE",
  PAID_LEAVE: "PAID_LEAVE",
  FLEXIBLE_REMOTE_WORK: "FLEXIBLE_REMOTE_WORK",
  SALARY_REVIEW: "SALARY_REVIEW",
  TEAM_BUILDING: "TEAM_BUILDING",
  TRAINING: "TRAINING",
  SNACKS_PANTRY: "SNACKS_PANTRY",
  WORK_ENVIRONMENT: "WORK_ENVIRONMENT",
  CHILD_CARE: "CHILD_CARE",
  OTHER: "OTHER",
} as const;

export type BenefitType = keyof typeof BenefitType;

export const BenefitTypeLabelVN: Record<BenefitType, string> = {
  [BenefitType.TRAVEL_OPPORTUNITY]: "Du lịch",
  [BenefitType.BONUS_GIFT]: "Thưởng/Quà tặng",
  [BenefitType.SHUTTLE_BUS]: "Xe đưa đón",
  [BenefitType.INSURANCE]: "Bảo hiểm",
  [BenefitType.LAPTOP_MONITOR]: "Laptop/Màn hình",
  [BenefitType.HEALTH_CARE]: "Chăm sóc sức khỏe",
  [BenefitType.PAID_LEAVE]: "Nghỉ phép",
  [BenefitType.FLEXIBLE_REMOTE_WORK]: "Làm việc từ xa/Linh hoạt",
  [BenefitType.SALARY_REVIEW]: "Xem xét lương",
  [BenefitType.TEAM_BUILDING]: "Team building",
  [BenefitType.TRAINING]: "Đào tạo",
  [BenefitType.SNACKS_PANTRY]: "Bếp ăn/Đồ ăn nhẹ",
  [BenefitType.WORK_ENVIRONMENT]: "Môi trường làm việc",
  [BenefitType.CHILD_CARE]: "Chăm sóc trẻ em",
  [BenefitType.OTHER]: "Khác",
};

export const benefitMapVN: Record<
  BenefitType,
  { label: (typeof BenefitTypeLabelVN)[BenefitType]; icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>> }
> = {
  [BenefitType.TRAVEL_OPPORTUNITY]: { label: BenefitTypeLabelVN.TRAVEL_OPPORTUNITY, icon: Plane },
  [BenefitType.BONUS_GIFT]: { label: BenefitTypeLabelVN.BONUS_GIFT, icon: Gift },
  [BenefitType.SHUTTLE_BUS]: { label: BenefitTypeLabelVN.SHUTTLE_BUS, icon: Bus },
  [BenefitType.INSURANCE]: { label: BenefitTypeLabelVN.INSURANCE, icon: Shield },
  [BenefitType.LAPTOP_MONITOR]: { label: BenefitTypeLabelVN.LAPTOP_MONITOR, icon: Laptop },
  [BenefitType.HEALTH_CARE]: { label: BenefitTypeLabelVN.HEALTH_CARE, icon: HeartPulse },
  [BenefitType.PAID_LEAVE]: { label: BenefitTypeLabelVN.PAID_LEAVE, icon: CalendarCheck },
  [BenefitType.FLEXIBLE_REMOTE_WORK]: { label: BenefitTypeLabelVN.FLEXIBLE_REMOTE_WORK, icon: Home },
  [BenefitType.SALARY_REVIEW]: { label: BenefitTypeLabelVN.SALARY_REVIEW, icon: BadgeDollarSign },
  [BenefitType.TEAM_BUILDING]: { label: BenefitTypeLabelVN.TEAM_BUILDING, icon: Users },
  [BenefitType.TRAINING]: { label: BenefitTypeLabelVN.TRAINING, icon: BookOpen },
  [BenefitType.SNACKS_PANTRY]: { label: BenefitTypeLabelVN.SNACKS_PANTRY, icon: Cookie },
  [BenefitType.WORK_ENVIRONMENT]: { label: BenefitTypeLabelVN.WORK_ENVIRONMENT, icon: Building2 },
  [BenefitType.CHILD_CARE]: { label: BenefitTypeLabelVN.CHILD_CARE, icon: Baby },
  [BenefitType.OTHER]: { label: BenefitTypeLabelVN.OTHER, icon: Sparkles },
};
