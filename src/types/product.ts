export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  brand: string;
  ratings: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}