import { orderApi } from '@/api';
import { Button, Card, Descriptions, Skeleton, Tag, Empty } from '@arco-design/web-react';
import React, { useEffect, useState } from 'react';
import './index.less';

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
  user?: {
    name: string;
    phone?: string;
  };
  total: number;
  status: string;
  address?: string;
  phone?: string;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export default function OrderDetail(props) {
  const { id } = props.match.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 获取订单详情
  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    setError(false);
    try {
      const orderDetail = await orderApi.getOrder(Number(id));
      setOrder(orderDetail);
    } catch (error) {
      console.error('获取订单详情失败:', error);
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
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // 返回订单列表
  const handleBack = () => {
    props.history.push('/order');
  };

  if (loading) {
    return (
      <div className="order-detail-page">
        <div className="order-detail-container">
          <div className="page-header">
            <h1>订单详情</h1>
          </div>
          <Card className="order-detail-card">
            <Skeleton animation />
            <Skeleton animation />
            <Skeleton animation />
            <Skeleton animation />
          </Card>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-detail-page">
        <div className="order-detail-container">
          <div className="page-header">
            <h1>订单详情</h1>
          </div>
          <div className="error-container">
            <Empty description="获取订单详情失败" />
            <Button type="primary" onClick={fetchOrderDetail}>
              重新加载
            </Button>
            <Button onClick={handleBack}>
              返回订单列表
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <div className="order-detail-container">
        <div className="page-header">
          <h1>订单详情</h1>
          <Button type="text" onClick={handleBack}>
            返回
          </Button>
        </div>

        <Card className="order-detail-card">
          {/* 订单基本信息 */}
          <div className="order-info-section">
            <h3>订单信息</h3>
            <Descriptions column={1}>
              <Descriptions.Item label="订单号">
                #{order.id}
              </Descriptions.Item>
              <Descriptions.Item label="订单状态">
                {getStatusTag(order.status)}
              </Descriptions.Item>
              <Descriptions.Item label="下单时间">
                {formatDateTime(order.created_at)}
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                {formatDateTime(order.updated_at)}
              </Descriptions.Item>
            </Descriptions>
          </div>

          {/* 用户信息 */}
          <div className="user-info-section">
            <h3>用户信息</h3>
            <Descriptions column={1}>
              <Descriptions.Item label="用户ID">
                {order.user_id}
              </Descriptions.Item>
              <Descriptions.Item label="用户姓名">
                {order.user?.name || '未知'}
              </Descriptions.Item>
              {/* <Descriptions.Item label="联系电话">
                {order.phone || order.user?.phone || '未填写'}
              </Descriptions.Item>
              <Descriptions.Item label="收货地址">
                {order.address || '未填写'}
              </Descriptions.Item> */}
            </Descriptions>
          </div>

          {/* 菜品信息 */}
          <div className="items-info-section">
            <h3>菜品信息</h3>
            {order.items && order.items.length > 0 ? (
              <div className="items-list">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-info">
                      <div className="item-name">{item.menu_item?.name || `菜品 ${item.menu_item_id}`}</div>
                      <div className="item-quantity">x{item.quantity}</div>
                    </div>
                    <div className="item-price">¥{item.price.toFixed(2)}</div>
                    <div className="item-total">¥{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty description="暂无菜品信息" />
            )}
          </div>

          {/* 订单金额 */}
          <div className="amount-section">
            <h3>订单金额</h3>
            <div className="amount-summary">
              <div className="summary-item">
                <span className="summary-label">订单总额：</span>
                <span className="summary-value">¥{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}