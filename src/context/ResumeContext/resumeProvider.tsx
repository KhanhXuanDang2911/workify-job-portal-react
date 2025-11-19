import { ResumeContext } from "@/context/ResumeContext/resumeContext";
import type { ResumeData, TemplateType } from "@/types/resume.type";
import { useState, type ReactNode } from "react";

const defaultResumeData: ResumeData = {
  basicInfo: {
    position: "",
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    avatarUrl: "",
    customFields: [],
  },
  objective: { description: "" },
  experience: [],
  education: [],
  skills: [],
  awards: [],
  certifications: [],
  interests: "",
  projects: [],
  references: [],
  additionalInformation: "",
  theme: {
    primaryColor: "#1f2937",
    bgColor: "#ffffff",
    textColor: "#000000",
  },
};

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resume, setResume] = useState<ResumeData>(defaultResumeData);
  const [template, setTemplate] = useState<TemplateType>("TEMPLATE-PANDA");
  const [resumeName, setResumeName] = useState<string>("My Resume");
  return (
    <ResumeContext.Provider
      value={{
        resumeName,
        setResumeName,
        resume,
        setResume,
        template,
        setTemplate,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}
