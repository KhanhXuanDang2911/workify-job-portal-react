import { ResumeContext } from "@/context/ResumeContext/resumeContext";
import { useContext } from "react";

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used inside ResumeProvider");
  return ctx;
}
