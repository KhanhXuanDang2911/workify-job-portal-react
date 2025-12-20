import type React from "react";
import { useReducer, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { EmployerAuthContext } from "./EmployerAuthContext";
import { employerAuthReducer } from "./EmployerAuthReducer";
import { initEmployerAuthState } from "./EmployerAuthTypes";
import { employerTokenUtils } from "@/lib/token";
import { employerService } from "@/services/employer.service";
import { employer_routes } from "@/routes/routes.const";
import { useWebSocket } from "@/context/WebSocket/WebSocketContext";

interface EmployerAuthProviderProps {
  children: React.ReactNode;
}

export const EmployerAuthProvider: React.FC<EmployerAuthProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(
    employerAuthReducer,
    initEmployerAuthState
  );
  const location = useLocation();
  const { setCurrentUserId } = useWebSocket();

  useEffect(() => {
    const isEmployerRoute = location.pathname.startsWith(employer_routes.BASE);

    if (!isEmployerRoute) {
      dispatch({ type: "SET_LOADING", payload: false });
      try {
        setCurrentUserId(null, "USER");
      } catch (e) {}
      return;
    }

    const initAuth = async () => {
      const accessToken = employerTokenUtils.getAccessToken();

      if (state.isAuthenticated && state.employer && accessToken) {
        return;
      }

      if (accessToken) {
        try {
          const response = await employerService.getEmployerProfile();
          const employer = response.data;

          dispatch({
            type: "SET_EMPLOYER",
            payload: {
              employer,
              isAuthenticated: true,
              isLoading: false,
            },
          });
          try {
            setCurrentUserId(employer?.id ?? null, "EMPLOYER");
          } catch (e) {}
        } catch (error) {
          employerTokenUtils.clearAuth();
          dispatch({ type: "CLEAR_EMPLOYER" });
          try {
            setCurrentUserId(null, "EMPLOYER");
          } catch (e) {}
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initAuth();

    const handleStorageChange = () => {
      const accessToken = employerTokenUtils.getAccessToken();

      if (!accessToken) {
        dispatch({ type: "CLEAR_EMPLOYER" });
        try {
          setCurrentUserId(null, "EMPLOYER");
        } catch (e) {}
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [location.pathname, state.isAuthenticated, state.employer]);

  return (
    <EmployerAuthContext.Provider value={{ state, dispatch }}>
      {children}
    </EmployerAuthContext.Provider>
  );
};
