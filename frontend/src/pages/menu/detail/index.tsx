import { menuApi } from '@/api';
import { getUrlParams2 } from '@/utils/commonUtils';
import { cartUtils } from '@/utils/cart';
import {
  Button,
  Carousel,
  Skeleton,
  Badge,
  Empty,
  Message,
  Typography,
  Card,
  Tag,
  Space,
  Divider,
} from '@arco-design/web-react';
import React, { useEffect, useMemo, useState } from 'react';
import './index.less';

export default function MenuDetail(props) {
  const id = getUrlParams2().id;

  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 状态管理：数量、选中规格、是否收藏
  const [count, setCount] = useState(1);
  const [selectedSpec, setSelectedSpec] = useState('中杯');
  const [isCollect, setIsCollect] = useState(false);

  // 数量增减
  const handleMinus = () => count > 1 && setCount(count - 1);
  const handlePlus = () => setCount(count + 1);

  // 切换收藏状态
  const handleCollect = () => setIsCollect(!isCollect);

  // 加入购物车
  const handleAddToCart = () => {
    if (!detail) return;
    
    const cartItem = {
      id: detail.id,
      name: detail.name,
      price: detail.price,
      image_url: detail.image_url,
      quantity: count,
      spec: selectedSpec,
    };
    
    cartUtils.addToCart(cartItem);
    Message.success(`已将 ${count} 份 ${detail.name} 加入购物车`);
  };

  // 立即购买
  const handleBuyNow = () => {
    if (!detail) return;
    
    // 直接跳转到购物车页面
    props.history.push('/cart');
  };

  // 获取菜品详情
  useEffect(() => {
    setLoading(true);
    setError(false);

    menuApi
      .getMenuItem(id)
      .then((res) => {
        setDetail(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
        console.log(err);
      });
  }, [id]);

  // 图片列表
  const imageSrc = useMemo(() => {
    return detail?.images?.map((item) => item.url) || [];
  }, [detail]);

  // 加载状态
  if (loading) {
    return (
      <div className="menu-detail-container">
        <Skeleton animation />
        <Skeleton animation />
        <Skeleton animation />
        <Skeleton animation />
      </div>
    );
  }

  // 错误状态
  if (error || !detail) {
    return (
      <div className="menu-detail-container error-container">
        <Empty description="获取菜品详情失败" />
        <Button type="primary" onClick={() => window.location.reload()}>
          重新加载
        </Button>
      </div>
    );
  }

  return (
    <div className="menu-detail-wrapper">
      {/* 顶部返回按钮和收藏按钮 */}
      <div className="top-bar">
        <Button
          shape="circle"
          icon={<span className="icon-back">←</span>}
          onClick={() => props.history.goBack()}
          className="back-btn"
        />
        <Button
          shape="circle"
          icon={
            <span className={`icon-collect ${isCollect ? 'active' : ''}`}>
              ★
            </span>
          }
          onClick={handleCollect}
          className="collect-btn"
        />
      </div>

      {/* 菜品图片轮播 */}
      <div className="image-section">
        <Carousel
          autoPlay
          animation="slide"
          showArrow={imageSrc.length > 1}
          className="menu-image-carousel"
        >
          {imageSrc.length > 0 ? (
            imageSrc.map((src, index) => (
              <div key={index} className="carousel-item">
                <img src={src} alt={`${detail.name} - 图片 ${index + 1}`} />
              </div>
            ))
          ) : (
            <div className="carousel-item">
              <div className="no-image">暂无图片</div>
            </div>
          )}
        </Carousel>
        {imageSrc.length > 1 && (
          <div className="carousel-indicator">
            {imageSrc.map((_, index) => (
              <span
                key={index}
                className={`indicator-dot ${index === 0 ? 'active' : ''}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 菜品基础信息 */}
      <Card className="menu-info-section" style={{ borderRadius: '12px', marginTop: '16px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {/* 标题和价格 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography.Title heading={2} style={{ margin: 0, fontSize: '24px' }}>{detail.name}</Typography.Title>
            {detail.price > 0 && (
              <Typography.Text type="primary" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                ¥{detail.price.toFixed(2)}
              </Typography.Text>
            )}
          </div>

          {/* 分类标签 */}
          {detail.category && (
            <Tag color="blue" style={{ display: 'inline-block', marginBottom: '16px' }}>
              {detail.category}
            </Tag>
          )}

          {/* 菜品描述 */}
          <Divider plain />
          <Typography.Paragraph strong>做法说明：</Typography.Paragraph>
          <Typography.Text style={{ fontSize: '16px', color: '#333', lineHeight: '24px' }}>
            {detail.description || '-'}
          </Typography.Text>
        </Space>
      </Card>

      {/* 分割线 */}
      <div className="divider"></div>

      {/* 食材信息 */}
      <Card className="ingredients-section" style={{ borderRadius: '12px', marginTop: '16px' }}>
        <Typography.Paragraph strong>所需食材：</Typography.Paragraph>
        <Typography.Text style={{ fontSize: '16px', color: '#333' }}>{detail.ingredients || '-'}</Typography.Text>
      </Card>

      {/* 分割线 */}
      <div className="divider"></div>

      {/* 数量选择 */}
      <Card className="count-section" style={{ borderRadius: '12px', marginTop: '16px' }}>
        <Typography.Paragraph strong>购买数量：</Typography.Paragraph>
        <Space size={0} style={{ justifyContent: 'center' }}>
          <Button 
            shape="circle" 
            onClick={handleMinus}
            disabled={count <= 1}
            style={{ width: '40px', height: '40px' }}
          >
            -
          </Button>
          <Typography.Text style={{ fontSize: '20px', fontWeight: 'bold', minWidth: '32px', textAlign: 'center' }}>{count}</Typography.Text>
          <Button 
            shape="circle" 
            onClick={handlePlus}
            style={{ width: '40px', height: '40px' }}
          >
            +
          </Button>
        </Space>
      </Card>

      {/* 底部操作栏 */}
      <div className="action-bar">
        <div className="action-left">
          <div className="total-price">
            <span className="price-label">合计：</span>
            <span className="price-value">
              ¥{(detail.price * count).toFixed(2)}
            </span>
          </div>
        </div>
        <div className="action-right">
          <button className="cart-btn" onClick={handleAddToCart}>
            加入购物车
          </button>
          <button className="buy-btn" onClick={handleBuyNow}>
            立即购买
          </button>
        </div>
      </div>
    </div>
  );
}
