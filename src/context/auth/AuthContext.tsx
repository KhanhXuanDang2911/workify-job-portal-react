import { createContext, type Dispatch } from "react";
import { initAuthState, type AuthState } from "./auth.state";
import type { AuthPayloadAction } from "./auth.action";
interface AuthContextType {
  state: AuthState;
  dispatch: Dispatch<AuthPayloadAction>;
}

const initAuthContext = {
  state: initAuthState,
  dispatch: () => null,
};

export const AuthContext = createContext<AuthContextType>(initAuthContext);
