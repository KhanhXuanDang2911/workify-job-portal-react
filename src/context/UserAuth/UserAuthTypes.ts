import type { User } from "@/types";

export interface UserAuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const initUserAuthState: UserAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};
