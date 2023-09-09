import React, { useEffect, useState } from "react";
import Container from "@/components/container";
import configPageApis from "@/apis/configPageApis";
import { CONTENT_PAGE } from "@/constants";
const AboutUs = () => {

  const [contentAbout, setContentAbout] = useState();

  const fetchDataAbout = async () => {
    const contents = await configPageApis.getListConfigPageContent({
      pageCode: [
        CONTENT_PAGE.INTRODUCE_PAGE,
        CONTENT_PAGE.INTRODUCE_PAGE_CUSTOMER,
        CONTENT_PAGE.INTRODUCE_PAGE_STORY,
      ],
    });
    setContentAbout(contents);
  }

  useEffect(() => {
    fetchDataAbout();
  }, []);
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
      <Container title="Giới thiệu">
        <section className="title--page text-center">
          <div className="container">
            <h3>Giới thiệu</h3>
          </div>
        </section>
        <div className="about-page">
          <div className="container gap--60">
            <div className="row justify-content-md-center">
              <div className="col-lg-6">
                <h2>
                  GIỚI THIỆU VỀ <span className="primary">SHESHI</span>
                </h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: contentAbout?.find(
                      (content) =>
                        content.pageCode === CONTENT_PAGE.INTRODUCE_PAGE
                    ).content,
                  }}
                />
              </div>
              <div className="col-lg-6">
                <div className="gap--30">
                  <img
                    src={
                      contentAbout?.find(
                        (content) =>
                          content.pageCode === CONTENT_PAGE.INTRODUCE_PAGE
                      ).image
                    }
                  />
                </div>
              </div>
            </div>
            <div className="row d-flex flex-lg-row-reverse justify-content-md-center">
              <div className="col-lg-6">
                <h2>
                  CÂU CHUYỆN <span className="primary">THƯƠNG HIỆU</span>
                </h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: contentAbout?.find(
                      (content) =>
                        content.pageCode === CONTENT_PAGE.INTRODUCE_PAGE_STORY
                    ).content,
                  }}
                />
              </div>
              <div className="col-lg-6">
                <img
                  className="gap--30"
                  src={
                    contentAbout?.find(
                      (content) =>
                        content.pageCode === CONTENT_PAGE.INTRODUCE_PAGE_STORY
                    ).image
                  }
                />
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-lg-6">
                <div className="gap--30">
                  <h2>
                    KHÁCH HÀNG <span className="primary">SHESHI</span>
                  </h2>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: contentAbout?.find(
                        (content) =>
                          content.pageCode ===
                          CONTENT_PAGE.INTRODUCE_PAGE_CUSTOMER
                      ).content,
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <img
                  src={
                    contentAbout?.find(
                      (content) =>
                        content.pageCode ===
                        CONTENT_PAGE.INTRODUCE_PAGE_CUSTOMER
                    ).image
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
};
export default AboutUs;
