import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CONTACT_PAGE } from "@/constants";
import configPageApis from "@/apis/configPageApis";

const Footer = () => {
  const cartItems = useSelector((state) => state.cartItems.value);
  const [totalProducts, setTotalProducts] = useState(0);
  const [contactFooter, setContactFooter] = useState();

  const fetchContact = async () => {
    const contact = await configPageApis.getListConfigPageContact();
    setContactFooter(
      contact.find((ct) => ct.type === CONTACT_PAGE.ADDRESS_FOOTER)
    );
  }

  useEffect(() => {
    fetchContact()
  }, [])

  useEffect(() => {
    setTotalProducts(
      cartItems.reduce((total, item) => total + Number(item.quantity), 0)
    );
  }, [cartItems]);

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-2">
            <Link to="/" className="footer__logo">
              <img src="/logo-w.svg" className="logo" />
            </Link>
          </div>
          <div className="col-lg-6">
            {contactFooter && (
              <div className="footer__text">
                <strong>CÔNG TY CỔ PHẦN TẬP ĐOÀN SHESHI</strong>
                <p>SỐ GPKD: {contactFooter.businessLicense}</p>
                <p>Địa chỉ: {contactFooter.address}</p>
                <p>Điện thoại: {contactFooter.telephone}</p>
                <p>Email: {contactFooter.email}</p>
              </div>
            )}
          </div>
          <div className="col-lg-1"></div>
          <div className="col-lg-3">
            <nav className="footer__menu">
              <ul>
                <li>
                  <Link to="/huong-dan-mua-hang">Hướng dẫn mua hàng</Link>
                </li>
                <li>
                  <Link to="/chinh-sach-doi-tra">Chính sách đổi trả</Link>
                </li>
                <li>
                  <Link to="/chinh-sach-giao-hang">Chính sách giao hàng</Link>
                </li>
                <li>
                  <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="row align-items-center">
            <div className="col-lg-3 col-md-12">
              <ul className="social-icons">
                <li>
                  <a
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                    href="https://www.facebook.com/hocviendaotaospasheshivietnam/"
                  >
                    <i className="bi bi-facebook"></i>
                  </a>
                </li>
                <li>
                  <a
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                    href="https://www.facebook.com/hocviendaotaospasheshivietnam/"
                  >
                    <i className="bi bi-twitter" />
                  </a>
                </li>
                <li>
                  <a
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                    href="https://www.facebook.com/hocviendaotaospasheshivietnam/"
                  >
                    <i className="bi bi-instagram" />
                  </a>
                </li>
                <li>
                  <a
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                    href="https://www.facebook.com/hocviendaotaospasheshivietnam/"
                  >
                    <i className="bi bi-youtube" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="d-none d-lg-block col-lg-6 col-md-12 text-center footer__bottom__corp">
              © Copyright 2022 SheShi.vn
            </div>
            <div className="d-none d-lg-block col-lg-3 col-md-12">
              <div className="footer__bottom__cert">
                <img src="/bct.png" className="BCT" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-mobile-menu">
        <Link to="/" className="menu-item">
          <div className="menu-icon">
            <i className="bi bi-house"></i>
          </div>
          <div className="text-menu--active">Trang chủ</div>
        </Link>

        <Link to="/san-pham" className="menu-item">
          <div className="menu-icon">
            <i className="bi bi-collection"></i>
          </div>
          <div className="text-menu--inactive">Sản phẩm</div>
        </Link>

        <Link to="/cart" className="menu-item">
          <div className="menu-icon">
            <div className="notification">
              <div className="custom-badge">{totalProducts}</div>
              <i className="bi bi-cart"></i>
            </div>
          </div>
          <div className="text-menu--inactive">Giỏ hàng</div>
        </Link>

        <Link to="/login" className="menu-item">
          <div className="menu-icon">
            <i className="bi bi-person"></i>
          </div>
          <div className="text-menu--inactive">Tài khoản</div>
        </Link>
      </div>

      <div className="callaction right">
        <div className="hotline-phone">
          <a href="tel:0966664254" title="Hotline" target="_blank">
            <div className="circle-hotline-phone">
              <img src="/imgsocial/hotline.png" />{" "}
              <span>Hotline: 0966664254</span>
            </div>
          </a>
        </div>
        <a
          rel="noopener noreferrer nofollow"
          target="_blank"
          title="Facebok Messenger"
          href="https://www.messenger.com/t/hocviendaotaospasheshivietnam/"
        >
          <img src="/imgsocial/chat.png" />
          <span>Facebook Messenger</span>
        </a>
        <a
          rel="noopener noreferrer nofollow"
          target="_blank"
          title="Zalo"
          href="https://zalo.me/0966664254"
        >
          <img src="/imgsocial/chat-zalo.png" />
          <span>Zalo: 0966664254</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
