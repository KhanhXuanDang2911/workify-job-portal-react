import { authUtils } from "@/lib/auth";
import { employer_routes, routes } from "@/routes/routes.const";
import { authService } from "@/services";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

          let response;
          if (isEmployerApp) {
            response = await authService.refreshTokenEmployer(refreshToken);
          } else {
            response = await authService.refreshTokenUser(refreshToken);
          }

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
        window.location.href = isEmployerApp ? `${employer_routes.BASE}/${employer_routes.SIGN_IN}` : `/${routes.SIGN_IN}`;
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default http;
