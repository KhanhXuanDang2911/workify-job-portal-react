import type { AuthState } from "./auth.state";
import type { AuthPayloadAction } from "./auth.action";

export function authReducer(state: AuthState, action: AuthPayloadAction): AuthState {
  switch (action.type) {
    case "SIGN_IN":
      return {
        ...state,
        user: action.payload.user ?? state.user,
        isAuthenticated: action.payload.isAuthenticated ?? true,
      };
    case "SIGN_OUT":
      return {
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
}
