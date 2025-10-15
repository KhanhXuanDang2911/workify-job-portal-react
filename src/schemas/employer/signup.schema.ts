import { EMAIL_REGEX, PASSWORD_REGEX, PHONE_REGEX } from "@/constants";
import { z } from "zod";

export const employerSignUpSchema = z
  .object({
    email: z.string().min(1, "Email là bắt buộc").regex(EMAIL_REGEX, "Định dạng email không hợp lệ"),
    password: z
      .string()
      .min(1, "Mật khẩu là bắt buộc")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(160, "Mật khẩu không được vượt quá 160 ký tự")
      .regex(PASSWORD_REGEX, "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt"),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
    companyName: z.string().min(1, "Tên công ty là bắt buộc").min(2, "Tên công ty phải có ít nhất 2 ký tự").max(255, "Tên công ty không được vượt quá 255 ký tự"),
    companySize: z.string().min(1, "Quy mô công ty là bắt buộc"),
    contactPerson: z
      .string()
      .min(1, "Tên người liên hệ là bắt buộc")
      .min(2, "Tên người liên hệ phải có ít nhất 2 ký tự")
      .max(100, "Tên người liên hệ không được vượt quá 100 ký tự"),
    phone: z.string().min(1, "Số điện thoại là bắt buộc").regex(PHONE_REGEX, "Số điện thoại không hợp lệ (VD: 0975704208 hoặc +84975704208)"),
    provinceId: z.number().min(1, "Tỉnh/Thành phố là bắt buộc"),
    districtId: z.number().min(1, "Quận/Huyện là bắt buộc"),
    detailAddress: z.string().optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Bạn phải đồng ý với điều khoản sử dụng",
    }),
    receiveJobAlerts: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type EmployerSignUpFormData = z.infer<typeof employerSignUpSchema>;
