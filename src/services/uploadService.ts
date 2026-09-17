import axios from "axios";

import API_BASE_URL from "../config/api";

const API_URL = `${API_BASE_URL}/api/uploads`;

export interface UploadImageResponse {
  message: string;

  image: {
    url: string;
    publicId: string;
  };
}

export const uploadProductImage = async (
  file: File,
  token: string
): Promise<UploadImageResponse> => {
  const formData = new FormData();

  formData.append("image", file);

  const response =
    await axios.post<UploadImageResponse>(
      `${API_URL}/product-image`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return response.data;
};