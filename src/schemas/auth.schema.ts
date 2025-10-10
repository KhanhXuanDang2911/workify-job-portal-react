import { z } from "zod";

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Họ và tên là bắt buộc")
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(50, "Họ và tên không được vượt quá 50 ký tự")
      .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Họ và tên chỉ được chứa chữ cái và khoảng trắng"),
    email: z
      .string()
      .min(1, "Email là bắt buộc")
      .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,63}[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]{0,253}[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/, "Đinh dạng email không hợp lệ"),
    password: z
      .string()
      .min(1, "Mật khẩu là bắt buộc")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(50, "Mật khẩu không được vượt quá 50 ký tự")
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).{8,160}$/, "Mật khẩu chứa ít nhất 8 kí tự gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "Bạn phải đồng ý với điều khoản sử dụng",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
