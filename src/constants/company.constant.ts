export const CompanySize = {
  LESS_THAN_10: "LESS_THAN_10",
  FROM_10_TO_24: "FROM_10_TO_24",
  FROM_25_TO_99: "FROM_25_TO_99",
  FROM_100_TO_499: "FROM_100_TO_499",
  FROM_500_TO_999: "FROM_500_TO_999",
  FROM_1000_TO_4999: "FROM_1000_TO_4999",
  FROM_5000_TO_9999: "FROM_5000_TO_9999",
  FROM_10000_TO_19999: "FROM_10000_TO_19999",
  FROM_20000_TO_49999: "FROM_20000_TO_49999",
  MORE_THAN_50000: "MORE_THAN_50000",
} as const;

export type CompanySize = keyof typeof CompanySize;

export const CompanySizeLabelVN: Record<CompanySize, string> = {
  [CompanySize.LESS_THAN_10]: "Dưới 10 nhân sự",
  [CompanySize.FROM_10_TO_24]: "Từ 10–24 nhân sự",
  [CompanySize.FROM_25_TO_99]: "Từ 25–99 nhân sự",
  [CompanySize.FROM_100_TO_499]: "Từ 100–499 nhân sự",
  [CompanySize.FROM_500_TO_999]: "Từ 500–999 nhân sự",
  [CompanySize.FROM_1000_TO_4999]: "Từ 1.000–4.999 nhân sự",
  [CompanySize.FROM_5000_TO_9999]: "Từ 5.000–9.999 nhân sự",
  [CompanySize.FROM_10000_TO_19999]: "Từ 10.000–19.999 nhân sự",
  [CompanySize.FROM_20000_TO_49999]: "Từ 20.000–49.999 nhân sự",
  [CompanySize.MORE_THAN_50000]: "Trên 50.000 nhân sự",
};

export const CompanySizeLabelEN: Record<CompanySize, string> = {
  [CompanySize.LESS_THAN_10]: "Fewer than 10 employees",
  [CompanySize.FROM_10_TO_24]: "10–24 employees",
  [CompanySize.FROM_25_TO_99]: "25–99 employees",
  [CompanySize.FROM_100_TO_499]: "100–499 employees",
  [CompanySize.FROM_500_TO_999]: "500–999 employees",
  [CompanySize.FROM_1000_TO_4999]: "1,000–4,999 employees",
  [CompanySize.FROM_5000_TO_9999]: "5,000–9,999 employees",
  [CompanySize.FROM_10000_TO_19999]: "10,000–19,999 employees",
  [CompanySize.FROM_20000_TO_49999]: "20,000–49,999 employees",
  [CompanySize.MORE_THAN_50000]: "More than 50,000 employees",
};

export const CompanySizeLabel = {
  vi: CompanySizeLabelVN,
  en: CompanySizeLabelEN,
} as const;

export const UserStatus = {
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
  BANNED: "BANNED",
} as const;

export type UserStatus = keyof typeof UserStatus;

export const UserStatusLabelVN: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: "Hoạt động",
  [UserStatus.PENDING]: "Chờ duyệt",
  [UserStatus.BANNED]: "Bị cấm",
};

export const UserStatusLabelEN: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: "Active",
  [UserStatus.PENDING]: "Pending",
  [UserStatus.BANNED]: "Banned",
};

export const UserStatusColors: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: "bg-green-500 text-white",
  [UserStatus.PENDING]: "bg-yellow-500 text-white",
  [UserStatus.BANNED]: "bg-purple-500 text-white",
};
