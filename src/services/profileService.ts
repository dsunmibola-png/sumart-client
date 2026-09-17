import axios from "axios";

import type {
  AuthUser,
} from "./authService";

import API_BASE_URL from "../config/api";

const API_URL = `${API_BASE_URL}/api`;

// ==========================================
// UPDATE PROFILE RESPONSE
// ==========================================

export interface UpdateProfileResponse {
  message: string;

  user: AuthUser;

  /*
   * true when the customer changed
   * their email address and must
   * verify the new one.
   */
  requiresEmailVerification:
    boolean;

  /*
   * Only returned when a new email
   * needs verification.
   */
  verificationEmail?: string;
}

// ==========================================
// UPLOAD AVATAR RESPONSE
// ==========================================

interface UploadAvatarResponse {
  message: string;
  avatar: string;
  user: AuthUser;
}

// ==========================================
// UPDATE PROFILE
// ==========================================

export const updateProfile = async (
  token: string,
  data: {
    name: string;
    email: string;
  }
): Promise<UpdateProfileResponse> => {
  const response =
    await axios.patch<UpdateProfileResponse>(
      `${API_URL}/users/profile`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return response.data;
};

// ==========================================
// UPLOAD AVATAR
// ==========================================

export const uploadAvatar = async (
  token: string,
  file: File
): Promise<UploadAvatarResponse> => {
  const formData =
    new FormData();

  formData.append(
    "image",
    file
  );

  const response =
    await axios.post<UploadAvatarResponse>(
      `${API_URL}/uploads/avatar`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return response.data;
};

// ==========================================
// DELETE ACCOUNT RESPONSE
// ==========================================

interface DeleteAccountResponse {
  message: string;
}

// ==========================================
// DELETE ACCOUNT
// ==========================================

export const deleteAccount = async (
  token: string,
  password: string
): Promise<DeleteAccountResponse> => {
  const response =
    await axios.delete<DeleteAccountResponse>(
      `${API_URL}/users/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },

        data: {
          password,
        },
      }
    );

  return response.data;
};