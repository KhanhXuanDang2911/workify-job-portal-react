import type { EmployerAuthState } from "./employerAuth.types";

export type EmployerAuthAction =
  | { type: "SET_EMPLOYER"; payload: EmployerAuthState }
  | { type: "CLEAR_EMPLOYER" }
  | { type: "SET_LOADING"; payload: boolean };

export const employerAuthReducer = (
  state: EmployerAuthState,
  action: EmployerAuthAction
): EmployerAuthState => {
  switch (action.type) {
    case "SET_EMPLOYER":
      return {
        ...state,
        employer: action.payload.employer,
        isAuthenticated: action.payload.isAuthenticated,
        isLoading: false,
      };
    case "CLEAR_EMPLOYER":
      return {
        employer: null,
        isAuthenticated: false,
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
};
