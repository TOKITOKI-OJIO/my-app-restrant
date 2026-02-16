import request from './request';
import { MenuItem, ApiResponse } from './types';

export const menuApi = {
  getAllMenuItems: (): Promise<MenuItem[]> => {
    return request.get('/menu');
  },

  getMenuItem: (id: number): Promise<MenuItem> => {
    return request.get(`/menu/${id}`);
  },

  createMenuItem: (data: Partial<MenuItem>): Promise<MenuItem> => {
    return request.post('/menu', data);
  },

  updateMenuItem: (id: number, data: Partial<MenuItem>): Promise<MenuItem> => {
    return request.put(`/menu/${id}`, data);
  },

  deleteMenuItem: (id: number): Promise<{ message: string }> => {
    return request.delete(`/menu/${id}`);
  },
};
