import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompanySize, CompanySizeLabelVN, EMAIL_REGEX, PASSWORD_REGEX, PHONE_REGEX, UserStatus, UserStatusLabelEN } from "@/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { districtService, employerService, provinceService } from "@/services";
import { Edit2, Eye, EyeOff, Save, Search, Trash, XIcon, PlusIcon, ArrowLeft, Camera } from "lucide-react";
import ReactQuill from "react-quill-new";
import { admin_routes } from "@/routes/routes.const";

const companySizeEnum = z.enum(Object.keys(CompanySize) as [keyof typeof CompanySize], { message: "Required" });
const UserStatusEnum = z.enum(Object.keys(UserStatus) as [keyof typeof UserStatus], { message: "Required" });

const schema = z.object({
  email: z.string().min(1, "Required").regex(EMAIL_REGEX, "Invalid email format"),
  password: z
    .string()
    .optional()
    .refine((val) => val === undefined || val === null || val.length === 0 || (val.length >= 8 && val.length <= 160 && PASSWORD_REGEX.test(val)), {
      message: "Password must be at least 8 characters long and include uppercase, lowercase, and special characters",
    }),
  companyName: z.string().min(1, "Required").min(2, "Company name must be at least 2 characters long").max(255, "Company name must not exceed 255 characters"),
  companySize: companySizeEnum,
  contactPerson: z.string().min(1, "Required"),
  phoneNumber: z.string().regex(PHONE_REGEX, "Invalid phone number format"),
  provinceId: z.union([z.number().int().positive()]).refine((val) => val !== undefined, { message: "Province is required" }),
  districtId: z.union([z.number().int().positive()]).refine((val) => val !== undefined, { message: "District is required" }),
  detailAddress: z.string(),
  status: UserStatusEnum,
  aboutCompany: z.string().optional(),
  facebookUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  googleUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
  websiteUrls: z.array(z.string()).optional(),
});

type EmployerFormData = z.infer<typeof schema>;

const defaultBanner = "https://i.pinimg.com/1200x/80/27/c6/8027c6c615900bf009b322294b61fcb2.jpg";
const defaultAvatar = "https://i.pinimg.com/1200x/5a/22/d8/5a22d8574a6de748e79d81dc22463702.jpg";

export default function EditEmployer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [bannerImage, setBannerImage] = useState<string>(defaultBanner);
  const [avatarImage, setAvatarImage] = useState<string>(defaultAvatar);

  const [showPassword, setShowPassword] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showAvatarHover, setShowAvatarHover] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [showBackgroundHover, setShowBackgroundHover] = useState(false);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const [provincesOptions, setProvincesOptions] = useState<{ id: number; name: string }[]>([]);
  const [searchProvince, setSearchProvince] = useState("");

  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");
  const [editingWebsiteUrlIndex, setEditingWebsiteUrlIndex] = useState<number | null>(null);
  const [editingWebsiteUrlValue, setEditingWebsiteUrlValue] = useState("");

  const { data: employerData, isLoading } = useQuery({
    queryKey: ["employer", id],
    queryFn: async () => {
      const res = await employerService.getEmployerById(Number(id));
      return res.data;
    },
    enabled: !!id,
  });

  const form = useForm<EmployerFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: UserStatus.ACTIVE,
      websiteUrls: [],
      companySize: employerData?.companySize,
      provinceId: employerData?.province?.id,
      districtId: employerData?.district?.id,
    },
  });

  const selectedProvinceId = form.watch("provinceId");

  useEffect(() => {
    if (employerData) {
      form.reset({
        email: employerData.email,
        companyName: employerData.companyName,
        companySize: employerData.companySize,
        contactPerson: employerData.contactPerson,
        phoneNumber: employerData.phoneNumber,
        provinceId: employerData.province?.id,
        districtId: employerData.district?.id,
        detailAddress: employerData.detailAddress || "",
        status: employerData.status,
        aboutCompany: employerData.aboutCompany || "",
        facebookUrl: employerData.facebookUrl || "",
        twitterUrl: employerData.twitterUrl || "",
        linkedinUrl: employerData.linkedinUrl || "",
        googleUrl: employerData.googleUrl || "",
        youtubeUrl: employerData.youtubeUrl || "",
        websiteUrls: employerData.websiteUrls || [],
      });
        console.log("id: ", employerData.district?.id);
      setBannerImage(employerData.backgroundUrl || defaultBanner);
      setAvatarImage(employerData.avatarUrl || defaultAvatar);
    }
  }, [employerData, form]);

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      return await employerService.updateEmployer(id, data);
    },
    onSuccess: () => {
      toast.success("Updated employer successfully");
      queryClient.invalidateQueries({ queryKey: ["employers"] });
    },
    onError: () => {
      toast.error("Failed to update employer");
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
    if (provinces && provinces.length > 0) setProvincesOptions(provinces);
  }, [provinces]);

  const { data: districts } = useQuery({
    queryKey: ["districts", selectedProvinceId],
    queryFn: async () => {
      if (!selectedProvinceId) return [];
      const res = await districtService.getDistrictsByProvinceId(selectedProvinceId);
      return res.data;
    },
    select: (data) => data.map((d: any) => ({ id: d.id, name: d.name })),
    enabled: !!selectedProvinceId,
    staleTime: 60 * 60 * 1000,
  });

  useEffect(() => {
  const districtId = employerData?.district?.id;
  if (districts?.length && districtId) {
 form.setValue("districtId", districtId);
  }
  }, [districts, employerData, form]);
    
  const onSubmit = (data: EmployerFormData) => {
    const formData = new FormData();

    if (avatarFile) formData.append("avatar", avatarFile);
    if (backgroundFile) formData.append("background", backgroundFile);

    formData.append("employer", new Blob([JSON.stringify(data)], { type: "application/json" }));

    updateMutation.mutate({ id: Number(id), data: formData });
  };

  const onError = (errors: any) => {
    console.error("Form validation failed!");
    console.log(form.getValues("districtId"));
    console.error("Errors:", errors);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white border-1 rounded-lg my-6">
      <Button variant="ghost" onClick={() => navigate(`${admin_routes.BASE}/${admin_routes.EMPLOYERS}`, { state: { refresh: true } })} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <h2 className="text-2xl font-semibold mb-4 text-[#4B9D7C]"> Employer</h2>
      <form className="grid grid-cols-2 gap-4" onSubmit={form.handleSubmit(onSubmit, onError)}>
        {/* Email */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Email <span className="text-red-600">*</span>
          </label>
          <Input {...form.register("email")} className="flex-1 focus-visible:ring-1 focus-visible:ring-[#4B9D7C]" />
          {form.formState.errors.email && <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Password <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <Input type={showPassword ? "text" : "password"} {...form.register("password")} className="flex-1 pr-10 focus-visible:ring-1 focus-visible:ring-[#4B9D7C]" />
            <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {form.formState.errors.password && <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>}
        </div>

        {/* Company Name */}
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">
            Company Name <span className="text-red-600">*</span>
          </label>
          <Input {...form.register("companyName")} className="flex-1  focus-visible:ring-1 focus-visible:ring-[#4B9D7C]" />
          {form.formState.errors.companyName && <p className="text-red-500 text-sm mt-1">{form.formState.errors.companyName.message}</p>}
        </div>

        {/* About Company */}
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">About Company</label>
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
            Company Size<span className="text-red-600">*</span>
          </label>
          <Controller
            name="companySize"
            control={form.control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Quy mô công ty" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CompanySize).map(([key, value]) => (
                    <SelectItem key={key} value={value} className="focus:bg-sky-200 focus:text-[#1967d2]">
                      {CompanySizeLabelVN[key as CompanySize]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.companySize && <p className="text-red-600 text-sm mt-1">{form.formState.errors.companySize.message}</p>}
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
        {/* Province & District */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Province
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
                  <SelectValue placeholder="Province" />
                </SelectTrigger>
                <SelectContent className="w-full p-0">
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
          <label className="block text-sm text-gray-600 mb-1">
            District <span className="text-red-600">*</span>
          </label>
          <Controller
            name="districtId"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value ? String(field.value) : ""} onValueChange={(v) => field.onChange(Number(v))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select district" />
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
          <label className="block text-sm text-gray-600 mb-1">
            Detail Address<span className="text-red-600">*</span>
          </label>
          <Input placeholder="Detail address" {...form.register("detailAddress")} className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]" />
          {form.formState.errors.detailAddress && <p className="text-red-600 text-sm mt-1">{form.formState.errors.detailAddress.message}</p>}
        </div>
        {/* Contact Info */}
        <div>
          <label>
            Contact Person <span className="text-red-600">*</span>
          </label>
          <Input {...form.register("contactPerson")} className="flex-1 focus-visible:ring-1 focus-visible:ring-[#4B9D7C]" />
        </div>
        <div>
          <label>Phone Number *</label>
          <Input {...form.register("phoneNumber")} />
        </div>

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
        <div>
          <label>Background</label>
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setShowBackgroundHover(true)}
            onMouseLeave={() => setShowBackgroundHover(false)}
            onClick={() => backgroundInputRef.current?.click()}
          >
            <img src={bannerImage || defaultBanner} alt="Company Banner" className="w-full h-64 object-cover" />
            {showBackgroundHover && (
              <div className="absolute inset-0 bg-black opacity-40 rounded-lg flex items-center justify-center">
                <Camera className="h-8 w-8 text-white" />
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
          <label className="block text-sm text-gray-600 mb-1">Facebook URL</label>
          <Input placeholder="https://facebook.com/..." {...form.register("facebookUrl")} className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]" />
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Twitter URL</label>
          <Input placeholder="https://twitter.com/..." {...form.register("twitterUrl")} className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]" />
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">LinkedIn URL</label>
          <Input placeholder="https://linkedin.com/..." {...form.register("linkedinUrl")} className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]" />
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Google URL</label>
          <Input placeholder="https://google.com/..." {...form.register("googleUrl")} className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]" />
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">YouTube URL</label>
          <Input placeholder="https://youtube.com/..." {...form.register("youtubeUrl")} className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]" />
        </div>

        {/* Website URLs Section */}
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Website URLs</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newWebsiteUrl}
              onChange={(e) => setNewWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
            />
            <Button
              type="button"
              className="bg-[#4B9D7C] hover:bg-[#4B9D7C]/90 text-white"
              onClick={() => {
                if (!newWebsiteUrl.trim()) return;
                const urls = form.getValues("websiteUrls") || [];
                form.setValue("websiteUrls", [...urls, newWebsiteUrl.trim()]);
                setNewWebsiteUrl("");
              }}
            >
              <PlusIcon /> Add
            </Button>
          </div>

          {form.watch("websiteUrls")?.length ? (
            <ul className="space-y-2">
              {form.watch("websiteUrls")!.map((url, i) => {
                const isEditing = editingWebsiteUrlIndex === i;
                return (
                  <li key={i} className="flex gap-2 bg-gray-50 border rounded-md px-3 py-2">
                    <Input
                      type="url"
                      value={isEditing ? editingWebsiteUrlValue : url}
                      onChange={(e) => isEditing && setEditingWebsiteUrlValue(e.target.value)}
                      disabled={!isEditing}
                      className="flex-1 focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
                    />
                    {isEditing ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => {
                          const urls = [...(form.getValues("websiteUrls") || [])];
                          urls[i] = editingWebsiteUrlValue.trim();
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
                        size="sm"
                        variant="outline"
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => {
                          setEditingWebsiteUrlIndex(i);
                          setEditingWebsiteUrlValue(url);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        const urls = form.getValues("websiteUrls") || [];
                        form.setValue(
                          "websiteUrls",
                          urls.filter((_, idx) => idx !== i)
                        );
                      }}
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-400 italic text-sm">No URLs added yet</p>
          )}
        </div>

        <div className="col-span-2 flex justify-end mt-4">
          <Button type="submit" disabled={updateMutation.isPending} className="bg-[#4B9D7C] text-white px-6">
            {updateMutation.isPending ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
