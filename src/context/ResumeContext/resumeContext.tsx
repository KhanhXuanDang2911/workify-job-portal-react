import type { ResumeData, TemplateType } from "@/types/resume.type";
import { createContext } from "react";

interface ResumeContextProps {
  resumeName: string;
  setResumeName: (value: string) => void;
  template: TemplateType;
  setTemplate: (value: TemplateType) => void;
  resume: ResumeData;
  setResume: React.Dispatch<React.SetStateAction<ResumeData>>;
}

export const ResumeContext = createContext<ResumeContextProps | null>(null);
