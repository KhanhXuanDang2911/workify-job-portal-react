import { EMAIL_REGEX } from "@/constants";
import { z } from "zod";

export const adminSignInSchema = z.object({
  email: z
    .string()
    .min(1, "validation.required")
    .regex(EMAIL_REGEX, "validation.emailInvalid"),
  password: z.string().min(1, "validation.passwordRequired"),
});

export type AdminSignInFormData = z.infer<typeof adminSignInSchema>;
