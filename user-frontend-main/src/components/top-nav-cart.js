import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import classNames from "classnames";

const TopNavCart = () => {
  const { t } = useTranslation();
  const location = useLocation();
  return (
    <ul className="cart-tabs">
      <li>
        <div
          className={classNames("cart-tabs__box", {
            active: location.pathname === "/cart",
          })}
        >
          <div className="cart-tabs__box__icon">
            <i className="bi bi-bag"></i>
          </div>
          <span>Giỏ hàng</span>
        </div>
      </li>
      <li>
        <div
          className={classNames("cart-tabs__box", {
            active: location.pathname === "/payment-confirm",
          })}
        >
          <div className="cart-tabs__box__icon">
            <i className="bi bi-receipt"></i>
          </div>
          <span>Địa chỉ giao hàng</span>
        </div>
      </li>
      <li>
        <div
          className={classNames("cart-tabs__box", {
            active: location.pathname === "/payment",
          })}
        >
          <div className="cart-tabs__box__icon">
            <i className="bi bi-credit-card-2-front"></i>
          </div>
          <span>Thanh toán</span>
        </div>
      </li>
    </ul>
  );
};
export default TopNavCart;
