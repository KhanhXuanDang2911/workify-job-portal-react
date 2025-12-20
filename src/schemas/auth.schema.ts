import { EMAIL_REGEX, FULLNAME_REGEX, PASSWORD_REGEX } from "@/constants";
import { z } from "zod";

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "validation.fullNameRequired")
      .min(2, "validation.fullNameMinLength")
      .max(50, "validation.fullNameMaxLength")
      .regex(FULLNAME_REGEX, "validation.fullNameInvalid"),
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
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "validation.agreeToTermsRequired",
    }),
    industryId: z.string().optional().nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "validation.passwordMismatch",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "validation.required")
    .regex(EMAIL_REGEX, "validation.emailInvalid"),
  password: z.string().min(1, "validation.passwordRequired"),
});

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "validation.currentPasswordRequired"),
    newPassword: z
      .string()
      .min(1, "validation.newPasswordRequired")
      .min(8, "validation.passwordTooShort")
      .max(160, "validation.passwordTooLong")
      .regex(PASSWORD_REGEX, "validation.passwordComplexity"),
    confirmNewPassword: z
      .string()
      .min(1, "validation.confirmNewPasswordRequired"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "validation.passwordMismatch",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "validation.newPasswordSameAsCurrent",
    path: ["newPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "validation.required")
    .regex(EMAIL_REGEX, "validation.emailInvalid"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "validation.newPasswordRequired")
      .min(8, "validation.passwordTooShort")
      .max(160, "validation.passwordTooLong")
      .regex(PASSWORD_REGEX, "validation.passwordComplexity"),
    confirmPassword: z.string().min(1, "validation.confirmPasswordRequired"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "validation.passwordMismatch",
    path: ["confirmPassword"],
  });

export const createPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "validation.required")
      .min(8, "auth.createPassword.requirements.length")
      .max(160, "validation.passwordTooLong")
      .regex(PASSWORD_REGEX, "auth.createPassword.requirements.special"),
    confirmPassword: z.string().min(1, "validation.required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "validation.passwordMismatch",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordFormSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type CreatePasswordFormData = z.infer<typeof createPasswordSchema>;
