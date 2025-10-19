import { signIn, signOut, type AuthPayloadAction } from "@/context/auth/auth.action";
import { authReducer } from "@/context/auth/auth.reducer";
import { initAuthState } from "@/context/auth/auth.state";
import { AuthContext } from "@/context/auth/AuthContext";
import { authUtils } from "@/lib/auth";
import { authService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useReducer } from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initAuthState);
  const accessToken = authUtils.getAccessToken();

  const { isPending } = useQuery({
    queryKey: ["users", "me"],
    queryFn: () =>
      authService
        .getProfile()
        .then((res) => {
          dispatch(signIn({ isAuthenticated: true, user: res.data }));
          return res;
        })
        .catch(() => {
          dispatch(signOut());
        }),
    enabled: Boolean(accessToken),
  });

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
}
