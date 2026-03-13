import request from './request';
import { User } from './types';

export const userApi = {
  getAllUsers: (): Promise<User[]> => {
    return request.get('/users');
  },

  getUser: (id: number): Promise<User> => {
    return request.get(`/users/${id}`);
  },

  createUser: (data: Partial<User>): Promise<User> => {
    return request.post('/users', data);
  },

  updateUser: (id: number, data: Partial<User>): Promise<User> => {
    return request.put(`/users/${id}`, data);
  },

  deleteUser: (id: number): Promise<{ message: string }> => {
    return request.delete(`/users/${id}`);
  },
};
