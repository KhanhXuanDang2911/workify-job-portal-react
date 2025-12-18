import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BaseModal from "@/components/BaseModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { provinceService } from "@/services";
import { useTranslation } from "@/hooks/useTranslation";

const createProvinceSchema = z.object({
  name: z.string().min(1, "validation.provinceNameRequired"),
  engName: z.string().min(1, "validation.provinceEngNameRequired"),
  code: z.string().min(1, "validation.codeRequired"),
});

type CreateProvinceForm = z.infer<typeof createProvinceSchema>;

export default function CreateProvinceModal() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProvinceForm>({
    resolver: zodResolver(createProvinceSchema),
    mode: "onBlur",
  });

  const createProvinceMutation = useMutation({
    mutationFn: provinceService.createProvince,
    onSuccess: () => {
      toast.success(t("toast.success.locationCreated"));
      queryClient.invalidateQueries({ queryKey: ["provinces"] });
    },
    onError: () => {
      toast.error(t("toast.error.createLocationFailed"));
    },
  });

  const onSubmit = (data: CreateProvinceForm, onClose: () => void) => {
    createProvinceMutation.mutate(data, {
      onSuccess: () => {
        onClose();
        reset();
      },
    });
  };

  return (
    <BaseModal
      title={t("admin.createProvince")}
      trigger={
        <Button className="bg-teal-500 text-white hover:bg-teal-500">
          + {t("common.create")}
        </Button>
      }
      footer={(onClose) => (
        <>
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleSubmit((data) => onSubmit(data, onClose))}
            disabled={createProvinceMutation.isPending}
          >
            {createProvinceMutation.isPending
              ? t("common.loading")
              : t("common.create")}
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
            placeholder={t("admin.provinceNamePlaceholder")}
            className="mt-2 bg-white focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {t(errors.name.message || "")}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">
            Eng Name<span className="text-red-600">*</span>
          </label>
          <Input
            {...register("engName")}
            placeholder="English name"
            className="mt-2 bg-white focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
          {errors.engName && (
            <p className="text-red-500 text-sm mt-1">
              {t(errors.engName.message || "")}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Code</label>
          <Input
            {...register("code")}
            placeholder="Code"
            className="mt-2 bg-white focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
          {errors.code && (
            <p className="text-red-500 text-sm mt-1">
              {t(errors.code.message || "")}
            </p>
          )}
        </div>
      </form>
    </BaseModal>
  );
}
