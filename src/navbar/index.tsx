import React, { useState } from 'react';
import { IconBook, IconUnorderedList, IconUser } from '@arco-design/web-react/icon';
import './index.less';

export default function BottomNav() {
  const [active, setActive] = useState('food');

  const tabs = [
    { key: 'food', label: '点餐', icon: <IconBook /> },
    { key: 'order', label: '订单', icon: <IconUnorderedList /> },
    { key: 'mine', label: '我的', icon: <IconUser />},
  ];

  return (
    <div className="bottom-nav">
      {tabs.map((tab) => (
        <div
          key={tab.key}
          className={`nav-item ${active === tab.key ? 'active' : ''}`}
          onClick={() => setActive(tab.key)}
        >
          <div className="nav-icon">{tab.icon}</div>
          <div className="nav-label">{tab.label}</div>
          {active === tab.key && <div className="indicator" />}
        </div>
      ))}
    </div>
  );
}
