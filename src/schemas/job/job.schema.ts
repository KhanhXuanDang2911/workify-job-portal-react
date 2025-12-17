import { z } from "zod";
import { DATE_REGEX, PHONE_REGEX } from "@/constants/regex.constant";
import {
  SalaryType,
  SalaryUnit,
  EducationLevel,
  ExperienceLevel,
  JobLevel,
  JobType,
  JobGender,
  AgeType,
  CompanySize,
  BenefitType,
} from "@/constants";

const salaryTypeEnum = z.enum(
  Object.keys(SalaryType) as [keyof typeof SalaryType],
  {
    message: "validation.required",
  }
);
const salaryUnitEnum = z.enum(
  Object.keys(SalaryUnit) as [keyof typeof SalaryUnit],
  {
    message: "validation.required",
  }
);
const educationLevelEnum = z.enum(
  Object.keys(EducationLevel) as [keyof typeof EducationLevel],
  {
    message: "validation.required",
  }
);
const experienceLevelEnum = z.enum(
  Object.keys(ExperienceLevel) as [keyof typeof ExperienceLevel],
  {
    message: "validation.required",
  }
);
const jobLevelEnum = z.enum(Object.keys(JobLevel) as [keyof typeof JobLevel], {
  message: "validation.required",
});
const jobTypeEnum = z.enum(Object.keys(JobType) as [keyof typeof JobType], {
  message: "validation.required",
});
const jobGenderEnum = z.enum(
  Object.keys(JobGender) as [keyof typeof JobGender],
  {
    message: "validation.required",
  }
);
const ageTypeEnum = z.enum(Object.keys(AgeType) as [keyof typeof AgeType], {
  message: "validation.required",
});
const companySizeEnum = z.enum(
  Object.keys(CompanySize) as [keyof typeof CompanySize],
  {
    message: "validation.required",
  }
);
const benefitTypeEnum = z.enum(
  Object.keys(BenefitType) as [keyof typeof BenefitType],
  {
    message: "validation.required",
  }
);

export const locationSchema = z.object({
  provinceId: z.number().int().positive("validation.required"),

  districtId: z.number().int().positive("validation.required"),

  detailAddress: z
    .string()
    .min(1, "validation.required")
    .refine((val) => val.trim().length > 0, { message: "validation.required" }),

  provinceName: z.string().optional(),
  districtName: z.string().optional(),
});

const industrySchema = z.object({
  id: z.number().int().positive("validation.required"),
  name: z.string().min(1, "validation.required"),
});

export type LocationFormData = z.infer<typeof locationSchema>;

export const jobBenefitSchema = z.object({
  type: benefitTypeEnum,
  description: z
    .string()
    .min(1, "validation.required")
    .max(1000, "validation.benefitDescriptionTooLong"),
});

export type JobBenefitFormData = z.infer<typeof jobBenefitSchema>;

export const postJobSchema = z
  .object({
    companyName: z
      .string()
      .min(1, "validation.companyNameRequired")
      .max(1000, "validation.companyNameTooLong"),
    companySize: companySizeEnum,
    companyWebsite: z
      .string()
      .max(1000, "validation.companyWebsiteTooLong")
      .transform((val) => (val === "" ? undefined : val))
      .optional(),
    aboutCompany: z.string().min(1, "validation.aboutCompanyRequired"),
    jobTitle: z
      .string()
      .min(1, "validation.jobTitleRequired")
      .max(1000, "validation.jobTitleTooLong"),
    jobLocations: z
      .array(locationSchema)
      .catch([])
      .refine((val) => val && val.length > 0, {
        message: "validation.jobLocationRequired",
      }),
    salaryType: salaryTypeEnum,
    minSalary: z.preprocess(
      (val) =>
        val === "" || val === null || val === undefined
          ? undefined
          : Number(val),
      z
        .number("validation.required")
        .nonnegative("validation.salaryMinNonNegative")
        .optional()
    ),
    maxSalary: z.preprocess(
      (val) =>
        val === "" || val === null || val === undefined
          ? undefined
          : Number(val),
      z
        .number("validation.required")
        .nonnegative("validation.salaryMaxNonNegative")
        .optional()
    ),
    salaryUnit: z.preprocess(
      (val) => (val === "" || val === null ? undefined : val),
      salaryUnitEnum.optional()
    ),
    jobDescription: z.string().min(1, "validation.jobDescriptionRequired"),
    requirement: z.string().min(1, "validation.jobRequirementRequired"),
    jobBenefits: z
      .array(jobBenefitSchema)
      .min(1, "validation.benefitRequired")
      .max(15, "validation.maxBenefits"),
    educationLevel: educationLevelEnum,
    experienceLevel: experienceLevelEnum,
    jobLevel: jobLevelEnum,
    jobType: jobTypeEnum,
    gender: jobGenderEnum,
    jobCode: z.string().optional(),
    industries: z
      .array(industrySchema)
      .catch([])
      .refine((val) => val && val.length > 0, {
        message: "validation.industriesRequired",
      }),
    ageType: ageTypeEnum,
    minAge: z.preprocess(
      (val) =>
        val === "" || val === null || val === undefined ? null : Number(val),
      z
        .number()
        .int()
        .min(15, "validation.minAgeInvalid")
        .max(100, "validation.maxAgeInvalid")
        .nullable()
    ),
    maxAge: z.preprocess(
      (val) =>
        val === "" || val === null || val === undefined ? null : Number(val),
      z
        .number()
        .int()
        .min(15, "validation.minAgeInvalid")
        .max(100, "validation.maxAgeInvalid")
        .nullable()
    ),
    contactPerson: z.string().min(1, "validation.contactPersonRequired"),
    phoneNumber: z.string().regex(PHONE_REGEX, "validation.phoneInvalid"),
    contactLocation: locationSchema.refine((val) => val !== undefined, {
      message: "validation.contactLocationRequired",
    }),
    description: z.string().optional(),
    expirationDate: z
      .string({
        error: "validation.required",
      })
      .regex(DATE_REGEX, "validation.dateFormatInvalid")
      .refine(
        (val) => {
          const [day, month, year] = val.split("/").map(Number);
          const date = new Date(year, month - 1, day);
          return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
          );
        },
        { message: "validation.dateFormatInvalid" }
      )
      .refine((val) => {
        const [day, month, year] = val.split("/").map(Number);
        const expiration = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return expiration > today;
      }, "validation.dateMustBeFuture"),
  })
  .transform((data) => {
    if (
      data.salaryType === SalaryType.NEGOTIABLE ||
      data.salaryType === SalaryType.COMPETITIVE
    ) {
      return {
        ...data,
        minSalary: undefined,
        maxSalary: undefined,
        salaryUnit: undefined,
      };
    }
    if (data.salaryType === SalaryType.GREATER_THAN) {
      return {
        ...data,
        maxSalary: undefined,
      };
    }
    return data;
  })
  .superRefine((data, ctx) => {
    if (
      data.salaryType === SalaryType.NEGOTIABLE ||
      data.salaryType === SalaryType.COMPETITIVE
    ) {
      return;
    }

    if (data.salaryType === SalaryType.RANGE) {
      if (data.minSalary === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "validation.required",
          path: ["minSalary"],
        });
      }

      if (data.maxSalary === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "validation.required",
          path: ["maxSalary"],
        });
      }

      if (!data.salaryUnit) {
        ctx.addIssue({
          code: "custom",
          message: "validation.required",
          path: ["salaryUnit"],
        });
      }

      if (data.minSalary !== undefined && data.maxSalary !== undefined) {
        if (data.minSalary >= data.maxSalary) {
          ctx.addIssue({
            code: "custom",
            message: "validation.salaryRangeInvalid",
            path: ["minSalary"],
          });
          ctx.addIssue({
            code: "custom",
            message: "validation.salaryRangeInvalid",
            path: ["maxSalary"],
          });
        }
      }
    }

    if (data.salaryType === SalaryType.GREATER_THAN) {
      if (data.minSalary === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "validation.required",
          path: ["minSalary"],
        });
      }
      if (!data.salaryUnit) {
        ctx.addIssue({
          code: "custom",
          message: "validation.required",
          path: ["salaryUnit"],
        });
      }
    }

    if (data.ageType === AgeType.ABOVE && data.minAge === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "validation.required",
        path: ["minAge"],
      });
    }

    if (data.ageType === AgeType.BELOW && data.maxAge === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "validation.required",
        path: ["maxAge"],
      });
    }

    if (data.ageType === AgeType.INPUT) {
      if (data.minAge === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "validation.required",
          path: ["minAge"],
        });
      }
      if (data.maxAge === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "validation.required",
          path: ["maxAge"],
        });
      }
      if (data.minAge != null && data.maxAge != null) {
        if (data.minAge >= data.maxAge) {
          ctx.addIssue({
            code: "custom",
            message: "validation.ageRangeInvalid",
            path: ["minAge"],
          });
          ctx.addIssue({
            code: "custom",
            message: "validation.ageRangeInvalid",
            path: ["maxAge"],
          });
        }
      }
    }
  });

export type PostJobFormData = z.infer<typeof postJobSchema>;
