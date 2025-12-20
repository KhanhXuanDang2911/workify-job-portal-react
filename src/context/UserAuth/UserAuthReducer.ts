import type { UserAuthState } from "./UserAuthTypes";

export type UserAuthAction =
  | { type: "SET_USER"; payload: UserAuthState }
  | { type: "CLEAR_USER" }
  | { type: "SET_LOADING"; payload: boolean };

export const userAuthReducer = (
  state: UserAuthState,
  action: UserAuthAction
): UserAuthState => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated,
        isLoading: false,
      };
    case "CLEAR_USER":
      return {
        user: null,
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
