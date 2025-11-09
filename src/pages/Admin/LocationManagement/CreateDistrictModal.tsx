import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BaseModal from "@/components/BaseModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { districtService, provinceService } from "@/services";

const createDistrictSchema = z.object({
  name: z.string().min(1, "Required"),
  code: z.string().min(1, "Required"),
  provinceId: z.number().min(1, "Required"),
});

type CreateDistrictForm = z.infer<typeof createDistrictSchema>;

export default function CreateDistrictModal({ provinceId: defaultProvinceId }: { provinceId?: number }) {
  const queryClient = useQueryClient();

  const { data: provincesData, isLoading: isLoadingProvinces } = useQuery({
    queryKey: ["provinces", "all"],
    queryFn: async () => {
         const res = await provinceService.getProvinces();
         return res.data;
       },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<CreateDistrictForm>({
    resolver: zodResolver(createDistrictSchema),
    mode: "onBlur",
    defaultValues: {
      provinceId: defaultProvinceId ?? undefined,
    },
  });

  const createDistrictMutation = useMutation({
    mutationFn: (data: CreateDistrictForm) => districtService.createDistrict(data),
    onSuccess: () => {
      toast.success("Tạo District thành công!");
      queryClient.invalidateQueries({ queryKey: ["districts", getValues("provinceId")] });
    },
    onError: () => {
      toast.error("Tạo district thất bại!");
    },
  });

  useEffect(() => {
    if (defaultProvinceId) {
      setValue("provinceId", defaultProvinceId);
    }
  }, [defaultProvinceId, setValue]);

  const onSubmit = (data: CreateDistrictForm, onClose: () => void) => {
    createDistrictMutation.mutate(data, {
      onSuccess: () => {
        onClose();
        reset();
      },
    });
  };

  return (
    <BaseModal
      title="Tạo District mới"
      trigger={<Button className="bg-teal-500 text-white hover:bg-teal-500">+ Add</Button>}
      footer={(onClose) => (
        <>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit((data) => onSubmit(data, onClose))} disabled={createDistrictMutation.isPending}>
            {createDistrictMutation.isPending ? "Đang tạo..." : "Tạo mới"}
          </Button>
        </>
      )}
    >
      <form className="flex flex-col gap-4 mt-2 min-w-[400px]">
        <div>
          <label className="text-sm font-medium">
            Name <span className="text-red-600">*</span>
          </label>
          <Input {...register("name")} placeholder="Tên ngành nghề" className="mt-2 bg-white focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]" />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">
            Eng Name <span className="text-red-600">*</span>
          </label>
          <Input {...register("code")} placeholder="Code" className="mt-2 bg-white focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]" />
          {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>}
        </div>

        {/* Province Select */}
        <div>
          <label className="text-sm font-medium">
            Province<span className="text-red-600">*</span>
          </label>
          {isLoadingProvinces ? (
            <p className="text-gray-500 text-sm mt-1">Đang tải...</p>
          ) : (
            <Select onValueChange={(value) => setValue("provinceId", Number(value))} defaultValue={defaultProvinceId ? String(defaultProvinceId) : undefined}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Chọn Category Job" />
              </SelectTrigger>
              <SelectContent>
                {provincesData?.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {errors.provinceId && <p className="text-red-500 text-sm mt-1">{errors.provinceId.message}</p>}
        </div>
      </form>
    </BaseModal>
  );
}
