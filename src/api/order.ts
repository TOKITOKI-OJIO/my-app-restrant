import request from './request';
import { Order, CreateOrderParams } from './types';

export const orderApi = {
  getAllOrders: (): Promise<Order[]> => {
    return request.get('/orders');
  },

  getOrder: (id: number): Promise<Order> => {
    return request.get(`/orders/${id}`);
  },

  createOrder: (data: CreateOrderParams): Promise<Order> => {
    return request.post('/orders', data);
  },

  updateOrder: (id: number, data: Partial<Order>): Promise<Order> => {
    return request.put(`/orders/${id}`, data);
  },

  deleteOrder: (id: number): Promise<{ message: string }> => {
    return request.delete(`/orders/${id}`);
  },
};
