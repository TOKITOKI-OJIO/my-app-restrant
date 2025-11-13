import logo from "./logo.svg";
import * as React from "react";
import "./App.css";
import NavBar from "./NavBar/NavBar";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { routes } from "./Route/index";
import { useHistory } from "react-router-dom";
// 获取平铺的路由数组
export const getFlatRoutes = (routesArr) => {
  return routesArr.reduce((flatArr, cur) => {
    flatArr.push({ ...cur, children: [] });
    if (cur.children && cur.children.length) {
      const child = cur.children;
      child.map((item) => {
        return (item["parentKey"] = cur.key);
      });
      const res = getFlatRoutes(child);
      flatArr.push(...res);
    }
    return flatArr;
  }, []);
};

export const useQueryParams = () => {
  const { search } = window.location;
  return React.useMemo(() => new URLSearchParams(search), [search]);
};

function App() {
  // 路由数组
  const flattenRoutes = getFlatRoutes(routes);
  const history = useHistory();

  // 点击菜单跳转
  const clickMenu = (key) => {
    console.log(key, "kkk");

    history.push(key);
  };

  return (
    <div className="App">
      <NavBar clickMenu={clickMenu}></NavBar>
      <Router>
        <Switch>
          {flattenRoutes.map((route) => {
            return (
              <Route
                exact
                key={route.key}
                path={route.key}
                component={route.component}
              />
            );
          })}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
