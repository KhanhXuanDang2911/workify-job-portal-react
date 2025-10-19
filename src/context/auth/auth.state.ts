import type { User } from "@/types";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export const initAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
};
