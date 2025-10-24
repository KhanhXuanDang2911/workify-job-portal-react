import type React from "react";

import { authReducer } from "@/context/auth/auth.reducer";
import { initAuthState } from "@/context/auth/auth.state";
import { AuthContext } from "@/context/auth/AuthContext";
import { useReducer, useEffect } from "react";
import { authUtils } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { employerService } from "@/services";
import { setLoading, signInEmployer, signInJobSeeker } from "@/context/auth/auth.action";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initAuthState);

  const { data: employerProfile } = useQuery({
    queryKey: ["employerProfile"],
    queryFn: async () => {
      const response = await employerService.getEmployerProfile();
      return response.data;
    },
    enabled: state.isAuthenticated && state.role === "EMPLOYER",
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const accessToken = authUtils.getAccessToken();
    const user = authUtils.getUser();
    const employer = authUtils.getEmployer();
    if (accessToken) {
      if (employer) {
        dispatch(
          signInEmployer({
            isAuthenticated: true,
            user: employer,
          })
        );
      } else if (user) {
        dispatch(
          signInJobSeeker({
            isAuthenticated: true,
            user: user,
          })
        );
      }
    }
    dispatch(setLoading(false));
  }, []);

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
}
