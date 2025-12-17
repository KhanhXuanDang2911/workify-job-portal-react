import { EMAIL_REGEX, PASSWORD_REGEX, PHONE_REGEX } from "@/constants";
import { z } from "zod";

export const employerSignUpSchema = z
  .object({
    email: z
      .string()
      .min(1, "validation.required")
      .regex(EMAIL_REGEX, "validation.emailInvalid"),
    password: z
      .string()
      .min(1, "validation.passwordRequired")
      .min(8, "validation.passwordTooShort")
      .max(160, "validation.passwordTooLong")
      .regex(PASSWORD_REGEX, "validation.passwordComplexity"),
    confirmPassword: z.string().min(1, "validation.confirmPasswordRequired"),
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
    phone: z
      .string()
      .min(1, "validation.phoneRequired")
      .regex(PHONE_REGEX, "validation.phoneInvalid"),
    provinceId: z.number().min(1, "validation.provinceRequired"),
    districtId: z.number().min(1, "validation.districtRequired"),
    detailAddress: z.string().optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "validation.agreeToTermsRequired",
    }),
    receiveJobAlerts: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "validation.passwordMismatch",
    path: ["confirmPassword"],
  });

export type EmployerSignUpFormData = z.infer<typeof employerSignUpSchema>;
