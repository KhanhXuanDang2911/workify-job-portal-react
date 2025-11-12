import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DATE_REGEX,
  EMAIL_REGEX,
  PASSWORD_REGEX,
  PHONE_REGEX,
  ROLE,
  UserStatus,
  UserStatusLabelEN,
} from "@/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { districtService, provinceService, userService } from "@/services";
import { Eye, EyeOff, Search, XIcon, ArrowLeft, Camera } from "lucide-react";
import { admin_routes } from "@/routes/routes.const";
import { useTranslation } from "@/hooks/useTranslation";

const UserStatusEnum = z.enum(
  Object.keys(UserStatus) as [keyof typeof UserStatus],
  {
    message: "Required",
  }
);

const RoleEnum = z.enum(Object.keys(ROLE) as [keyof typeof ROLE], {
  message: "Required",
});

const GENDER_ENUM = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
};

type GenderType = keyof typeof GENDER_ENUM;

const schema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters long")
    .max(160, "Full name must not exceed 160 characters"),
  email: z.string().min(1, "Required").regex(EMAIL_REGEX, "Invalid"),
  password: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === undefined ||
        val === null ||
        val.length === 0 ||
        (val.length >= 8 && val.length <= 160 && PASSWORD_REGEX.test(val)),
      {
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, and special characters",
      }
    ),
  phoneNumber: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine((val) => !val || PHONE_REGEX.test(val), "Invalid"),
  birthDate: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine((val) => !val || DATE_REGEX.test(val), "Invalid"),
  gender: z
    .enum(Object.keys(GENDER_ENUM) as [keyof typeof GENDER_ENUM])
    .optional()
    .refine(
      (val) =>
        val === null ||
        val === undefined ||
        Object.keys(GENDER_ENUM).includes(val),
      { message: "Invalid" }
    ),
  provinceId: z.number().int().positive().optional(),
  districtId: z.number().int().positive().optional(),
  detailAddress: z.string().nullable().optional(),
  status: UserStatusEnum,
  role: RoleEnum,
});

type UserFormData = z.infer<typeof schema>;

const defaultAvatar =
  "https://i.pinimg.com/1200x/5a/22/d8/5a22d8574a6de748e79d81dc22463702.jpg";

export default function EditUser() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [avatarImage, setAvatarImage] = useState<string>(defaultAvatar);

  const [showPassword, setShowPassword] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showAvatarHover, setShowAvatarHover] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [provincesOptions, setProvincesOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [searchProvince, setSearchProvince] = useState("");

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await userService.getUserById(Number(id));
      return res.data;
    },
    enabled: !!id,
  });

  const form = useForm<UserFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: UserStatus.ACTIVE,
      role: userData?.role,
      provinceId: userData?.province?.id,
      districtId: userData?.district?.id,
    },
  });

  const selectedProvinceId = form.watch("provinceId");

  useEffect(() => {
    if (userData) {
      form.reset({
        email: userData.email,
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber as string,
        gender: userData.gender || undefined,
        provinceId: userData.province?.id,
        districtId: userData.district?.id,
        detailAddress: userData.detailAddress || "",
        status: userData.status,
        role: userData.role,
      });
      const dateString = userData.birthDate;
      if (dateString) {
        const [year, month, day] = dateString.split("-");
        form.setValue("birthDate", `${day}/${month}/${year}`);
      }
      console.log(userData.gender);
      setAvatarImage(userData.avatarUrl || defaultAvatar);
    }
  }, [userData, form]);

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      return await userService.updateUser(id, data);
    },
    onSuccess: () => {
      toast.success(t("toast.success.userUpdated"));
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate(`${admin_routes.BASE}/${admin_routes.USERS}`);
    },
    onError: () => {
      toast.error(t("toast.error.updateUserFailed"));
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
    staleTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    if (provinces && provinces.length > 0) setProvincesOptions(provinces);
  }, [provinces]);

  const { data: districts } = useQuery({
    queryKey: ["districts", selectedProvinceId],
    queryFn: async () => {
      if (!selectedProvinceId) return [];
      const res =
        await districtService.getDistrictsByProvinceId(selectedProvinceId);
      return res.data;
    },
    select: (data) => data.map((d: any) => ({ id: d.id, name: d.name })),
    enabled: !!selectedProvinceId,
    staleTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    const districtId = userData?.district?.id;
    if (districts?.length && districtId) {
      form.setValue("districtId", districtId);
    }
    form.setValue("gender", userData?.gender || undefined);
  }, [districts, userData, form]);

  const onSubmit = (data: UserFormData) => {
    const formData = new FormData();

    if (avatarFile) formData.append("avatar", avatarFile);

    formData.append(
      "user",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );

    updateMutation.mutate({ id: Number(id), data: formData });
  };

  const onError = (errors: any) => {
    console.error("Form validation failed!");
    console.log(form.getValues("districtId"));
    console.error("Errors:", errors);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white border-1 rounded-lg my-6">
      <Button
        variant="ghost"
        onClick={() =>
          navigate(`${admin_routes.BASE}/${admin_routes.USERS}`, {
            state: { refresh: true },
          })
        }
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <h2 className="text-2xl font-semibold mb-4 text-[#4B9D7C]"> User</h2>
      <form
        className="grid grid-cols-2 gap-4"
        onSubmit={form.handleSubmit(onSubmit, onError)}
      >
        {/* File Upload */}
        <div>
          <label>Avatar</label>
          <div
            className="relative w-32 h-32 cursor-pointer"
            onMouseEnter={() => setShowAvatarHover(true)}
            onMouseLeave={() => setShowAvatarHover(false)}
            onClick={() => avatarInputRef.current?.click()}
          >
            <img
              src={avatarImage || defaultAvatar}
              alt="Company Avatar"
              className="w-32 h-32 rounded-lg border-4 border-white object-cover"
            />
            {showAvatarHover && (
              <div className="absolute inset-0 bg-black opacity-40 rounded-lg flex items-center justify-center">
                <Camera className="h-8 w-8 text-white" />
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
                setAvatarFile(file);
              }
            }}
          />
        </div>

        <div className="flex flex-col justify-between">
          {/* Birth Date */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Birth Date
            </label>
            <Input
              placeholder="dd/MM/yyyy"
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
            <label className="block text-sm text-gray-600 mb-1">Gender</label>
            <Controller
              name="gender"
              control={form.control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(GENDER_ENUM).map((key) => (
                      <SelectItem
                        key={key}
                        value={key}
                        className="focus:bg-sky-200 focus:text-[#1967d2]"
                      >
                        {key.charAt(0).toUpperCase() +
                          key.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Full Name */}
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">
            Full Name <span className="text-red-600">*</span>
          </label>
          <Input
            placeholder="Full Name"
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
            Email <span className="text-red-600">*</span>
          </label>
          <Input
            placeholder="Email"
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
            Password{" "}
            <span className="text-gray-400">
              (Leave blank to keep current password)
            </span>
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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
            Phone Number
          </label>
          <Input
            placeholder="Phone number"
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
          <label className="block text-sm text-gray-600 mb-1">Province</label>
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
                  <SelectValue placeholder="Province" />
                </SelectTrigger>
                <SelectContent className="w-96 p-0">
                  <div className="p-4">
                    <div className="relative mb-3">
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                        color="#1967d2"
                      />
                      <Input
                        placeholder="Search"
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
                          No province found.
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
          <label className="block text-sm text-gray-600 mb-1">District</label>
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
                  <SelectValue placeholder="Select District" />
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
            Detail Address
          </label>
          <Input
            placeholder="Detail address"
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
            Status <span className="text-red-600">*</span>
          </label>
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
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
            Role <span className="text-red-600">*</span>
          </label>
          <Controller
            name="role"
            control={form.control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="JOB_SEEKER">Job Seeker</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="col-span-2 flex justify-end mt-4">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-[#4B9D7C] text-white px-6"
          >
            {updateMutation.isPending ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
