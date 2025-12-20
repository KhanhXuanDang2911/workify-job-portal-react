import { PHONE_REGEX } from "@/constants";
import { z } from "zod";

export const companyInformationModalSchema = z.object({
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
  detailAddress: z
    .string()
    .min(1, "validation.addressRequired")
    .min(5, "validation.addressMinLength")
    .max(255, "validation.addressMaxLength255"),
  aboutCompany: z.string().min(1, "validation.aboutCompanyRequired"),
});

export type CompanyInformationModalFormData = z.infer<
  typeof companyInformationModalSchema
>;
