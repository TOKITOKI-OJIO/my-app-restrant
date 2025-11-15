import * as React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { routes } from '../Route/index';
import { useHistory } from 'react-router-dom';
import './index.less';
import NavBar from '@/navbar';
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

  return (
    <Router>
      <div className="my-restrant-app">
        <div className="app-content">
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
        </div>
        <div className="app-bottombar">
          <NavBar></NavBar>
        </div>
      </div>
    </Router>
  );
}

export default App;
