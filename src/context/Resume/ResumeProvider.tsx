import { ResumeContext, type ValidationErrors } from "./ResumeContext";
import { routes } from "@/routes/routes.const";
import type { FontFamily, ResumeData, TemplateType } from "@/types/resume.type";
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

const initialResumeData: ResumeData = {
  ...templatePandaDummy,
  basicInfo: {
    ...templatePandaDummy.basicInfo,
    profilePhoto: "/default-avatar.png",
  },
};

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
  const [fontFamily, setFontFamily] = useState<FontFamily>("PLUS_JAKARTA_SANS");
  const [resume, setResume] = useState<ResumeData>(initialResumeData);
  const [resumeId, setResumeId] = useState<number | null>(
    idFromUrl ? Number(idFromUrl) : null
  );
  const [isSaving, setIsSaving] = useState(false);

  const [isLoading, setIsLoading] = useState(!!idFromUrl);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const validateResume = (): boolean => {
    const errors: ValidationErrors = {};

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

  useEffect(() => {
    if (idFromUrl) {
      const id = Number(idFromUrl);
      if (id !== resumeId) {
        setResumeId(id);
        setIsLoading(true);
      }
    }
  }, [idFromUrl]);

  useEffect(() => {
    if (resumeId) {
      setIsLoading(true);
      const fetchResume = async () => {
        try {
          const res = await resumeService.getResumeById(resumeId);
          if (res.data) {
            setResumeName(res.data.title);
            setTemplate(res.data.template);
            if (res.data.fontFamily) {
              setFontFamily(res.data.fontFamily);
            }
            setResume(res.data.data);
          }
        } catch (error) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 403) {
            navigate(`/${routes.FORBIDDEN}`, { replace: true });
            return;
          }
          toast.error("Failed to load resume");
        } finally {
          setIsLoading(false);
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
        fontFamily: fontFamily,
        data: resume,
      };

      if (resumeId) {
        const res = await resumeService.updateResume(
          resumeId,
          payload,
          avatarFile
        );
        if (res.data) {
          setAvatarFile(null);
          toast.success(t("resumeBuilder.toolbar.toast.saveSuccess"));
          navigate("/my-resumes");
        }
      } else {
        const res = await resumeService.createResume(payload, avatarFile);
        if (res.data) {
          setResumeId(res.data.id);
          setAvatarFile(null);
          toast.success(t("resumeBuilder.toolbar.toast.saveSuccess"));
          navigate("/my-resumes");
        }
      }
    } catch (error) {
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
        fontFamily,
        setFontFamily,
        resume,
        setResume,
        saveResume,
        resumeId,
        isSaving,
        isLoading,
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
