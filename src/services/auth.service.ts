import publicHttp from "@/lib/publicHttp";
import userHttp from "@/lib/userHttp";
import employerHttp from "@/lib/employerHttp";
import type { ApiResponse, User, Employer } from "@/types";

export const authService = {
  // User Sign Up
  signUp: async (data: {
    fullName: string;
    email: string;
    password: string;
  }): Promise<ApiResponse> => {
    const response = await publicHttp.post<ApiResponse>("/users/sign-up", data);
    return response.data;
  },

  // User Sign In
  signIn: async (data: {
    email: string;
    password: string;
  }): Promise<
    ApiResponse<{ accessToken: string; refreshToken: string; data: User }>
  > => {
    const response = await publicHttp.post<
      ApiResponse<{ accessToken: string; refreshToken: string; data: User }>
    >("/auth/users/sign-in", data);
    return response.data;
  },

  // Employer Sign In
  signInEmployer: async (data: {
    email: string;
    password: string;
  }): Promise<
    ApiResponse<{ accessToken: string; refreshToken: string; data: Employer }>
  > => {
    const response = await publicHttp.post<
      ApiResponse<{ accessToken: string; refreshToken: string; data: Employer }>
    >("/auth/employers/sign-in", data);
    return response.data;
  },

  // Sign Out (User/Admin)
  signOut: async (
    accessToken: string,
    refreshToken: string
  ): Promise<ApiResponse<null>> => {
    const response = await publicHttp.post<ApiResponse<null>>(
      "/auth/sign-out",
      {},
      {
        headers: {
          "X-Token": accessToken,
          "Y-Token": refreshToken,
        },
      }
    );
    return response.data;
  },

  // Sign Out Employer
  signOutEmployer: async (
    accessToken: string,
    refreshToken: string
  ): Promise<ApiResponse<null>> => {
    const response = await publicHttp.post<ApiResponse<null>>(
      "/auth/sign-out",
      {},
      {
        headers: {
          "X-Token": accessToken,
          "Y-Token": refreshToken,
        },
      }
    );
    return response.data;
  },

  // Verify Email
  verifyEmail: async (
    token: string,
    role: "users" | "employers"
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await publicHttp.patch<ApiResponse<{ message: string }>>(
      `/auth/${role}/verify-email`,
      {},
      {
        headers: {
          "C-Token": token,
        },
      }
    );
    return response.data;
  },

  // Change Password (requires authentication)
  changePassword: async (
    data: { currentPassword: string; newPassword: string },
    role: "users" | "employers" | "admins"
  ): Promise<ApiResponse<{ message: string }>> => {
    let httpClient;
    if (role === "users") {
      httpClient = userHttp;
    } else if (role === "employers") {
      httpClient = employerHttp;
    } else {
      // For admins, we'll use userHttp (or create adminHttp if needed)
      httpClient = userHttp;
    }

    const response = await httpClient.patch<ApiResponse<{ message: string }>>(
      `/${role}/me/password`,
      data
    );
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (
    email: string,
    role: "users" | "employers"
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await publicHttp.post<ApiResponse<{ message: string }>>(
      `/auth/${role}/forgot-password`,
      { email }
    );
    return response.data;
  },

  // Reset Password
  resetPassword: async (
    token: string,
    newPassword: string,
    role: "users" | "employers"
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await publicHttp.post<ApiResponse<{ message: string }>>(
      `/auth/${role}/reset-password`,
      { newPassword },
      {
        headers: {
          "R-Token": token,
        },
      }
    );
    return response.data;
  },

  // Google Login (User)
  googleLogin: async (
    authorizationCode: string
  ): Promise<
    ApiResponse<{
      accessToken?: string;
      refreshToken?: string;
      data?: User;
      createPasswordToken?: string;
    }>
  > => {
    const response = await publicHttp.post<
      ApiResponse<{
        accessToken?: string;
        refreshToken?: string;
        data?: User;
        createPasswordToken?: string;
      }>
    >(
      "/auth/authenticate/google",
      {},
      {
        headers: {
          "G-Code": authorizationCode,
        },
      }
    );
    return response.data;
  },

  // LinkedIn Login (User)
  linkedInLogin: async (
    authorizationCode: string
  ): Promise<
    ApiResponse<{
      accessToken?: string;
      refreshToken?: string;
      data?: User;
      createPasswordToken?: string;
    }>
  > => {
    const response = await publicHttp.post<
      ApiResponse<{
        accessToken?: string;
        refreshToken?: string;
        data?: User;
        createPasswordToken?: string;
      }>
    >(
      "/auth/authenticate/linkedin",
      {},
      {
        headers: {
          "L-Code": authorizationCode,
        },
      }
    );
    return response.data;
  },

  // Create Password (for social login users)
  createPassword: async (
    token: string,
    password: string
  ): Promise<
    ApiResponse<{ accessToken: string; refreshToken: string; data: User }>
  > => {
    const response = await publicHttp.post<
      ApiResponse<{ accessToken: string; refreshToken: string; data: User }>
    >(
      "/auth/create-password",
      { password },
      {
        headers: {
          "CR-Token": token,
        },
      }
    );
    return response.data;
  },

  // Refresh Token - User
  refreshTokenUser: async (
    refreshToken: string
  ): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> => {
    const response = await publicHttp.post<
      ApiResponse<{ accessToken: string; refreshToken: string }>
    >(
      "/auth/users/refresh-token",
      {},
      {
        headers: {
          "Y-Token": refreshToken,
        },
      }
    );
    return response.data;
  },

  // Refresh Token - Employer
  refreshTokenEmployer: async (
    refreshToken: string
  ): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> => {
    const response = await publicHttp.post<
      ApiResponse<{ accessToken: string; refreshToken: string }>
    >(
      "/auth/employers/refresh-token",
      {},
      {
        headers: {
          "Y-Token": refreshToken,
        },
      }
    );
    return response.data;
  },
};
