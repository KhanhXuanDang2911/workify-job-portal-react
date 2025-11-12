import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  categoryJobService,
  type CategoryJobRequest,
  type CategoryJobResponse,
} from "@/services/categoryJobs.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTranslation } from "@/hooks/useTranslation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  name: z.string().min(1, "Required"),
  engName: z.string().min(1, "Required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CategoryJobDetails({
  job,
}: {
  job: CategoryJobResponse;
}) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: job.name,
      engName: job.engName,
      description: job.description || "",
    },
  });

  useEffect(() => {
    form.reset({
      name: job.name,
      engName: job.engName,
      description: job.description || "",
    });
  }, [job, form]);

  const updateMutation = useMutation({
    mutationFn: (data: CategoryJobRequest) =>
      categoryJobService.updateCategoryJob(job.id, data),
    onSuccess: () => {
      toast.success(t("toast.success.categoryUpdated"));
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["categoryJobs"] });
    },
    onError: () => {
      toast.error(t("toast.error.updateCategoryFailed"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => categoryJobService.deleteCategoryJob(job.id),
    onSuccess: () => {
      toast.success(t("toast.success.categoryDeleted"));
      queryClient.invalidateQueries({ queryKey: ["categoryJobs"] });
    },
    onError: () => {
      toast.error(t("toast.error.deleteCategoryFailed"));
    },
  });

  const onSubmit = (data: FormValues) => {
    updateMutation.mutate({
      name: data.name!,
      engName: data.engName!,
      description: data.description,
    });
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
    setShowDeleteDialog(false);
  };

  return (
    <div className="p-4 space-y-6 border-b border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-2 px-8 py-2 bg-teal-500 text-white w-fit"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)",
          }}
        >
          <span className="font-semibold">
            {t("admin.categoryJobManagement.categoryJob.title")}
          </span>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="bg-[#1967d2] hover:bg-[#1251a3] text-white hover:text-white"
              >
                {t("admin.categoryJobManagement.categoryJob.edit")}
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                {t("admin.categoryJobManagement.categoryJob.delete")}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-gray-300 bg-transparent"
              >
                {t("admin.categoryJobManagement.categoryJob.cancel")}
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                className="bg-[#1967d2] hover:bg-[#1251a3] text-white hover:text-white"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending
                  ? t("admin.categoryJobManagement.categoryJob.saving")
                  : t("admin.categoryJobManagement.categoryJob.save")}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("admin.categoryJobManagement.categoryJob.fields.name")}{" "}
                    {isEditing && <span className="text-red-600">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      className="bg-white focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
                    />
                  </FormControl>
                  {form.formState.errors.name ? (
                    <p className="text-red-600 text-sm min-h-[15px]">
                      {form.formState.errors.name.message}
                    </p>
                  ) : (
                    <p className="text-sm min-h-[15px]"> </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="engName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t(
                      "admin.categoryJobManagement.categoryJob.fields.engName"
                    )}{" "}
                    {isEditing && <span className="text-red-600">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      className="bg-white focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
                    />
                  </FormControl>
                  {form.formState.errors.engName ? (
                    <p className="text-red-600 text-sm min-h-[15px]">
                      {form.formState.errors.engName.message}
                    </p>
                  ) : (
                    <p className="text-sm min-h-[15px]"> </p>
                  )}
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t(
                    "admin.categoryJobManagement.categoryJob.fields.description"
                  )}
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={!isEditing}
                    placeholder={t(
                      "admin.categoryJobManagement.categoryJob.descriptionPlaceholder"
                    )}
                    className="min-h-[100px] bg-white resize-none focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("admin.categoryJobManagement.categoryJob.deleteDialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "admin.categoryJobManagement.categoryJob.deleteDialog.description",
                { name: job.name }
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("admin.categoryJobManagement.categoryJob.deleteDialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("admin.categoryJobManagement.categoryJob.deleteDialog.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
