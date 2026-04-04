import * as React from 'react';

export type IRoute = {
  name: string;
  key: string;
  // 当前页是否展示面包屑
  breadcrumb?: boolean;
  children?: IRoute[];
  // 当前路由是否渲染菜单项，为 true 的话不会在菜单中显示，但可通过路由地址访问。
  ignore?: boolean;
  component: React.FC;
  level?: number;
  [prop: string]: any;
};
import Main from '@/pages/main.tsx';
import Order from '@/pages/order/main.tsx';
import Menu from '@/pages/menu';
import Manage from '@/pages/manage';
import MenuDetail from '@/pages/menu/detail';
import Cart from '@/pages/cart';
import OrderConfirm from '@/pages/order/confirm';
import OrderDetail from '@/pages/order/detail';

export const routes: IRoute[] = [
  {
    name: 'main',
    key: `/`,
    component: Menu,
  },
  {
    name: 'menu',
    key: `/menu`,
    component: Menu,
  },
  {
    name: 'menu-detail',
    key: `/menu/detail`,
    component: MenuDetail,
  },
  {
    name: 'cart',
    key: `/cart`,
    component: Cart,
  },
  {
    name: 'order-confirm',
    key: `/order/confirm`,
    component: OrderConfirm,
  },
  {
    name: 'order',
    key: `/order`,
    component: Order,
  },
  {
    name: 'order-detail',
    key: `/order/:id`,
    component: OrderDetail,
  },
  {
    name: 'manage',
    key: `/mine`,
    component: Manage,
  },
];