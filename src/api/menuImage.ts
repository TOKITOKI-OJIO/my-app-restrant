import request from './request';
import { MenuImage } from './types';

export const menuImageApi = {
  getAllMenuImages: (params?: { menu_item_id?: number }): Promise<MenuImage[]> => {
    return request.get('/menu-images', { params });
  },

  getMenuImage: (id: number): Promise<MenuImage> => {
    return request.get(`/menu-images/${id}`);
  },

  createMenuImage: (data: Partial<MenuImage>): Promise<MenuImage> => {
    return request.post('/menu-images', data);
  },

  updateMenuImage: (id: number, data: Partial<MenuImage>): Promise<MenuImage> => {
    return request.put(`/menu-images/${id}`, data);
  },

  deleteMenuImage: (id: number): Promise<{ message: string }> => {
    return request.delete(`/menu-images/${id}`);
  },

  setPrimaryImage: (id: number): Promise<{ message: string }> => {
    return request.put(`/menu-images/${id}/set-primary`);
  },
};
