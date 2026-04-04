import { orderApi } from '@/api';
import { Button, Card, Descriptions, List, Skeleton, Tag, Empty } from '@arco-design/web-react';
import React, { useEffect, useState } from 'react';
import './main.less';

interface OrderItem {
  id: number;
  menu_item_id: number;
  quantity: number;
  price: number;
  menu_item?: {
    name: string;
    image_url?: string;
  };
}

interface Order {
  id: number;
  user_id: number;
  total: number;
  status: string;
  address?: string;
  phone?: string;
  items?: OrderItem[];
  created_at: string;
}

export default function Order(props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 获取今日订单
  useEffect(() => {
    fetchTodayOrders();
  }, []);

  const fetchTodayOrders = async () => {
    setLoading(true);
    setError(false);
    try {
      const allOrders = await orderApi.getAllOrders();
      // 筛选今日订单
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayOrders = allOrders.filter((order) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= today;
      });
      
      setOrders(todayOrders);
    } catch (error) {
      console.error('获取订单失败:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // 获取订单状态标签
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'pending':
        return <Tag color="orange">待处理</Tag>;
      case 'processing':
        return <Tag color="blue">处理中</Tag>;
      case 'completed':
        return <Tag color="green">已完成</Tag>;
      case 'cancelled':
        return <Tag color="red">已取消</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // 格式化日期时间
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 跳转到订单详情
  const handleViewOrder = (orderId: number) => {
    props.history.push(`/order/${orderId}`);
  };

  if (loading) {
    return (
      <div className="order-page">
        <div className="order-container">
          <div className="page-header">
            <h1>今日订单</h1>
          </div>
          <div className="order-list">
            {Array(3).fill(0).map((_, index) => (
              <Card key={index} className="order-card">
                <Skeleton animation />
                <Skeleton animation />
                <Skeleton animation />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-page">
        <div className="order-container">
          <div className="page-header">
            <h1>今日订单</h1>
          </div>
          <div className="error-container">
            <Empty description="获取订单失败" />
            <Button type="primary" onClick={fetchTodayOrders}>
              重新加载
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <div className="order-container">
        <div className="page-header">
          <h1>今日订单</h1>
          <Button type="text" onClick={fetchTodayOrders}>
            刷新
          </Button>
        </div>

        {orders.length === 0 ? (
          <Empty description="今日暂无订单" />
        ) : (
          <List className="order-list">
            {orders.map((order) => (
              <Card key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-id">订单号: #{order.id}</div>
                  <div className="order-time">{formatDateTime(order.created_at)}</div>
                </div>
                
                <div className="order-status">
                  {getStatusTag(order.status)}
                </div>
                
                <div className="order-items">
                  <h3>菜品列表</h3>
                  {order.items && order.items.length > 0 ? (
                    <div className="items-list">
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <div className="item-info">
                            <div className="item-name">{item.menu_item?.name || `菜品 ${item.menu_item_id}`}</div>
                            <div className="item-quantity">x{item.quantity}</div>
                          </div>
                          <div className="item-price">¥{(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty description="暂无菜品信息" />
                  )}
                </div>
                
                <div className="order-summary">
                  <div className="summary-item">
                    <span className="summary-label">收货地址：</span>
                    <span className="summary-value">{order.address || '未填写'}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">联系电话：</span>
                    <span className="summary-value">{order.phone || '未填写'}</span>
                  </div>
                  <div className="summary-item total">
                    <span className="summary-label">订单总额：</span>
                    <span className="summary-value">¥{order.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="order-actions">
                  <Button type="primary" onClick={() => handleViewOrder(order.id)}>
                    查看详情
                  </Button>
                </div>
              </Card>
            ))}
          </List>
        )}
      </div>
    </div>
  );
}