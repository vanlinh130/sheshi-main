import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "@/components/container";
import ProductCard from "@/components/product-card";
import ProductView from "@/components/product-view";
import productsApis from "@/apis/productApis";
import Slider from "react-slick";
import { GLOBAL_STATUS, IMAGE_TYPE } from "@/constants";

const Product = () => {
  const { slug } = useParams();

  const [product, setProduct] = useState();
  const [relatedProducts, setRelatedProducts] = useState([]);

  const getProduct = async () => {
    const params = {
      productSlug: slug,
    };
    const result = await productsApis.getProducts(params);
    setProduct(result);
  };
  const getProductRelated = async () => {
    const params = {
      size: 8,
      status: GLOBAL_STATUS.ACTIVE
    };

    const result = await productsApis.getAllProducts(params);
    setRelatedProducts(result.rows);
  };

  useEffect(() => {
    getProduct();
    getProductRelated();
  }, [slug]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

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
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    responsive: [
      {
        breakpoint: 1198,
        settings: {
          infinite: false,
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

  return (
    <Container title={product?.name} description={product?.description.replace(/(<([^>]+)>)/gi, "")} image={product?.productImage[0].image}>
      {!!product && <ProductView product={product} />}
      <div className="container gap--60">
        <h3 className="title--center gap--30">Sản phẩm liên quan</h3>
        <div className="slider-related-product">
          <Slider {...settings}>
            {relatedProducts.map((item, index) => (
              <ProductCard
                key={index}
                img01={
                  item.productImage.find((e) => e.isMain === IMAGE_TYPE.MAIN)
                    ?.image
                }
                name={item.name}
                price={Number(item.productDetail[0]?.price)}
                priceDiscount={
                  item.discount
                    ? Number(item.price - ((item.price * item.discount.discountPercent) / 100))
                    : null
                }
                slug={item.productSlug}
              />
            ))}
          </Slider>
        </div>
      </div>
    </Container>
  );
};

export default Product;
