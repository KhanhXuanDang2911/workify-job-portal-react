import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import BaseModal from "@/components/BaseModal";
import { industryService } from "@/services/industry.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { categoryJobService } from "@/services/categoryJobs.service";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/useTranslation";

const createIndustrySchema = z.object({
  name: z.string().min(1, "Required"),
  engName: z.string().min(1, "Required"),
  description: z.string().optional(),
  categoryJobId: z.number().min(1, "Required"),
});

type CreateIndustryForm = z.infer<typeof createIndustrySchema>;

export default function CreateIndustryModal({
  categoryJobId: defaultCategoryJobId,
}: {
  categoryJobId?: number;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: categoryJobsData, isLoading: isLoadingCategoryJobs } = useQuery(
    {
      queryKey: ["categoryJobs", "all"],
      queryFn: () => categoryJobService.getAllCategoryJobs(),
      select: (data) => data.data,
      refetchOnWindowFocus: false,
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<CreateIndustryForm>({
    resolver: zodResolver(createIndustrySchema),
    mode: "onBlur",
    defaultValues: {
      categoryJobId: defaultCategoryJobId ?? undefined,
    },
  });

  const createIndustryMutation = useMutation({
    mutationFn: (data: CreateIndustryForm) =>
      industryService.createIndustry(data),
    onSuccess: () => {
      toast.success(t("toast.success.industryCreated"));
      queryClient.invalidateQueries({
        queryKey: ["industries", getValues("categoryJobId")],
      });
    },
    onError: () => {
      toast.error(t("toast.error.createIndustryFailed"));
    },
  });

  useEffect(() => {
    if (defaultCategoryJobId) {
      setValue("categoryJobId", defaultCategoryJobId);
    }
  }, [defaultCategoryJobId, setValue]);

  const onSubmit = (data: CreateIndustryForm, onClose: () => void) => {
    createIndustryMutation.mutate(data, {
      onSuccess: () => {
        onClose();
        reset();
      },
    });
  };

  return (
    <BaseModal
      title="Tạo Industry mới"
      trigger={
        <Button className="bg-teal-500 text-white hover:bg-teal-500">
          + Add
        </Button>
      }
      footer={(onClose) => (
        <>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit((data) => onSubmit(data, onClose))}
            disabled={createIndustryMutation.isPending}
          >
            {createIndustryMutation.isPending ? "Đang tạo..." : "Tạo mới"}
          </Button>
        </>
      )}
    >
      <form className="flex flex-col gap-4 mt-2 min-w-[400px]">
        <div>
          <label className="text-sm font-medium">
            Name <span className="text-red-600">*</span>
          </label>
          <Input
            {...register("name")}
            placeholder="Tên ngành nghề"
            className="mt-2 bg-white focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">
            Eng Name <span className="text-red-600">*</span>
          </label>
          <Input
            {...register("engName")}
            placeholder="English name"
            className="mt-2 bg-white focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
          {errors.engName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.engName.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Mô tả</label>
          <Textarea
            {...register("description")}
            placeholder="Mô tả ngắn"
            className="mt-2 bg-white focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
        </div>

        {/* Category Job Select */}
        <div>
          <label className="text-sm font-medium">
            Category Job<span className="text-red-600">*</span>
          </label>
          {isLoadingCategoryJobs ? (
            <p className="text-gray-500 text-sm mt-1">Đang tải...</p>
          ) : (
            <Select
              onValueChange={(value) =>
                setValue("categoryJobId", Number(value))
              }
              defaultValue={
                defaultCategoryJobId ? String(defaultCategoryJobId) : undefined
              }
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Chọn Category Job" />
              </SelectTrigger>
              <SelectContent>
                {categoryJobsData?.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {errors.categoryJobId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.categoryJobId.message}
            </p>
          )}
        </div>
      </form>
    </BaseModal>
  );
}
