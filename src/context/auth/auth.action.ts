import type { AuthState } from "./auth.state";

export type AuthPayloadAction = { type: "SIGN_IN"; payload: Partial<AuthState> } | { type: "SIGN_OUT" };

export const signIn = (payload: Partial<AuthState>): AuthPayloadAction => ({
  type: "SIGN_IN",
  payload,
});

export const signOut = (): AuthPayloadAction => ({
  type: "SIGN_OUT",
});
