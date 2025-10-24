import { EMAIL_REGEX } from "@/constants";
import { z } from "zod";

export const adminSignInSchema = z.object({
 email: z.string().min(1, "Email là bắt buộc").regex(EMAIL_REGEX, "Đinh dạng email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
});

export type AdminSignInFormData = z.infer<typeof adminSignInSchema>;