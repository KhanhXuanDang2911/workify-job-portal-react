import { CVContext } from "./CVContext";
import { useContext } from "react";

export const useCV = () => {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error("useCV must be used within CVProvider");
  }
  return context;
};
