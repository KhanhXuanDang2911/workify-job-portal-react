import type React from "react";

import { authReducer } from "@/context/auth/auth.reducer";
import { initAuthState } from "@/context/auth/auth.state";
import { AuthContext } from "@/context/auth/AuthContext";
import { useReducer, useEffect } from "react";
import { authUtils } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { employerService } from "@/services";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initAuthState);

  const { data: employerProfile } = useQuery({
    queryKey: ["employerProfile"],
    queryFn: async () => {
      const response = await employerService.getEmployerProfile();
      return response.data;
    },
    enabled: state.isAuthenticated && state.role === "EMPLOYER",
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    const accessToken = authUtils.getAccessToken();
    const user = authUtils.getUser();
    const employer = authUtils.getEmployer();

    if (accessToken) {
      if (employer) {
        dispatch({
          type: "SIGN_IN_EMPLOYER",
          payload: {
            isAuthenticated: true,
            user: employer,
          },
        });
      } else if (user) {
        dispatch({
          type: "SIGN_IN_JOB_SEEKER",
          payload: {
            isAuthenticated: true,
            user: user,
          },
        });
      }
    }
  }, []);

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
}
