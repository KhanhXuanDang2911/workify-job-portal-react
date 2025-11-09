import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import BaseModal from "@/components/BaseModal";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { districtService, provinceService, userService } from "@/services";
import { DATE_REGEX, EMAIL_REGEX, PASSWORD_REGEX, PHONE_REGEX, ROLE, UserStatus, UserStatusLabelEN } from "@/constants";
import { useEffect, useRef, useState } from "react";
import { Camera, Eye, EyeOff, Plus, Search, XIcon } from "lucide-react";

const UserStatusEnum = z.enum(Object.keys(UserStatus) as [keyof typeof UserStatus], {
  message: "Required",
});

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
  fullName: z.string().min(3, "Full name must be at least 3 characters long").max(160, "Full name must not exceed 160 characters"),
  email: z.string().min(1, "Required").regex(EMAIL_REGEX, "Invalid"),
  password: z
    .string()
    .min(1, "Required")
    .min(8, "Password must be at least 8 characters long")
    .max(160, "Password must not exceed 160 characters")
    .regex(PASSWORD_REGEX, "Password must include at least one uppercase letter, one lowercase letter, and one special character"),
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
    .nullable()
    .optional()
    .refine((val) => val === null || val === undefined || Object.keys(GENDER_ENUM).includes(val), { message: "Invalid" }),
  provinceId: z.number().int().positive().optional(),
  districtId: z.number().int().positive().optional(),
  detailAddress: z.string().nullable().optional(),
  status: UserStatusEnum,
  role: RoleEnum,
});

const defaultAvatar = "https://i.pinimg.com/1200x/5a/22/d8/5a22d8574a6de748e79d81dc22463702.jpg";

type FormData = z.infer<typeof schema>;

export default function CreateUserModal() {
  const queryClient = useQueryClient();

  const [showPassword, setShowPassword] = useState(false);

  const [avatarImage, setAvatarImage] = useState<string>(defaultAvatar);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showAvatarHover, setShowAvatarHover] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [provincesOptions, setProvincesOptions] = useState<{ id: number; name: string }[]>([]);
  const [searchProvince, setSearchProvince] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: UserStatus.ACTIVE,
      role: ROLE.JOB_SEEKER,
    },
  });

  const seletedProvinceId = form.watch("provinceId");

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();

      formData.append("user", new Blob([JSON.stringify(data)], { type: "application/json" }));

      if (avatarFile) formData.append("avatar", avatarFile);

      return await userService.createUser(formData);
    },
    onSuccess: () => {
      toast.success("Create user successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toast.error("Create employer failed");
    },
  });

  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: async () => {
      const res = await provinceService.getProvinces();
      return res.data;
    },
    select: (data) => data?.map((province: { id: number; name: string }) => ({ id: province.id, name: province.name })),
    staleTime: 60 * 60 * 1000,
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
      const res = await districtService.getDistrictsByProvinceId(seletedProvinceId as number);
      return res.data;
    },
    select: (data) => data?.map((district: { id: number; name: string }) => ({ id: district.id, name: district.name })),
    enabled: !!seletedProvinceId,
    staleTime: 60 * 60 * 1000,
  });

  return (
    <BaseModal
      title="Tạo User"
      className="max-w-[500px]!"
      trigger={
        <Button className="bg-[#4B9D7C] hover:bg-[#4B9D7C]/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add New
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
            Hủy
          </Button>
          <Button
            onClick={form.handleSubmit((data) => createMutation.mutate(data))}
            className="bg-[#4B9D7C] w-28 hover:bg-[#4B9D7C]/90 text-white"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Đang tạo..." : "Tạo"}
          </Button>
        </>
      )}
    >
      <form className="max-h-[400px] grid grid-cols-2 gap-4 mt-4 overflow-y-scroll px-2">
        {/* File Upload */}
        <div>
          <label>Avatar</label>
          <div
            className="relative w-32 h-32 cursor-pointer"
            onMouseEnter={() => setShowAvatarHover(true)}
            onMouseLeave={() => setShowAvatarHover(false)}
            onClick={() => avatarInputRef.current?.click()}
          >
            <img src={avatarImage || defaultAvatar} alt="Company Avatar" className="w-32 h-32 rounded-lg border-4 border-white object-cover" />
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
            <label className="block text-sm text-gray-600 mb-1">Birth Date</label>
            <Input placeholder="dd/MM/yyyy" {...form.register("birthDate")} className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]" />
            {form.formState.errors.birthDate && <p className="text-red-600 text-sm mt-1">{form.formState.errors.birthDate.message}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Gender</label>
            <Controller
              name="gender"
              control={form.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
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
          <Input placeholder="Full Name" {...form.register("fullName")} className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]" />
          {form.formState.errors.fullName && <p className="text-red-600 text-sm mt-1">{form.formState.errors.fullName.message}</p>}
        </div>

        {/* Email */}
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">
            Email <span className="text-red-600">*</span>
          </label>
          <Input placeholder="Email" {...form.register("email")} className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]" />
          {form.formState.errors.email && <p className="text-red-600 text-sm mt-1">{form.formState.errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Password <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...form.register("password")}
              className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C] pr-10"
            />
            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {form.formState.errors.password && <p className="text-red-600 w-full text-sm mt-1 whitespace-normal break-words">{form.formState.errors.password.message}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
          <Input placeholder="Phone number" {...form.register("phoneNumber")} className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]" />
          {form.formState.errors.phoneNumber && <p className="text-red-600 text-sm mt-1">{form.formState.errors.phoneNumber.message}</p>}
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
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" color="#1967d2" />
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
                          const filtered = provinces?.filter((option) => option.name.toLowerCase().includes(event.target.value.toLowerCase()));
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
                          <SelectItem key={province.id} value={String(province.id)} className="focus:bg-sky-200 focus:text-[#1967d2]">
                            {province.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500">No province found.</div>
                      )}
                    </div>
                  </div>
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.provinceId && <p className="text-red-600 text-sm mt-1">{form.formState.errors.provinceId.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">District</label>
          <Controller
            name="districtId"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value ? String(field.value) : ""} onValueChange={(val) => field.onChange(Number(val))} disabled={!form.watch("provinceId")}>
                <SelectTrigger className="w-full" disabled={!form.watch("provinceId")}>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  {districts?.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)} className="focus:bg-sky-200 focus:text-[#1967d2]">
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.districtId && <p className="text-red-600 text-sm mt-1">{form.formState.errors.districtId.message}</p>}
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Detail Address</label>
          <Input placeholder="Detail address" {...form.register("detailAddress")} className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]" />
          {form.formState.errors.detailAddress && <p className="text-red-600 text-sm mt-1">{form.formState.errors.detailAddress.message}</p>}
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
                    <SelectItem key={key} value={key} className="focus:bg-sky-200 focus:text-[#1967d2]">
                      {UserStatusLabelEN[key as keyof typeof UserStatusLabelEN]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.status && <p className="text-red-600 text-sm mt-1">{form.formState.errors.status.message}</p>}
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
      </form>
    </BaseModal>
  );
}
