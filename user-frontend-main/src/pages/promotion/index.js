import React from "react";
import Container from "@/components/container";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";

const Pages = (props) => {
  const { t } = useTranslation();

  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
    <div {...props}>
      <i className="bi bi-chevron-left"></i>
    </div>
  );
  const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
    <div {...props}>
      <i className="bi bi-chevron-right"></i>
    </div>
  );
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    responsive: [
      {
        breakpoint: 1198,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          rows: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 1,
        },
      },
    ],
  };

  return (
    <Container title={t("promotion")}>
      <div className="promotions-page">
        <h3 className="title--sub mb-3 text-center">Khuyến mãi dành cho bạn</h3>
        <div className="promotion-list">
          <Slider {...settings}>
            <div>
              <div className="promotion-item">
                <div className="promotion-item__img">
                  <img src="imghome/qrcode.png" />
                </div>
                <div className="promotion-item__text">
                  <h3 className="promotion-item__text__name">
                    Tri ân khách hàng
                  </h3>
                  <a href="/" className="btn btn-primary btn-sm">
                    Chi tiết
                  </a>
                </div>
              </div>
            </div>
            <div>
              <div className="promotion-item">
                <div className="promotion-item__img">
                  <img src="imghome/qrcode.png" />
                </div>
                <div className="promotion-item__text">
                  <h3 className="promotion-item__text__name">
                    Mã giảm giá 20K
                  </h3>
                  <a href="/" className="btn btn-primary btn-sm">
                    Chi tiết
                  </a>
                </div>
              </div>
            </div>
            <div>
              <div className="promotion-item">
                <div className="promotion-item__img">
                  <img src="imghome/qrcode.png" />
                </div>
                <div className="promotion-item__text">
                  <h3 className="promotion-item__text__name">MÃ GIẢM 50%</h3>
                  <a href="/" className="btn btn-primary btn-sm">
                    Chi tiết
                  </a>
                </div>
              </div>
            </div>
            <div>
              <div className="promotion-item">
                <div className="promotion-item__img">
                  <img src="imghome/qrcode.png" />
                </div>
                <div className="promotion-item__text">
                  <h3 className="promotion-item__text__name">MÃ GIẢM 50%</h3>
                  <a href="/" className="btn btn-primary btn-sm">
                    Chi tiết
                  </a>
                </div>
              </div>
            </div>
            <div>
              <div className="promotion-item">
                <div className="promotion-item__img">
                  <img src="imghome/qrcode.png" />
                </div>
                <div className="promotion-item__text">
                  <h3 className="promotion-item__text__name">MÃ GIẢM 50%</h3>
                  <a href="/" className="btn btn-primary btn-sm">
                    Chi tiết
                  </a>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </Container>
  );
};

export default Pages;
