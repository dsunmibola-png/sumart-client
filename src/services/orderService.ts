import axios from "axios";

import API_BASE_URL from "../config/api";

const API_URL = `${API_BASE_URL}/api/orders`;

export interface CreateOrderPayload {
  items: {
    productId: string;
    quantity: number;
  }[];

  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };

  paymentMethod:
    | "card"
    | "delivery";
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;

  user: string;

  items: OrderItem[];

  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };

  paymentMethod:
    | "card"
    | "delivery";

  paymentStatus:
    | "pending"
    | "paid"
    | "failed";

  orderStatus:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

  totalAmount: number;

  paymentReference?: string;

  paidAt?: string;

  processedAt?: string;

  shippedAt?: string;

  deliveredAt?: string;

  cancelledAt?: string;

  createdAt: string;

  updatedAt: string;
}

export const createOrder = async (
  payload: CreateOrderPayload,
  token: string
) => {
  const response =
    await axios.post(
      API_URL,
      payload,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;
};

export const getMyOrders = async (
  token: string
): Promise<Order[]> => {
  const response =
    await axios.get<{
      orders: Order[];
    }>(
      `${API_URL}/my-orders`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data.orders;
};

export const getOrderById = async (
  orderId: string,
  token: string
): Promise<Order> => {
  const response =
    await axios.get<{
      order: Order;
    }>(
      `${API_URL}/${orderId}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data.order;
};