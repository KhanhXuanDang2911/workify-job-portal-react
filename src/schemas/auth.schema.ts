import { EMAIL_REGEX, FULLNAME_REGEX, PASSWORD_REGEX } from "@/constants";
import { z } from "zod";

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Họ và tên là bắt buộc")
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(50, "Họ và tên không được vượt quá 50 ký tự")
      .regex(FULLNAME_REGEX, "Họ và tên chỉ được chứa chữ cái và khoảng trắng"),
    email: z
      .string()
      .min(1, "Email là bắt buộc")
      .regex(EMAIL_REGEX, "Đinh dạng email không hợp lệ"),
    password: z
      .string()
      .min(1, "Mật khẩu là bắt buộc")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(160, "Mật khẩu không được vượt quá 160 ký tự")
      .regex(
        PASSWORD_REGEX,
        "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt"
      ),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "Bạn phải đồng ý với điều khoản sử dụng",
    }),
    industryId: z.string().optional().nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .regex(EMAIL_REGEX, "Đinh dạng email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
});

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Mật khẩu hiện tại là bắt buộc"),
    newPassword: z
      .string()
      .min(1, "Mật khẩu mới là bắt buộc")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(160, "Mật khẩu không được vượt quá 160 ký tự")
      .regex(
        PASSWORD_REGEX,
        "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt"
      ),
    confirmNewPassword: z.string().min(1, "Xác nhận mật khẩu mới là bắt buộc"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password cannot be the same as the current password.",
    path: ["newPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .regex(EMAIL_REGEX, "Đinh dạng email không hợp lệ"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Mật khẩu mới là bắt buộc")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(160, "Mật khẩu không được vượt quá 160 ký tự")
      .regex(
        PASSWORD_REGEX,
        "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt"
      ),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
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
