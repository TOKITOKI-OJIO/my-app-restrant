import React from 'react';
import { Layout, Menu, Breadcrumb } from '@arco-design/web-react';
import {
  Route,
  Switch,
  useRouteMatch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import {
  IconMenu,
  IconUser,
  IconHome,
  IconSettings,
} from '@arco-design/web-react/icon';
import MenuManagement from './menu';
import './index.less';

const { Header, Content, Sider } = Layout;

const Manage: React.FC = () => {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();

  const menuItems = [
    {
      key: 'menu',
      icon: <IconMenu />,
      label: '菜单管理',
      path: `${match.path}/menu`,
    },
    // {
    //   key: 'order',
    //   icon: <IconSettings />,
    //   label: '订单管理',
    //   path: `${match.path}/order`,
    // },
    // {
    //   key: 'user',
    //   icon: <IconUser />,
    //   label: '用户管理',
    //   path: `${match.path}/user`,
    // },
  ];

  const currentKey =
    menuItems.find((item) => location.pathname.includes(item.key))?.key ||
    'menu';

  const handleMenuClick = (key: string) => {
    const item = menuItems.find((item) => item.key === key);
    if (item) {
      history.push(item.path);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="manage-header">
        <div className="manage-header-title">
          <IconHome style={{ marginRight: 8 }} />
          <span>后台管理系统</span>
        </div>
        <div className="manage-header-user">
          <span>管理员</span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="manage-sider">
          <Menu
            selectedKeys={[currentKey]}
            onClickMenuItem={(key) => handleMenuClick(key)}
            style={{ height: '100%', borderRight: 0 }}
          >
            {menuItems.map((item) => (
              <Menu.Item key={item.key}>{item.label}</Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Breadcrumb style={{ marginBottom: 24 }}>
            <Breadcrumb.Item>后台管理</Breadcrumb.Item>
            <Breadcrumb.Item>
              {menuItems.find((item) => item.key === currentKey)?.label}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              background: '#fff',
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Switch>
              <Route path={`${match.path}/menu`} component={MenuManagement} />
              <Route path={match.path} component={MenuManagement} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Manage;
