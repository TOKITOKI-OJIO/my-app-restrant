import { cartUtils } from '@/utils/cart';
import {
  Button,
  Checkbox,
  Empty,
  Input,
  Modal,
  Message,
} from '@arco-design/web-react';
import React, { useEffect, useState } from 'react';
import './index.less';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  quantity: number;
  spec?: string;
}

export default function CartPage(props) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderForm, setOrderForm] = useState({
    address: '',
    phone: '',
  });

  // 加载购物车数据
  useEffect(() => {
    loadCartData();
  }, []);

  // 加载购物车数据
  const loadCartData = () => {
    const items = cartUtils.getCart();
    setCartItems(items);
  };

  // 选择/取消选择商品
  const handleSelectItem = (itemId: number) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // 全选/取消全选
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSelectedItems(newSelectAll ? cartItems.map((item) => item.id) : []);
  };

  // 更新商品数量
  const handleUpdateQuantity = (itemId: number, quantity: number) => {
    cartUtils.updateQuantity(itemId, quantity);
    loadCartData();
  };

  // 删除商品
  const handleRemoveItem = (itemId: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个商品吗？',
      onOk: () => {
        cartUtils.removeFromCart(itemId);
        loadCartData();
        Message.success('删除成功');
      },
    });
  };

  // 清空购物车
  const handleClearCart = () => {
    Modal.confirm({
      title: '确认清空',
      content: '确定要清空购物车吗？',
      onOk: () => {
        cartUtils.clearCart();
        loadCartData();
        setSelectedItems([]);
        setSelectAll(false);
        Message.success('购物车已清空');
      },
    });
  };

  // 计算选中商品的总价
  const getSelectedTotalPrice = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // 计算选中商品的总数量
  const getSelectedTotalQuantity = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.quantity, 0);
  };

  // 提交订单
  const handleSubmitOrder = () => {
    if (selectedItems.length === 0) {
      Message.warning('请选择要购买的商品');
      return;
    }

    

    // 构建订单数据
    const orderData = {
      items: cartItems
        .filter((item) => selectedItems.includes(item.id))
        .map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
        })),
      address: orderForm.address,
      phone: orderForm.phone,
    };

    // 保存订单数据到 localStorage，供订单页面使用
    localStorage.setItem('pending_order', JSON.stringify(orderData));

    // 清空购物车中已购买的商品
    const remainingCart = cartItems.filter(
      (item) => !selectedItems.includes(item.id),
    );
    cartUtils.saveCart(remainingCart);

    // 跳转到订单确认页面
    props.history.push('/order/confirm');
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>购物车</h1>
          <Button type="text" onClick={handleClearCart}>
            清空购物车
          </Button>
        </div>

        {cartItems.length === 0 ? (
          <Empty description="购物车是空的" />
        ) : (
          <>
            {/* 全选栏 */}
            <div className="select-all-bar">
              <Checkbox checked={selectAll} onChange={handleSelectAll}>
                全选
              </Checkbox>
              <span className="select-info">
                已选择 {getSelectedTotalQuantity()} 件商品
              </span>
            </div>

            {/* 商品列表 */}
            <div className="cart-items">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`cart-item ${selectedItems.includes(item.id) ? 'selected' : ''}`}
                >
                  <div className="item-left">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                    />
                    <img
                      src={item.image_url || ''}
                      alt={item.name}
                      className="item-image"
                    />
                    <div className="item-info">
                      <div className="item-name">{item.name}</div>
                      <div className="item-spec">{item.spec}</div>
                      <div className="item-price">¥{item.price.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="item-right">
                    <div className="quantity-control">
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span className="quantity-num">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <div className="item-total">
                      ¥{(item.price * item.quantity).toFixed(2)}
                    </div>
                    <Button
                      type="text"
                      status="danger"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      删除
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* 底部操作栏 */}
            <div className="cart-footer">
              <div className="footer-left">
                <div className="total-price">
                  <span className="price-label">合计：</span>
                  <span className="price-value">
                    ¥{getSelectedTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="footer-right">
                <Button
                  type="primary"
                  size="large"
                  onClick={() => setShowOrderModal(true)}
                  disabled={selectedItems.length === 0}
                >
                  结算 ({selectedItems.length})
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 订单确认弹窗 */}
      <Modal
        title="确认订单"
        visible={showOrderModal}
        onOk={handleSubmitOrder}
        onCancel={() => setShowOrderModal(false)}
        okText="提交订单"
        cancelText="取消"
        width={600}
      >
        <div className="order-form">
          <div className="order-summary">
            <div className="summary-item">
              <span className="summary-label">商品数量：</span>
              <span className="summary-value">
                {getSelectedTotalQuantity()} 件
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">订单总额：</span>
              <span className="summary-value price">
                ¥{getSelectedTotalPrice().toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
