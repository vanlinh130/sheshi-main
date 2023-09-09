import React from "react";
import LayoutAuth from "@/components/layout-auth";
import LayoutNormal from "@/components/layout-normal";
import LayoutUser from "@/components/layout-user";
import { ROLE } from "@/constants";
import ForgotPassword from "@/pages/auth/forgot-password";
import Login from "@/pages/auth/login";
import SignUpUser from "@/pages/auth/register-user";
import Home from "@/pages/home";
import Page from "@/pages/page";
import Search from "@/pages/search";
import Catalog from "@/pages/catalog";
import Product from "@/pages/product";
import Cart from "@/pages/cart";
import ConfirmPayment from "@/pages/cart/payment-confirm";
import Payment from "@/pages/cart/payment";
import PaymentSuccess from "@/pages/cart/payment-success";
import Profile from "@/pages/profile";
import MyOrder from "@/pages/my-order";
import Contact from "@/pages/contact";
import MyOrderDetail from "@/pages/my-order/detail";
import Promotion from "@/pages/promotion";
import Referral from "@/pages/referral";
import Notfound from "@/pages/404";
import AboutUs from "@/pages/about-us";
import Academy from "@/pages/academy";
import Recruitment from "@/pages/recruitment";

import { useSelector } from "react-redux";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import OrderSearchDetails from "@/pages/my-order/detailSearch";
import { checkConditionLevelUp } from "@/utils/funcs";
import MyBonus from "@/pages/my-bonus";
import News from "@/pages/news";
import ListNews from "@/pages/list-news";

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

function RouteWithCondition({ children, condition, redirect }) {
  const location = useLocation();

  if (condition()) {
    return children;
  }

  return <Navigate to={redirect} state={{ from: location }} replace />;
}

const MainRouter = () => {
  const { info } = useSelector((state) => state.account);

  if (info) {
    checkConditionLevelUp(info)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <NotRequireAuth>
              <LayoutAuth />
            </NotRequireAuth>
          }
        >
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/sign-up/" element={<SignUpUser />} />
          <Route path="/sign-up/:referralCode" element={<SignUpUser />} />
        </Route>
        <Route
          element={
            <RequireAuth>
              <LayoutUser />
            </RequireAuth>
          }
        >
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/referral"
            element={
              <RequireAuth>
                <Referral />
              </RequireAuth>
            }
          />
          <Route
            path="/my-order"
            element={
              <RequireAuth>
                <MyOrder />
              </RequireAuth>
            }
          />
          <Route
            path="/my-bonus"
            element={
              <RequireAuth>
                <MyBonus />
              </RequireAuth>
            }
          />
          <Route
            path="/my-order/:slug"
            element={
              <RequireAuth>
                <MyOrderDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/promotions"
            element={
              <RequireAuth>
                <Promotion />
              </RequireAuth>
            }
          />
        </Route>
        <Route element={<LayoutNormal />}>
          <Route path="/" element={<Home />} />
          <Route path="/search-order" element={<OrderSearchDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment-confirm" element={<ConfirmPayment />} />
          <Route path="/payment" element={<Payment />} />
          <Route
            path="/payment-success/:orderCode"
            element={<PaymentSuccess />}
          />
          <Route path="/san-pham" element={<Catalog />} />
          <Route path="/san-pham/:slug" element={<Product />} />
          <Route path="/:slug" element={<Page />} />
          <Route path="/search" element={<Search />} />
          <Route path="/lien-he" element={<Contact />} />
          <Route path="/gioi-thieu" element={<AboutUs />} />
          <Route path="/hoc-vien-dao-tao-sheshi" element={<Academy />} />
          <Route path="/tin-tuc" element={<ListNews />} />
          <Route path="/tin-tuc/:slug" element={<News />} />
          <Route path="/tuyen-dung" element={<Recruitment />} />
          <Route path="/not-found" element={<Notfound />} />
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default MainRouter;
