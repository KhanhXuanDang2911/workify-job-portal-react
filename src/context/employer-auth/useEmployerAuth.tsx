import { useContext } from "react";
import { EmployerAuthContext } from "./EmployerAuthContext";

export const useEmployerAuth = () => {
  const context = useContext(EmployerAuthContext);

  if (context === undefined) {
    throw new Error("useEmployerAuth must be used within EmployerAuthProvider");
  }

  return context;
};
