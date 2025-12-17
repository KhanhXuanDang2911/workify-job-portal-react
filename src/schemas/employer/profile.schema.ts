import { PHONE_REGEX } from "@/constants";
import { z } from "zod";

export const employerProfileUpdateSchema = z.object({
  companyName: z
    .string()
    .min(1, "validation.companyNameRequired")
    .min(2, "validation.companyNameMinLength")
    .max(255, "validation.companyNameMaxLength255"),
  companySize: z.string().min(1, "validation.companySizeRequired"),
  contactPerson: z
    .string()
    .min(1, "validation.contactPersonRequired")
    .min(2, "validation.contactPersonMinLength")
    .max(100, "validation.contactPersonMaxLength100"),
  phoneNumber: z
    .string()
    .min(1, "validation.phoneRequired")
    .regex(PHONE_REGEX, "validation.phoneInvalid"),
  provinceId: z.number().min(1, "validation.provinceRequired"),
  districtId: z.number().min(1, "validation.districtRequired"),
  detailAddress: z.string().optional(),
  aboutCompany: z.string().optional(),
});

export type EmployerProfileUpdateFormData = z.infer<
  typeof employerProfileUpdateSchema
>;

export const employerWebsiteUpdateSchema = z.object({
  websiteUrls: z.array(z.string().url("validation.urlInvalid")).optional(),
  facebookUrl: z
    .string()
    .url("validation.urlInvalid")
    .optional()
    .or(z.literal("")),
  twitterUrl: z
    .string()
    .url("validation.urlInvalid")
    .optional()
    .or(z.literal("")),
  linkedinUrl: z
    .string()
    .url("validation.urlInvalid")
    .optional()
    .or(z.literal("")),
  googleUrl: z
    .string()
    .url("validation.urlInvalid")
    .optional()
    .or(z.literal("")),
  youtubeUrl: z
    .string()
    .url("validation.urlInvalid")
    .optional()
    .or(z.literal("")),
});

export type EmployerWebsiteUpdateFormData = z.infer<
  typeof employerWebsiteUpdateSchema
>;
