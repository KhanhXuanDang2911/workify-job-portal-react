import type { Employer } from "@/types";

export interface EmployerAuthState {
  employer: Employer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const initEmployerAuthState: EmployerAuthState = {
  employer: null,
  isAuthenticated: false,
  isLoading: true,
};
