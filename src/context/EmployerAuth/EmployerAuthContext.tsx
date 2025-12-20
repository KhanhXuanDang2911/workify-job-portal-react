import { createContext } from "react";
import type { EmployerAuthState } from "./EmployerAuthTypes";
import type { EmployerAuthAction } from "./EmployerAuthReducer";
import { initEmployerAuthState } from "./EmployerAuthTypes";

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
