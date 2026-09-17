import axios from "axios";

import API_BASE_URL from "../config/api";

const API_URL = `${API_BASE_URL}/api/auth`;

// ==========================================
// TYPES
// ==========================================

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
  isEmailVerified: boolean;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
  token: string;
}

export interface RegisterResponse {
  message: string;
  email: string;
  requiresEmailVerification: boolean;
}

export interface VerificationResponse {
  message: string;
}

export interface ResendVerificationResponse {
  message: string;
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// ==========================================
// REGISTER
// ==========================================

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> => {
  const response =
    await axios.post<RegisterResponse>(
      `${API_URL}/register`,
      {
        name,
        email,
        password,
      }
    );

  return response.data;
};

// ==========================================
// VERIFY EMAIL
// ==========================================

export const verifyEmail = async (
  email: string,
  code: string
): Promise<VerificationResponse> => {
  const response =
    await axios.post<VerificationResponse>(
      `${API_URL}/verify-email`,
      {
        email,
        code,
      }
    );

  return response.data;
};

// ==========================================
// RESEND VERIFICATION CODE
// ==========================================

export const resendVerification =
  async (
    email: string
  ): Promise<ResendVerificationResponse> => {
    const response =
      await axios.post<ResendVerificationResponse>(
        `${API_URL}/resend-verification`,
        {
          email,
        }
      );

    return response.data;
  };

// ==========================================
// FORGOT PASSWORD
// ==========================================

export const forgotPassword =
  async (
    email: string
  ): Promise<ForgotPasswordResponse> => {
    const response =
      await axios.post<ForgotPasswordResponse>(
        `${API_URL}/forgot-password`,
        {
          email,
        }
      );

    return response.data;
  };

// ==========================================
// RESET PASSWORD
// ==========================================

export const resetPassword =
  async (
    email: string,
    code: string,
    newPassword: string
  ): Promise<ResetPasswordResponse> => {
    const response =
      await axios.post<ResetPasswordResponse>(
        `${API_URL}/reset-password`,
        {
          email,
          code,
          newPassword,
        }
      );

    return response.data;
  };

// ==========================================
// LOGIN
// ==========================================

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response =
    await axios.post<AuthResponse>(
      `${API_URL}/login`,
      {
        email,
        password,
      }
    );

  return response.data;
};

// ==========================================
// CURRENT USER
// ==========================================

export const getCurrentUser = async (
  token: string
): Promise<{ user: AuthUser }> => {
  const response =
    await axios.get<{
      user: AuthUser;
    }>(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

  return response.data;
};