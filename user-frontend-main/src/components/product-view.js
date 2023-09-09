import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { addItem } from "@/store/slices/cartItemsSlide";
import { remove } from "@/store/slices/productModalSlice";
import Button from "@/components/button";
import numberWithCommas from "@/utils/number-with-commas";
import { useNavigate } from "react-router-dom";
import successHelper from "@/utils/success-helper";
import errorHelper from "@/utils/error-helper";
import { IMAGE_TYPE, MASTER_DATA_NAME } from "@/constants";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import configDataApis from "@/apis/configDataApis";

const ProductView = (props) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cartItems.value);
  const currentUrl = window.location.href;
  const propProduct = props.product;
  const [product, setProduct] = useState(props.product);
  const [capacity, setCapacity] = useState()
  const [quantity, setQuantity] = useState(1);
  const [detailProductQuantity, setDetailProductQuantity] = useState();
  const [img, setImg] = useState();
  const [price, setPrice] = useState()
  const [masterUnit, setMasterUnit] = useState([])
  const [listImageSlide, setListImageSlide] = useState([])
  const [masterCapacity, setMasterCapacity] = useState([])
  const [selected, setSelected] = useState(1);

  const fetchMasterData = async () => {
    const fetchMasterCapacity = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.CAPACITY_PRODUCT,
    });
    const fetchMasterUnit = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.UNIT_PRODUCT,
    });
    setMasterCapacity(fetchMasterCapacity)
    setMasterUnit(fetchMasterUnit)
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  const updateQuantity = (type) => {
    if (type === "plus") {
      if (+quantity === 999) return
      setQuantity(+quantity + 1);
    } else {
      setQuantity(+quantity - 1 < 1 ? 1 : +quantity - 1);
    }
  };

  useEffect(() => {
    const productDetailOption = []

    if (masterCapacity.length > 0) {
      propProduct.productDetail.map((e) => {
        const capacity = masterCapacity?.find((cap) => cap.id === e.capacityId)
        const unit = masterUnit?.find((cap) => cap.id === e.unitId)
        productDetailOption.push({
          id: e.id,
          capacityId: capacity?.id,
          unitId: unit?.id,
          price: e.price,
          quantity: propProduct.productInventory.find(
            (prdInv) => prdInv.productId === e.productId && prdInv.subProductId === e.id
          )?.quantity,
          value: capacity?.id + "-" + unit?.id,
          name: capacity?.name + " " + unit?.name,
        });
      })
    }

    setProduct({
      name: propProduct.name,
      content: propProduct.content,
      imageMain: propProduct.productImage?.find((e) => e.isMain === IMAGE_TYPE.MAIN)
        ?.image,
      imageSub: propProduct.productImage?.filter((e) => e.isMain === IMAGE_TYPE.SUB),
      categorySlug: propProduct.productCategory?.categorySlug,
      slug: propProduct.productSlug,
      acronym: propProduct.acronym,
      expiry: propProduct.expiry,
      nameVi: propProduct.nameVi,
      description: propProduct.description,
      element: propProduct.element,
      uses: propProduct.uses,
      guide: propProduct.guide,
      productDetailOption
    });
    setPrice(productDetailOption[0]?.price)
    setCapacity(productDetailOption[0]?.capacityId + '-' + productDetailOption[0]?.unitId)
    setDetailProductQuantity(productDetailOption[0]?.quantity)
  }, [propProduct, masterUnit]);

  useEffect(() => {
    setImg(product.imageMain);
    const slideImage = []
    slideImage.push({ image: product.imageMain });
    product.imageSub?.map((e) => {
      slideImage.push({ image: e.image });
    })
    setListImageSlide(slideImage)
    setQuantity(1);
  }, [product]);

  const check = () => {
    if (+quantity < 1) return false;
    return true;
  };

  const addToCart = () => {
    if (check()) {
      const detailProduct = product.productDetailOption.find(
        (prdDetail) => prdDetail.value === capacity
      );
      let newItem = {
        slug: product.slug,
        capacityId: detailProduct.capacityId,
        unitId: detailProduct.unitId,
        price: detailProduct.price,
        quantity: quantity,
        capacity: detailProduct.name,
        totalQuantity : detailProductQuantity
      };
      if (quantity > detailProductQuantity) {
        setQuantity(detailProductQuantity)
        return toast.error(
          `Sản phẩm hiện tại không đủ, chỉ còn ${detailProductQuantity} sản phẩm trong kho`,
          { position: toast.POSITION.TOP_CENTER }
        );
      }
      const item = cartItems.find(
        (cart) =>
          cart.slug === newItem.slug &&
          cart.unitId === newItem.unitId &&
          cart.capacityId === newItem.capacityId
      );
      if (item) {
        if (item.quantity + quantity > detailProductQuantity) {
          return toast.error("Sản phẩm hiện tại không đủ", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      }
      if (dispatch(addItem(newItem))) {
        successHelper(t("add_to_cart_sucsess"));
      } else {
        errorHelper("Fail");
      }
    }
  };

  const goToCart = () => {
    if (check()) {
      const detailProduct = product.productDetailOption.find(
        (prdDetail) => prdDetail.value === capacity
      );
      let newItem = {
        slug: product.slug,
        capacityId: detailProduct.capacityId,
        unitId: detailProduct.unitId,
        price: detailProduct.price,
        quantity: quantity,
        capacity: detailProduct.name,
        totalQuantity : detailProductQuantity
      };
      if (quantity > detailProductQuantity) {
        setQuantity(detailProductQuantity)
        return toast.error(
          `Sản phẩm hiện tại không đủ, chỉ còn ${detailProductQuantity} sản phẩm trong kho`,
          { position: toast.POSITION.TOP_CENTER }
        );
      }
      const item = cartItems.find(
        (cart) =>
          cart.slug === newItem.slug &&
          cart.unitId === newItem.unitId &&
          cart.capacityId === newItem.capacityId
      );
      if (item) {
        if (item.quantity + quantity > detailProductQuantity) {
          return toast.error("Sản phẩm hiện tại không đủ", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      }
      if (dispatch(addItem(newItem))) {
        dispatch(remove());
        navigate("/cart");
      } else {
        errorHelper("Fail");
      }
    }
  };

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
  const settings_slthumb = {
    dots: false,
    infinite: false,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    responsive: [
      {
        breakpoint: 1198,
        settings: {
          infinite: false,
          slidesToShow: 5,
          slidesToScroll: 5,
          rows: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          infinite: true,
          slidesToShow: 3,
          slidesToScroll: 3,
          rows: 1,
        },
      },
    ],
  };

  const hoverHandler = (image, i) => {
    setImg(image);
    if (refs.current[i]) {
      refs.current[i]?.classList.add('active');
      for (var j = 0; j < product?.imageSub?.length; j++) {
        if (i !== j) {
          refs.current[j]?.classList.remove('active');
        }
      }
    }
  };
  const refs = useRef([]);
  refs.current = [];
  const addRefs = (el) => {
    if (el && !refs.current.includes(el)) {
      refs.current.push(el);
    }
  };

  return (
    <div className="bg gap--30">
      <div className="container">
        <div className="product">
          <div className="row">
            <div className="col-lg-7">
              <div className="product-galzoom">
                {listImageSlide?.length > 0 && (
                  <div className="product-galzoom__thumb">
                    <Slider {...settings_slthumb}>
                      {listImageSlide?.map((image, i) => (
                        <div
                          id="classList"
                          className={i == 0 ? "img_wrap active" : "img_wrap"}
                          key={i}
                          onMouseMove={() => hoverHandler(image.image, i)}
                          ref={addRefs}
                        >
                          <img src={image.image} alt="" />
                        </div>
                      ))}
                    </Slider>
                  </div>
                )}
                <div className="product-galzoom__view">
                  <img src={img} />
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="product__info">
                <h1 className="product__info__title">{product.name}</h1>
                {product.nameVi && (
                  <p className="product__info__titlesub">{product.nameVi}</p>
                )}
                {product.acronym && (
                  <p className="product__info__code">Mã: {product.acronym}</p>
                )}
                <div className="product__info__item">
                  <span className="product__info__item__price">
                    {price && numberWithCommas(price)}đ
                  </span>
                </div>
                <div className="product__info__ext">
                  <p className="stock in-stock">
                    <label>Tình trạng:</label>{" "}
                    {detailProductQuantity > 0 ? " Còn hàng" : " Hết hàng"}
                  </p>
                  {product.expiry && <p>Hạn sử dụng: {product.expiry}</p>}
                </div>
                <div className="product__info__item">
                  <div className="product__info__item__title">Số lượng</div>
                  <div className="d-flex product-countcap">
                    <div className="product__info__item__quantity">
                      <div
                        className="product__info__item__quantity__btn"
                        onClick={() => updateQuantity("minus")}
                      >
                        -
                      </div>
                      <input
                        value={quantity}
                        onChange={(e) => {
                          if (!+e.target.value) return;
                          setQuantity(+e.target.value);
                        }}
                        className="product__info__item__quantity__input inputnumber"
                        maxLength={3}
                      />
                      <div
                        className="product__info__item__quantity__btn"
                        onClick={() => updateQuantity("plus")}
                      >
                        +
                      </div>
                    </div>
                    {/* <select
                      onChange={(e) => {
                        setDetailProductQuantity(
                          product.productDetailOption.find(
                            (prdDetail) => prdDetail.value === e.target.value
                          ).quantity
                        );
                        setPrice(
                          product.productDetailOption.find(
                            (prdDetail) => prdDetail.value === e.target.value
                          ).price
                        );
                        setCapacity(e.target.value);
                      }}
                      className="select-custom select-capitalize"
                    >
                      {product.productDetailOption?.map((capacity) => {
                        return (
                          <option key={capacity.value} value={capacity.value}>
                            {capacity.name}
                          </option>
                        );
                      })}
                    </select> */}
                  </div>
                </div>
                <div
                  style={{ marginTop: "10px" }}
                  className="d-flex product-countcap"
                  onClick={(e) => {
                    if (!e.target.htmlFor) return;
                    setDetailProductQuantity(
                      product.productDetailOption.find(
                        (prdDetail) => prdDetail.value === e.target.htmlFor
                      ).quantity
                    );
                    setPrice(
                      product.productDetailOption.find(
                        (prdDetail) => prdDetail.value === e.target.htmlFor
                      ).price
                    );
                    setCapacity(e.target.htmlFor);
                  }}
                >
                  {product?.productDetailOption?.map((optionCapacity) => {
                    return (
                      <div key={optionCapacity.value}>
                        <input
                          type="radio"
                          id={optionCapacity.id}
                          value={optionCapacity.value}
                          className="btn-check"
                          name="capacity"
                          checked={capacity === optionCapacity.value}
                          readOnly
                        />
                        <label
                          htmlFor={optionCapacity.value}
                          style={{ marginRight: "8px" }}
                          className="btn btn-outline-danger"
                        >
                          {optionCapacity.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
                {detailProductQuantity > 0 && (
                  <div className="product__info__item">
                    <Button
                      className="btn-outline-primary btn-lg"
                      style={{ width: "150px" }}
                      onClick={() => addToCart()}
                    >
                      Thêm vào giỏ
                    </Button>
                    <Button
                      className="btn-primary btn-lg"
                      style={{ width: "150px" }}
                      onClick={() => goToCart()}
                    >
                      Mua ngay
                    </Button>
                  </div>
                )}

                {detailProductQuantity < 10 && (
                  <div className="product__info__stock">
                    Chỉ còn {detailProductQuantity} sản phẩm
                  </div>
                )}

                <div className="product__info__item d-none">
                  <ul className="social-icons">
                    <li>
                      <a
                        href={`//www.facebook.com/sharer.php?u=${currentUrl}`}
                        aria-label="Facebook"
                        rel="noopener noreferrer nofollow"
                        target="_blank"
                      >
                        <i className="bi bi-facebook"></i>
                      </a>
                    </li>
                    <li>
                      <a
                        rel="noopener noreferrer nofollow"
                        target="_blank"
                        href={`//twitter.com/share?url=${currentUrl}`}
                      >
                        <i className="bi bi-twitter" />
                      </a>
                    </li>
                    <li>
                      <a
                        rel="noopener noreferrer nofollow"
                        target="_blank"
                        href={`//pinterest.com/pin/create/button/?url=${currentUrl}`}
                      >
                        <i className="bi bi-pinterest" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="product-content">
          <div>
            <ul className="nav nav-tabs" id="productTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="product_content-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#product_content-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="product_content-tab-pane"
                  aria-selected="true"
                >
                  Mô tả sản phẩm
                </button>
              </li>
              {product.element != null && (
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="element-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#element-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="element-tab-pane"
                    aria-selected="false"
                  >
                    Thành phần
                  </button>
                </li>
              )}
              {product.uses != null && (
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="uses-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#uses-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="uses-tab-pane"
                    aria-selected="false"
                  >
                    Công dụng
                  </button>
                </li>
              )}
              {product.guide != null && (
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="user-manual-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#user-manual-pane"
                    type="button"
                    role="tab"
                    aria-controls="user-manual-pane"
                    aria-selected="false"
                  >
                    Hướng dẫn sử dụng
                  </button>
                </li>
              )}
            </ul>
            <div className="tab-content" id="productTabContent">
              <div
                className="tab-pane fade show active"
                id="product_content-tab-pane"
                role="tabpanel"
                aria-labelledby="product_content-tab"
                tabIndex={0}
              >
                <div
                  className="product-content__content"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                ></div>
              </div>
              <div
                className="tab-pane fade"
                id="element-tab-pane"
                role="tabpanel"
                aria-labelledby="element-tab"
                tabIndex={1}
              >
                <div
                  className="product-content__content"
                  dangerouslySetInnerHTML={{ __html: product.element }}
                ></div>
              </div>
              <div
                className="tab-pane fade"
                id="uses-tab-pane"
                role="tabpanel"
                aria-labelledby="uses-tab"
                tabIndex={2}
              >
                <div
                  className="product-content__content"
                  dangerouslySetInnerHTML={{ __html: product.uses }}
                ></div>
              </div>
              <div
                className="tab-pane fade"
                id="user-manual-pane"
                role="tabpanel"
                aria-labelledby="user-manual-tab"
                tabIndex={3}
              >
                <div
                  className="product-content__content"
                  dangerouslySetInnerHTML={{ __html: product.guide }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductView.propTypes = {
  product: PropTypes.object,
};
export default ProductView;
