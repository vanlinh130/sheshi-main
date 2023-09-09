import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import ProductViewModal from "./product-view-modal";
import { useSelector } from "react-redux";

const LayoutNormal = () => {
  const productSlug = useSelector((state) => state.productModal.value);
  return (
    <div className="layout-normal">
      <Header />
      <div className="layout__content">
        <Outlet />
      </div>
      <Footer />
      {productSlug && <ProductViewModal />}
    </div>
  );
};

export default LayoutNormal;
