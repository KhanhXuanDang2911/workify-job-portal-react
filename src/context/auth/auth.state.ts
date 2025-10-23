import type { Role } from "@/constants";
import type { Employer, User } from "@/types";

export interface AuthState {
  user: User | Employer | null;
  isAuthenticated: boolean;
  role: Role | null;
  isLoading: boolean;
}

export const initAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  role: null,
  isLoading: true,
};
