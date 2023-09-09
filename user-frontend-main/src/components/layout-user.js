import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import NavbarUser from "./navbar-user";

const LayoutUser = () => (
  <div className="layout-user">
    <Header />
    <div className="container">
      <div className="layout__content">
        <div className="row">
          <div className="col-lg-3">
            <div className="layout__content-sidebar">
              <NavbarUser />
            </div>
          </div>
          <div className="col-lg-9">
            <div className="layout__content-detail">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default LayoutUser;
