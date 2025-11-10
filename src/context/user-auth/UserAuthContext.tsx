import { createContext } from "react";
import type { UserAuthState } from "./userAuth.types";
import type { UserAuthAction } from "./userAuth.reducer";
import { initUserAuthState } from "./userAuth.types";

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
