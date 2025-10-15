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
  LESS_THAN_10: "Dưới 10 người",
  FROM_10_TO_24: "Từ 10–24 người",
  FROM_25_TO_99: "Từ 25–99 người",
  FROM_100_TO_499: "Từ 100–499 người",
  FROM_500_TO_999: "Từ 500–999 người",
  FROM_1000_TO_4999: "Từ 1.000–4.999 người",
  FROM_5000_TO_9999: "Từ 5.000–9.999 người",
  FROM_10000_TO_19999: "Từ 10.000–19.999 người",
  FROM_20000_TO_49999: "Từ 20.000–49.999 người",
  MORE_THAN_50000: "Trên 50.000 người",
};

export const CompanySizeLabelEN: Record<CompanySize, string> = {
  LESS_THAN_10: "Fewer than 10 employees",
  FROM_10_TO_24: "10–24 employees",
  FROM_25_TO_99: "25–99 employees",
  FROM_100_TO_499: "100–499 employees",
  FROM_500_TO_999: "500–999 employees",
  FROM_1000_TO_4999: "1,000–4,999 employees",
  FROM_5000_TO_9999: "5,000–9,999 employees",
  FROM_10000_TO_19999: "10,000–19,999 employees",
  FROM_20000_TO_49999: "20,000–49,999 employees",
  MORE_THAN_50000: "More than 50,000 employees",
};

export const CompanySizeLabel = {
  vi: CompanySizeLabelVN,
  en: CompanySizeLabelEN,
} as const;
