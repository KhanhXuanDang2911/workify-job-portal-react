import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Plus, Loader2 } from "lucide-react";
import BaseModal from "@/components/BaseModal/BaseModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employerService } from "@/services";
import { toast } from "react-toastify";
import { useTranslation } from "@/hooks/useTranslation";

interface CompanyBannerModalProps {
  currentBanner: string;
  onBannerChange: (banner: string) => void;
  trigger: React.ReactNode;
}

export default function CompanyBannerModal({
  currentBanner,
  onBannerChange,
  trigger,
}: CompanyBannerModalProps) {
  const { t } = useTranslation();
  const [userBanners, setUserBanners] = useState<string[]>(
    currentBanner ? [currentBanner] : []
  );
  const [selectedBanner, setSelectedBanner] = useState<string>(currentBanner);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const updateBackgroundMutation = useMutation({
    mutationFn: (file: File) => employerService.updateEmployerBackground(file),
    onSuccess: (response) => {
      const newBackgroundUrl = response.data?.backgroundUrl || "";
      setUserBanners([...userBanners, newBackgroundUrl]);
      setSelectedBanner(newBackgroundUrl);
      setSelectedFile(null);
      toast.success(t("toast.success.companyBannerUpdated"));
      queryClient.invalidateQueries({ queryKey: ["employerProfile"] });
    },
    onError: () => {
      toast.error(t("toast.error.updateProfileFailed"));
    },
  });

  const handleAddPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Reset input value to allow selecting the same file again if deleted
      e.target.value = "";

      if (file.size > 3 * 1024 * 1024) {
        setError("File size must not exceed 3MB");
        return;
      }

      setError("");
      const reader = new FileReader();
      reader.onloadend = () => {
        const newBanner = reader.result as string;
        // Replace existing banner list with new banner
        setUserBanners([newBanner]);
        setSelectedBanner(newBanner);
        setSelectedFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBanner = (banner: string) => {
    const newBanners = userBanners.filter((b) => b !== banner);
    setUserBanners(newBanners);
    if (selectedBanner === banner) {
      setSelectedBanner(newBanners[0] || "");
    }
  };

  const handleUpdate = (onClose: () => void) => {
    if (selectedFile) {
      updateBackgroundMutation.mutate(selectedFile, {
        onSuccess: () => {
          onBannerChange(selectedBanner);
          onClose();
        },
      });
    } else {
      onBannerChange(selectedBanner);
      onClose();
    }
  };

  return (
    <BaseModal
      title="Company Banner"
      trigger={trigger}
      className="!max-w-4xl"
      footer={(onClose) => (
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2] w-28 bg-transparent"
            disabled={updateBackgroundMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#1967d2] w-28 hover:bg-[#1251a3]"
            onClick={() => handleUpdate(onClose)}
            disabled={updateBackgroundMutation.isPending}
          >
            {updateBackgroundMutation.isPending ? (
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
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">Your banner</h3>
          {userBanners.length > 0 && selectedBanner ? (
            <div className="relative w-full aspect-[3/1] rounded-lg overflow-hidden border-2 border-[#1967d2]">
              <img
                src={selectedBanner}
                alt="Company Banner"
                className="w-full h-full object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveBanner(selectedBanner);
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-60 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors group"
                title="Remove banner"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleAddPhoto}
                className="w-full aspect-[3/1] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-[#1967d2] hover:bg-gray-50 transition-colors"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-[#1967d2]" />
                </div>
                <span className="text-base font-medium text-gray-900">
                  Add new photo
                </span>
                <p className="text-sm text-gray-500 mt-2">
                  Supports: JPG, PNG, GIF (Max 3MB)
                </p>
              </button>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>
    </BaseModal>
  );
}
