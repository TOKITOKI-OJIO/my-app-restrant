import React, { useState, useEffect } from 'react';
import { IconBook, IconUnorderedList, IconUser } from '@arco-design/web-react/icon';
import { useHistory, useLocation } from 'react-router-dom';
import './index.less';

export default function BottomNav() {
  const [active, setActive] = useState('food');
  const history = useHistory();
  const location = useLocation();

  const tabs = [
    { key: 'food', label: '点餐', icon: <IconBook />, path: '/menu' },
    { key: 'order', label: '订单', icon: <IconUnorderedList />, path: '/order' },
    { key: 'mine', label: '我的', icon: <IconUser />, path: '/mine'},
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const activeTab = tabs.find(tab => currentPath === tab.path);
    if (activeTab) {
      setActive(activeTab.key);
    }
  }, [location.pathname, tabs]);

  return (
    <div className="bottom-nav">
      {tabs.map((tab) => (
        <div
          key={tab.key}
          className={`nav-item ${active === tab.key ? 'active' : ''}`}
          onClick={() =>{
            setActive(tab.key);
            history.push(tab.path);
          }}
        >
          <div className="nav-icon">{tab.icon}</div>
          <div className="nav-label">{tab.label}</div>
          {active === tab.key && <div className="indicator" />}
        </div>
      ))}
    </div>
  );
}
