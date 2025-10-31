import { Baby, BadgeDollarSign, BookOpen, Building2, Bus, CalendarCheck, Cookie, Gift, HeartPulse, Home, Laptop, Plane, Shield, Sparkles, Users } from "lucide-react";

export const SalaryType = {
  RANGE: "RANGE",
  GREATER_THAN: "GREATER_THAN",
  NEGOTIABLE: "NEGOTIABLE",
  COMPETITIVE: "COMPETITIVE",
} as const;

export type SalaryType = keyof typeof SalaryType;

export const SalaryTypeLabelEN: Record<SalaryType, string> = {
  RANGE: "Input",
  GREATER_THAN: "More Than",
  NEGOTIABLE: "Negotiable",
  COMPETITIVE: "Competitive",
};

export const SalaryUnit = {
  VND: "VND",
  USD: "USD",
} as const;

export type SalaryUnit = keyof typeof SalaryUnit;

export const SalaryUnitLabelEN: Record<SalaryUnit, string> = {
  VND: "VND",
  USD: "USD",
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
  HIGH_SCHOOL: "THPT",
  COLLEGE: "Cao đẳng",
  UNIVERSITY: "Đại học",
  POSTGRADUATE: "Sau đại học",
  MASTER: "Thạc sĩ",
  DOCTORATE: "Tiến sĩ",
  OTHER: "Khác",
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
  LESS_THAN_ONE_YEAR: "Dưới 1 năm",
  ONE_TO_TWO_YEARS: "1–2 năm",
  TWO_TO_FIVE_YEARS: "2–5 năm",
  FIVE_TO_TEN_YEARS: "5–10 năm",
  MORE_THAN_TEN_YEARS: "Trên 10 năm",
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
  INTERN: "Thực tập",
  ENTRY_LEVEL: "Mới ra trường/Junior",
  STAFF: "Nhân viên",
  ENGINEER: "Kỹ sư",
  SUPERVISOR: "Giám sát",
  MANAGER: "Quản lý",
  DIRECTOR: "Giám đốc",
  SENIOR_MANAGER: "Quản lý cấp cao",
  EXECUTIVE: "Lãnh đạo cấp cao",
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
  FULL_TIME: "Toàn thời gian",
  TEMPORARY_FULL_TIME: "Toàn thời gian thời vụ",
  PART_TIME: "Bán thời gian",
  TEMPORARY_PART_TIME: "Bán thời gian thời vụ",
  CONTRACT: "Hợp đồng",
  OTHER: "Khác",
};

export const JobGender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  ANY: "ANY",
} as const;

export type JobGender = keyof typeof JobGender;

export const JobGenderLabelVN: Record<JobGender, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
  ANY: "Bất kỳ",
};

export const AgeType = {
  NONE: "NONE",
  ABOVE: "ABOVE",
  BELOW: "BELOW",
  INPUT: "INPUT",
} as const;

export type AgeType = keyof typeof AgeType;

export const AgeTypeLabelVN: Record<AgeType, string> = {
  NONE: "Không yêu cầu độ tuổi",
  ABOVE: "Trên một độ tuổi",
  BELOW: "Dưới một độ tuổi",
  INPUT: "Trong khoảng",
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
  DRAFT: "Nháp",
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Bị từ chối",
  CLOSED: "Đã đóng",
  EXPIRED: "Hết hạn",
};

export const JobStatusLabelEN: Record<JobStatus, string> = {
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CLOSED: "Closed",
  PENDING: "Pending",
  DRAFT: "Draft",
  EXPIRED: "Expired",
};

export const BenefitType = {
  TRAVEL_OPPORTUNITY: "TRAVEL_OPPORTUNITY",
  BONUS_GIFTS: "BONUS_GIFTS",
  SHUTTLE_BUS: "SHUTTLE_BUS",
  INSURANCE: "INSURANCE",
  LAPTOP_MONITOR: "LAPTOP_MONITOR",
  HEALTH_CARE: "HEALTH_CARE",
  PAID_LEAVE: "PAID_LEAVE",
  FLEXIBLE_REMOTE_WORK: "FLEXIBLE_REMOTE_WORK",
  SALARY_REVIEW: "SALARY_REVIEW",
  TEAM_BUILDING: "TEAM_BUILDING",
  TRAINING: "TRAINING",
  SNACKS_PANTRY: "SNACK_PANTRY",
  WORK_ENVIRONMENT: "WORK_ENVIRONMENT",
  CHILD_CARE: "CHILDCARE",
  OTHER: "OTHER",
} as const;

export type BenefitType = keyof typeof BenefitType;

export const BenefitTypeLabelVN: Record<BenefitType, string> = {
  TRAVEL_OPPORTUNITY: "Du lịch",
  BONUS_GIFTS: "Thưởng/Quà tặng",
  SHUTTLE_BUS: "Xe đưa đón",
  INSURANCE: "Bảo hiểm",
  LAPTOP_MONITOR: "Laptop/Màn hình",
  HEALTH_CARE: "Chăm sóc sức khỏe",
  PAID_LEAVE: "Nghỉ phép",
  FLEXIBLE_REMOTE_WORK: "Làm việc từ xa/Linh hoạt",
  SALARY_REVIEW: "Xem xét lương",
  TEAM_BUILDING: "Team building",
  TRAINING: "Đào tạo",
  SNACKS_PANTRY: "Bếp ăn/Đồ ăn nhẹ",
  WORK_ENVIRONMENT: "Môi trường làm việc",
  CHILD_CARE: "Chăm sóc trẻ em",
  OTHER: "Khác",
};

export const benefitMapVN: Record<BenefitType, { label: (typeof BenefitTypeLabelVN)[BenefitType]; icon: React.ComponentType<any> }> = {
  TRAVEL_OPPORTUNITY: { label: BenefitTypeLabelVN.TRAVEL_OPPORTUNITY, icon: Plane },
  BONUS_GIFTS: { label: BenefitTypeLabelVN.BONUS_GIFTS, icon: Gift },
  SHUTTLE_BUS: { label: BenefitTypeLabelVN.SHUTTLE_BUS, icon: Bus },
  INSURANCE: { label: BenefitTypeLabelVN.INSURANCE, icon: Shield },
  LAPTOP_MONITOR: { label: BenefitTypeLabelVN.LAPTOP_MONITOR, icon: Laptop },
  HEALTH_CARE: { label: BenefitTypeLabelVN.HEALTH_CARE, icon: HeartPulse },
  PAID_LEAVE: { label: BenefitTypeLabelVN.PAID_LEAVE, icon: CalendarCheck },
  FLEXIBLE_REMOTE_WORK: { label: BenefitTypeLabelVN.FLEXIBLE_REMOTE_WORK, icon: Home },
  SALARY_REVIEW: { label: BenefitTypeLabelVN.SALARY_REVIEW, icon: BadgeDollarSign },
  TEAM_BUILDING: { label: BenefitTypeLabelVN.TEAM_BUILDING, icon: Users },
  TRAINING: { label: BenefitTypeLabelVN.TRAINING, icon: BookOpen },
  SNACKS_PANTRY: { label: BenefitTypeLabelVN.SNACKS_PANTRY, icon: Cookie },
  WORK_ENVIRONMENT: { label: BenefitTypeLabelVN.WORK_ENVIRONMENT, icon: Building2 },
  CHILD_CARE: { label: BenefitTypeLabelVN.CHILD_CARE, icon: Baby },
  OTHER: { label: BenefitTypeLabelVN.OTHER, icon: Sparkles },
};
