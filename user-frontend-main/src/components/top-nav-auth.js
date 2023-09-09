import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TopNavAuth = () => {
  const { t } = useTranslation();
  const location = useLocation();
  return (
    <div className="top-nav-auth-component">
      <Link to="/" className="box-logo">
        <img src="/logo.png" className="logo" />
      </Link>
      <div className="box-route">
        {location.pathname === "/forgot-password" ? (
          <Link className="active" to="/forgot-password">
            {t("forgot_password")}
          </Link>
        ) : (
          <>
            <NavLink to="/login">{t("login")}</NavLink>
            <NavLink to="/sign-up">{t("sign_up")}</NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default TopNavAuth;
