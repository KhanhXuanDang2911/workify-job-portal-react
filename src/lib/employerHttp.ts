import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  AxiosError,
} from "axios";
import { employerTokenUtils } from "@/lib/token";
import { employer_routes } from "@/routes/routes.const";
import type { ApiError } from "@/types";
import { toast } from "react-toastify";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/workify/api/v1";

// Auth API paths that should NOT trigger refresh token
const AUTH_PATHS = {
  SIGN_IN: "/auth/employers/sign-in",
  SIGN_OUT: "/auth/sign-out",
  REFRESH_TOKEN: "/auth/employers/refresh-token",
  RESET_PASSWORD: "/auth/employers/reset-password",
  FORGOT_PASSWORD: "/auth/employers/forgot-password",
  VERIFY_EMAIL: "/auth/employers/verify-email",
};

class EmployerHttp {
  instance: AxiosInstance;
  private accessToken: string;
  private refreshToken: string;
  private refreshPromise: Promise<string> | null;
  private refreshFailed: boolean;

  constructor() {
    this.accessToken = employerTokenUtils.getAccessToken() || "";
    this.refreshToken = employerTokenUtils.getRefreshToken() || "";
    this.refreshPromise = null;
    this.refreshFailed = false;

    this.instance = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor - Add employer access token
    this.instance.interceptors.request.use(
      (config) => {
        // Always read fresh token from localStorage instead of using cached value
        const currentAccessToken = employerTokenUtils.getAccessToken();

        if (currentAccessToken) {
          config.headers.Authorization = `Bearer ${currentAccessToken}`;
          this.accessToken = currentAccessToken; // Update cached value
        }
        // Don't set Content-Type for FormData - let browser/axios set it with boundary
        // Only delete if not explicitly set in config
        if (
          config.data instanceof FormData &&
          !config.headers["Content-Type"]
        ) {
          delete config.headers["Content-Type"];
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle token refresh
    this.instance.interceptors.response.use(
      (response) => {
        // Note: Sign-in tokens are handled by EmployerSignIn page component
        // Note: Sign-out tokens are handled by EmployerHeader/Sidebar components
        // Only update internal instance tokens for refresh flow

        return response;
      },
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as
          | (AxiosRequestConfig & {
              _retry?: boolean;
            })
          | undefined;

        // Always clear tokens on sign-out error
        if (originalRequest?.url === AUTH_PATHS.SIGN_OUT) {
          this.accessToken = "";
          this.refreshToken = "";
          employerTokenUtils.clearAuth();
        }

        // Check if should skip refresh token
        const shouldSkipRefresh =
          !originalRequest ||
          originalRequest._retry ||
          originalRequest.url === AUTH_PATHS.SIGN_IN ||
          originalRequest.url === AUTH_PATHS.SIGN_OUT ||
          originalRequest.url === AUTH_PATHS.REFRESH_TOKEN ||
          originalRequest.url === AUTH_PATHS.RESET_PASSWORD ||
          originalRequest.url === AUTH_PATHS.FORGOT_PASSWORD ||
          originalRequest.url === AUTH_PATHS.VERIFY_EMAIL;

        // Handle 401 - Unauthorized (token expired)
        if (error.response?.status === 401 && !shouldSkipRefresh) {
          // If refresh already failed, clear auth and redirect
          if (this.refreshFailed) {
            this.accessToken = "";
            this.refreshToken = "";
            employerTokenUtils.clearAuth();
            window.location.href = `${employer_routes.BASE}/${employer_routes.SIGN_IN}`;
            return Promise.reject(error);
          }

          originalRequest._retry = true;

          // Create refresh promise if not exists
          if (!this.refreshPromise) {
            this.refreshPromise = (async () => {
              try {
                // Call refresh token API
                const response = await axios.post<{
                  status: number;
                  message: string;
                  data: { accessToken: string; refreshToken: string };
                }>(
                  `${BASE_URL}/auth/employers/refresh-token`,
                  {},
                  {
                    headers: {
                      "Y-Token": this.refreshToken,
                    },
                  }
                );

                const {
                  accessToken: newAccessToken,
                  refreshToken: newRefreshToken,
                } = response.data.data;
                this.accessToken = newAccessToken;
                this.refreshToken = newRefreshToken;
                employerTokenUtils.setTokens(newAccessToken, newRefreshToken);

                return newAccessToken;
              } catch (err) {
                this.refreshFailed = true;
                this.accessToken = "";
                this.refreshToken = "";
                employerTokenUtils.clearAuth();
                window.location.href = `${employer_routes.BASE}/${employer_routes.SIGN_IN}`;
                toast.error("Phiên đăng nhập hết hạn");
                throw err;
              } finally {
                this.refreshPromise = null;
              }
            })();
          }

          try {
            const token = await this.refreshPromise;
            if (originalRequest?.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return this.instance(originalRequest!);
          } catch (err) {
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      }
    );
  }
}

const employerHttpInstance = new EmployerHttp();
export const employerHttp = employerHttpInstance.instance;
export default employerHttp;
