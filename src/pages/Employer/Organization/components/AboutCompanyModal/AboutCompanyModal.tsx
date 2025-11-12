import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import BaseModal from "@/components/BaseModal/BaseModal";
import { Loader2, Pencil } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { employerService } from "@/services";
import { toast } from "react-toastify";
import type { CompanyInformationModalFormData } from "@/schemas/employer/companyInformationModal.schema";
import { useTranslation } from "@/hooks/useTranslation";

function AboutCompanyModal() {
  const { t } = useTranslation();
  const [aboutContent, setAboutContent] = useState("");
  const queryClient = useQueryClient();

  const { data: employerData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["employerProfile"],
    queryFn: async () => {
      const response = await employerService.getEmployerProfile();
      return response.data;
    },
    staleTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    if (employerData) {
      setAboutContent(employerData.aboutCompany || "");
    }
  }, [employerData]);

  const updateAboutMutation = useMutation({
    mutationFn: (data: CompanyInformationModalFormData) =>
      employerService.updateEmployerProfile(data),
    onSuccess: () => {
      toast.success(t("toast.success.aboutCompanyUpdated"));
      queryClient.invalidateQueries({ queryKey: ["employerProfile"] });
    },
    onError: () => {
      toast.error(t("toast.error.updateProfileFailed"));
    },
  });

  const handleSave = (onClose: () => void) => {
    const cleanContent = aboutContent !== "<p><br></p>" ? aboutContent : "";
    if (employerData) {
      // Validate phoneNumber before sending
      if (!employerData.phoneNumber || employerData.phoneNumber.trim() === "") {
        toast.error(t("toast.error.updateProfileFailed"));
        return;
      }

      updateAboutMutation.mutate(
        {
          companyName: employerData.companyName,
          companySize: employerData.companySize,
          contactPerson: employerData.contactPerson,
          phoneNumber: employerData.phoneNumber,
          provinceId: employerData.province?.id || 1,
          districtId: employerData.district?.id || 1,
          detailAddress: employerData.detailAddress || "",
          aboutCompany: cleanContent,
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  const handleCancel = (onClose: () => void) => {
    onClose();
  };

  return (
    <BaseModal
      title="About company"
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
            className="border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2] w-28 bg-transparent"
            disabled={updateAboutMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#1967d2] w-28 hover:bg-[#1251a3]"
            onClick={() => handleSave(onClose)}
            disabled={updateAboutMutation.isPending || isLoadingProfile}
          >
            {updateAboutMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </>
      )}
    >
      <div className="min-w-[700px]">
        <Label htmlFor="company-profile" className="mb-2 block">
          Company profile <span className="text-red-500">*</span>
        </Label>
        <ReactQuill
          theme="snow"
          value={aboutContent}
          onChange={setAboutContent}
          className="bg-white [&_.ql-editor]:min-h-[300px] [&_.ql-editor]:max-h-[250px] [&_.ql-editor]:overflow-y-auto"
        />
      </div>
    </BaseModal>
  );
}

export default AboutCompanyModal;
