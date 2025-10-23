import { z } from "zod";
import { PHONE_REGEX } from "@/constants/regex.constant";
import { SalaryType, SalaryUnit, EducationLevel, ExperienceLevel, JobLevel, JobType, JobGender, AgeType, CompanySize, BenefitType } from "@/constants";

const salaryTypeEnum = z.enum(Object.keys(SalaryType) as [keyof typeof SalaryType], {
  message: "Required",
});
const salaryUnitEnum = z.enum(Object.keys(SalaryUnit) as [keyof typeof SalaryUnit], {
  message: "Required",
});
const educationLevelEnum = z.enum(Object.keys(EducationLevel) as [keyof typeof EducationLevel], {
  message: "Required",
});
const experienceLevelEnum = z.enum(Object.keys(ExperienceLevel) as [keyof typeof ExperienceLevel], {
  message: "Required",
});
const jobLevelEnum = z.enum(Object.keys(JobLevel) as [keyof typeof JobLevel], {
  message: "Required",
});
const jobTypeEnum = z.enum(Object.keys(JobType) as [keyof typeof JobType], {
  message: "Required",
});
const jobGenderEnum = z.enum(Object.keys(JobGender) as [keyof typeof JobGender], {
  message: "Required",
});
const ageTypeEnum = z.enum(Object.keys(AgeType) as [keyof typeof AgeType], {
  message: "Required",
});
const companySizeEnum = z.enum(Object.keys(CompanySize) as [keyof typeof CompanySize], {
  message: "Required",
});
const benefitTypeEnum = z.enum(Object.keys(BenefitType) as [keyof typeof BenefitType], {
  message: "Required",
});

export const locationSchema = z.object({
  provinceId: z.number().int().positive("Required"),

  districtId: z.number().int().positive("Required"),

  detailAddress: z
    .string()
    .min(1, "Required")
    .refine((val) => val.trim().length > 0, { message: "Required" }),

  provinceName: z.string().optional(),
  districtName: z.string().optional(),
});

export type LocationFormData = z.infer<typeof locationSchema>;

export const jobBenefitSchema = z.object({
  type: benefitTypeEnum,
  description: z.string().min(1, "Required").max(1000, "Description cannot exceed 1000 characters"),
});

export type JobBenefitFormData = z.infer<typeof jobBenefitSchema>;

export const postJobSchema = z
  .object({
    companyName: z.string().min(1, "Required").max(1000, "Company name cannot exceed 1000 characters"),
    companySize: companySizeEnum,
    companyWebsite: z
      .string()
      .max(1000, "Website cannot exceed 1000 characters")
      .transform((val) => (val === "" ? undefined : val))
      .optional(),
    aboutCompany: z.string().min(1, "Required"),
    jobTitle: z.string().min(1, "Required").max(1000, "Job title cannot exceed 1000 characters"),
    jobLocations: z
      .array(locationSchema)
      .catch([])
      .refine((val) => val && val.length > 0, { message: "Required" }),
    salaryType: salaryTypeEnum,
    minSalary: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
      z.number("Required").nonnegative("Minimum salary must be a non-negative number").optional()
    ),
    maxSalary: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
      z.number("Required").nonnegative("Maximum salary must be a non-negative number").optional()
    ),
    salaryUnit: salaryUnitEnum.optional(),
    jobDescription: z.string().min(1, "Required"),
    requirement: z.string().min(1, "Required"),
    jobBenefits: z.array(jobBenefitSchema).min(1, "At least one benefit is required").max(10, "Maximum 10 benefits allowed"),
    educationLevel: educationLevelEnum,
    experienceLevel: experienceLevelEnum,
    jobLevel: jobLevelEnum,
    jobType: jobTypeEnum,
    gender: jobGenderEnum,
    jobCode: z.string().optional(),
    industryIds: z
      .array(z.number().int().positive())
      .catch([])
      .refine((val) => val && val.length > 0, { message: "Required" }),
    ageType: ageTypeEnum,
    minAge: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
      z.number().int().min(15, "Minimum age must be at least 15").max(100, "Minimum age cannot exceed 100").nullable()
    ),
    maxAge: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
      z.number().int().min(15, "Maximum age must be at least 15").max(100, "Maximum age cannot exceed 100").nullable()
    ),
    contactPerson: z.string().min(1, "Required"),
    phoneNumber: z.string().regex(PHONE_REGEX, "Invalid"),
    contactLocation: locationSchema.refine((val) => val !== undefined, {
      message: "Required",
    }),
    description: z.string().optional(),
    expirationDate: z
      .string({
        error: "Required",
      })
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Expiration date must be in dd/MM/yyyy format")
      .refine((val) => {
        const [day, month, year] = val.split("/").map(Number);
        const expiration = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return expiration > today;
      }, "Expiration date must be after today"),
  })
  .transform((data) => {
    if (data.salaryType === "NEGOTIABLE" || data.salaryType === "COMPETITIVE") {
      return {
        ...data,
        minSalary: undefined,
        maxSalary: undefined,
        salaryUnit: undefined,
      };
    }
    if (data.salaryType === "GREATER_THAN") {
      return {
        ...data,
        maxSalary: undefined,
      };
    }
    return data;
  })
  .superRefine((data, ctx) => {
    if (data.salaryType === "RANGE") {
      if (data.minSalary === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "Required",
          path: ["minSalary"],
        });
      }

      if (data.maxSalary === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "Required",
          path: ["maxSalary"],
        });
      }

      if (!data.salaryUnit) {
        ctx.addIssue({
          code: "custom",
          message: "Required",
          path: ["salaryUnit"],
        });
      }

      if (data.minSalary !== undefined && data.maxSalary !== undefined) {
        console.log("Checking range:", data.minSalary, ">=", data.maxSalary);
        if (data.minSalary >= data.maxSalary) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid range",
            path: ["minSalary"],
          });
          ctx.addIssue({
            code: "custom",
            message: "Invalid range",
            path: ["maxSalary"],
          });
        }
      }
    }

    if (data.salaryType === "GREATER_THAN") {
      if (data.minSalary === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "Required",
          path: ["minSalary"],
        });
      }
      if (!data.salaryUnit) {
        ctx.addIssue({
          code: "custom",
          message: "Required",
          path: ["salaryUnit"],
        });
      }
    }

    if (data.ageType === "ABOVE" && data.minAge === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "Required",
        path: ["minAge"],
      });
    }

    if (data.ageType === "BELOW" && data.maxAge === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "Required",
        path: ["maxAge"],
      });
    }

    if (data.ageType === "INPUT") {
      if (data.minAge === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "Required",
          path: ["minAge"],
        });
      }
      if (data.maxAge === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "Required",
          path: ["maxAge"],
        });
      }
      if (data.minAge != null && data.maxAge != null) {
        if (data.minAge >= data.maxAge) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid range",
            path: ["minAge"],
          });
          ctx.addIssue({
            code: "custom",
            message: "Invalid range",
            path: ["maxAge"],
          });
        }
      }
    }
  });

export type PostJobFormData = z.infer<typeof postJobSchema>;
