import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Plus, Loader2 } from "lucide-react";
import BaseModal from "@/components/BaseModal/BaseModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employerService } from "@/services";
import { toast } from "react-toastify";

interface CompanyBannerModalProps {
  currentBanner: string;
  onBannerChange: (banner: string) => void;
  trigger: React.ReactNode;
}

const defaultBanners = [
  "https://plus.unsplash.com/premium_photo-1701853893878-c42e95905f5d?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1670513725725-664c7d3c2789?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1673197406917-546fd8675a27?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export default function CompanyBannerModal({ currentBanner, onBannerChange, trigger }: CompanyBannerModalProps) {
  const [userBanners, setUserBanners] = useState<string[]>([currentBanner]);
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
      toast.success("Background uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["employerProfile"] });
    },
    onError: () => {
      toast.error("Failed to upload background");
    },
  });

  const handleAddPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setError("File size must not exceed 3MB");
        return;
      }

      setError("");
      const reader = new FileReader();
      reader.onloadend = () => {
        const newBanner = reader.result as string;
        setUserBanners([...userBanners, newBanner]);
        setSelectedBanner(newBanner);
        setSelectedFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBanner = (banner: string) => {
    setUserBanners(userBanners.filter((b) => b !== banner));
    if (selectedBanner === banner) {
      setSelectedBanner(userBanners[0] || defaultBanners[0]);
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
      className="!max-w-3xl"
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
          <Button className="bg-[#1967d2] w-28 hover:bg-[#1251a3]" onClick={() => handleUpdate(onClose)} disabled={updateBackgroundMutation.isPending}>
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
        {/* Your Banners */}
        <div>
          <h3 className="font-medium mb-3">Your banners</h3>
          <div className="flex gap-4 flex-wrap">
            {/* Add New Photo Button */}
            <button
              onClick={handleAddPhoto}
              className="w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-[#1967d2] hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <Plus className="h-6 w-6 text-[#1967d2]" />
              </div>
              <span className="text-sm text-gray-600">Add new photo</span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

            {/* User Uploaded Banners */}
            {userBanners.map((banner, index) => (
              <div
                key={index}
                className={`relative w-48 h-32 rounded-lg overflow-hidden cursor-pointer border-2 ${selectedBanner === banner ? "border-[#1967d2]" : "border-transparent"}`}
                onClick={() => setSelectedBanner(banner)}
              >
                <img src={banner || "/placeholder.svg"} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveBanner(banner);
                  }}
                  className="absolute top-1 right-1 w-6 h-6 bg-black bg-opacity-60 rounded-full flex items-center justify-center hover:bg-opacity-80"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            ))}
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Default Banners */}
        <div>
          <h3 className="font-medium mb-3">Workify's default banner</h3>
          <div className="flex gap-4 flex-wrap">
            {defaultBanners.map((banner, index) => (
              <div
                key={index}
                className={`relative w-48 h-32 rounded-lg overflow-hidden cursor-pointer border-2 ${selectedBanner === banner ? "border-[#1967d2]" : "border-transparent"}`}
                onClick={() => setSelectedBanner(banner)}
              >
                <img src={banner || "/placeholder.svg"} alt={`Default Banner ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
