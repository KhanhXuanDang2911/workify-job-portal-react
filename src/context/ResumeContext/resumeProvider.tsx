import {
  ResumeContext,
  type ValidationErrors,
} from "@/context/ResumeContext/resumeContext";
import type { ResumeData, TemplateType } from "@/types/resume.type";
import { useState, type ReactNode, useEffect } from "react";
import { templatePandaDummy } from "@/templates/TemplatePanda/dummy";
import { resumeService } from "@/services/resume.service";
import { toast } from "react-toastify";
import { useTranslation } from "@/hooks/useTranslation";
import { useParams, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

interface ApiError {
  message?: string;
  errors?: { field: string; message: string }[];
}

// Initial resume data for creating new CV (using default-avatar.png)
const initialResumeData: ResumeData = {
  ...templatePandaDummy,
  basicInfo: {
    ...templatePandaDummy.basicInfo,
    profilePhoto: "/default-avatar.png",
  },
};

// Helper function to check if rich text content is empty
const isRichTextEmpty = (html: string | undefined | null): boolean => {
  if (!html) return true;
  const textContent = html
    .replace(/<br\s*\/?>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  return textContent.length === 0;
};

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const { id: idFromUrl } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [resumeName, setResumeName] = useState<string>("");
  const [template, setTemplate] = useState<TemplateType>("TEMPLATE-PANDA");
  const [resume, setResume] = useState<ResumeData>(initialResumeData);
  const [resumeId, setResumeId] = useState<number | null>(
    idFromUrl ? Number(idFromUrl) : null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Validate resume data
  const validateResume = (): boolean => {
    const errors: ValidationErrors = {};

    // BasicInfo - all fields required per API docs
    if (!resume.basicInfo.position?.trim()) {
      errors.position = true;
    }
    if (!resume.basicInfo.fullName?.trim()) {
      errors.fullName = true;
    }
    if (!resume.basicInfo.email?.trim()) {
      errors.email = true;
    }
    if (!resume.basicInfo.phoneNumber?.trim()) {
      errors.phone = true;
    }
    if (!resume.basicInfo.location?.trim()) {
      errors.location = true;
    }
    // Objective - description required
    if (isRichTextEmpty(resume.objective?.description)) {
      errors.objective = true;
    }

    setValidationErrors(errors);

    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      toast.error(t("resumeBuilder.validation.hasErrors"));
    }

    return !hasErrors;
  };

  // Load resume if ID exists
  useEffect(() => {
    // Update resumeId if idFromUrl changes
    if (idFromUrl) {
      const id = Number(idFromUrl);
      if (id !== resumeId) {
        setResumeId(id);
      }
    }
  }, [idFromUrl]);

  useEffect(() => {
    if (resumeId) {
      const fetchResume = async () => {
        try {
          const res = await resumeService.getResumeById(resumeId);
          if (res.data) {
            setResumeName(res.data.title);
            setTemplate(res.data.template);
            setResume(res.data.data);
          }
        } catch (error) {
          console.error("Failed to load resume", error);
          toast.error("Failed to load resume");
        }
      };
      fetchResume();
    }
  }, [resumeId]);

  const saveResume = async () => {
    setIsSaving(true);
    try {
      const payload = {
        title: resumeName.trim() === "" ? "Untitled Resume" : resumeName,
        template: template,
        data: resume,
      };

      if (resumeId) {
        // Update
        const res = await resumeService.updateResume(
          resumeId,
          payload,
          avatarFile
        );
        if (res.data) {
          setAvatarFile(null); // Reset after successful save
          toast.success(t("resumeBuilder.toolbar.toast.saveSuccess"));
          navigate("/my-resumes");
        }
      } else {
        // Create
        const res = await resumeService.createResume(payload, avatarFile);
        if (res.data) {
          setResumeId(res.data.id);
          setAvatarFile(null); // Reset after successful save
          toast.success(t("resumeBuilder.toolbar.toast.saveSuccess"));
          navigate("/my-resumes");
        }
      }
    } catch (error) {
      console.error("Failed to save resume", error);
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError.response?.data?.message ||
        t("resumeBuilder.toolbar.toast.saveFailed");
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeName,
        setResumeName,
        template,
        setTemplate,
        resume,
        setResume,
        saveResume,
        resumeId,
        isSaving,
        validationErrors,
        setValidationErrors,
        validateResume,
        avatarFile,
        setAvatarFile,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};
