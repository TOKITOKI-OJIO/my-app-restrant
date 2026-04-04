import { orderApi } from '@/api';
import { Button, Card, Table, Tag, Modal, Input, Select, DatePicker, Message } from '@arco-design/web-react';
import React, { useEffect, useState } from 'react';
import './index.less';

interface OrderItem {
  id: number;
  menu_item_id: number;
  quantity: number;
  price: number;
  menu_item?: {
    name: string;
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
  updated_at: string;
}

export default function OrderManage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchParams, setSearchParams] = useState({
    status: '',
    startDate: null,
    endDate: null,
  });

  // 获取所有订单
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const allOrders = await orderApi.getAllOrders();
      setOrders(allOrders);
    } catch (error) {
      console.error('获取订单失败:', error);
      Message.error('获取订单失败');
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
    });
  };

  // 查看订单详情
  const handleViewDetail = (order: Order) => {
    setCurrentOrder(order);
    setShowDetailModal(true);
  };

  // 更新订单状态
  const handleUpdateStatus = async (orderId: number, status: string) => {
    try {
      await orderApi.updateOrder(orderId, { status });
      Message.success('订单状态更新成功');
      fetchOrders();
    } catch (error) {
      console.error('更新订单状态失败:', error);
      Message.error('更新订单状态失败');
    }
  };

  // 删除订单
  const handleDeleteOrder = (orderId: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个订单吗？',
      onOk: async () => {
        try {
          await orderApi.deleteOrder(orderId);
          Message.success('订单删除成功');
          fetchOrders();
        } catch (error) {
          console.error('删除订单失败:', error);
          Message.error('删除订单失败');
        }
      },
    });
  };

  // 表格列配置
  const columns = [
    {
      title: '订单号',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => `#${id}`,
    },
    {
      title: '用户ID',
      dataIndex: 'user_id',
      key: 'user_id',
    },
    {
      title: '订单总额',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `¥${total.toFixed(2)}`,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '下单时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (createdAt: string) => formatDateTime(createdAt),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: Order) => (
        <div className="order-actions">
          <Button type="text" onClick={() => handleViewDetail(record)}>
            详情
          </Button>
          <Select
            defaultValue={record.status}
            style={{ width: 120, margin: '0 8px' }}
            onChange={(value) => handleUpdateStatus(record.id, value)}
          >
            <Select.Option value="pending">待处理</Select.Option>
            <Select.Option value="processing">处理中</Select.Option>
            <Select.Option value="completed">已完成</Select.Option>
            <Select.Option value="cancelled">已取消</Select.Option>
          </Select>
          <Button type="text" status="danger" onClick={() => handleDeleteOrder(record.id)}>
            删除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="order-manage">
      <div className="page-header">
        <h1>订单管理</h1>
        <Button type="primary" onClick={fetchOrders}>
          刷新
        </Button>
      </div>

      <Card className="search-card">
        <div className="search-form">
          <Select
            placeholder="订单状态"
            style={{ width: 120, marginRight: 16 }}
            value={searchParams.status}
            onChange={(value) => setSearchParams({ ...searchParams, status: value })}
          >
            <Select.Option value="">全部</Select.Option>
            <Select.Option value="pending">待处理</Select.Option>
            <Select.Option value="processing">处理中</Select.Option>
            <Select.Option value="completed">已完成</Select.Option>
            <Select.Option value="cancelled">已取消</Select.Option>
          </Select>
          <DatePicker.RangePicker
            style={{ width: 300, marginRight: 16 }}
            value={[searchParams.startDate, searchParams.endDate]}
            onChange={(value) => setSearchParams({
              ...searchParams,
              startDate: value?.[0] || null,
              endDate: value?.[1] || null,
            })}
          />
          <Button type="primary">搜索</Button>
        </div>
      </Card>

      <Card className="order-table-card">
        <Table
          columns={columns}
          data={orders}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 订单详情弹窗 */}
      <Modal
        title="订单详情"
        visible={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowDetailModal(false)}>
            关闭
          </Button>,
        ]}
        width={700}
      >
        {currentOrder && (
          <div className="order-detail">
            <div className="detail-section">
              <h3>基本信息</h3>
              <div className="detail-item">
                <span className="detail-label">订单号：</span>
                <span className="detail-value">#{currentOrder.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">用户ID：</span>
                <span className="detail-value">{currentOrder.user_id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">订单状态：</span>
                <span className="detail-value">{getStatusTag(currentOrder.status)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">下单时间：</span>
                <span className="detail-value">{formatDateTime(currentOrder.created_at)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">更新时间：</span>
                <span className="detail-value">{formatDateTime(currentOrder.updated_at)}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>收货信息</h3>
              <div className="detail-item">
                <span className="detail-label">收货地址：</span>
                <span className="detail-value">{currentOrder.address || '未填写'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">联系电话：</span>
                <span className="detail-value">{currentOrder.phone || '未填写'}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>菜品信息</h3>
              {currentOrder.items && currentOrder.items.length > 0 ? (
                <div className="items-list">
                  {currentOrder.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-name">{item.menu_item?.name || `菜品 ${item.menu_item_id}`}</div>
                      <div className="item-quantity">x{item.quantity}</div>
                      <div className="item-price">¥{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-items">暂无菜品信息</div>
              )}
            </div>

            <div className="detail-section total-section">
              <div className="total-item">
                <span className="total-label">订单总额：</span>
                <span className="total-value">¥{currentOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}