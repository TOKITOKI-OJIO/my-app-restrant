import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Form,
  Modal,
  Message,
  Card,
  Space,
  Upload,
  Icon,
  Tag,
  Alert,
  Skeleton,
  InputNumber,
} from '@arco-design/web-react';
import { menuApi, menuImageApi } from '@/api';
import { MenuItem, MenuImage } from '@/api/types';
import { categorys as categories } from '@/const';

const { Option } = Select;
const { Search } = Input;

const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // 图片上传状态
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<MenuImage[]>([]);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const items = await menuApi.getAllMenuItems();
      setMenuItems(items);
    } catch (error) {
      Message.error('获取菜单列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async (menuItemId: number) => {
    try {
      const menuImages = await menuImageApi.getAllMenuImages({
        menu_item_id: menuItemId,
      });
      setImages(menuImages);
    } catch (error) {
      console.error('获取图片失败:', error);
    }
  };

  const handleAdd = () => {
    setCurrentItem(null);
    setImages([]);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (item: MenuItem) => {
    setCurrentItem(item);
    form.setFieldsValue({
      name: item.name,
      description: item.description,
      ingredients: item.ingredients,
      price: item.price,
      category: item.category,
      available: item.available,
    });
    fetchImages(item.id);
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个菜单吗？',
      onOk: async () => {
        try {
          await menuApi.deleteMenuItem(id);
          Message.success('删除成功');
          fetchMenuItems();
        } catch (error) {
          Message.error('删除失败');
          console.error(error);
        }
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validate();

      if (currentItem) {
        // 编辑
        await menuApi.updateMenuItem(currentItem.id, values);
        Message.success('更新成功');
      } else {
        // 添加
        await menuApi.createMenuItem(values);
        Message.success('添加成功');
      }

      setModalVisible(false);
      fetchMenuItems();
    } catch (error) {
      Message.error('操作失败');
      console.error(error);
    }
  };

  const handleImageUpload = async (file: any) => {
    setUploading(true);
    try {
      if (!currentItem) {
        Message.error('请先保存菜单');
        return;
      }

      // 这里应该上传到服务器，暂时使用模拟数据
      const mockImage: MenuImage = {
        id: Date.now(),
        menu_item_id: currentItem.id,
        url: URL.createObjectURL(file),
        sorter: images.length + 1,
        is_primary: images.length === 0,
        name: file.name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const newImage = await menuImageApi.createMenuImage(mockImage);
      setImages([...images, newImage]);
      Message.success('图片上传成功');
    } catch (error) {
      Message.error('图片上传失败');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id: number) => {
    try {
      await menuImageApi.deleteMenuImage(id);
      setImages(images.filter((img) => img.id !== id));
      Message.success('图片删除成功');
    } catch (error) {
      Message.error('图片删除失败');
      console.error(error);
    }
  };

  const handleSetPrimary = async (id: number) => {
    try {
      await menuImageApi.setPrimaryImage(id);
      setImages(
        images.map((img) => ({
          ...img,
          is_primary: img.id === id,
        })),
      );
      Message.success('设置主图成功');
    } catch (error) {
      Message.error('设置主图失败');
      console.error(error);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '名称',
      dataIndex: 'name',
      sorter: (a: MenuItem, b: MenuItem) => a.name.localeCompare(b.name),
    },
    {
      title: '价格',
      dataIndex: 'price',
      width: 100,
      render: (price: number) => `¥${price.toFixed(2)}`,
      sorter: (a: MenuItem, b: MenuItem) => a.price - b.price,
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 120,
      render: (category: string) => <Tag color="arcoblue">{category}</Tag>,
      filters: categories.map((cat) => ({ text: cat, value: cat })),
      onFilter: (value: string, record: MenuItem) => record.category === value,
    },
    {
      title: '状态',
      dataIndex: 'available',
      width: 100,
      render: (available: boolean) => (
        <Tag color={available ? 'green' : 'red'}>
          {available ? '在售' : '下架'}
        </Tag>
      ),
    },
    {
      title: '操作',
      width: 200,
      render: (_, record: MenuItem) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            color="danger"
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card
        title="菜单管理"
        extra={
          <Button type="primary" onClick={handleAdd}>
            添加菜单
          </Button>
        }
      >
        <div style={{ marginBottom: 20, display: 'flex', gap: 10 , justifyContent: 'space-between'}}>
          <div>
            <Search
              placeholder="搜索菜单名称"
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e)}
            />
            <Select
              placeholder="选择分类"
              style={{ width: 150 }}
              value={categoryFilter}
              onChange={(value) => setCategoryFilter(value)}
            >
              <Option value="">全部</Option>
              {categories.map((cat) => (
                <Option key={cat} value={cat}>
                  {cat}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <Button type="primary" onClick={() => fetchMenuItems()}>
              刷新
            </Button>
          </div>
        </div>

        {loading ? (
          <Skeleton />
        ) : filteredItems.length === 0 ? (
          <Alert
            type="info"
            content="暂无菜单数据"
            style={{ margin: '20px 0' }}
          />
        ) : (
          <Table
            columns={columns}
            data={filteredItems}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>

      <Modal
        title={currentItem ? '编辑菜单' : '添加菜单'}
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="菜单名称"
            field="name"
            rules={[{ required: true, message: '请输入菜单名称' }]}
          >
            <Input placeholder="请输入菜单名称" />
          </Form.Item>

          <Form.Item label="描述" field="description">
            <Input.TextArea placeholder="请输入菜单描述" rows={3} />
          </Form.Item>

          <Form.Item label="食材" field="ingredients">
            <Input.TextArea placeholder="请输入食材配料" rows={3} />
          </Form.Item>

          <Form.Item
            label="价格"
            field="price"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber type="number" placeholder="请输入价格" />
          </Form.Item>

          <Form.Item
            label="分类"
            field="category"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              {categories.map((cat) => (
                <Option key={cat} value={cat}>
                  {cat}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="状态" field="available">
            <Select placeholder="请选择状态">
              <Option value={true}>在售</Option>
              <Option value={false}>下架</Option>
            </Select>
          </Form.Item>

          <Form.Item label="图片管理">
            <div style={{ marginBottom: 10 }}>
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={handleImageUpload}
              >
                <Button type="primary">上传图片</Button>
              </Upload>
            </div>

            {images.length > 0 ? (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {images.map((image) => (
                  <div
                    key={image.id}
                    style={{ position: 'relative', width: 100, height: 100 }}
                  >
                    <img
                      src={image.url}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      alt={image.name}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        background: 'rgba(0,0,0,0.5)',
                        padding: 2,
                      }}
                    >
                      <Button
                        size="mini"
                        type={image.is_primary ? 'primary' : 'default'}
                        onClick={() => handleSetPrimary(image.id)}
                      >
                        主图
                      </Button>
                      <Button
                        size="mini"
                        color="danger"
                        style={{ marginLeft: 5 }}
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#999' }}>暂无图片</div>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MenuManagement;
