import { authUtils } from "@/lib/auth";
import { admin_routes, employer_routes, routes } from "@/routes/routes.const";
import { authService } from "@/services";
import axios from "axios";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BASE_URL = "http://localhost:8080/workify/api/v1"

export const http = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  (config) => {
    const accessToken = authUtils.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    console.log("Request:", config);
    return config;
  },
  (error) => {
    console.log("Request error:", error);
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  async (error) => {
    console.log("Response Error:", error);
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = authUtils.getRefreshToken();

        if (refreshToken) {
          const isEmployerApp = window.location.pathname.startsWith(`${employer_routes.BASE}`);
          const isAdmin = window.location.pathname.startsWith(`${admin_routes.BASE}`);

          const response = isEmployerApp ? await authService.refreshTokenEmployer(refreshToken) : await authService.refreshTokenUser(refreshToken);

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          authUtils.setTokens(accessToken, newRefreshToken || refreshToken);

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${accessToken}`,
          };

          return http(originalRequest);
        }
      } catch (refreshError) {
        console.error("refreshError:", refreshError);

        authUtils.clearAuth();
        const isEmployerApp = window.location.pathname.startsWith(`${employer_routes.BASE}`);
        const isAdmin = window.location.pathname.startsWith(`${admin_routes.BASE}`);
        if (isAdmin) {
          window.location.href = `${admin_routes.BASE}/${admin_routes.SIGN_IN}`;
        } else if (isEmployerApp) {
          window.location.href = `${employer_routes.BASE}/${employer_routes.SIGN_IN}`;
        } else {
          window.location.href = `/${routes.SIGN_IN}`;
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default http;
