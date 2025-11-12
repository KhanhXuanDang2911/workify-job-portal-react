import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { userService, districtService } from "@/services";
import { toast } from "react-toastify";
import AddressSelector from "@/components/AddressSelector/AddressSelector";

export default function ProfileTab() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    birthDate: "",
    gender: "" as "MALE" | "FEMALE" | "OTHER" | "",
    provinceId: 0,
    districtId: 0,
    detailAddress: "",
  });

  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Type for mutation data with nullable birthDate
  type UpdateProfileData = {
    fullName: string;
    phoneNumber: string;
    birthDate: string | null;
    gender: "MALE" | "FEMALE" | "OTHER" | "";
    provinceId: number;
    districtId: number;
    detailAddress: string;
  };

  // Fetch user profile
  const { data: profileResponse, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => userService.getUserProfile(),
  });

  const user = profileResponse?.data;

  // Initialize form data from user profile
  useEffect(() => {
    if (user && !isInitialized) {
      const loadUserData = async () => {
        // If user has both province and district, load districts first
        if (user.province?.id && user.district?.id) {
          try {
            const provinceId = user.province.id;
            const districtId = user.district.id;

            // Load districts for the user's province FIRST
            await queryClient.prefetchQuery({
              queryKey: ["districts", provinceId],
              queryFn: () =>
                districtService.getDistrictsByProvinceId(provinceId),
            });

            // Then set all data INCLUDING district after districts are loaded
            setFormData({
              fullName: user.fullName || "",
              phoneNumber: user.phoneNumber || "",
              birthDate: user.birthDate ? user.birthDate.split("T")[0] : "",
              gender: user.gender || "",
              provinceId: provinceId,
              districtId: districtId,
              detailAddress: user.detailAddress || "",
            });
            setIsInitialized(true);
          } catch (error) {
            console.error("Failed to load districts:", error);
            // Fallback: set data without district
            setFormData({
              fullName: user.fullName || "",
              phoneNumber: user.phoneNumber || "",
              birthDate: user.birthDate ? user.birthDate.split("T")[0] : "",
              gender: user.gender || "",
              provinceId: user.province?.id || 0,
              districtId: 0,
              detailAddress: user.detailAddress || "",
            });
            setIsInitialized(true);
          }
        } else {
          // Set basic data if no province/district
          setFormData({
            fullName: user.fullName || "",
            phoneNumber: user.phoneNumber || "",
            birthDate: user.birthDate ? user.birthDate.split("T")[0] : "",
            gender: user.gender || "",
            provinceId: user.province?.id || 0,
            districtId: user.district?.id || 0,
            detailAddress: user.detailAddress || "",
          });
          setIsInitialized(true);
        }

        setAvatarPreview(user.avatarUrl || "");
      };

      loadUserData();
    }
  }, [user, queryClient, isInitialized]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => {
      return userService.updateUserProfile({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber || null,
        birthDate: data.birthDate || null,
        gender: data.gender || null,
        provinceId: data.provinceId > 0 ? data.provinceId : null,
        districtId: data.districtId > 0 ? data.districtId : null,
        detailAddress: data.detailAddress || null,
      });
    },
    onSuccess: () => {
      toast.success(t("toast.success.profileUpdated"));
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: () => {
      toast.error(t("toast.error.updateProfileFailed"));
    },
  });

  // Update avatar mutation
  const updateAvatarMutation = useMutation({
    mutationFn: (file: File) => userService.updateUserAvatar(file),
    onSuccess: () => {
      toast.success(t("toast.success.avatarUpdated"));
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setAvatarFile(null);
    },
    onError: () => {
      toast.error(t("toast.error.updateAvatarFailed"));
    },
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      toast.error(t("profile.avatarSizeError"));
      e.currentTarget.value = "";
      return;
    }

    // Check if image
    if (!file.type.startsWith("image/")) {
      toast.error(t("profile.avatarTypeError"));
      e.currentTarget.value = "";
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error(t("profile.fullNameRequired"));
      return;
    }

    // Convert birthDate from yyyy-MM-dd to dd/MM/yyyy format
    let formattedBirthDate: string | null = formData.birthDate;
    if (formData.birthDate && formData.birthDate.includes("-")) {
      const [year, month, day] = formData.birthDate.split("-");
      formattedBirthDate = `${day}/${month}/${year}`;
    } else if (!formData.birthDate) {
      formattedBirthDate = null;
    }

    // Update profile
    updateProfileMutation.mutate({
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      birthDate: formattedBirthDate,
      gender: formData.gender,
      provinceId: formData.provinceId,
      districtId: formData.districtId,
      detailAddress: formData.detailAddress,
    });

    // Update avatar if changed
    if (avatarFile) {
      updateAvatarMutation.mutate(avatarFile);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white rounded-lg">
        <Loader2 className="w-8 h-8 animate-spin text-[#1967d2]" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white w-full p-6 rounded-lg"
    >
      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-200">
        <Label className="text-sm font-medium text-gray-700">
          {t("profile.avatar")}
        </Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />
        <div
          role="button"
          tabIndex={0}
          onClick={handleAvatarClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleAvatarClick();
            }
          }}
          className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 hover:border-[#1967d2] transition-colors cursor-pointer overflow-hidden group"
        >
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
              <span className="text-white text-3xl font-bold">
                {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 text-center max-w-xs">
          {t("profile.avatarHint")}
        </p>
        {updateAvatarMutation.isPending && (
          <p className="text-sm text-[#1967d2]">{t("common.loading")}</p>
        )}
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="md:col-span-2">
          <Label
            htmlFor="fullName"
            className="text-sm font-medium text-gray-700 mb-2 block"
          >
            {t("profile.fullName")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="focus-visible:ring-1 focus-visible:ring-[#1967d2] focus-visible:border-none"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <Label
            htmlFor="phoneNumber"
            className="text-sm font-medium text-gray-700 mb-2 block"
          >
            {t("profile.phoneNumber")}
          </Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            placeholder="+84912345678"
            className="focus-visible:ring-1 focus-visible:ring-[#1967d2] focus-visible:border-none"
          />
        </div>

        {/* Birth Date */}
        <div>
          <Label
            htmlFor="birthDate"
            className="text-sm font-medium text-gray-700 mb-2 block"
          >
            {t("profile.birthDate")}
          </Label>
          <Input
            id="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={(e) =>
              setFormData({ ...formData, birthDate: e.target.value })
            }
            className="focus-visible:ring-1 focus-visible:ring-[#1967d2] focus-visible:border-none"
          />
        </div>

        {/* Gender */}
        <div>
          <Label
            htmlFor="gender"
            className="text-sm font-medium text-gray-700 mb-2 block"
          >
            {t("profile.gender")}
          </Label>
          <Select
            value={formData.gender}
            onValueChange={(val) =>
              setFormData({
                ...formData,
                gender: val as typeof formData.gender,
              })
            }
          >
            <SelectTrigger className="focus-visible:ring-1 w-full focus-visible:ring-[#1967d2]">
              <SelectValue placeholder={t("profile.selectGender")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="MALE"
                className="focus:bg-sky-200 focus:text-[#1967d2]"
              >
                {t("profile.genderMale")}
              </SelectItem>
              <SelectItem
                value="FEMALE"
                className="focus:bg-sky-200 focus:text-[#1967d2]"
              >
                {t("profile.genderFemale")}
              </SelectItem>
              <SelectItem
                value="OTHER"
                className="focus:bg-sky-200 focus:text-[#1967d2]"
              >
                {t("profile.genderOther")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Address Section */}
        <div className="md:col-span-2 space-y-4">
          <Label className="text-sm font-medium text-gray-700">
            {t("profile.address")}
          </Label>
          {isInitialized ? (
            <AddressSelector
              provinceId={formData.provinceId}
              districtId={formData.districtId}
              onProvinceChange={(value) => {
                setFormData({
                  ...formData,
                  provinceId: Number(value) || 0,
                  districtId: 0, // Reset district when province changes
                });
              }}
              onDistrictChange={(value) => {
                setFormData({ ...formData, districtId: Number(value) || 0 });
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="w-6 h-6 animate-spin text-[#1967d2]" />
            </div>
          )}
        </div>

        {/* Detail Address */}
        <div className="md:col-span-2">
          <Label
            htmlFor="detailAddress"
            className="text-sm font-medium text-gray-700 mb-2 block"
          >
            {t("profile.detailAddress")}
          </Label>
          <Input
            id="detailAddress"
            value={formData.detailAddress}
            onChange={(e) =>
              setFormData({ ...formData, detailAddress: e.target.value })
            }
            placeholder={t("profile.detailAddressPlaceholder")}
            className="focus-visible:ring-1 focus-visible:ring-[#1967d2] focus-visible:border-none"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-center">
        <Button
          type="submit"
          className="bg-[#1967d2] hover:bg-[#1557b0] px-12 py-6 text-base"
          disabled={
            updateProfileMutation.isPending || updateAvatarMutation.isPending
          }
        >
          {updateProfileMutation.isPending || updateAvatarMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("common.loading")}
            </>
          ) : (
            t("common.save")
          )}
        </Button>
      </div>
    </form>
  );
}
