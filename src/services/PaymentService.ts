import axios from "axios";

import API_BASE_URL from "../config/api";

const API_URL = `${API_BASE_URL}/api/payments`;

export interface InitializePaymentResponse {
  message: string;

  payment: {
    authorizationUrl: string;
    accessCode: string;
    reference: string;
  };
}

export interface VerifyPaymentResponse {
  message: string;

  order: {
    _id: string;
    paymentStatus: string;
    orderStatus: string;
    paymentReference?: string;
    totalAmount: number;
  };
}

export const initializePayment = async (
  orderId: string,
  token: string
): Promise<InitializePaymentResponse> => {
  const response =
    await axios.post<InitializePaymentResponse>(
      `${API_URL}/initialize`,
      {
        orderId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return response.data;
};

export const verifyPayment = async (
  reference: string,
  token: string
): Promise<VerifyPaymentResponse> => {
  const response =
    await axios.get<VerifyPaymentResponse>(
      `${API_URL}/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return response.data;
};