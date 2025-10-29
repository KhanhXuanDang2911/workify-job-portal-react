import type { AuthState } from "./auth.state";
import type { AuthPayloadAction } from "./auth.action";
import { ROLE } from "@/constants";

export function authReducer(state: AuthState, action: AuthPayloadAction): AuthState {
  switch (action.type) {
    case "SIGN_IN_JOB_SEEKER":
      return {
        ...state,
        user: action.payload.user ?? state.user,
        isAuthenticated: action.payload.isAuthenticated ?? true,
        role: ROLE.JOB_SEEKER,
        isLoading: false,
      };
    case "SIGN_IN_EMPLOYER":
      return {
        ...state,
        user: action.payload.user ?? state.user,
        isAuthenticated: action.payload.isAuthenticated ?? true,
        role: ROLE.EMPLOYER,
        isLoading: false,
      };
    case "SIGN_IN_ADMIN":
      return {
        ...state,
        user: action.payload.user ?? state.user,
        isAuthenticated: action.payload.isAuthenticated ?? true,
        role: ROLE.ADMIN,
        isLoading: false,
      };
    case "SIGN_OUT":
      return {
        user: null,
        isAuthenticated: false,
        role: null,
        isLoading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}
