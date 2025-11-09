import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import type { District} from "@/types";
import { toast } from "react-toastify";
import { districtService, provinceService } from "@/services";

interface DistrictSheetProps {
  district: District;
  isOpen: boolean;
  onClose: () => void;
  provinceId: number;
}

const formSchema = z.object({
  name: z.string().min(1, "Required"),
  code: z.string().min(1, "Required"),
  provinceId: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

export default function DistrictSheet({ district, isOpen, onClose, provinceId }: DistrictSheetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: district.name,
      code: district.code,
      provinceId,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: district.name,
        code: district.code,
        provinceId,
      });
      setIsEditing(false);
    }
  }, [district, isOpen, form, provinceId]);

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

  const updateMutation = useMutation({
    mutationFn: (data: FormValues) =>
      districtService.updateDistrict(district.id, {
        name: data.name,
        code: data.code,
        provinceId: data.provinceId,
      }),
    onSuccess: () => {
      toast.success("District updated successfully");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["districts",provinceId] });
    },
    onError: () => {
      toast.error("Failed to update district");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => districtService.deleteDistrict(district.id),
    onSuccess: () => {
      toast.success("Xóa thành công");
      queryClient.invalidateQueries({ queryKey: ["districts", provinceId] });
      onClose();
    },
    onError: () => {
      toast.error("Xóa thất bại");
    },
  });

  const onSubmit = (data: FormValues) => {
    if (isEditing) {
      updateMutation.mutate(data);
    }
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
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full max-w-2xl p-0 overflow-y-auto">
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="flex items-center justify-between">
              <span> District Details</span>
              <div className="flex gap-2">
                {!isEditing ? (
                  <>
                    <Button onClick={() => setIsEditing(true)} className="bg-[#1967d2] hover:bg-[#1251a3] text-white hover:text-white">
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                      Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={updateMutation.isPending} className="bg-[#1967d2] hover:bg-[#1251a3] text-white hover:text-white">
                      {updateMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                  </>
                )}
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="p-6">
            <Form {...form}>
              <form className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name {isEditing && <span className="text-red-600">*</span>}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing}
                          placeholder="Enter name"
                          className="bg-white focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code {isEditing && <span className="text-red-600">*</span>}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing}
                          placeholder="Enter English name"
                          className="bg-white focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="provinceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province {isEditing && <span className="text-red-600">*</span>}</FormLabel>
                      <Select disabled={!isEditing || isLoadingProvinces} onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={isLoadingProvinces ? "Loading..." : "Select province"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {provincesData?.map((province) => (
                            <SelectItem key={province.id} value={province.id.toString()} className="focus:bg-green-200">
                              {province.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the district "{district.name}". This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
