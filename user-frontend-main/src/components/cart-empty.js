import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "@/components/button";
const CartEmpty = () => {
  const { t } = useTranslation();
  return (
    <div className="cart-empty">
      <div className="cart-empty__img">
        <i className="bi bi-inbox"></i>
      </div>
      <div className="cart-empty__text">
        Chưa có sản phẩm nào trong giỏ hàng.
      </div>

      <Link to="/san-pham">
        <Button className="btn-primary">Quay trở lại cửa hàng</Button>
      </Link>
    </div>
  );
};
export default CartEmpty;
