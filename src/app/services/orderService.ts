import api from './api';
import { CreateOrderData, Order } from '../types/order';

export const orderService = {
  create: async (data: CreateOrderData): Promise<{ order_number: string; total: number }> => {
    const response = await api.post('/orders', data);
    return {
      order_number: response.data.data.order_number,
      total: parseFloat(response.data.data.total),
    };
  },

  getByOrderNumber: async (orderNumber: string, phone: string): Promise<Order | null> => {
    try {
      const response = await api.get(`/orders/${orderNumber}`, {
        params: { phone }
      });
      const order = response.data.data;
      return {
        ...order,
        total: Number(order.total),
        subtotal: Number(order.subtotal),
        delivery_fee: Number(order.delivery_fee),
        items: order.items.map((item: any) => ({
          ...item,
          unit_price: Number(item.unit_price),
          subtotal: Number(item.subtotal),
        })),
      };
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  },

  // Admin methods
  getAll: async (params?: any): Promise<{ data: Order[]; meta: any }> => {
    const response = await api.get('/admin/orders', { params });
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  updateStatus: async (id: number, status: string, notes?: string): Promise<void> => {
    await api.put(`/admin/orders/${id}/status`, {
      order_status: status,
      admin_notes: notes
    });
  },

  updatePayment: async (id: number, status: string): Promise<void> => {
    await api.put(`/admin/orders/${id}/payment`, {
      payment_status: status
    });
  }
};
