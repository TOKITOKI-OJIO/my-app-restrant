import Main from "../components/Main/Main";
import About from "../components/About/About";

const routePrefix = "";

export type IRoute = {
  name: string;
  key: string;
  // 当前页是否展示面包屑
  breadcrumb?: boolean;
  children?: IRoute[];
  // 当前路由是否渲染菜单项，为 true 的话不会在菜单中显示，但可通过路由地址访问。
  ignore?: boolean;
  component: React.FC;
  level?: number;
  [prop: string]: any;
};

export const routes: IRoute[] = [
  {
    name: "main",
    key: `${routePrefix}/index`,
    component: Main,
  },
  {
    name: "main",
    key: `${routePrefix}/main`,
    component: Main,
  },
  {
    name: "about",
    key: `${routePrefix}/about`,
    component: About,
  },
];
