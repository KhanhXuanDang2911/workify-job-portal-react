import { createContext } from "react";
import type { UserAuthState } from "./UserAuthTypes";
import type { UserAuthAction } from "./UserAuthReducer";
import { initUserAuthState } from "./UserAuthTypes";

interface UserAuthContextType {
  state: UserAuthState;
  dispatch: React.Dispatch<UserAuthAction>;
}

const initUserAuthContext: UserAuthContextType = {
  state: initUserAuthState,
  dispatch: () => null,
};

export const UserAuthContext =
  createContext<UserAuthContextType>(initUserAuthContext);
