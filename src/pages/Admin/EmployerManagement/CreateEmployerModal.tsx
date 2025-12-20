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
import { districtService, employerService, provinceService } from "@/services";
import {
  CompanySize,
  CompanySizeLabelVN,
  EMAIL_REGEX,
  PASSWORD_REGEX,
  PHONE_REGEX,
  UserStatus,
  UserStatusLabelEN,
} from "@/constants";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  Camera,
  Edit2,
  Eye,
  EyeOff,
  Plus,
  PlusIcon,
  Save,
  Search,
  Trash,
  XIcon,
} from "lucide-react";
import ReactQuill from "react-quill-new";
import { useTranslation } from "@/hooks/useTranslation";

export default function CreateEmployerModal() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const [provincesOptions, setProvincesOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [searchProvince, setSearchProvince] = useState("");

  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");

  const [editingWebsiteUrlIndex, setEditingWebsiteUrlIndex] = useState<
    number | null
  >(null);
  const [editingWebsiteUrlValue, setEditingWebsiteUrlValue] = useState("");

  const schema = useMemo(() => {
    const companySizeEnum = z.enum(
      Object.keys(CompanySize) as [keyof typeof CompanySize],
      {
        message: t("validation.companySizeRequired"),
      }
    );

    const UserStatusEnum = z.enum(
      Object.keys(UserStatus) as [keyof typeof UserStatus],
      {
        message: t("validation.statusRequired"),
      }
    );

    return z.object({
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
      companyName: z
        .string()
        .min(1, t("validation.companyNameRequired"))
        .min(2, t("validation.companyNameMinLength"))
        .max(255, t("validation.companyNameMaxLength255")),
      companySize: companySizeEnum,
      contactPerson: z.string().min(1, t("validation.contactPersonRequired")),
      phoneNumber: z.string().regex(PHONE_REGEX, t("validation.phoneInvalid")),
      provinceId: z
        .union([z.number().int().positive(), z.undefined()])
        .refine((val) => val !== undefined, {
          message: t("validation.provinceRequired"),
        }),
      districtId: z
        .union([z.number().int().positive(), z.undefined()])
        .refine((val) => val !== undefined, {
          message: t("validation.districtRequired"),
        }),
      detailAddress: z.string().min(1, t("validation.addressRequired")),
      status: UserStatusEnum,

      aboutCompany: z.string().optional(),
      facebookUrl: z.string().optional(),
      twitterUrl: z.string().optional(),
      linkedinUrl: z.string().optional(),
      googleUrl: z.string().optional(),
      youtubeUrl: z.string().optional(),
      websiteUrls: z.array(z.string()).optional(),
    });
  }, [t]);

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: UserStatus.ACTIVE,
      websiteUrls: [],
    },
  });

  const seletedProvinceId = form.watch("provinceId");

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();

      formData.append(
        "employer",
        new Blob([JSON.stringify(data)], { type: "application/json" })
      );

      if (avatarFile) formData.append("avatar", avatarFile);

      if (backgroundFile) formData.append("background", backgroundFile);

      return await employerService.createEmployer(formData);
    },
    onSuccess: () => {
      toast.success(t("toast.success.employerCreated"));
      queryClient.invalidateQueries({ queryKey: ["employers"] });
      setOpen(false);
      form.reset();
      setAvatarImage(null);
      setBannerImage(null);
      setAvatarFile(null);
      setBackgroundFile(null);
      navigate(`${admin_routes.BASE}/${admin_routes.EMPLOYERS}`);
    },
    onError: (error: any) => {
      const apiError = error?.response?.data;
      if (apiError?.status === 409) {
        toast.error(apiError.message);
      } else {
        toast.error(t("toast.error.createEmployerFailed"));
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
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  useEffect(() => {
    if (provinces && provinces.length > 0) {
      setProvincesOptions(provinces);
    }
  }, [provinces]);

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
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  return (
    <BaseModal
      title={t("admin.createEmployer.title")}
      className=""
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button className="bg-[#4B9D7C] hover:bg-[#4B9D7C]/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          {t("admin.createEmployer.buttons.add")}
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
            {t("admin.createEmployer.buttons.cancel")}
          </Button>
          <Button
            onClick={form.handleSubmit((data) => createMutation.mutate(data))}
            className="bg-[#4B9D7C] w-28 hover:bg-[#4B9D7C]/90 text-white"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending
              ? t("admin.createEmployer.buttons.creating")
              : t("admin.createEmployer.buttons.create")}
          </Button>
        </>
      )}
    >
      <form className="max-h-[400px] grid grid-cols-2 gap-4 mt-4 overflow-y-scroll px-2">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createEmployer.fields.email")}{" "}
            <span className="text-red-600">*</span>
          </label>
          <Input
            placeholder={t("admin.createEmployer.placeholders.email")}
            {...form.register("email")}
            className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
          {form.formState.errors.email && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="">
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createEmployer.fields.password")}{" "}
            <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <Input
              placeholder={t("admin.createEmployer.placeholders.password")}
              type={showPassword ? "text" : "password"}
              {...form.register("password")}
              className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C] pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none top-1/2"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createEmployer.fields.companyName")}{" "}
            <span className="text-red-600">*</span>
          </label>
          <Input
            placeholder={t("admin.createEmployer.placeholders.companyName")}
            {...form.register("companyName")}
            className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
          {form.formState.errors.companyName && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.companyName.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createEmployer.fields.aboutCompany")}
          </label>
          <Controller
            name="aboutCompany"
            control={form.control}
            render={({ field }) => (
              <ReactQuill
                theme="snow"
                // readOnly
                value={field.value}
                onChange={field.onChange}
                className="bg-white [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:max-h-[160px] [&_.ql-editor]:overflow-y-auto [&_.ql-editor]:focus-visible:ring-1 [&_.ql-editor]:focus-visible:ring-[#4B9D7C]"
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createEmployer.fields.companySize")}
            <span className="text-red-600">*</span>
          </label>
          <Controller
            name="companySize"
            control={form.control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t(
                      "admin.createEmployer.placeholders.companySize"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CompanySize).map(([key, value]) => (
                    <SelectItem
                      key={key}
                      value={value}
                      className="focus:bg-sky-200 focus:text-[#1967d2]"
                    >
                      {CompanySizeLabelVN[key as CompanySize]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.companySize && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.companySize.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createEmployer.fields.status")}{" "}
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
                      "admin.createEmployer.placeholders.selectStatus"
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

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createEmployer.fields.contactPerson")}
            <span className="text-red-600">*</span>
          </label>
          <Input
            placeholder={t("admin.createEmployer.placeholders.contactPerson")}
            {...form.register("contactPerson")}
            className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
          {form.formState.errors.contactPerson && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.contactPerson.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createEmployer.fields.phoneNumber")}
            <span className="text-red-600">*</span>
          </label>
          <Input
            placeholder={t("admin.createEmployer.placeholders.phoneNumber")}
            {...form.register("phoneNumber")}
            className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
          {form.formState.errors.phoneNumber && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createEmployer.fields.province")}
            <span className="text-red-600">*</span>
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
                      "admin.createEmployer.placeholders.selectProvince"
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
                        placeholder={t(
                          "admin.createEmployer.placeholders.search"
                        )}
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
                          {t("admin.createEmployer.noProvinceFound")}
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
            {t("admin.createEmployer.fields.district")}
            <span className="text-red-600">*</span>
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
                      "admin.createEmployer.placeholders.selectDistrict"
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

        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createEmployer.fields.detailAddress")}
            <span className="text-red-600">*</span>
          </label>
          <Input
            placeholder={t("admin.createEmployer.placeholders.detailAddress")}
            {...form.register("detailAddress")}
            className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
          {form.formState.errors.detailAddress && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.detailAddress.message}
            </p>
          )}
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createEmployer.fields.avatar")}
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
                  alt="Company Avatar"
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
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createEmployer.fields.background")}
          </label>
          <div
            className={`relative w-full h-64 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden hover:border-[#4B9D7C] transition-colors ${
              !bannerImage ? "bg-gray-50" : ""
            }`}
            onClick={() => backgroundInputRef.current?.click()}
          >
            {bannerImage ? (
              <>
                <img
                  src={bannerImage}
                  alt="Company Banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <Camera className="h-10 w-10 mb-2" />
                <span className="text-sm">{t("common.upload")}</span>
              </div>
            )}
          </div>
          <input
            ref={backgroundInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={() => {
              const file = backgroundInputRef.current?.files?.[0];
              if (file) {
                setBackgroundFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                  setBannerImage(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createEmployer.fields.facebookUrl")}
          </label>
          <Input
            placeholder="https://facebook.com/..."
            {...form.register("facebookUrl")}
            className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createEmployer.fields.twitterUrl")}
          </label>
          <Input
            placeholder="https://twitter.com/..."
            {...form.register("twitterUrl")}
            className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createEmployer.fields.linkedinUrl")}
          </label>
          <Input
            placeholder="https://linkedin.com/..."
            {...form.register("linkedinUrl")}
            className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createEmployer.fields.googleUrl")}
          </label>
          <Input
            placeholder="https://google.com/..."
            {...form.register("googleUrl")}
            className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">
            {t("admin.createEmployer.fields.youtubeUrl")}
          </label>
          <Input
            placeholder="https://youtube.com/..."
            {...form.register("youtubeUrl")}
            className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-2">
            {t("admin.createEmployer.fields.websiteUrls")}
          </label>

          <div className="flex items-center gap-2 mb-2">
            <Input
              type="url"
              placeholder="https://example.com"
              value={newWebsiteUrl}
              onChange={(e) => setNewWebsiteUrl(e.target.value)}
              className="flex-1 focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
            />
            <Button
              type="button"
              className="bg-[#4B9D7C] hover:bg-[#4B9D7C]/90 text-white"
              onClick={() => {
                const newUrl = newWebsiteUrl.trim();
                if (newUrl === "") return;
                const currentUrls = form.getValues("websiteUrls") || [];
                form.setValue("websiteUrls", [...currentUrls, newUrl]);
                setNewWebsiteUrl("");
              }}
            >
              <PlusIcon /> {t("admin.createEmployer.buttons.add")}
            </Button>
          </div>

          {form.watch("websiteUrls")?.length ? (
            <ul className="space-y-2">
              {form.watch("websiteUrls")?.map((url, index) => {
                const isEditing = editingWebsiteUrlIndex === index;

                return (
                  <li
                    key={index}
                    className="flex items-center justify-between gap-2 bg-gray-50 border rounded-md px-3 py-2 text-sm text-gray-700"
                  >
                    <Input
                      type="url"
                      value={isEditing ? editingWebsiteUrlValue : url}
                      onChange={(e) => {
                        if (isEditing)
                          setEditingWebsiteUrlValue(e.target.value);
                      }}
                      disabled={!isEditing}
                      className="flex-1 focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        const urls = form.getValues("websiteUrls") || [];
                        form.setValue(
                          "websiteUrls",
                          urls.filter((_, i) => i !== index)
                        );
                        if (editingWebsiteUrlIndex === index) {
                          setEditingWebsiteUrlIndex(null);
                          setEditingWebsiteUrlValue("");
                        }
                      }}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>

                    {isEditing ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => {
                          const urls = form.getValues("websiteUrls") || [];
                          urls[index] = editingWebsiteUrlValue.trim();
                          form.setValue("websiteUrls", urls);
                          setEditingWebsiteUrlIndex(null);
                          setEditingWebsiteUrlValue("");
                        }}
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => {
                          setEditingWebsiteUrlIndex(index);
                          setEditingWebsiteUrlValue(url);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </form>
    </BaseModal>
  );
}
