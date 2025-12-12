import type { ResumeData, TemplateType } from "@/types/resume.type";
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
  resume: ResumeData;
  setResume: React.Dispatch<React.SetStateAction<ResumeData>>;
  saveResume: () => Promise<void>;
  resumeId: number | null;
  isSaving: boolean;
  validationErrors: ValidationErrors;
  setValidationErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>;
  validateResume: () => boolean;
}

export const ResumeContext = createContext<ResumeContextProps | null>(null);
