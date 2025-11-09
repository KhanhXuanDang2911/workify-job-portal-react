import type React from "react";

import { authReducer } from "@/context/auth/auth.reducer";
import { initAuthState } from "@/context/auth/auth.state";
import { AuthContext } from "@/context/auth/AuthContext";
import { useReducer } from "react";
import { useQuery } from "@tanstack/react-query";
import { employerService } from "@/services";
import { ROLE } from "@/constants";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initAuthState);

  // Fetch employer profile if authenticated as employer
  useQuery({
    queryKey: ["employerProfile"],
    queryFn: async () => {
      const response = await employerService.getEmployerProfile();
      return response.data;
    },
    enabled: state.isAuthenticated && state.role === ROLE.EMPLOYER,
    staleTime: 1000 * 60 * 5,
  });

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
}
