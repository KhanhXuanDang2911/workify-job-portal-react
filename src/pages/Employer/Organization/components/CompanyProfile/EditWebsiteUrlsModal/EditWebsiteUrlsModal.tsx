import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import BaseModal from "@/components/BaseModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { employerService } from "@/services";
import { useEffect, useState } from "react";
import { Edit2, Pencil, PlusIcon, Save, Trash } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const schema = z.object({
  facebookUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  googleUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
  websiteUrls: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditWebsiteUrlsModal() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");

  const [editingWebsiteUrlIndex, setEditingWebsiteUrlIndex] = useState<
    number | null
  >(null);
  const [editingWebsiteUrlValue, setEditingWebsiteUrlValue] = useState("");
  useState<string | null>(null);

  const { data: employerData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["employerProfile"],
    queryFn: async () => {
      const response = await employerService.getEmployerProfile();
      return response.data;
    },
    staleTime: 60 * 60 * 1000,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (employerData) {
      form.reset({
        facebookUrl: employerData.facebookUrl || "",
        twitterUrl: employerData.twitterUrl || "",
        linkedinUrl: employerData.linkedinUrl || "",
        googleUrl: employerData.googleUrl || "",
        youtubeUrl: employerData.youtubeUrl || "",
        websiteUrls: employerData.websiteUrls || [],
      });
    }
  }, [employerData, form]);

  const updateWebsiteUrlsMutation = useMutation({
    mutationFn: (data: FormData) =>
      employerService.updateEmployerWebsiteUrls({
        facebookUrl: data.facebookUrl,
        twitterUrl: data.twitterUrl,
        linkedinUrl: data.linkedinUrl,
        googleUrl: data.googleUrl,
        youtubeUrl: data.youtubeUrl,
        websiteUrls: data.websiteUrls,
      }),
    onSuccess: () => {
      toast.success(t("toast.success.websiteUrlsUpdated"));
      queryClient.invalidateQueries({ queryKey: ["employerProfile"] });
    },
    onError: () => {
      toast.error(t("toast.error.updateProfileFailed"));
    },
  });

  const onSubmit = (data: FormData, onClose: () => void) => {
    updateWebsiteUrlsMutation.mutate(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleCancel = (onClose: () => void) => {
    form.reset();
    onClose();
  };

  return (
    <BaseModal
      title="Update Nhà Tuyển Dụng"
      className=""
      trigger={
        <Button
          variant="ghost"
          size="sm"
          className="border border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2]"
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      }
      footer={(onClose) => (
        <>
          <Button
            variant="outline"
            onClick={() => handleCancel(onClose)}
            disabled={updateWebsiteUrlsMutation.isPending}
            className="w-28"
          >
            Hủy
          </Button>
          <Button
            onClick={form.handleSubmit((data) => onSubmit(data, onClose))}
            className="bg-[#4B9D7C] w-28 hover:bg-[#4B9D7C]/90 text-white"
            disabled={updateWebsiteUrlsMutation.isPending || isLoadingProfile}
          >
            {updateWebsiteUrlsMutation.isPending ? "Updating..." : "Update"}
          </Button>
        </>
      )}
    >
      <form className="max-h-[400px] w-[600px] grid grid-cols-2 gap-4 mt-4 overflow-y-scroll px-2">
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">
            Facebook URL
          </label>
          <Input
            placeholder="https://facebook.com/..."
            {...form.register("facebookUrl")}
            className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">
            Twitter URL
          </label>
          <Input
            placeholder="https://twitter.com/..."
            {...form.register("twitterUrl")}
            className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">
            LinkedIn URL
          </label>
          <Input
            placeholder="https://linkedin.com/..."
            {...form.register("linkedinUrl")}
            className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Google URL</label>
          <Input
            placeholder="https://google.com/..."
            {...form.register("googleUrl")}
            className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">
            YouTube URL
          </label>
          <Input
            placeholder="https://youtube.com/..."
            {...form.register("youtubeUrl")}
            className="focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-2">
            Website URLs
          </label>

          <div className="flex items-center gap-2 mb-2">
            <Input
              type="url"
              placeholder="https://example.com"
              value={newWebsiteUrl}
              onChange={(e) => setNewWebsiteUrl(e.target.value)}
              className="flex-1 focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
            />
            <Button
              type="button"
              className="bg-[#4B9D7C] hover:bg-[#4B9D7C]/90 text-white"
              onClick={() => {
                const newUrl = newWebsiteUrl.trim();
                if (newUrl === "") return;
                const currentUrls = form.getValues("websiteUrls") || [];
                form.setValue("websiteUrls", [...currentUrls, newUrl]);
                setNewWebsiteUrl("");
              }}
            >
              <PlusIcon /> Add
            </Button>
          </div>

          {form.watch("websiteUrls")?.length ? (
            <ul className="space-y-2">
              {form.watch("websiteUrls")?.map((url, index) => {
                const isEditing = editingWebsiteUrlIndex === index;

                return (
                  <li
                    key={index}
                    className="flex items-center justify-between gap-2 bg-gray-50 border rounded-md px-3 py-2 text-sm text-gray-700"
                  >
                    <Input
                      type="url"
                      value={isEditing ? editingWebsiteUrlValue : url}
                      onChange={(e) => {
                        if (isEditing)
                          setEditingWebsiteUrlValue(e.target.value);
                      }}
                      disabled={!isEditing}
                      className="flex-1 focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        const urls = form.getValues("websiteUrls") || [];
                        form.setValue(
                          "websiteUrls",
                          urls.filter((_, i) => i !== index)
                        );
                        if (editingWebsiteUrlIndex === index) {
                          setEditingWebsiteUrlIndex(null);
                          setEditingWebsiteUrlValue("");
                        }
                      }}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>

                    {isEditing ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => {
                          const urls = form.getValues("websiteUrls") || [];
                          urls[index] = editingWebsiteUrlValue.trim();
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
                        variant="outline"
                        size="sm"
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => {
                          setEditingWebsiteUrlIndex(index);
                          setEditingWebsiteUrlValue(url);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">
              Chưa có URL nào được thêm
            </p>
          )}
        </div>
      </form>
    </BaseModal>
  );
}
