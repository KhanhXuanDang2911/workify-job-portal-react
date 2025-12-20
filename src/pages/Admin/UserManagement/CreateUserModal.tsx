import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { admin_routes } from "@/routes/routes.const";
import BaseModal from "@/components/BaseModal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { districtService, provinceService, userService } from "@/services";
import { industryService } from "@/services/industry.service";
import {
  DATE_REGEX,
  EMAIL_REGEX,
  PASSWORD_REGEX,
  PHONE_REGEX,
  ROLE,
  UserStatus,
  UserStatusLabelEN,
} from "@/constants";
import { useEffect, useRef, useState, useMemo } from "react";
import { Camera, Eye, EyeOff, Plus, Search, XIcon } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const GENDER_ENUM = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
};

export default function CreateUserModal() {
  const { t, currentLanguage, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [avatarImage, setAvatarImage] = useState<string | null>(null);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [provincesOptions, setProvincesOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [searchProvince, setSearchProvince] = useState("");

  const schema = useMemo(() => {
    const UserStatusEnum = z.enum(
      Object.keys(UserStatus) as [keyof typeof UserStatus],
      {
        message: t("validation.statusRequired"),
      }
    );

    const RoleEnum = z.enum(Object.keys(ROLE) as [keyof typeof ROLE], {
      message: t("validation.roleRequired"),
    });

    return z.object({
      fullName: z
        .string()
        .min(3, t("validation.fullNameMinLength"))
        .max(160, t("validation.fullNameMaxLength")),
      email: z
        .string()
        .min(1, t("validation.emailRequired"))
        .regex(EMAIL_REGEX, t("validation.emailInvalid")),
      password: z
        .string()
        .min(1, t("validation.passwordRequired"))
        .min(8, t("validation.passwordTooShort"))
        .max(160, t("validation.passwordTooLong"))
        .regex(PASSWORD_REGEX, t("validation.passwordComplexity")),
      phoneNumber: z
        .string()
        .transform((val) => (val === "" ? undefined : val))
        .optional()
        .refine(
          (val) => !val || PHONE_REGEX.test(val),
          t("validation.phoneInvalid")
        ),
      birthDate: z
        .string()
        .transform((val) => (val === "" ? undefined : val))
        .optional()
        .refine(
          (val) => !val || DATE_REGEX.test(val),
          t("validation.dateInvalid")
        ),
      gender: z
        .enum(Object.keys(GENDER_ENUM) as [keyof typeof GENDER_ENUM])
        .nullable()
        .optional()
        .refine(
          (val) =>
            val === null ||
            val === undefined ||
            Object.keys(GENDER_ENUM).includes(val),
          { message: t("validation.invalid") }
        ),
      provinceId: z.number().int().positive().optional(),
      districtId: z.number().int().positive().optional(),
      industryId: z.number().int().positive().optional(),
      detailAddress: z.string().nullable().optional(),
      status: UserStatusEnum,
      role: RoleEnum,
    });
  }, [t]);

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: UserStatus.ACTIVE,
      role: ROLE.JOB_SEEKER,
      industryId: undefined,
    },
  });

  const seletedProvinceId = form.watch("provinceId");

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();

      formData.append(
        "user",
        new Blob([JSON.stringify(data)], { type: "application/json" })
      );

      if (avatarFile) formData.append("avatar", avatarFile);

      return await userService.createUser(formData);
    },
    onSuccess: () => {
      toast.success(t("toast.success.userCreated"));
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setOpen(false);
      form.reset();
      setAvatarImage(null);
      setAvatarFile(null);
      navigate(`${admin_routes.BASE}/${admin_routes.USERS}`);
    },
    onError: (error: any) => {
      const apiError = error?.response?.data;
      if (apiError?.status === 409) {
        toast.error(apiError.message);
      } else {
        toast.error(t("toast.error.createUserFailed"));
      }
    },
  });

  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: async () => {
      const res = await provinceService.getProvinces();
      return res.data;
    },
    select: (data) =>
      data?.map((province: { id: number; name: string }) => ({
        id: province.id,
        name: province.name,
      })),
    staleTime: 30 * 60 * 1000,
  });

  useEffect(() => {
    if (provinces && provinces.length > 0) {
      setProvincesOptions(provinces);
    }
  }, [provinces]);

  const { data: industriesResponse } = useQuery({
    queryKey: ["all-industries"],
    queryFn: () => industryService.getAllIndustries(),
    staleTime: 30 * 60 * 1000,
  });

  const industries = industriesResponse?.data || [];

  const { data: districts } = useQuery({
    queryKey: ["districts", seletedProvinceId],
    queryFn: async () => {
      if (!seletedProvinceId) return [];
      const res = await districtService.getDistrictsByProvinceId(
        seletedProvinceId as number
      );
      return res.data;
    },
    select: (data) =>
      data?.map((district: { id: number; name: string }) => ({
        id: district.id,
        name: district.name,
      })),
    enabled: !!seletedProvinceId,
    staleTime: 30 * 60 * 1000,
  });

  return (
    <BaseModal
      title={t("admin.createUser.title")}
      className="max-w-[500px]!"
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button className="bg-[#4B9D7C] hover:bg-[#4B9D7C]/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          {t("admin.createUser.addNew")}
        </Button>
      }
      footer={(onClose) => (
        <>
          <Button
            variant="outline"
            onClick={() => {
              form.reset();
              form.clearErrors();
              onClose();
            }}
            disabled={createMutation.isPending}
            className="w-28"
          >
            {t("admin.createUser.cancel")}
          </Button>
          <Button
            onClick={form.handleSubmit((data) => createMutation.mutate(data))}
            className="bg-[#4B9D7C] w-28 hover:bg-[#4B9D7C]/90 text-white"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending
              ? t("admin.createUser.creating")
              : t("admin.createUser.create")}
          </Button>
        </>
      )}
    >
      <form className="max-h-[400px] grid grid-cols-2 gap-4 mt-4 overflow-y-scroll px-2">
        {/* File Upload */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createUser.fields.avatar")}
          </label>
          <div
            className={`relative w-32 h-32 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden hover:border-[#4B9D7C] transition-colors ${
              !avatarImage ? "bg-gray-50" : ""
            }`}
            onClick={() => avatarInputRef.current?.click()}
          >
            {avatarImage ? (
              <>
                <img
                  src={avatarImage}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <Camera className="h-8 w-8 mb-1" />
                <span className="text-xs">{t("common.upload")}</span>
              </div>
            )}
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={() => {
              const file = avatarInputRef.current?.files?.[0];
              if (file) {
                setAvatarFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                  setAvatarImage(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>

        <div className="flex flex-col justify-between">
          {/* Birth Date */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              {t("admin.createUser.fields.birthDate")}
            </label>
            <Input
              placeholder={t("admin.createUser.placeholders.birthDate")}
              {...form.register("birthDate")}
              className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
            />
            {form.formState.errors.birthDate && (
              <p className="text-red-600 text-sm mt-1">
                {form.formState.errors.birthDate.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              {t("admin.createUser.fields.gender")}
            </label>
            <Controller
              name="gender"
              control={form.control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t(
                        "admin.createUser.placeholders.selectGender"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">
                      {t("admin.createUser.genders.MALE")}
                    </SelectItem>
                    <SelectItem value="FEMALE">
                      {t("admin.createUser.genders.FEMALE")}
                    </SelectItem>
                    <SelectItem value="OTHER">
                      {t("admin.createUser.genders.OTHER")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Full Name */}
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createUser.fields.fullName")}{" "}
            <span className="text-red-600">*</span>
          </label>
          <Input
            placeholder={t("admin.createUser.placeholders.fullName")}
            {...form.register("fullName")}
            className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
          {form.formState.errors.fullName && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createUser.fields.email")}{" "}
            <span className="text-red-600">*</span>
          </label>
          <Input
            placeholder={t("admin.createUser.placeholders.email")}
            {...form.register("email")}
            className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
          {form.formState.errors.email && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createUser.fields.password")}{" "}
            <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={t("admin.createUser.placeholders.password")}
              {...form.register("password")}
              className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C] pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-red-600 w-full text-sm mt-1 whitespace-normal break-words">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createUser.fields.phoneNumber")}
          </label>
          <Input
            placeholder={t("admin.createUser.placeholders.phoneNumber")}
            {...form.register("phoneNumber")}
            className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
          {form.formState.errors.phoneNumber && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createUser.fields.province")}
          </label>
          <Controller
            name="provinceId"
            control={form.control}
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : ""}
                onValueChange={(value) => {
                  field.onChange(value ? Number(value) : undefined);
                }}
              >
                <SelectTrigger className=" w-full">
                  <SelectValue
                    placeholder={t(
                      "admin.createUser.placeholders.selectProvince"
                    )}
                  />
                </SelectTrigger>
                <SelectContent className="w-96 p-0">
                  <div className="p-4">
                    <div className="relative mb-3">
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                        color="#1967d2"
                      />
                      <Input
                        placeholder={t("admin.createUser.placeholders.search")}
                        className="pl-10 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] pr-10"
                        value={searchProvince}
                        onChange={(event) => {
                          setSearchProvince(event.target.value);
                          if (event.target.value === "") {
                            setProvincesOptions(provinces || []);
                            return;
                          }
                          const filtered = provinces?.filter((option) =>
                            option.name
                              .toLowerCase()
                              .includes(event.target.value.toLowerCase())
                          );
                          setProvincesOptions(filtered || []);
                        }}
                      />
                      {searchProvince && (
                        <XIcon
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                          color="#1967d2"
                          onClick={() => {
                            setSearchProvince("");
                            setProvincesOptions(provinces || []);
                          }}
                        />
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {provincesOptions.length > 0 ? (
                        provincesOptions.map((province) => (
                          <SelectItem
                            key={province.id}
                            value={String(province.id)}
                            className="focus:bg-sky-200 focus:text-[#1967d2]"
                          >
                            {province.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500">
                          {t("admin.createUser.noProvinceFound")}
                        </div>
                      )}
                    </div>
                  </div>
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.provinceId && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.provinceId.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createUser.fields.district")}
          </label>
          <Controller
            name="districtId"
            control={form.control}
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : ""}
                onValueChange={(val) => field.onChange(Number(val))}
                disabled={!form.watch("provinceId")}
              >
                <SelectTrigger
                  className="w-full"
                  disabled={!form.watch("provinceId")}
                >
                  <SelectValue
                    placeholder={t(
                      "admin.createUser.placeholders.selectDistrict"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {districts?.map((d) => (
                    <SelectItem
                      key={d.id}
                      value={String(d.id)}
                      className="focus:bg-sky-200 focus:text-[#1967d2]"
                    >
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.districtId && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.districtId.message}
            </p>
          )}
        </div>

        {/* Industry */}
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createUser.fields.industry")}
          </label>
          <Controller
            name="industryId"
            control={form.control}
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : ""}
                onValueChange={(val) =>
                  field.onChange(val ? Number(val) : undefined)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t(
                      "admin.createUser.placeholders.selectIndustry"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {industries.length > 0 ? (
                    industries.map((ind: any) => (
                      <SelectItem key={ind.id} value={String(ind.id)}>
                        {i18n?.exists(ind.name)
                          ? t(ind.name)
                          : currentLanguage === "en"
                            ? ind.engName || ind.name
                            : ind.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-gray-500">
                      {t("admin.createUser.noIndustry")}
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createUser.fields.detailAddress")}
          </label>
          <Input
            placeholder={t("admin.createUser.placeholders.detailAddress")}
            {...form.register("detailAddress")}
            className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
          {form.formState.errors.detailAddress && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.detailAddress.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createUser.fields.status")}{" "}
            <span className="text-red-600">*</span>
          </label>
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t(
                      "admin.createUser.placeholders.selectStatus"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(UserStatusLabelEN).map((key) => (
                    <SelectItem
                      key={key}
                      value={key}
                      className="focus:bg-sky-200 focus:text-[#1967d2]"
                    >
                      {UserStatusLabelEN[key as keyof typeof UserStatusLabelEN]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.status && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.status.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createUser.fields.role")}{" "}
            <span className="text-red-600">*</span>
          </label>
          <Controller
            name="role"
            control={form.control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t("admin.createUser.placeholders.selectRole")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">
                    {t("admin.createUser.roles.ADMIN")}
                  </SelectItem>
                  <SelectItem value="JOB_SEEKER">
                    {t("admin.createUser.roles.JOB_SEEKER")}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </form>
    </BaseModal>
  );
}
