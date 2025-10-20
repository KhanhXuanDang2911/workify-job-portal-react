import { z } from "zod";
import { PHONE_REGEX } from "@/constants/regex.constant";
import { SalaryType, SalaryUnit, EducationLevel, ExperienceLevel, JobLevel, JobType, JobGender, AgeType, CompanySize } from "@/constants";

const salaryTypeEnum = z.enum(Object.keys(SalaryType) as [keyof typeof SalaryType]);
const salaryUnitEnum = z.enum(Object.keys(SalaryUnit) as [keyof typeof SalaryUnit]);
const educationLevelEnum = z.enum(Object.keys(EducationLevel) as [keyof typeof EducationLevel]);
const experienceLevelEnum = z.enum(Object.keys(ExperienceLevel) as [keyof typeof ExperienceLevel]);
const jobLevelEnum = z.enum(Object.keys(JobLevel) as [keyof typeof JobLevel]);
const jobTypeEnum = z.enum(Object.keys(JobType) as [keyof typeof JobType]);
const jobGenderEnum = z.enum(Object.keys(JobGender) as [keyof typeof JobGender]);
const ageTypeEnum = z.enum(Object.keys(AgeType) as [keyof typeof AgeType]);
const companySizeEnum = z.enum(Object.keys(CompanySize) as [keyof typeof CompanySize]);

const jobLocationSchema = z.object({
  provinceId: z.number().int().positive("Tỉnh/Thành phố không hợp lệ"),
  districtId: z.number().int().positive("Quận/Huyện không hợp lệ"),
  detailAddress: z.string().max(1000, "Địa chỉ không được vượt quá 1000 ký tự"),
});

const jobContactLocationSchema = z.object({
  provinceId: z.number().int().positive("Tỉnh/Thành phố không hợp lệ"),
  districtId: z.number().int().positive("Quận/Huyện không hợp lệ"),
  detailAddress: z.string().max(1000, "Địa chỉ không được vượt quá 1000 ký tự"),
});

export const postJobSchema = z
  .object({
    companyName: z.string().min(1, "Tên công ty là bắt buộc").max(1000, "Tên công ty không được vượt quá 1000 ký tự"),
    companySize: companySizeEnum,
    companyWebsite: z.string().max(1000, "Website không được vượt quá 1000 ký tự").optional(),
    aboutCompany: z.string().min(1, "Giới thiệu công ty là bắt buộc"),
    jobTitle: z.string().min(1, "Tên công việc là bắt buộc").max(1000, "Tên công việc không được vượt quá 1000 ký tự"),
    jobLocations: z.array(jobLocationSchema).min(1, "Cần ít nhất một địa điểm làm việc"),
    salaryType: salaryTypeEnum,
    minSalary: z.number().nonnegative("Lương tối thiểu phải là số không âm").optional(),
    maxSalary: z.number().nonnegative("Lương tối đa phải là số không âm").optional(),
    salaryUnit: salaryUnitEnum.optional(),
    jobDescription: z.string().min(1, "Mô tả công việc là bắt buộc"),
    requirement: z.string().min(1, "Yêu cầu công việc là bắt buộc"),
    educationLevel: educationLevelEnum,
    experienceLevel: experienceLevelEnum,
    jobLevel: jobLevelEnum,
    jobType: jobTypeEnum,
    gender: jobGenderEnum,
    jobCode: z.string().optional(),
    industryIds: z.array(z.number().int().positive()).min(1, "Cần chọn ít nhất một ngành nghề"),
    ageType: ageTypeEnum,
    minAge: z.number().int().min(15, "Tuổi tối thiểu phải từ 15").max(100, "Tuổi tối thiểu không vượt quá 100").optional(),
    maxAge: z.number().int().min(15, "Tuổi tối đa phải từ 15").max(100, "Tuổi tối đa không vượt quá 100").optional(),
    contactPerson: z.string().min(1, "Tên người liên hệ là bắt buộc"),
    phoneNumber: z.string().regex(PHONE_REGEX, "Số điện thoại không hợp lệ"),
    contactLocation: jobContactLocationSchema,
    description: z.string().optional(),
    expirationDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Ngày hết hạn phải có định dạng dd/MM/yyyy"),
  })
  .refine(
    (data) => {
      if (data.salaryType === "RANGE") {
        return data.minSalary !== undefined && data.maxSalary !== undefined && data.salaryUnit !== undefined;
      }
      if (data.salaryType === "GREATER_THAN") {
        return data.minSalary !== undefined && data.salaryUnit !== undefined;
      }
      return true;
    },
    {
      message: "Vui lòng nhập đầy đủ thông tin lương tương ứng với loại lương đã chọn",
      path: ["salaryType"],
    }
  )
  .refine(
    (data) => {
      if (data.ageType === "ABOVE") {
        return data.minAge !== undefined;
      }
      if (data.ageType === "BELOW") {
        return data.maxAge !== undefined;
      }
      if (data.ageType === "INPUT") {
        return data.minAge !== undefined && data.maxAge !== undefined && data.minAge <= data.maxAge;
      }
      return true;
    },
    {
      message: "Vui lòng nhập thông tin tuổi phù hợp với loại giới hạn tuổi đã chọn",
      path: ["ageType"],
    }
  );

export type PostJobFormData = z.infer<typeof postJobSchema>;
