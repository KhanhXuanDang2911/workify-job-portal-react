import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
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
import type { Province } from "@/types";
import { provinceService } from "@/services";

const formSchema = z.object({
  name: z.string().min(1, "Required"),
  engName: z.string().min(1, "Required"),
  code: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProvinceDetails({ province }: { province: Province }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: province.name,
      engName: province.engName,
      code: province.code,
    },
  });

  useEffect(() => {
    form.reset({
      name: province.name,
      engName: province.engName,
      code: province.code,
    });
  }, [province, form]);

  const updateMutation = useMutation({
    mutationFn: (data: FormValues) =>
      provinceService.updateProvince(province.id, {
        name: data.name,
        engName: data.engName,
        code: data.code,
      }),
    onSuccess: () => {
      toast.success("Update successful");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["provinces"] });
    },
    onError: () => {
      toast.error("Update failed");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => provinceService.deleteProvince(province.id),
    onSuccess: () => {
      toast.success("Delete successful");
      queryClient.invalidateQueries({ queryKey: ["provinces"] });
    },
    onError: () => {
      toast.error("Delete failed");
    },
  });

  const onSubmit = (data: FormValues) => {
    updateMutation.mutate({
      name: data.name!,
      engName: data.engName!,
      code: data.code!,
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
          style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)" }}
        >
          <span className="font-semibold">Province</span>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)} className="bg-[#1967d2] hover:bg-[#1251a3] text-white hover:text-white">
                Edit
              </Button>
              <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel} className="border-gray-300 bg-transparent">
                Cancel
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)} className="bg-[#1967d2] hover:bg-[#1251a3] text-white hover:text-white" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form className="space-y-1">
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name {isEditing && <span className="text-red-600">*</span>}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditing} className="bg-white focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]" />
                  </FormControl>
                  {form.formState.errors.name ? (
                    <p className="text-red-600 text-sm min-h-[15px]">{form.formState.errors.name.message}</p>
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
                  <FormLabel>Eng Name {isEditing && <span className="text-red-600">*</span>}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditing} className="bg-white focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]" />
                  </FormControl>
                  {form.formState.errors.engName ? (
                    <p className="text-red-600 text-sm min-h-[15px]">{form.formState.errors.engName.message}</p>
                  ) : (
                    <p className="text-sm min-h-[15px]"> </p>
                  )}
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code{isEditing && <span className="text-red-600">*</span>}</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} className="bg-white focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]" />
                </FormControl>
                {form.formState.errors.code ? <p className="text-red-600 text-sm min-h-[15px]">{form.formState.errors.code.message}</p> : <p className="text-sm min-h-[15px]"> </p>}
              </FormItem>
            )}
          />
        </form>
      </Form>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the province "{province.name}" and all associated industries.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
