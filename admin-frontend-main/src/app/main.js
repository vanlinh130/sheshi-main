import axiosClient from "@/apis/axiosClient";
import Layout from "@/components/layout";
import { STORAGE_KEY } from "@/constants/storage-key";
import Notfound from "@/pages/404";
import Login from "@/pages/auth/login";
import Home from "@/pages/home";
import LocalStorage from "@/utils/storage";
import React from "react";
import { useSelector } from "react-redux";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  Outlet,
} from "react-router-dom";
import Init from "./init";
import User from "@/pages/user";
import UserBonus from "@/pages/user-bonus";
import ProductCategory from "@/pages/product-category";
import ProductCategoryCreate from "@/pages/product-category/modal-product-category-create";
import ProductCategoryUpdate from "@/pages/product-category/modal-product-category-update";
import Product from "@/pages/product";
import ProductCreate from "@/pages/product/product-create";
import ProductUpdate from "@/pages/product/product-update";
import Order from "@/pages/order";
import OrderView from "@/pages/order/order-view";
import ConfigData from "@/pages/config-data";
import Contact from "@/pages/contact";
import ConfigPage from "@/pages/config-page";
import ConfigRole from "@/pages/config-role";
import ConfigCommission from "@/pages/config-commission";
import ConfigLevel from "@/pages/config-level";
import ProductElement from "@/pages/product-element";
import ProductOrigin from "@/pages/product-origin";
import CommingSoon from "@/pages/comming-soon";
import News from "@/pages/news";
import NewsCreate from "@/pages/news/news-create";
import SalesStatistics from "@/pages/sales-statistics";

axiosClient.defaults.headers.common = {
  Authorization: `Bearer ${LocalStorage.get(STORAGE_KEY.TOKEN)}`,
};

function RequireAuth({ children }) {
  const { token } = useSelector((state) => state.account);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function NotRequireAuth({ children }) {
  const { token } = useSelector((state) => state.account);
  const location = useLocation();

  if (token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

const MainApp = () => (
  <Init>
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<User />} />
          <Route path="/user-bonus" element={<UserBonus />} />
          <Route path="/product-category" element={<ProductCategory />} />
          <Route
            path="/product-category/create"
            element={<ProductCategoryCreate />}
          />
          <Route
            path="/product-category/update/:id"
            element={<ProductCategoryUpdate />}
          />
          <Route path="/news" element={<News />} />
          <Route path="/news/create" element={<NewsCreate />} />
          <Route path="/news/update/:id" element={<NewsCreate />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product-attribute" element={<ProductElement />} />
          <Route path="/product-origin" element={<ProductOrigin />} />
          <Route path="/product/create" element={<ProductCreate />} />
          <Route path="/product/update/:id" element={<ProductUpdate />} />
          <Route path="/order" element={<Order />} />
          <Route path="/order-new" element={<CommingSoon />} />
          <Route path="/sales-statistics" element={<SalesStatistics />} />
          <Route path="/order-detail/:orderCode" element={<OrderView />} />
          <Route path="/config-data" element={<ConfigData />} />
          <Route path="/config-page" element={<ConfigPage />} />
          <Route path="/config-role" element={<ConfigRole />} />
          <Route path="/config-commission" element={<ConfigCommission />} />
          <Route path="/config-level" element={<ConfigLevel />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route
          element={
            <NotRequireAuth>
              <Outlet />
            </NotRequireAuth>
          }
        >
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/not-found" element={<Notfound />} />
        <Route path="*" element={<Navigate to="/not-found" />} />
      </Routes>
    </BrowserRouter>
  </Init>
);

export default MainApp;
