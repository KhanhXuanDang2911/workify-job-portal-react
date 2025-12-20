import FacebookIcon from "@/assets/icons/FacebookIcon";
import GithubIcon from "@/assets/icons/GithubIcon";
import InfoIcon from "@/assets/icons/InfoIcon";
import InstagramIcon from "@/assets/icons/InstagramIcon";
import LinkedinIcon from "@/assets/icons/LinkedinIcon";
import YoutubeIcon from "@/assets/icons/YoutubeIcon";
import { useResume } from "@/context/Resume/useResume";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import type { CustomFieldType } from "@/types/resume.type";
import { Camera, Plus, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const FIELD_TYPE_MAP: Record<
  CustomFieldType,
  { label: string; icon: React.ComponentType<{ color: string }> }
> = {
  FACEBOOK: { label: "Facebook", icon: FacebookIcon },
  LINKEDIN: { label: "LinkedIn", icon: LinkedinIcon },
  INSTAGRAM: { label: "Instagram", icon: InstagramIcon },
  YOUTUBE: { label: "YouTube", icon: YoutubeIcon },
  GITHUB: { label: "GitHub", icon: GithubIcon },
  INFO: { label: "Info", icon: InfoIcon },
};

function BasicInformationSection() {
  const {
    resume,
    setResume,
    validationErrors,
    setValidationErrors,
    setAvatarFile,
  } = useResume();
  const { t } = useTranslation();
  const [customFields, setCustomFields] = useState(
    resume.basicInfo.customFields || []
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setCustomFields(resume.basicInfo.customFields || []);
  }, [resume.basicInfo.customFields]);

  const handleChangeBasicField = (
    field: keyof typeof resume.basicInfo,
    value: string
  ) => {
    setResume({
      ...resume,
      basicInfo: {
        ...resume.basicInfo,
        [field]: value,
      },
    });

    if (field === "fullName" && validationErrors.fullName) {
      setValidationErrors((prev) => ({ ...prev, fullName: false }));
    }
    if (field === "email" && validationErrors.email) {
      setValidationErrors((prev) => ({ ...prev, email: false }));
    }
    if (field === "position" && validationErrors.position) {
      setValidationErrors((prev) => ({ ...prev, position: false }));
    }
    if (field === "phoneNumber" && validationErrors.phone) {
      setValidationErrors((prev) => ({ ...prev, phone: false }));
    }
    if (field === "location" && validationErrors.location) {
      setValidationErrors((prev) => ({ ...prev, location: false }));
    }
  };

  const addCustomField = () => {
    const existingTypes = customFields.map((f) => f.type);
    const availableTypes = (
      Object.keys(FIELD_TYPE_MAP) as CustomFieldType[]
    ).filter((type) => !existingTypes.includes(type));
    if (availableTypes.length === 0) return;
    const newField: { type: CustomFieldType; value: string } = {
      type: availableTypes[0],
      value: "",
    };
    const newCustomFields = [...customFields, newField];
    setCustomFields(newCustomFields);
    setResume({
      ...resume,
      basicInfo: {
        ...resume.basicInfo,
        customFields: newCustomFields,
      },
    });
  };

  const updateFieldType = (
    oldType: CustomFieldType,
    newType: CustomFieldType
  ) => {
    const newCustomFields = customFields.map((f) =>
      f.type === oldType ? { ...f, type: newType } : f
    );
    setCustomFields(newCustomFields);
    setResume({
      ...resume,
      basicInfo: {
        ...resume.basicInfo,
        customFields: newCustomFields,
      },
    });
  };

  const updateFieldValue = (type: CustomFieldType, value: string) => {
    const newCustomFields = customFields.map((f) =>
      f.type === type ? { ...f, value } : f
    );
    setCustomFields(newCustomFields);
    setResume({
      ...resume,
      basicInfo: {
        ...resume.basicInfo,
        customFields: newCustomFields,
      },
    });
  };

  const removeField = (type: CustomFieldType) => {
    const newCustomFields = customFields.filter((f) => f.type !== type);
    setCustomFields(newCustomFields);
    setResume({
      ...resume,
      basicInfo: {
        ...resume.basicInfo,
        customFields: newCustomFields,
      },
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);

    const previewUrl = URL.createObjectURL(file);
    setResume({
      ...resume,
      basicInfo: {
        ...resume.basicInfo,
        profilePhoto: previewUrl,
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Avatar + Full Name */}
      <div className="flex items-start gap-4">
        <div className="relative">
          <img
            src={resume.basicInfo.profilePhoto || "/default-avatar.png"}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div
            className="absolute bottom-0 right-0 bg-gray-200 p-1 rounded-full cursor-pointer hover:bg-gray-300"
            onClick={handleAvatarClick}
          >
            <Camera className="w-4 h-4" />
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">
            {t("resumeBuilder.forms.basicInfo.fullName")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={resume.basicInfo.fullName || ""}
            onChange={(e) => handleChangeBasicField("fullName", e.target.value)}
            className={cn(
              "w-full border rounded px-3 py-2 text-sm focus:outline-0",
              validationErrors.fullName ? "border-red-500" : "border-gray-300"
            )}
          />
          {validationErrors.fullName && (
            <span className="text-red-500 text-xs">
              {t("resumeBuilder.validation.required")}
            </span>
          )}
        </div>
      </div>

      {/* Position */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {t("resumeBuilder.forms.basicInfo.position")}{" "}
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={resume.basicInfo.position || ""}
          onChange={(e) => handleChangeBasicField("position", e.target.value)}
          className={cn(
            "w-full border rounded px-3 py-2 text-sm focus:outline-0",
            validationErrors.position ? "border-red-500" : "border-gray-300"
          )}
        />
        {validationErrors.position && (
          <span className="text-red-500 text-xs">
            {t("resumeBuilder.validation.required")}
          </span>
        )}
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {t("resumeBuilder.forms.basicInfo.location")}{" "}
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={resume.basicInfo.location || ""}
          onChange={(e) => handleChangeBasicField("location", e.target.value)}
          className={cn(
            "w-full border rounded px-3 py-2 text-sm focus:outline-0",
            validationErrors.location ? "border-red-500" : "border-gray-300"
          )}
        />
        {validationErrors.location && (
          <span className="text-red-500 text-xs">
            {t("resumeBuilder.validation.required")}
          </span>
        )}
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("resumeBuilder.forms.basicInfo.email")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={resume.basicInfo.email || ""}
            onChange={(e) => handleChangeBasicField("email", e.target.value)}
            className={cn(
              "w-full border rounded px-3 py-2 text-sm focus:outline-0",
              validationErrors.email ? "border-red-500" : "border-gray-300"
            )}
          />
          {validationErrors.email && (
            <span className="text-red-500 text-xs">
              {t("resumeBuilder.validation.required")}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("resumeBuilder.forms.basicInfo.phone")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={resume.basicInfo.phoneNumber || ""}
            onChange={(e) =>
              handleChangeBasicField("phoneNumber", e.target.value)
            }
            className={cn(
              "w-full border rounded px-3 py-2 text-sm focus:outline-0",
              validationErrors.phone ? "border-red-500" : "border-gray-300"
            )}
          />
          {validationErrors.phone && (
            <span className="text-red-500 text-xs">
              {t("resumeBuilder.validation.required")}
            </span>
          )}
        </div>
      </div>

      {/* Custom Fields */}
      <div className="space-y-4">
        {customFields.map((field) => {
          const typeInfo = FIELD_TYPE_MAP[field.type];
          const Icon = typeInfo.icon;
          return (
            <div key={field.type} className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <Icon color={"#3d509f"} />
              </div>

              <select
                value={field.type}
                onChange={(e) =>
                  updateFieldType(field.type, e.target.value as CustomFieldType)
                }
                className="w-40 px-4 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none"
              >
                {Object.entries(FIELD_TYPE_MAP).map(([type]) => {
                  const isSelected = customFields.some((f) => f.type === type);
                  return (
                    <option key={type} value={type} disabled={isSelected}>
                      {t(
                        `resumeBuilder.forms.basicInfo.customFields.${type.toLowerCase()}`
                      )}
                    </option>
                  );
                })}
              </select>

              <input
                type="text"
                placeholder={t(
                  "resumeBuilder.forms.basicInfo.customFields.value"
                )}
                value={field.value}
                onChange={(e) => updateFieldValue(field.type, e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-0"
              />

              <button
                onClick={() => removeField(field.type)}
                className="p-2 hover:bg-red-200 rounded cursor-pointer"
              >
                <Trash size={16} />
              </button>
            </div>
          );
        })}

        {customFields.length < Object.keys(FIELD_TYPE_MAP).length && (
          <button
            onClick={addCustomField}
            className="text-sm text-black font-medium hover:underline flex items-center gap-1"
          >
            <Plus />
            {t("resumeBuilder.forms.basicInfo.addCustomField")}
          </button>
        )}
      </div>
    </div>
  );
}

export default BasicInformationSection;
