import React from "react";
import { Outlet } from "react-router-dom";
import Page from "./page";
import Header from "./header";
import Footer from "./footer";
import TopNavAuth from "./top-nav-auth";

const LayoutAuth = () => (
  <div className="layout-normal">
    <Header />
    <div className="layout__content">
      <Outlet />
    </div>
    <Footer />
  </div>
);

export default LayoutAuth;
