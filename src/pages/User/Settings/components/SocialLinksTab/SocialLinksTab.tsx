import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

const socialPlatforms = [
  { value: "facebook", label: "Facebook", icon: "📘" },
  { value: "twitter", label: "Twitter", icon: "🐦" },
  { value: "instagram", label: "Instagram", icon: "📷" },
  { value: "youtube", label: "Youtube", icon: "📺" },
  { value: "linkedin", label: "LinkedIn", icon: "💼" },
  { value: "github", label: "GitHub", icon: "🐙" },
];

export default function SocialLinksTab() {
  const { t } = useTranslation();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { id: "1", platform: "facebook", url: "" },
    { id: "2", platform: "twitter", url: "" },
    { id: "3", platform: "instagram", url: "" },
    { id: "4", platform: "youtube", url: "" },
  ]);

  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: "facebook",
      url: "",
    };
    setSocialLinks([...socialLinks, newLink]);
  };

  const removeSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter((link) => link.id !== id));
  };

  const updateSocialLink = (
    id: string,
    field: "platform" | "url",
    value: string
  ) => {
    setSocialLinks(
      socialLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Social links:", socialLinks);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-5 rounded-lg">
      <div className="space-y-4">
        {socialLinks.map((link, index) => (
          <div key={link.id} className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {t("socialLinks.socialLink")} {index + 1}
            </Label>
            <div className="flex gap-3 items-start">
              {/* Platform Select */}
              <Select
                value={link.platform}
                onValueChange={(val) =>
                  updateSocialLink(link.id, "platform", val)
                }
              >
                <SelectTrigger className="w-[200px] focus-visible:ring-1 focus-visible:ring-[#1967d2]">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span>
                        {
                          socialPlatforms.find((p) => p.value === link.platform)
                            ?.icon
                        }
                      </span>
                      <span>
                        {
                          socialPlatforms.find((p) => p.value === link.platform)
                            ?.label
                        }
                      </span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {socialPlatforms.map((platform) => (
                    <SelectItem
                      key={platform.value}
                      value={platform.value}
                      className="focus:bg-sky-200 focus:text-[#1967d2]"
                    >
                      <div className="flex items-center gap-2">
                        <span>{platform.icon}</span>
                        <span>{platform.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* URL Input */}
              <Input
                value={link.url}
                onChange={(e) =>
                  updateSocialLink(link.id, "url", e.target.value)
                }
                placeholder={t("socialLinks.urlPlaceholder")}
                className="flex-1 focus-visible:ring-1 focus-visible:ring-[#1967d2] focus-visible:border-none"
              />

              {/* Remove Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeSocialLink(link.id)}
                className="hover:bg-red-50 hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Social Link Button */}
      <Button
        type="button"
        variant="outline"
        onClick={addSocialLink}
        className="w-full border-dashed border-2 border-gray-300 hover:border-[#1967d2] hover:bg-sky-50 text-gray-600 hover:text-[#1967d2] bg-transparent"
      >
        <Plus className="w-5 h-5 mr-2" />
        {t("socialLinks.addNew")}
      </Button>

      {/* Save Button */}
      <div className="mt-6 flex justify-center">
        <Button
          type="submit"
          className="bg-[#1967d2] hover:bg-[#1557b0] px-12 py-6 text-base"
        >
          {t("common.save")}
        </Button>
      </div>
    </form>
  );
}
