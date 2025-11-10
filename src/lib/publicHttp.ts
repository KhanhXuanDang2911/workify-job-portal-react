import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/workify/api/v1";

/**
 * HTTP client for public endpoints (no authentication required)
 * Used for sign up, sign in, forgot password, etc.
 */
export const publicHttp = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
publicHttp.interceptors.request.use(
  (config) => {
    // Don't set Content-Type for FormData - let browser/axios set it with boundary
    // Only delete if not explicitly set in config
    if (config.data instanceof FormData && !config.headers["Content-Type"]) {
      delete config.headers["Content-Type"];
    }
    console.log("[Public HTTP] Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("[Public HTTP] Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
publicHttp.interceptors.response.use(
  (response) => {
    console.log("[Public HTTP] Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("[Public HTTP] Response error:", error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);

export default publicHttp;
