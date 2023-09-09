import React, { useState, useEffect } from "react";
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
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import configDataApis from "@/apis/configDataApis";

const ProductViewCom = (props) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const propProduct = props.product;
  const [product, setProduct] = useState(props.product);
  const cartItems = useSelector((state) => state.cartItems.value);
  const [capacity, setCapacity] = useState()
  const [price, setPrice] = useState()
  const [previewImg, setPreviewImg] = useState(product.image01);
  const [descriptionExpand, setDescriptionExpand] = useState(false);
  const [detailProductQuantity, setDetailProductQuantity] = useState();
  const [quantity, setQuantity] = useState(1);

  const [masterUnit, setMasterUnit] = useState([])
  const [masterCapacity, setMasterCapacity] = useState([])

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
          capacityId: capacity?.id,
          unitId: unit?.id,
          price: e.price,
          quantity: propProduct.productInventory.find(
            (prdInv) =>
              prdInv.productId === e.productId && prdInv.subProductId === e.id
          )?.quantity,
          value: capacity?.id + "-" + unit?.id,
          name: capacity?.name + " " + unit?.name,
        });
      })
    }

    setProduct({
      name: propProduct.name,
      imageMain: propProduct.productImage?.find((e) => e.isMain === IMAGE_TYPE.MAIN)
        ?.image,
      imageSub: propProduct.productImage?.filter((e) => e.isMain === IMAGE_TYPE.SUB),
      categorySlug: propProduct.productCategory?.categorySlug,
      slug: propProduct.productSlug,
      description: propProduct.description,
      productDetailOption
    });
    setPrice(productDetailOption[0]?.price)
    setCapacity(productDetailOption[0]?.capacityId + '-' + productDetailOption[0]?.unitId)
    setDetailProductQuantity(productDetailOption[0]?.quantity)
  }, [propProduct, masterUnit]);

  useEffect(() => {
    setPreviewImg(product.imageMain);
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

  return (
    <div className="product">
      <div className="row">
        <div className="col-lg-7">
          <div className="product__images">
            <div className="product__images__main">
              <img src={product.imageMain} alt="" />
            </div>

            {/* <div
              className={`product-description ${descriptionExpand ? "expand" : ""}`}
            >
              <div className="product-description__title">Mô tả sản phẩm</div>
              <div
                className="product-description__content"
                dangerouslySetInnerHTML={{ __html: product.description }}
              ></div>
               <div className="product-description__toggle">
                <Button
                  size="sm"
                  onClick={() => setDescriptionExpand(!descriptionExpand)}
                >
                  {descriptionExpand ? "Thu gọn" : "Xem thêm"}
                </Button>
              </div> 
            </div> */}
          </div>
        </div>
        <div className="col-lg-5">
          <div className="product__info">
            <h1 className="product__info__title">{product.name}</h1>
            <div className="product__info__item">
              <span className="product__info__item__price">
                {price && numberWithCommas(price)}đ
              </span>
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
            <div className="product__info__item">
              <Button
                className="btn-outline-primary btn-lg"
                onClick={() => addToCart()}
              >
                <i className="bi bi-bag"></i> Thêm vào giỏ
              </Button>
              <Button className="btn-primary btn-lg" onClick={() => goToCart()}>
                Mua ngay
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 
      <div
        className={`product-description mobile ${descriptionExpand ? "expand" : ""
          }`}
      >
        <div className="product-description__title">Chi tiết sản phẩm</div>
        <div
          className="product-description__content"
          dangerouslySetInnerHTML={{ __html: product.description }}
        ></div>
        <div className="product-description__toggle">
          <Button
            size="sm"
            onClick={() => setDescriptionExpand(!descriptionExpand)}
          >
            {descriptionExpand ? "Thu gọn" : "Xem thêm"}
          </Button>
        </div>
      </div> */}
    </div>
  );
};

ProductViewCom.propTypes = {
  product: PropTypes.object,
};
export default ProductViewCom;
