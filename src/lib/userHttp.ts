import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  AxiosError,
} from "axios";
import { userTokenUtils } from "@/lib/token";
import { routes, admin_routes } from "@/routes/routes.const";
import type { ApiError } from "@/types";
import { toast } from "react-toastify";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/workify/api/v1";

const AUTH_PATHS = {
  SIGN_IN: "/auth/users/sign-in",
  SIGN_OUT: "/auth/sign-out",
  REFRESH_TOKEN: "/auth/users/refresh-token",
  RESET_PASSWORD: "/auth/users/reset-password",
  FORGOT_PASSWORD: "/auth/users/forgot-password",
  VERIFY_EMAIL: "/auth/users/verify-email",
  AUTHENTICATE_GOOGLE: "/auth/authenticate/google",
  AUTHENTICATE_LINKEDIN: "/auth/authenticate/linkedin",
  CREATE_PASSWORD: "/auth/create-password",
};

class UserHttp {
  instance: AxiosInstance;
  private accessToken: string;
  private refreshToken: string;
  private refreshPromise: Promise<string> | null;
  private refreshFailed: boolean;

  constructor() {
    this.accessToken = userTokenUtils.getAccessToken() || "";
    this.refreshToken = userTokenUtils.getRefreshToken() || "";
    this.refreshPromise = null;
    this.refreshFailed = false;

    this.instance = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.request.use(
      (config) => {
        const currentAccessToken = userTokenUtils.getAccessToken();

        if (currentAccessToken) {
          config.headers.Authorization = `Bearer ${currentAccessToken}`;
          this.accessToken = currentAccessToken;
        }
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

    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as
          | (AxiosRequestConfig & {
              _retry?: boolean;
            })
          | undefined;

        if (originalRequest?.url === AUTH_PATHS.SIGN_OUT) {
          this.accessToken = "";
          this.refreshToken = "";
          userTokenUtils.clearAuth();
        }

        const shouldSkipRefresh =
          !originalRequest ||
          originalRequest._retry ||
          originalRequest.url === AUTH_PATHS.SIGN_IN ||
          originalRequest.url === AUTH_PATHS.SIGN_OUT ||
          originalRequest.url === AUTH_PATHS.REFRESH_TOKEN ||
          originalRequest.url === AUTH_PATHS.RESET_PASSWORD ||
          originalRequest.url === AUTH_PATHS.FORGOT_PASSWORD ||
          originalRequest.url === AUTH_PATHS.VERIFY_EMAIL ||
          originalRequest.url === AUTH_PATHS.AUTHENTICATE_GOOGLE ||
          originalRequest.url === AUTH_PATHS.AUTHENTICATE_LINKEDIN ||
          originalRequest.url === AUTH_PATHS.CREATE_PASSWORD;

        if (error.response?.status === 401 && !shouldSkipRefresh) {
          const currentRefreshToken = userTokenUtils.getRefreshToken();
          if (!currentRefreshToken) {
            return Promise.reject(error);
          }

          if (this.refreshFailed) {
            this.accessToken = "";
            this.refreshToken = "";
            userTokenUtils.clearAuth();

            window.location.href = `/${routes.SIGN_IN}`;

            return Promise.reject(error);
          }

          originalRequest._retry = true;

          if (!this.refreshPromise) {
            this.refreshPromise = (async () => {
              try {
                const response = await axios.post<{
                  status: number;
                  message: string;
                  data: { accessToken: string; refreshToken: string };
                }>(
                  `${BASE_URL}/auth/users/refresh-token`,
                  {},
                  {
                    headers: {
                      "Y-Token": this.refreshToken || currentRefreshToken,
                    },
                  }
                );

                const {
                  accessToken: newAccessToken,
                  refreshToken: newRefreshToken,
                } = response.data.data;
                this.accessToken = newAccessToken;
                this.refreshToken = newRefreshToken;
                userTokenUtils.setTokens(newAccessToken, newRefreshToken);

                return newAccessToken;
              } catch (err) {
                this.refreshFailed = true;
                this.accessToken = "";
                this.refreshToken = "";
                userTokenUtils.clearAuth();

                window.location.href = `/${routes.SIGN_IN}`;

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

const userHttpInstance = new UserHttp();
export const userHttp = userHttpInstance.instance;
export default userHttp;
