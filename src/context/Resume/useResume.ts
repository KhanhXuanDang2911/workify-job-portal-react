import { ResumeContext } from "./ResumeContext";
import { useContext } from "react";

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used inside ResumeProvider");
  return ctx;
}
