import type React from "react";
import { useReducer, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { EmployerAuthContext } from "./EmployerAuthContext";
import { employerAuthReducer } from "./employerAuth.reducer";
import { initEmployerAuthState } from "./employerAuth.types";
import { employerTokenUtils } from "@/lib/token";
import { employerService } from "@/services/employer.service";
import { employer_routes } from "@/routes/routes.const";
import { useWebSocket } from "@/context/websocket/WebSocketContext";

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

  // Initialize or re-fetch auth state when navigating to employer routes
  useEffect(() => {
    const isEmployerRoute = location.pathname.startsWith(employer_routes.BASE);

    // Only run on employer routes
    if (!isEmployerRoute) {
      dispatch({ type: "SET_LOADING", payload: false });
      try {
        setCurrentUserId(null, "USER");
      } catch (e) {
        // ignore
      }
      return;
    }

    // Initialize auth state by fetching employer profile from API
    const initAuth = async () => {
      const accessToken = employerTokenUtils.getAccessToken();

      // Skip if already authenticated with employer data AND not navigating
      if (state.isAuthenticated && state.employer && accessToken) {
        console.log("[EmployerAuth] Already authenticated, skipping API call");
        return;
      }

      if (accessToken) {
        try {
          // Fetch fresh employer data from API
          console.log("[EmployerAuth] Fetching employer profile...");
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
          } catch (e) {
            // ignore
          }
        } catch (error) {
          console.error(
            "[EmployerAuth] Failed to fetch employer profile:",
            error
          );
          // Token might be invalid, clear auth
          employerTokenUtils.clearAuth();
          dispatch({ type: "CLEAR_EMPLOYER" });
          try {
            setCurrentUserId(null, "EMPLOYER");
          } catch (e) {
            // ignore
          }
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initAuth();

    // Listen for storage changes (e.g., logout in another tab)
    const handleStorageChange = () => {
      const accessToken = employerTokenUtils.getAccessToken();

      if (!accessToken) {
        dispatch({ type: "CLEAR_EMPLOYER" });
        try {
          setCurrentUserId(null, "EMPLOYER");
        } catch (e) {
          // ignore
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [location.pathname, state.isAuthenticated, state.employer]); // Run when pathname changes or auth state changes

  return (
    <EmployerAuthContext.Provider value={{ state, dispatch }}>
      {children}
    </EmployerAuthContext.Provider>
  );
};
