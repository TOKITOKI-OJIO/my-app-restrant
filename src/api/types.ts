export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image_url?: string;
  available: boolean;
  images?: MenuImage[];
  created_at: string;
  updated_at: string;
}

export interface MenuImage {
  id: number;
  menu_item_id: number;
  url: string;
  sorter: number;
  is_primary: boolean;
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  price: number;
  menu_item?: MenuItem;
}

export interface Order {
  id: number;
  user_id: number;
  user?: User;
  total: number;
  status: string;
  address?: string;
  phone?: string;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateOrderParams {
  user_id: number;
  items: {
    menu_item_id: number;
    quantity: number;
  }[];
  address?: string;
  phone?: string;
}
