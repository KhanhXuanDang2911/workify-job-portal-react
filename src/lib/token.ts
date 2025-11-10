// User token keys (path: /)
const USER_ACCESS_TOKEN = "user_access_token";
const USER_REFRESH_TOKEN = "user_refresh_token";

// Employer token keys (path: /employer)
const EMPLOYER_ACCESS_TOKEN = "employer_access_token";
const EMPLOYER_REFRESH_TOKEN = "employer_refresh_token";

/**
 * Token utilities for User (Job Seeker & Admin)
 * Only stores tokens, user data will be fetched from API
 */
export const userTokenUtils = {
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(USER_ACCESS_TOKEN, accessToken);
    localStorage.setItem(USER_REFRESH_TOKEN, refreshToken);
    window.dispatchEvent(new Event("storage"));
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem(USER_ACCESS_TOKEN);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(USER_REFRESH_TOKEN);
  },

  clearAuth: () => {
    localStorage.removeItem(USER_ACCESS_TOKEN);
    localStorage.removeItem(USER_REFRESH_TOKEN);
    window.dispatchEvent(new Event("storage"));
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(USER_ACCESS_TOKEN);
  },
};

/**
 * Token utilities for Employer
 * Only stores tokens, employer data will be fetched from API
 */
export const employerTokenUtils = {
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(EMPLOYER_ACCESS_TOKEN, accessToken);
    localStorage.setItem(EMPLOYER_REFRESH_TOKEN, refreshToken);
    window.dispatchEvent(new Event("storage"));
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem(EMPLOYER_ACCESS_TOKEN);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(EMPLOYER_REFRESH_TOKEN);
  },

  clearAuth: () => {
    localStorage.removeItem(EMPLOYER_ACCESS_TOKEN);
    localStorage.removeItem(EMPLOYER_REFRESH_TOKEN);
    window.dispatchEvent(new Event("storage"));
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(EMPLOYER_ACCESS_TOKEN);
  },
};
