// DATA_MODELS.ts
// TypeScript interfaces representing the PostgreSQL database schemas and API responses

export interface User {
  id: number;
  name: string;
  role?: 'customer' | 'admin';
}

export interface Product {
  product_id: number;
  product_name: string;
  price: string; // Decimal from Postgres comes as string
  description: string;
  stock_quantity: number;
  category_name: string;
}

export interface CartItem {
  product_id: number;
  product_name: string;
  price: string;
  quantity: number;
  total: string;
}

export interface Order {
  order_id: number;
  order_date: string; // ISO String
  total_amount: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: string; // Comma separated list of product names
}

// Payloads

export interface CheckoutPayload {
  paymentMethod: 'Credit Card' | 'Debit Card' | 'PayPal' | 'Net Banking' | 'Cash on Delivery';
}

export interface AddToCartPayload {
  productId: number;
  quantity: number;
}
