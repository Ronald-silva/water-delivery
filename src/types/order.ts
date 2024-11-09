export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'IN_DELIVERY' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'money' | 'card' | 'pix';

export interface OrderFormData {
  customerName: string;
  phone: string;
  address: string;
  items: number;
  paymentMethod: PaymentMethod;
  changeAmount?: number;
  notes?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  total: number;
  notes?: string;
}