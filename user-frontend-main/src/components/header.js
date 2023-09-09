import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { MODE_THEME, ROLE } from "@/constants";
import { changeLanguage, changeTheme } from "@/store/slices/commonSlice";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import LocalStorage from "@/utils/storage";
import { STORAGE_KEY } from "@/constants/storage-key";
import { clearInfo } from "@/store/slices/accountSlice";
import { clearSession } from "@/store/slices/cartItemsSlide";
import { Button, Form, Stack, Tooltip } from "react-bootstrap";

const Header = () => {
  const { t, i18n } = useTranslation();
  const { theme, lang } = useSelector((state) => state.common);
  const { token, info } = useSelector((state) => state.account);
  const dispatch = useDispatch();
  const [isHidden, setIsHidden] = useState(false);
  const cartItems = useSelector((state) => state.cartItems.value);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const [totalProducts, setTotalProducts] = useState(0);

  const onChangeTheme = () => {
    const newTheme =
      theme === MODE_THEME.LIGHT ? MODE_THEME.DARK : MODE_THEME.LIGHT;
    dispatch(changeTheme(newTheme));
  };

  const onChangeLang = (newLang) => {
    i18n.changeLanguage(newLang, () => {
      dispatch(changeLanguage(newLang));
      LocalStorage.set(STORAGE_KEY.LANGUAGE, newLang);
    });
  };

  const onLogoutAction = () => {
    dispatch(clearSession());
    dispatch(clearInfo());
    LocalStorage.remove(STORAGE_KEY.TOKEN);
    navigate("/")
  };

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  const onGetAvatar = () => {
    let avatar = "";

    avatar = info?.userInformation?.avatar;

    if (avatar) {
      return avatar;
    }
    return "logo.png";
  };

  const hideBar = () => {
    const pos = window.pageYOffset;
    pos > 520 ? setIsHidden(true) : setIsHidden(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", hideBar, { passive: true });

    return () => {
      window.removeEventListener("scroll", hideBar);
    };
  }, []);

  useEffect(() => {
    setTotalProducts(
      cartItems.reduce((total, item) => total + Number(item.quantity), 0)
    );
  }, [cartItems]);

  const searchOrder = (e) => {
    e.preventDefault();
    const body = {
      email: e.target.email.value,
      orderCode: e.target.orderCode.value,
    };
    navigate(
      `/search-order?email=${e.target.email.value}&orderCode=${e.target.orderCode.value}`
    );
  }
  return (
    <div className={classNames("header-user", { sticky: isHidden })}>
      <div className="container d-flex align-items-center">
        <div
          className="btn-nav d-block d-lg-none pointer me-2 me-sm-3"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebarToggle"
        >
          <span className="jr-menu-icon">
            <span className="menu-icon" />
          </span>
        </div>

        <Link to="/" className="box-logo">
          <img src="/logosheshe.png" className="logo" />
          <img className="box-logo__text" src="/logo_text.svg" />
        </Link>

        <div className="nav-box d-none d-lg-flex flex-grow-1">
          <ul>
            <li>
              <NavLink to="/">{t("home")}</NavLink>
            </li>
            <li>
              <NavLink to="/gioi-thieu">{t("about_us")}</NavLink>
            </li>
            <li>
              <NavLink to="/san-pham">{t("product")}</NavLink>
            </li>
            <li>
              <NavLink to="/hoc-vien-dao-tao-sheshi">Học viện SheShi</NavLink>
            </li>
            <li>
              <NavLink to="/tin-tuc">Tin tức</NavLink>
            </li>
            {/* <li>
              <NavLink to="/tuyen-dung">Tuyển dụng</NavLink>
            </li> */}
            <li>
              <NavLink to="/lien-he">{t("contact")}</NavLink>
            </li>
          </ul>
        </div>

        <div className="flex-grow-1 d-flex justify-content-end">
          <div className="box__action-right">
            <ul className="header__nav">
              <li
                data-toggle="tooltip"
                data-placement="bottom"
                title="Tìm kiếm sản phẩm"
              >
                <button
                  className="toggle-search"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-search"></i>
                </button>

                <div className="dropdown-menu search-dropdown dropdown-menu-end">
                  <label className="mb-2">Tìm kiếm sản phẩm</label>
                  <form
                    action="/search"
                    className="position-relative search-dropdown__form"
                  >
                    <input
                      name="keyword"
                      className="form-control bg-light"
                      value={keyword}
                      onChange={handleInputChange}
                      type="text"
                      placeholder={t("search_placeholder")}
                      aria-label={t("search")}
                    />
                    <button className="btn bg-transparent" type="submit">
                      <i className="bi bi-search fs-5"> </i>
                    </button>
                  </form>
                </div>
              </li>
              <li
                data-toggle="tooltip"
                data-placement="bottom"
                title="Theo dõi đơn hàng"
              >
                <button
                  className="toggle-search"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-eye"></i>
                </button>

                <div className="dropdown-menu search-dropdown dropdown-menu-end">
                  <label className="mb-2">Tìm kiếm đơn hàng</label>
                  <Form onSubmit={searchOrder}>
                    <Stack gap={2}>
                      <Form.Control
                        name="email"
                        className="form-control bg-light"
                        type="email"
                        placeholder="Nhập email"
                      />
                      <Form.Control
                        name="orderCode"
                        className="form-control bg-light"
                        type="orderCode"
                        placeholder="Nhập mã đơn hàng"
                      />
                      <Button variant="light" type="submit">
                        Submit
                      </Button>
                    </Stack>
                  </Form>
                </div>
              </li>
              <li
                data-toggle="tooltip"
                data-placement="bottom"
                title="Giỏ hàng"
              >
                <Link to="/cart" className="cart-icon">
                  <div className="cart-icon__notification">
                    <div className="cart-icon__notification__badge">
                      {totalProducts}
                    </div>
                    <i className="bi bi-bag"></i>
                  </div>
                </Link>
              </li>
              <li data-toggle="tooltip" data-placement="bottom" title="Cá nhân">
                {token ? (
                  <>
                    <button
                      className="toggle-avatar"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img
                        src={onGetAvatar()}
                        className="avatar-user rounded-circle"
                      />
                    </button>

                    <ul className="dropdown-menu pull-right dropdown-menu-end">
                      <li>
                        <NavLink to={"/profile"}>
                          <i className="bi bi-person-bounding-box"></i>{" "}
                          {t("profile")}
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to={"/my-order"}>
                          <i className="bi bi-receipt"></i> {t("my_order")}
                        </NavLink>
                      </li>
                      <li>
                        <a onClick={onLogoutAction}>
                          <i className="bi bi-box-arrow-right"></i>{" "}
                          {t("logout")}
                        </a>
                      </li>
                    </ul>
                  </>
                ) : (
                  <>
                    <button
                      className="auth-icon"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-person"></i>
                    </button>
                    <ul className="dropdown-menu pull-right dropdown-menu-end">
                      <li>
                        <Link to="/login">
                          <i className="bi bi-box-arrow-in-right"></i>
                          {t("login")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/sign-up">
                          <i className="bi bi-person-plus"></i>
                          {t("sign_up")}
                        </Link>
                      </li>
                    </ul>
                  </>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        className="d-block d-lg-none offcanvas offcanvas-start"
        tabIndex="-1"
        id="sidebarToggle"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <div className="flex-grow-1">
            <Link to="/" className="box-logo-mobile">
              <img src="/logo_text.svg" className="logo" />
            </Link>
          </div>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="nav-box-mobile d-flex flex-column">
            <NavLink to="/">
              <div data-bs-toggle="offcanvas" data-bs-target="#sidebarToggle">
                {t("home")}
              </div>
            </NavLink>
            <NavLink to="/gioi-thieu">
              <div data-bs-toggle="offcanvas" data-bs-target="#sidebarToggle">
                {t("about_us")}
              </div>
            </NavLink>
            <NavLink to="/san-pham">
              <div data-bs-toggle="offcanvas" data-bs-target="#sidebarToggle">
                {t("product")}
              </div>
            </NavLink>

            <NavLink to="/hoc-vien-dao-tao-sheshi">
              <div data-bs-toggle="offcanvas" data-bs-target="#sidebarToggle">
                Học viện SheShi
              </div>
            </NavLink>
            <NavLink to="/tin-tuc">
              <div data-bs-toggle="offcanvas" data-bs-target="#sidebarToggle">
                Tin tức
              </div>
            </NavLink>
            <NavLink to="/lien-he">
              <div data-bs-toggle="offcanvas" data-bs-target="#sidebarToggle">
                {t("contact")}
              </div>
            </NavLink>
            <NavLink to="/cart">
              <div data-bs-toggle="offcanvas" data-bs-target="#sidebarToggle">
                {t("shopping_cart")}
              </div>
            </NavLink>
            <NavLink to="/login">
              <div data-bs-toggle="offcanvas" data-bs-target="#sidebarToggle">
                {t("login")}
              </div>
            </NavLink>
            <NavLink to="/sign-up">
              <div data-bs-toggle="offcanvas" data-bs-target="#sidebarToggle">
                {t("sign_up")}
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
