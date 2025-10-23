import type { AuthState } from "./auth.state";

export type AuthPayloadAction =
  | { type: "SIGN_IN_JOB_SEEKER"; payload: Partial<AuthState> }
  | { type: "SIGN_IN_EMPLOYER"; payload: Partial<AuthState> }
  | { type: "SIGN_IN_ADMIN"; payload: Partial<AuthState> }
  | { type: "SIGN_OUT" }
  | { type: "SET_LOADING"; payload: boolean };

export const signInJobSeeker = (payload: Partial<AuthState>): AuthPayloadAction => ({
  type: "SIGN_IN_JOB_SEEKER",
  payload,
});
export const signInEmployer = (payload: Partial<AuthState>): AuthPayloadAction => ({
  type: "SIGN_IN_EMPLOYER",
  payload,
});

export const signOut = (): AuthPayloadAction => ({
  type: "SIGN_OUT",
});

export const setLoading = (isLoading: boolean): AuthPayloadAction => ({
  type: "SET_LOADING",
  payload: isLoading,
});
