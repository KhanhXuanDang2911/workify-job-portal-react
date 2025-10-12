const ACCESS_TOKEN = "accessToken"
const REFRESH_TOKEN = "refreshToken"
const USER_KEY = "user"

export const authUtils = {
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(REFRESH_TOKEN, refreshToken);

    window.dispatchEvent(new Event("storage"));
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN);
  },

  setUser: (user: unknown) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    window.dispatchEvent(new Event("storage"));
  },

  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  clearAuth: () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(USER_KEY);

    window.dispatchEvent(new Event("storage"));
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(ACCESS_TOKEN);
  },
};
