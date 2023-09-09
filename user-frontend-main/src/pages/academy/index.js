import React, { useEffect, useState } from "react";
import Container from "@/components/container";
import Slider from "react-slick";
import configPageApis from "@/apis/configPageApis";
import { CONTENT_PAGE, SLIDE_PAGE } from "@/constants";
const Academy = () => {
  const [contentAcademy, setContentAcademy] = useState();
  const [slideImageAcademy, setSlideImageAcademy] = useState();

  const fetchDataAcademy = async () => {
    const contents = await configPageApis.getListConfigPageContent({
      pageCode: [
        CONTENT_PAGE.SCHOOL_PAGE_OVERVIEW,
        CONTENT_PAGE.SCHOOL_PAGE_PROCESS,
      ],
    });
    const images = await configPageApis.getListConfigPageSlide({pageCode :[
      SLIDE_PAGE.SCHOOL_PAGE
    ]});

    setContentAcademy(contents);
    setSlideImageAcademy(images);
  }

  useEffect(() => {
    fetchDataAcademy();
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
  const settings_gal = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    className: "center",
    centerMode: true,
    responsive: [
      {
        breakpoint: 1198,
        settings: {
          infinite: true,
          slidesToShow: 3,
          slidesToScroll: 3,
          rows: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 1,
        },
      },
    ],
  };

  return (
    <Container title="Học viện đào tạo thẩm mỹ SheShi">
      <section className="title--page text-center">
        <div className="container">
          <h3>Học viện đào tạo thẩm mỹ SheShi</h3>
        </div>
      </section>
      <section className="academy-page gap--60">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-lg-6">
              <div className="academy-page__title">
                <small>Học viện Đào tạo</small>
                <h2>
                  Đào tạo thẩm mỹ<span className="primary">SHESHI</span>
                </h2>
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: contentAcademy?.find(
                    (content) =>
                      content.pageCode === CONTENT_PAGE.SCHOOL_PAGE_OVERVIEW
                  ).content,
                }}
              />
              <div className="gap--30">
                <img
                  src={
                    contentAcademy?.find(
                      (content) =>
                        content.pageCode === CONTENT_PAGE.SCHOOL_PAGE_OVERVIEW
                    ).image
                  }
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row d-flex flex-lg-column-reverse">
                <div
                  className="col-lg-12"
                  dangerouslySetInnerHTML={{
                    __html: contentAcademy?.find(
                      (content) =>
                        content.pageCode === CONTENT_PAGE.SCHOOL_PAGE_PROCESS
                    ).content,
                  }}
                />
                <div className="col-lg-12">
                  <div className="gap--30">
                    <img
                      src={
                        contentAcademy?.find(
                          (content) =>
                            content.pageCode ===
                            CONTENT_PAGE.SCHOOL_PAGE_PROCESS
                        ).image
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="gal-list gap--60">
          <Slider {...settings_gal}>
            {slideImageAcademy?.map((img) => (
              <div className="gal-item" key={img.id}>
                <img src={img.image} />
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </Container>
  );
};
export default Academy;
