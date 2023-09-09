import React, { useEffect, useState } from "react";
import Container from "@/components/container";
import ProductCard from "@/components/product-card";
import productData from "@/apis/productApis";
// import category from "@/apis/categoryApis";
import Slider from "react-slick";
import productsApis from "@/apis/productApis";
import { GLOBAL_STATUS, IMAGE_TYPE, SLIDE_PAGE, CONTENT_PAGE } from "@/constants";
import { Link } from "react-router-dom";
import { Slide } from "react-toastify";
import configPageApis from "@/apis/configPageApis";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import newsApis from "@/apis/newsApis";

const OUTSTANDING_PRODUCTS = 1;
const Home = () => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [outstandingProducts, setOutstandingProducts] = useState([]);
  const [news, setNews] = useState([]);
  const [slideImageHome, setSlideImageHome] = useState();
  const [slideImageAdvert, setSlideImageAdvert] = useState();
  const [contentAcademy, setContentAcademy] = useState();

  const fetchSlideHome = async () => {
    const contents = await configPageApis.getListConfigPageContent({
      pageCode: [CONTENT_PAGE.SCHOOL_PAGE_OVERVIEW],
    });
    const images = await configPageApis.getListConfigPageSlide({
      pageCode: [
        SLIDE_PAGE.HOME_PAGE_ADVERTMENT,
        SLIDE_PAGE.HOME_PAGE_MAIN_PC,
        SLIDE_PAGE.HOME_PAGE_MAIN_SMARTPHONE,
      ],
    });
    const imagePc = images.filter((image) => image.pageCode === SLIDE_PAGE.HOME_PAGE_MAIN_PC)
    const imageSmp = images.filter((image) => image.pageCode === SLIDE_PAGE.HOME_PAGE_MAIN_SMARTPHONE)
    if (imageSmp.length !== imageSmp.length) return;
    setSlideImageHome(
      imagePc.map((imgPc, i) => ({
        id: i,
        urlPc: imgPc.image,
        urlSmp: imageSmp[i].image,
      }))
    );
    setSlideImageAdvert(
      images.filter((image) => image.pageCode === SLIDE_PAGE.HOME_PAGE_ADVERTMENT)
    );
    setContentAcademy(contents);
  }

  const getOutstandingProducts = async () => {
    const params = {
      size: 5,
      outstanding: OUTSTANDING_PRODUCTS,
      getMainImage: true,
      status: GLOBAL_STATUS.ACTIVE,
    };

    const result = await productsApis.getAllProducts(params);
    setOutstandingProducts(result.rows);
  };
  const getProductRelated = async () => {
    const params = {
      size: 5,
      getMainImage: true,
      status: GLOBAL_STATUS.ACTIVE,
    };

    // const return1 =
    const result = await productsApis.getAllProducts(params);
    setRelatedProducts(result.rows);
  };
  const getNews = async () => {
    const params = {
      size: 8,
      status: GLOBAL_STATUS.ACTIVE,
    };

    // const return1 =
    const result = await newsApis.getNews(params);
    setNews(result.rows.filter((e) => e.outstanding === 1));
  };

  useEffect(() => {
    getProductRelated();
    getOutstandingProducts();
    fetchSlideHome();
    getNews();
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
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
  };

  const settings_news = {
    infinite: true,
    speed: 500,
    className: "center",
    centerMode: true,
    centerPadding: "60px",
    slidesToShow: 3,
    slidesToScroll: 3,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    responsive: [
      {
        breakpoint: 1198,
        settings: {
          infinite: true,
          slidesToShow: 3,
          slidesToScroll: 3,
          rows: 1,
          dots: false,
        },
      },
      {
        breakpoint: 576,
        settings: {
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 1,
          dots: false,
        },
      },
    ],
  };

  const settings1 = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    responsive: [
      {
        breakpoint: 1198,
        settings: {
          infinite: true,
          slidesToShow: 2,
          slidesToScroll: 2,
          rows: 1,
          dots: false,
        },
      },
      {
        breakpoint: 576,
        settings: {
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 1,
          dots: false,
        },
      },
    ],
  };
  const settings_new = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    responsive: [
      {
        breakpoint: 1198,
        settings: {
          infinite: true,
          slidesToShow: 2,
          slidesToScroll: 2,
          rows: 1,
          dots: false,
        },
      },
      {
        breakpoint: 576,
        settings: {
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 1,
          dots: false,
        },
      },
    ],
  };

  const settings_outstanding = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    responsive: [
      {
        breakpoint: 1198,
        settings: {
          infinite: true,
          slidesToShow: 2,
          slidesToScroll: 2,
          rows: 1,
          dots: false,
        },
      },
      {
        breakpoint: 576,
        settings: {
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 1,
          dots: false,
        },
      },
    ],
  };

  const settings_feedback = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    rows: 1,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
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
    <Container>
      <div className="home-page">
        <section className="slider bg">
          <Slider {...settings}>
            {/* <div className="slider__item">
              <div className="slider__item__img">
                <img className="slider__item__img__bg" src="/imghome/slide1_bg.png" />
                <img className="slider__item__img__img" src="/imghome/slide1_img.png" />
              </div>
              <div className="slider__item__text">
                <div className="container">
                  <div className="slider__item__text__wrap">
                    <img src="/imghome/sheshi_gold.png" />
                    <p className="gap--20">
                      Trắng thuần khiết chỉ sau 3 tuần
                      Dòng Sản Phẩm được bào chế từ công nghệ Độc Quyền đến từ Hàn Quốc
                      Công nghệ Phủ Mượt Tế Bào cà các phân tử nano cực nhỏ chỉ bằng 1/2000 lỗ chân lông, giúp lưu truyền dưỡng chất sâu hơn, thẩm thấu nhanh hơn, tác dụng trắng rõ rệt và an toàn tuyệt đối.
                    </p>
                  </div>
                </div>
              </div>
            </div> */}
            {/* {slideImageHome?.map((slide) => (
              <div className="sliderv2__item">
                <div className="sliderv2__item__desktop">
                  <img src="/imghome/d1.jpg" />
                </div>
                <div className="sliderv2__item__mobile">
                  <img src="/imghome/m1.jpg" />
                </div>
              </div>
            ))} */}
            {slideImageHome?.map((img) => (
              <div className="sliderv2__item" key={img.id}>
                <div className="sliderv2__item__desktop">
                  <img src={img.urlPc} />
                </div>
                <div className="sliderv2__item__mobile">
                  <img src={img.urlSmp} />
                </div>
              </div>
            ))}
          </Slider>
        </section>

        {/* <section className="collections bg gap--60">
        <div className="container">
          <div className="text-center title--home">
            <img src="/logo.png" className="logo" />
            <p className="up">MỸ PHẨM SHESHI</p>
            <h3 className="up">Dòng Sản phẩm</h3>
          </div>

          <div className="gap--30"></div>
          <div className="row">
            {category.map((item, index) => (
              <div key={index} className="col-lg-3 col-sm-6 col-xs-6">
                <div className="collections__item">
                  <a href="/catalog">
                    <div className="collections__item__box">
                      <div className="collections__item__box__img">
                        <img src={item.image} alt={item.display} />
                      </div>
                      <h3 className="collections__item__box__text">
                        {item.display}
                      </h3>
                    </div>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

        <section className="bg gap--60">
          <div className="container">
            <div className="text-center title--normal">
              <h3 className="up">Sản phẩm nổi bật</h3>
            </div>

            <div className="gap--10"></div>
            <div className="row slider-outstanding-product">
              <Slider {...settings_outstanding}>
                {outstandingProducts?.map((item, index) => (
                  <ProductCard
                    key={index}
                    img01={item.productImage[0]?.image}
                    name={item.name}
                    price={Number(item.productDetail[0]?.price)}
                    priceDiscount={
                      item.discount
                        ? Number(
                            item.price -
                              (item.price * item.discount.discountPercent) / 100
                          )
                        : null
                    }
                    slug={item.productSlug}
                  />
                ))}
              </Slider>
            </div>
            <div className="mx-auto text-center">
              <Link to="/san-pham" className="btn btn-link">
                <button type="button" className="btn btn-primary">
                  Xem thêm
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section className="experience bg--1 gap--30">
          <div className="container">
            <div className="row">
              {contentAcademy && (
                <div className="col-lg-7 align-self-center">
                  <h3 className="title--normal">Học viện đào tạo Sheshi</h3>

                  <div
                    dangerouslySetInnerHTML={{
                      __html: contentAcademy[0]?.content,
                    }}
                  />
                  <a href="/hoc-vien-dao-tao-sheshi" className="btn btn-link">
                    Xem chi tiết
                  </a>
                </div>
              )}
              <div className="col-lg-5">
                <div className="experience__img gap--30">
                  <iframe
                    src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Fsheshipharma%2Fvideos%2F709801732988589%2F&show_text=false&width=560&t=0"
                    width={560}
                    height={314}
                    style={{ border: "none", overflow: "hidden" }}
                    scrolling="no"
                    frameBorder={0}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg slide-news gap--60">
          <div className="text-center slide-news__title">
            <h3 className="title--normal">
              {slideImageAdvert && slideImageAdvert[0]?.title}
            </h3>
          </div>
          <div className="gap--30"></div>

          <div className="slidernews">
            <Slider {...settings_news}>
              {slideImageAdvert?.map((slide) => (
                <div className="slidernews__item" key={slide.id}>
                  <img src={slide.image} />
                </div>
              ))}
            </Slider>
          </div>
        </section>

        <section className="gap--60">
          <div className="container">
            <div className="text-center title--normal">
              <h3 className="up">Sản phẩm mới</h3>
            </div>

            <div className="slider-related-product">
              <Slider {...settings1}>
                {relatedProducts?.map((item, index) => (
                  <ProductCard
                    key={index}
                    img01={
                      item.productImage.find(
                        (e) => e.isMain === IMAGE_TYPE.MAIN
                      )?.image
                    }
                    name={item.name}
                    price={Number(item.productDetail[0]?.price)}
                    priceDiscount={
                      item.discount
                        ? Number(
                            item.price -
                              (item.price * item.discount.discountPercent) / 100
                          )
                        : null
                    }
                    slug={item.productSlug}
                  />
                ))}
              </Slider>
            </div>
            <div className="mx-auto text-center">
              <Link to="/san-pham" className="btn btn-link">
                <button type="button" className="btn btn-primary">
                  Xem thêm
                </button>
              </Link>
            </div>
          </div>
        </section>
        {news.length !== 0 && (
          <section className="home-feedback gap--60 bg">
            <div style={{ width: "90%", margin: "auto" }}>
              <div className="text-center title--normal">
                <h3 className="up">TIN TỨC</h3>
              </div>
              <div className="feedback_slider">
                <Slider {...settings_new}>
                  {news.map((detailNews) => (
                    <Card
                      key={detailNews.id}
                      className="statistics-box"
                      style={{ width: "25rem", height: "800px" }}
                    >
                      <Card.Img
                        variant="top"
                        style={{
                          objectFit: "cover",
                          height: "15vw",
                          width: "100%",
                        }}
                        src={detailNews.thumbnail}
                      />
                      <Card.Body style={{ textAlign: "center" }}>
                        <Card.Title>{detailNews.title}</Card.Title>
                        <Card.Text>
                          {detailNews.description.length > 200
                            ? detailNews.description.substring(0, 200)
                            : detailNews.description + "..."}
                        </Card.Text>
                        <Link to={`/tin-tuc/${detailNews.slug}`}>
                          {" "}
                          <Button variant="primary">Xem thêm</Button>
                        </Link>
                      </Card.Body>
                    </Card>
                  ))}
                </Slider>
              </div>
            </div>
          </section>
        )}
        <section className="home-feedback gap--60">
          <div className="container">
            <div className="text-center title--normal">
              <h3 className="up">Cảm nhận khách hàng</h3>
              <p>
                Cảm nhận của khách hàng đã sử dụng sản phẩm và dịch vụ mỹ phẩm
                SHESHI. Bạn thì sao? Hãy cho chúng tôi biết cảm nhận của bạn về
                sản phẩm hoặc đến với chúng tôi để cảm nhận và trải nghiệm sản
                phẩm.
              </p>
            </div>
          </div>
          <div className="gap--30"></div>

          <div className="feedback_slider">
            <Slider {...settings_feedback}>
              <div className="statistics-box bg">
                <div className="statistics-box__head">
                  <div className="statistics-box__img">
                    <img src="/imghome/feed/feed1.jpg" />
                  </div>
                  <div className="statistics-box__details">
                    <div className="statistics-box__name">MRS. LÊ THÚY</div>
                    <div className="statistics-box__nickname" />
                  </div>
                </div>
                <div className="statistics-box__text">
                  <p></p>
                  <p>
                    Tôi thực sự thích thú với cá dòng sản phẩm của SheShi bởi
                    mùi hương thơm quyến rũ nhưng mang rất nhiều âm hưởng từ
                    thiên nhiên , đồng thời tác dụng cấp kỳ của sản phẩm trên
                    da...
                  </p>
                  <p />
                </div>
                <div className="statistics-box__info">
                  <div className="statistics-box__social">Facebook</div>
                </div>
              </div>

              <div className="statistics-box bg">
                <div className="statistics-box__head">
                  <div className="statistics-box__img">
                    <img src="/imghome/feed/feed2.jpg" />
                  </div>
                  <div className="statistics-box__details">
                    <div className="statistics-box__name">MS. HOA PHẠM</div>
                    <div className="statistics-box__nickname" />
                  </div>
                </div>
                <div className="statistics-box__text">
                  <p></p>
                  <p>
                    {" "}
                    Mỹ phẩm SheShi cho mình một cảm giác rất yên tâm vì qua tìm
                    hiểu mình biết đây là sản phẩm chính hãng nhập khẩu Bulgaria
                    với thiết kế bao bì chai lọ rất đẹp và chuyên nghiệp ,
                    mùi...{" "}
                  </p>
                  <p />
                </div>
                <div className="statistics-box__info">
                  <div className="statistics-box__social">Facebook</div>
                </div>
              </div>

              <div className="statistics-box bg">
                <div className="statistics-box__head">
                  <div className="statistics-box__img">
                    <img src="/imghome/feed/feed3.jpg" />
                  </div>
                  <div className="statistics-box__details">
                    <div className="statistics-box__name">MRS. TẠ NGỌC</div>
                    <div className="statistics-box__nickname" />
                  </div>
                </div>
                <div className="statistics-box__text">
                  <p></p>
                  <p>
                    Từ khi biết đến và sử dụng mỹ phẩm nhập khẩu Bulgaria của
                    SheShi mình dần thấy làn da của mình có sự cải thiện rõ ràng
                    hơn bao giờ hết . Mình cảm thấy sự khác biệt ngay lần...
                  </p>
                  <p />
                </div>
                <div className="statistics-box__info">
                  <div className="statistics-box__social">Facebook</div>
                </div>
              </div>

              <div className="statistics-box bg">
                <div className="statistics-box__head">
                  <div className="statistics-box__img">
                    <img src="/imghome/feed/feed4.jpg" />
                  </div>
                  <div className="statistics-box__details">
                    <div className="statistics-box__name">MRS. KHÁNH LY</div>
                    <div className="statistics-box__nickname" />
                  </div>
                </div>
                <div className="statistics-box__text">
                  <p></p>
                  <p>
                    Một người khó tính như mình cuối cùng cũng bị thuyết phục
                    bởi sản phẩm của SheShi. Bản thân mình với đặc thù công việc
                    người mẫu, sau nhiều năm làm việc mình sử...{" "}
                  </p>
                  <p />
                </div>
                <div className="statistics-box__info">
                  <div className="statistics-box__social">Facebook</div>
                </div>
              </div>

              <div className="statistics-box bg">
                <div className="statistics-box__head">
                  <div className="statistics-box__img">
                    <img src="/imghome/feed/feed3.jpg" />
                  </div>
                  <div className="statistics-box__details">
                    <div className="statistics-box__name">MRS. THANH LÊ</div>
                    <div className="statistics-box__nickname" />
                  </div>
                </div>
                <div className="statistics-box__text">
                  <p></p>
                  <p>
                    Cô đã từng sử dụng qua nhiều dòng sản phẩm mỹ phẩm cao cấp
                    của nhiều thương hiệu nổi tiếng, nhưng khi biết đến Rosa
                    Beauty cô đặc biệt ấn tượng bởi mùi hương của những sản phẩm
                    này...
                  </p>
                  <p />
                </div>
                <div className="statistics-box__info">
                  <div className="statistics-box__social">Facebook</div>
                </div>
              </div>
            </Slider>
          </div>
        </section>
      </div>
    </Container>
  );
};

export default Home;
