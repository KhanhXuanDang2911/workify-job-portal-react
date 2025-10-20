export const SalaryType = {
  RANGE: "RANGE",
  GREATER_THAN: "GREATER_THAN",
  NEGOTIABLE: "NEGOTIABLE",
  COMPETITIVE: "COMPETITIVE",
} as const

export type SalaryType = keyof typeof SalaryType

export const SalaryTypeLabelEN: Record<SalaryType, string> = {
  RANGE: "Input",
  GREATER_THAN: "More Than",
  NEGOTIABLE: "Negotiable",
  COMPETITIVE: "Competitive",
}

export const SalaryUnit = {
  VND: "VND",
  USD: "USD",
} as const

export type SalaryUnit = keyof typeof SalaryUnit

export const SalaryUnitLabelEN: Record<SalaryUnit, string> = {
  VND: "VND",
  USD: "USD",
}

export const EducationLevel = {
  HIGH_SCHOOL: "HIGH_SCHOOL",
  COLLEGE: "COLLEGE",
  UNIVERSITY: "UNIVERSITY",
  POSTGRADUATE: "POSTGRADUATE",
  MASTER: "MASTER",
  DOCTORATE: "DOCTORATE",
  OTHER: "OTHER",
} as const

export type EducationLevel = keyof typeof EducationLevel

export const EducationLevelLabelVN: Record<EducationLevel, string> = {
  HIGH_SCHOOL: "THPT",
  COLLEGE: "Cao đẳng",
  UNIVERSITY: "Đại học",
  POSTGRADUATE: "Sau đại học",
  MASTER: "Thạc sĩ",
  DOCTORATE: "Tiến sĩ",
  OTHER: "Khác",
}

export const ExperienceLevel = {
  LESS_THAN_ONE_YEAR: "LESS_THAN_ONE_YEAR",
  ONE_TO_TWO_YEARS: "ONE_TO_TWO_YEARS",
  TWO_TO_FIVE_YEARS: "TWO_TO_FIVE_YEARS",
  FIVE_TO_TEN_YEARS: "FIVE_TO_TEN_YEARS",
  MORE_THAN_TEN_YEARS: "MORE_THAN_TEN_YEARS",
} as const

export type ExperienceLevel = keyof typeof ExperienceLevel

export const ExperienceLevelLabelVN: Record<ExperienceLevel, string> = {
  LESS_THAN_ONE_YEAR: "Dưới 1 năm",
  ONE_TO_TWO_YEARS: "1–2 năm",
  TWO_TO_FIVE_YEARS: "2–5 năm",
  FIVE_TO_TEN_YEARS: "5–10 năm",
  MORE_THAN_TEN_YEARS: "Trên 10 năm",
}

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
} as const

export type JobLevel = keyof typeof JobLevel

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
}

export const JobType = {
  FULL_TIME: "FULL_TIME",
  TEMPORARY_FULL_TIME: "TEMPORARY_FULL_TIME",
  PART_TIME: "PART_TIME",
  TEMPORARY_PART_TIME: "TEMPORARY_PART_TIME",
  CONTRACT: "CONTRACT",
  OTHER: "OTHER",
} as const

export type JobType = keyof typeof JobType

export const JobTypeLabelVN: Record<JobType, string> = {
  FULL_TIME: "Toàn thời gian",
  TEMPORARY_FULL_TIME: "Toàn thời gian thời vụ",
  PART_TIME: "Bán thời gian",
  TEMPORARY_PART_TIME: "Bán thời gian thời vụ",
  CONTRACT: "Hợp đồng",
  OTHER: "Khác",
}

export const JobGender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  ANY: "ANY",
} as const

export type JobGender = keyof typeof JobGender

export const JobGenderLabelVN: Record<JobGender, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
  ANY: "Bất kỳ",
}

export const AgeType = {
  NONE: "NONE",
  ABOVE: "ABOVE",
  BELOW: "BELOW",
  INPUT: "INPUT",
} as const

export type AgeType = keyof typeof AgeType

export const AgeTypeLabelVN: Record<AgeType, string> = {
  NONE: "Không yêu cầu độ tuổi",
  ABOVE: "Trên một độ tuổi",
  BELOW: "Dưới một độ tuổi",
  INPUT: "Trong khoảng",
}

export const JobStatus = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CLOSED: "CLOSED",
  EXPIRED: "EXPIRED",
} as const

export type JobStatus = keyof typeof JobStatus

export const JobStatusLabelVN: Record<JobStatus, string> = {
  DRAFT: "Nháp",
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Bị từ chối",
  CLOSED: "Đã đóng",
  EXPIRED: "Hết hạn",
}
