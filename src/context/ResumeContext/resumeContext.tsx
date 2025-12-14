import type { FontFamily, ResumeData, TemplateType } from "@/types/resume.type";
import { createContext } from "react";

export interface ValidationErrors {
  position?: boolean;
  fullName?: boolean;
  email?: boolean;
  phone?: boolean;
  location?: boolean;
  objective?: boolean;
}

interface ResumeContextProps {
  resumeName: string;
  setResumeName: (value: string) => void;
  template: TemplateType;
  setTemplate: (value: TemplateType) => void;
  fontFamily: FontFamily;
  setFontFamily: (value: FontFamily) => void;
  resume: ResumeData;
  setResume: React.Dispatch<React.SetStateAction<ResumeData>>;
  saveResume: () => Promise<void>;
  resumeId: number | null;
  isSaving: boolean;
  isLoading: boolean;
  validationErrors: ValidationErrors;
  setValidationErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>;
  validateResume: () => boolean;
  avatarFile: File | null;
  setAvatarFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export const ResumeContext = createContext<ResumeContextProps | null>(null);
