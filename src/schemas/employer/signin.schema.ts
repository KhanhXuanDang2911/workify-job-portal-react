import { z } from "zod";
import { EMAIL_REGEX } from "@/constants";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .regex(EMAIL_REGEX, "Đinh dạng email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
});

export type SignInFormData = z.infer<typeof signInSchema>;
