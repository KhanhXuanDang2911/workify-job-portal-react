import type { Role } from "@/constants";
import type { Employer, User } from "@/types";
import { authUtils } from "@/lib/auth";
import { ROLE } from "@/constants";

// Initialize auth state from localStorage to prevent flash on refresh
const initializeAuthState = (): AuthState => {
  const accessToken = authUtils.getAccessToken();
  const user = authUtils.getUser();
  const employer = authUtils.getEmployer();

  if (accessToken) {
    if (employer) {
      return {
        user: employer,
        isAuthenticated: true,
        role: ROLE.EMPLOYER,
        isLoading: false,
      };
    } else if (user) {
      if (user.role === ROLE.JOB_SEEKER) {
        return {
          user: user,
          isAuthenticated: true,
          role: ROLE.JOB_SEEKER,
          isLoading: false,
        };
      } else if (user.role === ROLE.ADMIN) {
        return {
          user: user,
          isAuthenticated: true,
          role: ROLE.ADMIN,
          isLoading: false,
        };
      }
    }
  }

  return {
    user: null,
    isAuthenticated: false,
    role: null,
    isLoading: false,
  };
};

export interface AuthState {
  user: User | Employer | null;
  isAuthenticated: boolean;
  role: Role | null;
  isLoading: boolean;
}

export const initAuthState: AuthState = initializeAuthState();
