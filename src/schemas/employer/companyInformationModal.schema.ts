import { PHONE_REGEX } from "@/constants";
import { z } from "zod";

export const companyInformationModalSchema = z.object({
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
    .regex(
      PHONE_REGEX,
      "Số điện thoại không hợp lệ (VD: 0975704208 hoặc +84975704208)"
    ),
  provinceId: z.number().min(1, "Tỉnh/Thành phố là bắt buộc"),
  districtId: z.number().min(1, "Quận/Huyện là bắt buộc"),
  detailAddress: z
    .string()
    .min(1, "Địa chỉ chi tiết là bắt buộc")
    .min(5, "Địa chỉ phải có ít nhất 5 ký tự")
    .max(255, "Địa chỉ không được vượt quá 255 ký tự"),
  aboutCompany: z.string().min(1, "Giới thiệu về công ty là bắt buộc"),
});

export type CompanyInformationModalFormData = z.infer<
  typeof companyInformationModalSchema
>;
