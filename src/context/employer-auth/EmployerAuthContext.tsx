import { createContext } from "react";
import type { EmployerAuthState } from "./employerAuth.types";
import type { EmployerAuthAction } from "./employerAuth.reducer";
import { initEmployerAuthState } from "./employerAuth.types";

interface EmployerAuthContextType {
  state: EmployerAuthState;
  dispatch: React.Dispatch<EmployerAuthAction>;
}

const initEmployerAuthContext: EmployerAuthContextType = {
  state: initEmployerAuthState,
  dispatch: () => null,
};

export const EmployerAuthContext = createContext<EmployerAuthContextType>(
  initEmployerAuthContext
);
