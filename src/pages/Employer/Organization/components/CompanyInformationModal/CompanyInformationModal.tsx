import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Pencil } from "lucide-react";
import BaseModal from "@/components/BaseModal/BaseModal";
import type { District } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { districtService, employerService, provinceService } from "@/services";
import { companyInformationModalSchema, type CompanyInformationModalFormData } from "@/schemas/employer/companyInformationModal.schema";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanySize, CompanySizeLabelVN } from "@/constants";
import ReactQuill from "react-quill-new";

export default function CompanyInformationModal() {
  const [districts, setDistricts] = useState<District[]>([]);
  const queryClient = useQueryClient();

  const { data: employerData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["employerProfile"],
    queryFn: async () => {
      const response = await employerService.getEmployerProfile();
      return response.data;
    },
    staleTime: 60 * 60 * 1000,
  });

  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: async () => {
      const response = await provinceService.getProvinces();
      return response.data;
    },
    staleTime: 60 * 60 * 1000,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<CompanyInformationModalFormData>({
    resolver: zodResolver(companyInformationModalSchema),
    defaultValues: {
      companyName: "",
      companySize: "",
      aboutCompany: "",
      contactPerson: "",
      phoneNumber: "",
      provinceId: 0,
      districtId: 0,
      detailAddress: "",
    },
  });

  const handleProvinceChange = useCallback(
    async (provinceId: string) => {
      const id = Number.parseInt(provinceId);
      setValue("provinceId", id);
      setValue("districtId", 0);

      try {
        const response = await districtService.getDistrictsByProvinceId(id);
        setDistricts(response.data || []);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch districts:", error);
        toast.error("Không thể tải danh sách quận/huyện");
        return [];
      }
    },
    [setValue]
  );

  useEffect(() => {
    if (employerData) {
      const fetchData = async () => {
        reset({
          companyName: employerData.companyName || "",
          companySize: employerData.companySize || "",
          aboutCompany: employerData.aboutCompany || "",
          contactPerson: employerData.contactPerson || "",
          phoneNumber: employerData.phoneNumber || "",
          provinceId: employerData.province?.id || 1,
          districtId: 1,
          detailAddress: employerData.detailAddress || "",
        });

        if (employerData.province?.id) {
          await handleProvinceChange(employerData.province.id.toString());
          setValue("districtId", employerData.district?.id || 0);
        }
      };

      fetchData();
    }
  }, [employerData, reset, handleProvinceChange, setValue]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: CompanyInformationModalFormData) =>
      employerService.updateEmployerProfile({
        companyName: data.companyName,
        companySize: data.companySize,
        aboutCompany: data.aboutCompany,
        contactPerson: data.contactPerson,
        phoneNumber: data.phoneNumber,
        provinceId: data.provinceId,
        districtId: data.districtId,
        detailAddress: data.detailAddress,
      }),
    onSuccess: () => {
      toast.success("Thông tin công ty đã được cập nhật thành công");
      queryClient.invalidateQueries({ queryKey: ["employerProfile"] });
    },
    onError: () => {
      toast.error("Cập nhật thông tin công ty thất bại");
    },
  });

  const onSubmit = (data: CompanyInformationModalFormData, onClose: () => void) => {
    updateProfileMutation.mutate(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleCancel = (onClose: () => void) => {
    reset();
    onClose();
  };

  return (
    <>
      <BaseModal
        title="Company information"
        trigger={
          <Button variant="ghost" size="sm" className="border border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2]">
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        }
        className="!max-w-2xl"
        footer={(onClose) => (
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => handleCancel(onClose)}
              className="border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2] w-28 bg-transparent"
              disabled={updateProfileMutation.isPending}
            >
              Cancel
            </Button>
            <Button className="bg-[#1967d2] hover:bg-[#1557b0]" onClick={handleSubmit((data) => onSubmit(data, onClose))} disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        )}
      >
        <form className="space-y-4 max-h-[60vh] overflow-y-auto px-2 py-3">
          <div className="space-y-2">
            <Label htmlFor="companyName">
              Company name <span className="text-red-500">*</span>
            </Label>
            <Input id="companyName" {...register("companyName")} className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] mt-2" />
            {errors.companyName && <p className="text-sm text-red-500">{errors.companyName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfEmployers">
              Number of employers <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="companySize"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="focus:border-[#1967d2] focus:ring-[#1967d2]">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CompanySize).map(([key, value]) => (
                      <SelectItem key={value} value={value} className="focus:bg-sky-200 focus:text-[#1967d2]">
                        {CompanySizeLabelVN[key as keyof typeof CompanySizeLabelVN]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.companySize && <p className="text-sm text-red-500">{errors.companySize.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-profile" className="mb-2 block">
              About Company <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="aboutCompany"
              control={control}
              render={({ field }) => (
                <ReactQuill
                  theme="snow"
                  // readOnly
                  value={field.value}
                  onChange={field.onChange}
                  className="bg-white [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:max-h-[160px] [&_.ql-editor]:overflow-y-auto"
                />
              )}
            />
            {errors.aboutCompany && <span className="text-xs text-red-500">{errors.aboutCompany.message}</span>}
          </div>

          <div className="space-y-2">
            <Label>
              Contact address <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-row gap-2 mt-2">
              <Controller
                name="provinceId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(Number.parseInt(value));
                      handleProvinceChange(value);
                    }}
                    value={field.value ? field.value.toString() : ""}
                  >
                    <SelectTrigger className="flex-1 focus:border-[#1967d2] focus:ring-[#1967d2]">
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces?.map((province: any) => (
                        <SelectItem key={province.id} value={province.id.toString()}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <Controller
                name="districtId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={(value) => field.onChange(Number.parseInt(value))} value={field.value ? field.value.toString() : ""}>
                    <SelectTrigger className="flex-1 focus:border-[#1967d2] focus:ring-[#1967d2]">
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district: any) => (
                        <SelectItem key={district.id} value={district.id.toString()}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {(errors.provinceId || errors.districtId) && <p className="text-sm text-red-500">{errors.provinceId?.message || errors.districtId?.message}</p>}
          </div>
          <div className="space-y-2">
            <Input {...register("detailAddress")} placeholder="Street address" className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]" />
            {errors.detailAddress && <p className="text-sm text-red-500">{errors.detailAddress.message}</p>}
          </div>

          <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600 italic">
            *The info you fill below will be used as each job entry default contact. You can also modify these contact info per job basis
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactName">Contact Name</Label>
            <Input id="contactPerson" {...register("contactPerson")} className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]" />
            {errors.contactPerson && <p className="text-sm text-red-500">{errors.contactPerson.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">
              Contact Phone <span className="text-red-500">*</span>
            </Label>
            <Input id="phoneNumber" {...register("phoneNumber")} className="focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]" />
            {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}
          </div>
        </form>
      </BaseModal>
    </>
  );
}
