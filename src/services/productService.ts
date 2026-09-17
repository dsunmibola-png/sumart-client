import axios from "axios";
import type { Product } from "../types/product";

import API_BASE_URL from "../config/api";

const API_URL = `${API_BASE_URL}/api/products`;

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  brand: string;
  ratings?: number;
  isFeatured?: boolean;
}

export interface ProductPagination {
  page: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
  featured?: boolean;
  inStock?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  pagination: ProductPagination;
}

// Paginated products
export const getProducts = async (
  params: ProductQueryParams = {}
): Promise<ProductsResponse> => {
  const response =
    await axios.get<ProductsResponse>(
      API_URL,
      {
        params,
      }
    );

  return response.data;
};

// Keep this for older components that
// still expect Product[].
//
// It loads every page so existing pages
// do not suddenly lose products after the
// backend pagination change.
export const getAllProducts =
  async (): Promise<Product[]> => {
    const firstResponse =
      await getProducts({
        page: 1,
        limit: 100,
      });

    let products = [
      ...firstResponse.products,
    ];

    if (
      firstResponse.pagination
        .totalPages <= 1
    ) {
      return products;
    }

    const requests = [];

    for (
      let page = 2;
      page <=
      firstResponse.pagination
        .totalPages;
      page++
    ) {
      requests.push(
        getProducts({
          page,
          limit: 100,
        })
      );
    }

    const remainingResponses =
      await Promise.all(
        requests
      );

    remainingResponses.forEach(
      (response) => {
        products = [
          ...products,
          ...response.products,
        ];
      }
    );

    return products;
  };

export const getProductById =
  async (
    productId: string
  ): Promise<Product> => {
    const response =
      await axios.get<{
        product: Product;
      }>(
        `${API_URL}/${productId}`
      );

    return response.data.product;
  };

export const createProduct =
  async (
    payload: ProductPayload,
    token: string
  ): Promise<Product> => {
    const response =
      await axios.post<{
        message: string;
        product: Product;
      }>(
        API_URL,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    return response.data.product;
  };

export const updateProduct =
  async (
    productId: string,
    payload: Partial<ProductPayload>,
    token: string
  ): Promise<Product> => {
    const response =
      await axios.put<{
        message: string;
        product: Product;
      }>(
        `${API_URL}/${productId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    return response.data.product;
  };

export const deleteProduct =
  async (
    productId: string,
    token: string
  ): Promise<void> => {
    await axios.delete(
      `${API_URL}/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };