import "@/locales/i18n";
// import 'bootstrap/dist/css/bootstrap.min.css';
import "@/resources/styles/antd-custom.less";
import "@/resources/styles/index.scss";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import MainApp from "./app/main";
import store from "./store";
import { ConfigProvider } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';

const container = document.getElementById("application");
const root = createRoot(container);
// App
root.render(
  // <React.StrictMode>
  <ConfigProvider locale={viVN}>
    <Provider store={store}>
      <MainApp />
    </Provider>
  </ConfigProvider>
  // </React.StrictMode>
);
