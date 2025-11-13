import * as React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { routes } from '../Route/index';
import { useHistory } from 'react-router-dom';
import './index.less';
// 获取平铺的路由数组
export const getFlatRoutes = (routesArr) => {
  return routesArr.reduce((flatArr, cur) => {
    flatArr.push({ ...cur, children: [] });
    if (cur.children && cur.children.length) {
      const child = cur.children;
      child.map((item) => {
        return (item['parentKey'] = cur.key);
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

  const [key, setKey] = React.useState(1);
  // 点击菜单跳转
  const clickMenu = (url) => {
    console.log(key, 'kkk');

    setKey(key + 1);
    history.push(url);
  };

  console.log('flattenRoutes', flattenRoutes);

  return (
    <Router>
      <div className="web-site-app" data-user-loaded id={'web-site-app'}>
        <Switch>
          {flattenRoutes.map((route) => {
            return (
              <Route
                exact
                key={route.key + key}
                path={route.key}
                component={route.component}
              />
            );
          })}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
