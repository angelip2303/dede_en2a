import type { AlertColor } from "@mui/material/Alert";

export type User = {
  name: string;
  webId: string;
  email: string;
  password: string;
};

export type Product = {
  code: string;
  name: string;
  description: string;
  price: number;
  stock: number;
};

export type NotificationType = {
  severity: AlertColor;
  message: string;
};

export type CartItem = {
  product: Product;
  amount: number;
};

export type OrderProduct = {
  code: string;
  amount: number;
};

export type Order = {
  orderCode: string;
  userEmail: string;
  products: OrderProduct[];
  totalPrice: number;
  shippingPrice: number;
  isOrderReceived: boolean;
};

export type Review = {
  userEmail: string;
  productCode: string;
  rating: number;
  comment: string;
};
