import { Product } from './product';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type PaymentMethod = 'cash_on_delivery' | 'mobile_money' | 'bank_transfer';

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  delivery_region?: string;
  delivery_district?: string;
  subtotal: number;
  delivery_fee: number;
  tax: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  notes?: string;
  admin_notes?: string;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_sku?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface CreateOrderData {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  delivery_region?: string;
  delivery_district?: string;
  payment_method: PaymentMethod;
  notes?: string;
  items: {
    product_id: number;
    quantity: number;
  }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
