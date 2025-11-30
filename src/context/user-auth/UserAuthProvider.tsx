import type React from "react";
import { useReducer, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { UserAuthContext } from "./UserAuthContext";
import { userAuthReducer } from "./userAuth.reducer";
import { initUserAuthState } from "./userAuth.types";
import { userTokenUtils } from "@/lib/token";
import { userService } from "@/services/user.service";
import { employer_routes } from "@/routes/routes.const";
import { useWebSocket } from "@/context/websocket/WebSocketContext";

interface UserAuthProviderProps {
  children: React.ReactNode;
}

export const UserAuthProvider: React.FC<UserAuthProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(userAuthReducer, initUserAuthState);
  const location = useLocation();
  const { setCurrentUserId } = useWebSocket();

  // Initialize or re-fetch auth state when navigating to user routes
  useEffect(() => {
    const isEmployerRoute = location.pathname.startsWith(employer_routes.BASE);

    // Skip if on employer routes
    if (isEmployerRoute) {
      dispatch({ type: "SET_LOADING", payload: false });
      // Clear any user id registration in websocket if switching to employer
      try {
        setCurrentUserId(null, "EMPLOYER");
      } catch (e) {
        // ignore
      }
      return;
    }

    // Initialize auth state by fetching user profile from API
    const initAuth = async () => {
      const accessToken = userTokenUtils.getAccessToken();

      // Skip if already authenticated with user data AND not navigating
      if (state.isAuthenticated && state.user && accessToken) {
        console.log("[UserAuth] Already authenticated, skipping API call");
        return;
      }

      if (accessToken) {
        try {
          // Fetch fresh user data from API
          console.log("[UserAuth] Fetching user profile...");
          const response = await userService.getUserProfile();
          const user = response.data;

          dispatch({
            type: "SET_USER",
            payload: {
              user,
              isAuthenticated: true,
              isLoading: false,
            },
          });
          try {
            setCurrentUserId(user?.id ?? null, "USER");
          } catch (e) {
            // ignore
          }
        } catch (error) {
          console.error("[UserAuth] Failed to fetch user profile:", error);
          // Token might be invalid, clear auth
          userTokenUtils.clearAuth();
          dispatch({ type: "CLEAR_USER" });
          try {
            setCurrentUserId(null, "USER");
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
      const accessToken = userTokenUtils.getAccessToken();

      if (!accessToken) {
        dispatch({ type: "CLEAR_USER" });
        try {
          setCurrentUserId(null, "USER");
        } catch (e) {
          // ignore
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [location.pathname, state.isAuthenticated, state.user]); // Run when pathname changes or auth state changes

  return (
    <UserAuthContext.Provider value={{ state, dispatch }}>
      {children}
    </UserAuthContext.Provider>
  );
};
