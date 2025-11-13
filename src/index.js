import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "@arco-themes/react-ocean-design/css/arco.css";

import "@ccf2e/arco-material/dist/css/index.css";
// 引入该文件后，业务不需要单独添加iconfont依赖的文件
import "@ccf2e/arco-material/lib/style/css.js";
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
