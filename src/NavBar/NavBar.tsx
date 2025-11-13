import * as React from "react";
import { Typography, Card, Tabs } from "@arco-design/web-react";

import { useHistory, useLocation } from "react-router-dom";

const TabPane = Tabs.TabPane;

export default function NavBar(props) {
  const history = useHistory();
  const location = useLocation();

  const [activeTab, setActiveTab] = React.useState("main");

  console.log(history, location);

  // 点击菜单跳转
  const { clickMenu } = props;

  return (
    <Tabs activeTab={activeTab} onChange={clickMenu}>
      <TabPane key="main" title="main"></TabPane>
      <TabPane key="about" title="about"></TabPane>
    </Tabs>
  );
}
