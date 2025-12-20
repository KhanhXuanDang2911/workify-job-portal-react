import type React from "react";
import { useReducer, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { UserAuthContext } from "./UserAuthContext";
import { userAuthReducer } from "./UserAuthReducer";
import { initUserAuthState } from "./UserAuthTypes";
import { userTokenUtils } from "@/lib/token";
import { userService } from "@/services/user.service";
import { employer_routes } from "@/routes/routes.const";
import { useWebSocket } from "@/context/WebSocket/WebSocketContext";

interface UserAuthProviderProps {
  children: React.ReactNode;
}

export const UserAuthProvider: React.FC<UserAuthProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(userAuthReducer, initUserAuthState);
  const location = useLocation();
  const { setCurrentUserId } = useWebSocket();

  useEffect(() => {
    const isEmployerRoute = location.pathname.startsWith(employer_routes.BASE);

    if (isEmployerRoute) {
      dispatch({ type: "SET_LOADING", payload: false });

      try {
        setCurrentUserId(null, "EMPLOYER");
      } catch (e) {}
      return;
    }

    const initAuth = async () => {
      const accessToken = userTokenUtils.getAccessToken();

      if (state.isAuthenticated && state.user && accessToken) {
        return;
      }

      if (accessToken) {
        try {
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
          } catch (e) {}
        } catch (error) {
          userTokenUtils.clearAuth();
          dispatch({ type: "CLEAR_USER" });
          try {
            setCurrentUserId(null, "USER");
          } catch (e) {}
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initAuth();

    const handleStorageChange = () => {
      const accessToken = userTokenUtils.getAccessToken();

      if (!accessToken) {
        dispatch({ type: "CLEAR_USER" });
        try {
          setCurrentUserId(null, "USER");
        } catch (e) {}
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [location.pathname, state.isAuthenticated, state.user]);

  return (
    <UserAuthContext.Provider value={{ state, dispatch }}>
      {children}
    </UserAuthContext.Provider>
  );
};
