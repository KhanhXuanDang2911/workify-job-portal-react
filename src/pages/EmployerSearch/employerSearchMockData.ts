// Company Size
export const CompanySize = {
  STARTUP: "startup",
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
  ENTERPRISE: "enterprise",
} as const;
export type CompanySize = (typeof CompanySize)[keyof typeof CompanySize];

// Company Type
export const CompanyType = {
  PRIVATE: "private",
  PUBLIC: "public",
  NON_PROFIT: "non-profit",
  GOVERNMENT: "government",
  STARTUP: "startup",
} as const;
export type CompanyType = (typeof CompanyType)[keyof typeof CompanyType];

// Founded Period
export const FoundedPeriod = {
  LAST_5_YEARS: "last-5-years",
  FIVE_TO_TEN: "5-10-years",
  TEN_TO_TWENTY: "10-20-years",
  OVER_TWENTY: "over-20-years",
} as const;
export type FoundedPeriod = (typeof FoundedPeriod)[keyof typeof FoundedPeriod];

// Sort Option
export const SortOption = {
  RECENT: "recent",
  COMPANY_SIZE: "company-size",
  JOBS_COUNT: "jobs-count",
  RATING: "rating",
} as const;
export type SortOption = (typeof SortOption)[keyof typeof SortOption];

// =========================
// Format functions
// =========================
// eslint-disable-next-line react-refresh/only-export-components
export const formatCompanySize = (size: CompanySize): string => {
  const sizeMap: Record<CompanySize, string> = {
    [CompanySize.STARTUP]: "Startup (1-10)",
    [CompanySize.SMALL]: "Small (11-50)",
    [CompanySize.MEDIUM]: "Medium (51-200)",
    [CompanySize.LARGE]: "Large (201-1000)",
    [CompanySize.ENTERPRISE]: "Enterprise (1000+)",
  };
  return sizeMap[size];
};

// eslint-disable-next-line react-refresh/only-export-components
export const formatCompanyType = (type: CompanyType): string => {
  const typeMap: Record<CompanyType, string> = {
    [CompanyType.PRIVATE]: "Private",
    [CompanyType.PUBLIC]: "Public",
    [CompanyType.NON_PROFIT]: "Non-profit",
    [CompanyType.GOVERNMENT]: "Government",
    [CompanyType.STARTUP]: "Startup",
  };
  return typeMap[type];
};

// eslint-disable-next-line react-refresh/only-export-components
export const formatFoundedPeriod = (period: FoundedPeriod): string => {
  const periodMap: Record<FoundedPeriod, string> = {
    [FoundedPeriod.LAST_5_YEARS]: "Last 5 years",
    [FoundedPeriod.FIVE_TO_TEN]: "5-10 years ago",
    [FoundedPeriod.TEN_TO_TWENTY]: "10-20 years ago",
    [FoundedPeriod.OVER_TWENTY]: "Over 20 years ago",
  };
  return periodMap[period];
};

// =========================
// Mock data for employer search
// =========================
// eslint-disable-next-line react-refresh/only-export-components
export const mockEmployerSearchData = {
  totalEmployers: 1850,
  employers: [
    {
      id: 1,
      name: "Google Vietnam",
      logo: "https://static.vecteezy.com/system/resources/previews/047/656/219/non_2x/abstract-logo-design-for-any-corporate-brand-business-company-vector.jpg",
      coverImage:
        "https://blob-careerlinkvn.careerlink.vn/company_banners/12ffdf76af19636f1c6d1eb90132dbb6",
      openJobs: 45,
      location: "Ho Chi Minh City",
      description:
        "Leading technology company focusing on search, cloud computing, and artificial intelligence solutions",
      featured: true,
      size: CompanySize.ENTERPRISE,
      type: CompanyType.PUBLIC,
      founded: 1998,
      rating: 4.8,
    },
    {
      id: 2,
      name: "Samsung Electronics Vietnam",
      logo: "https://static.vecteezy.com/system/resources/previews/008/214/517/non_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg",
      coverImage:
        "https://blob-careerlinkvn.careerlink.vn/company_banners/12ffdf76af19636f1c6d1eb90132dbb6",
      openJobs: 32,
      location: "Bac Ninh",
      description:
        "Global leader in consumer electronics, semiconductors, and mobile communications",
      featured: true,
      size: CompanySize.ENTERPRISE,
      type: CompanyType.PUBLIC,
      founded: 1969,
      rating: 4.6,
    },
    {
      id: 3,
      name: "VinGroup",
      logo: "https://thewebmax.org/react/jobzilla/assets/images/jobs-company/pic2.jpg",
      coverImage:
        "https://blob-careerlinkvn.careerlink.vn/company_banners/12ffdf76af19636f1c6d1eb90132dbb6",
      openJobs: 28,
      location: "Hanoi",
      description:
        "Vietnam's largest private conglomerate with diverse business portfolio",
      featured: false,
      size: CompanySize.ENTERPRISE,
      type: CompanyType.PRIVATE,
      founded: 1993,
      rating: 4.4,
    },
    {
      id: 4,
      name: "FPT Corporation",
      logo: "https://thewebmax.org/react/jobzilla/assets/images/jobs-company/pic3.jpg",
      coverImage:
        "https://blob-careerlinkvn.careerlink.vn/company_banners/12ffdf76af19636f1c6d1eb90132dbb6",
      openJobs: 56,
      location: "Ho Chi Minh City",
      description:
        "Leading technology corporation providing IT services and digital transformation solutions",
      featured: true,
      size: CompanySize.LARGE,
      type: CompanyType.PUBLIC,
      founded: 1988,
      rating: 4.5,
    },
  ],
  industries: [
    "Technology",
    "Telecommunications",
    "Finance & Banking",
    "Manufacturing",
    "Healthcare",
    "Education",
    "Retail & E-commerce",
    "Real Estate",
    "Transportation",
    "Energy & Utilities",
  ],
  companySizes: [
    CompanySize.STARTUP,
    CompanySize.SMALL,
    CompanySize.MEDIUM,
    CompanySize.LARGE,
    CompanySize.ENTERPRISE,
  ],
  companyTypes: [
    CompanyType.PRIVATE,
    CompanyType.PUBLIC,
    CompanyType.NON_PROFIT,
    CompanyType.GOVERNMENT,
    CompanyType.STARTUP,
  ],
  foundedPeriods: [
    FoundedPeriod.LAST_5_YEARS,
    FoundedPeriod.FIVE_TO_TEN,
    FoundedPeriod.TEN_TO_TWENTY,
    FoundedPeriod.OVER_TWENTY,
  ],
  benefits: [
    "Health Insurance",
    "Remote Work",
    "Flexible Hours",
    "Professional Development",
    "Stock Options",
    "Retirement Plan",
    "Paid Time Off",
  ],
  suggestedEmployers: [
    {
      id: 101,
      name: "Microsoft Vietnam",
      openJobs: 18,
      rating: 4.7,
      type: "Featured" as const,
    },
    {
      id: 102,
      name: "Intel Vietnam",
      openJobs: 12,
      rating: 4.5,
      type: "Top Rated" as const,
    },
    {
      id: 103,
      name: "Shopee Vietnam",
      openJobs: 34,
      rating: 4.4,
      type: "Hiring" as const,
    },
    {
      id: 104,
      name: "Grab Vietnam",
      openJobs: 21,
      rating: 4.6,
      type: "Remote" as const,
    },
  ],
};
