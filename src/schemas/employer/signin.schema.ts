import { z } from "zod";
import { EMAIL_REGEX } from "@/constants";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "validation.required")
    .regex(EMAIL_REGEX, "validation.emailInvalid"),
  password: z.string().min(1, "validation.passwordRequired"),
});

export type SignInFormData = z.infer<typeof signInSchema>;
