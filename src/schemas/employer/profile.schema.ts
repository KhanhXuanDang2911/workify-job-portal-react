import { PHONE_REGEX } from "@/constants";
import { z } from "zod";

export const employerProfileUpdateSchema = z.object({
  companyName: z
    .string()
    .min(1, "Tên công ty là bắt buộc")
    .min(2, "Tên công ty phải có ít nhất 2 ký tự")
    .max(255, "Tên công ty không được vượt quá 255 ký tự"),
  companySize: z.string().min(1, "Quy mô công ty là bắt buộc"),
  contactPerson: z
    .string()
    .min(1, "Tên người liên hệ là bắt buộc")
    .min(2, "Tên người liên hệ phải có ít nhất 2 ký tự")
    .max(100, "Tên người liên hệ không được vượt quá 100 ký tự"),
  phoneNumber: z
    .string()
    .min(1, "Số điện thoại là bắt buộc")
    .regex(PHONE_REGEX, "Số điện thoại không hợp lệ"),
  provinceId: z.number().min(1, "Tỉnh/Thành phố là bắt buộc"),
  districtId: z.number().min(1, "Quận/Huyện là bắt buộc"),
  detailAddress: z.string().optional(),
  aboutCompany: z.string().optional(),
});

export type EmployerProfileUpdateFormData = z.infer<
  typeof employerProfileUpdateSchema
>;

export const employerWebsiteUpdateSchema = z.object({
  websiteUrls: z.array(z.string().url("URL không hợp lệ")).optional(),
  facebookUrl: z.string().url("URL không hợp lệ").optional().or(z.literal("")),
  twitterUrl: z.string().url("URL không hợp lệ").optional().or(z.literal("")),
  linkedinUrl: z.string().url("URL không hợp lệ").optional().or(z.literal("")),
  googleUrl: z.string().url("URL không hợp lệ").optional().or(z.literal("")),
  youtubeUrl: z.string().url("URL không hợp lệ").optional().or(z.literal("")),
});

export type EmployerWebsiteUpdateFormData = z.infer<
  typeof employerWebsiteUpdateSchema
>;
