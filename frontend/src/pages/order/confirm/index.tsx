import { orderApi } from '@/api';
import { Button, Card, Descriptions, Steps, Message } from '@arco-design/web-react';
import React, { useEffect, useState } from 'react';
import './index.less';

interface OrderItem {
  menu_item_id: number;
  quantity: number;
  price?: number;
  name?: string;
  image_url?: string;
}

interface OrderFormData {
  items: OrderItem[];
  address: string;
  phone: string;
}

export default function OrderConfirmPage(props) {
  const [orderData, setOrderData] = useState<OrderFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // 加载订单数据
  useEffect(() => {
    const pendingOrder = localStorage.getItem('pending_order');
    if (pendingOrder) {
      try {
        const parsedOrder = JSON.parse(pendingOrder);
        setOrderData(parsedOrder);
      } catch (error) {
        console.error('解析订单数据失败:', error);
        Message.error('订单数据错误');
        props.history.push('/cart');
      }
    } else {
      Message.warning('没有待确认的订单');
      props.history.push('/cart');
    }
  }, []);

  // 提交订单
  const handleSubmitOrder = async () => {
    if (!orderData) return;

    setLoading(true);
    try {
      // 构建订单数据，添加用户ID（这里假设用户ID为1，实际应该从登录状态获取）
      const orderPayload = {
        ...orderData,
        user_id: 1, // TODO: 从登录状态获取用户ID
      };

      const order = await orderApi.createOrder(orderPayload);
      
      // 清除待确认订单数据
      localStorage.removeItem('pending_order');
      
      Message.success('订单提交成功！');
      
      // 跳转到订单详情页面
      props.history.push(`/order/${order.id}`);
    } catch (error) {
      console.error('提交订单失败:', error);
      Message.error('提交订单失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 计算订单总额
  const calculateTotal = () => {
    if (!orderData) return 0;
    return orderData.items.reduce((total, item) => {
      const itemPrice = item.price || 0;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  // 计算商品总数
  const calculateTotalQuantity = () => {
    if (!orderData) return 0;
    return orderData.items.reduce((total, item) => total + item.quantity, 0);
  };

  // 返回购物车
  const handleBackToCart = () => {
    props.history.push('/cart');
  };

  if (!orderData) {
    return null;
  }

  return (
    <div className="order-confirm-page">
      <div className="confirm-container">
        <div className="page-header">
          <h1>确认订单</h1>
          <Button type="text" onClick={handleBackToCart}>
            返回购物车
          </Button>
        </div>

        {/* 订单进度 */}
        <div className="steps-section">
          <Steps current={1}>
            <Steps.Step title="购物车" />
            <Steps.Step title="确认订单" />
            <Steps.Step title="支付" />
            <Steps.Step title="完成" />
          </Steps>
        </div>

        {/* 商品信息 */}
        <Card title="商品信息" className="info-card">
          <div className="order-items">
            {orderData.items.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-left">
                  <img
                    src={item.image_url || ''}
                    alt={item.name}
                    className="item-image"
                  />
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-price">¥{(item.price || 0).toFixed(2)}</div>
                  </div>
                </div>
                <div className="item-right">
                  <div className="item-quantity">x{item.quantity}</div>
                  <div className="item-total">
                    ¥{((item.price || 0) * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="order-summary">
            <div className="summary-row">
              <span className="summary-label">商品数量：</span>
              <span className="summary-value">{calculateTotalQuantity()} 件</span>
            </div>
            <div className="summary-row total">
              <span className="summary-label">订单总额：</span>
              <span className="summary-value">¥{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* 收货信息 */}
        {/* <Card title="收货信息" className="info-card">
          <Descriptions column={1}>
            <Descriptions.Item label="收货地址">
              {orderData.address}
            </Descriptions.Item>
            <Descriptions.Item label="联系电话">
              {orderData.phone}
            </Descriptions.Item>
          </Descriptions>
        </Card> */}

        {/* 底部操作栏 */}
        <div className="action-bar">
          <div className="action-left">
            <div className="total-price">
              <span className="price-label">合计：</span>
              <span className="price-value">¥{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          <div className="action-right">
            <Button
              type="primary"
              size="large"
              onClick={handleSubmitOrder}
              loading={loading}
            >
              提交订单
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}