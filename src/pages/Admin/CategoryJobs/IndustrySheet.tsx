import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { industryService } from "@/services/industry.service";
import type { Industry } from "@/types";
import { toast } from "react-toastify";
import { categoryJobService } from "@/services/categoryJobs.service";

interface IndustrySheetProps {
  industry: Industry;
  isOpen: boolean;
  onClose: () => void;
  categoryJobId: number;
}

const formSchema = z.object({
  name: z.string().min(1, "Required"),
  engName: z.string().min(1, "Required"),
  description: z.string().optional(),
  categoryJobId: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

export default function IndustrySheet({ industry, isOpen, onClose, categoryJobId }: IndustrySheetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: industry.name,
      engName: industry.engName,
      description: industry.description || "",
      categoryJobId,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: industry.name,
        engName: industry.engName,
        description: industry.description || "",
        categoryJobId,
      });
      setIsEditing(false);
    }
  }, [industry, isOpen, form, categoryJobId]);

  const { data: categoryJobsData, isLoading: isLoadingCategoryJobs } = useQuery({
    queryKey: ["categoryJobs","all"],
    queryFn: () => categoryJobService.getAllCategoryJobs(),
    select: (data) => data.data,
    refetchOnWindowFocus: false,
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormValues) =>
      industryService.updateIndustry(industry.id, {
        name: data.name,
        engName: data.engName,
        description: data.description || "",
         categoryJobId: data.categoryJobId,
      }),
    onSuccess: () => {
      toast.success("Industry updated successfully");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["industries",categoryJobId] });
    },
    onError: () => {
      toast.error("Failed to update industry");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => industryService.deleteIndustry(industry.id),
    onSuccess: () => {
      toast.success("Xóa thành công");
      queryClient.invalidateQueries({ queryKey: ["industries"] });
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
              <span> Industry Details</span>
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
                  name="engName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>English Name {isEditing && <span className="text-red-600">*</span>}</FormLabel>
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={!isEditing}
                          placeholder="Enter description"
                          rows={6}
                          className="min-h-[100px] bg-white resize-none focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryJobId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Job {isEditing && <span className="text-red-600">*</span>}</FormLabel>
                      <Select disabled={!isEditing || isLoadingCategoryJobs} onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={isLoadingCategoryJobs ? "Loading..." : "Select category job"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryJobsData?.map((job) => (
                            <SelectItem key={job.id} value={job.id.toString()} className="focus:bg-green-200">
                              {job.name}
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
            <AlertDialogDescription>This will permanently delete the industry "{industry.name}". This action cannot be undone.</AlertDialogDescription>
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
