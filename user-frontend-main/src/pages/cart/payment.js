import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames";
import Container from "@/components/container";
import Button from "@/components/button";
import CartEmpty from "@/components/cart-empty";
import TopNavCart from "@/components/top-nav-cart";
import { getCartItemsInfo } from "@/apis/productApis";
import numberWithCommas from "@/utils/number-with-commas";
import Textarea from "@/components/textarea";
import errorHelper from "@/utils/error-helper";
import successHelper from "@/utils/success-helper";
import yup from "@/utils/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";
import orderApis from "@/apis/orderApis";
import { clearSession } from "@/store/slices/cartItemsSlide";
import commissionApis from "@/apis/commissionApis";
import { COMMISSION_TYPE, TOKEN_API } from "@/constants";
import shipApis from "@/apis/shipApis";
import { getLocation } from "@/components/location-vn";

const Payment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const cartItems = useSelector((state) => state.cartItems.value);
  const cartInfomation = useSelector((state) => state.cartItems.infomation);
  const userInfo = useSelector((state) => state.account.info);

  const [cartProducts, setCartProducts] = useState();
  const [unitGhn, setUnitGhn] = useState();
  const [unitGhtk, setUnitGhtk] = useState();
  const [fee, setFee] = useState(0);

  const [totalProducts, setTotalProducts] = useState(0);

  const [totalPrice, setTotalPrice] = useState(0);
  const [commission, setCommission] = useState();

  const schema = yup.object({
    notes: yup.string().max(255).trim().nullable(),
    deliveryMethod: yup.mixed().required(),
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [loadingSelectPayment, setLoadingSelectPayment] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedMethodPayment, setSelectedMethodPayment] = useState(0);
  const [selectedBank, setSelectedBank] = useState(1);

  const onSubmit = async (values) => {
    const districtAndCity = await getLocation(
      cartInfomation.cityCode,
      cartInfomation.districtCode,
      cartInfomation.wardCode
    );

    const { notes, deliveryMethod, paymentMethod } = values;
    let typePayment = paymentMethod === "0" ? "0" : `${selectedBank}`;
    const body = {
      deliveryMethod,
      paymentMethod: typePayment,
      note: notes,
      fee: fee,
      listProduct: cartProducts,
      userId: userInfo ? `${userInfo.id}` : null,
      telephone: `+${cartInfomation.phoneCode}${cartInfomation.phoneNumber}`,
      email: cartInfomation.email,
      referralCode: cartInfomation.referralCode,
      address: cartInfomation.address,
      fullName: cartInfomation.fullName,
      cityCode: cartInfomation.cityCode,
      districtCode: cartInfomation.districtCode,
      wardCode: cartInfomation.wardCode,
      districtAndCity
    };
    setLoadingSelectPayment(true);
    orderApis
      .createOrder(body)
      .then((rs) => {
        if (typePayment === "0") {
          dispatch(clearSession());
          successHelper(t("order_success"));
          navigate(`/payment-success/${rs.order.orderCode}`);
        } else if (typePayment === "1") {
          orderApis
            .createPaymentMomo({
              requestType: "captureWallet",
              ipnUrl: `${window.location.origin}/payment-success/${rs.order.orderCode}`,
              redirectUrl: `${window.location.origin}/payment-success/${rs.order.orderCode}`,
              amount: rs.order.total,
              orderInfo: `CK cho đơn hàng ${rs.order.orderCode}`,
              extraData: "",
            })
            .then((url) => {
              window.location.href = url;
            })
            .finally(dispatch(clearSession()));
        } else if (typePayment === "2") {
          orderApis
            .createPaymentVnpay({
              amount: rs.order.total,
              orderDescription: `CK cho đơn hàng ${rs.order.orderCode}`,
              bankCode: "",
              orderType: "other",
              language: "vn",
              returnUrl: `${window.location.origin}/payment-success/${rs.order.orderCode}`,
            })
            .then((url) => {
              window.location.href = url;
            })
            .finally(dispatch(clearSession()));
        }
      })
      .catch((err) => {
        errorHelper(err);
      })
      .finally(() => {
        setLoadingSelectPayment(false);
      });
  };

  useEffect(() => {
    if (totalPrice > 0) {
      getFeeGhtk();
      getFeeGhn();
    }
  }, [totalPrice]);

  useEffect(() => {
    // getUnitShipper();
    getListCommission();
  }, [])

  useEffect(() => {
    getCartInfo()
    setTotalPrice(
      cartItems.reduce(
        (total, item) => total + Number(item.quantity) * Number(item.price),
        0
      )
    );
    setTotalProducts(
      cartItems.reduce((total, item) => total + Number(item.quantity), 0)
    );
  }, [cartItems]);

  const getCartInfo = async () => {
    const cartItemInfo = await getCartItemsInfo(cartItems)
    setCartProducts(cartItemInfo);
  }

  const handlePaymentMethodChange = (e) => {
    setSelectedMethodPayment(e.target.value);
  };

  const handleBankChange = (e) => {
    setSelectedBank(e.target.value);
  };
  const changeDeliveryMethod = (e) => {
    setValue("deliveryMethod", e.target.value);
    switch(e.target.value) {
      case "1" :
        setFee(unitGhn?.total ? unitGhn.total : 0);
        break
      case "2" :
        setFee(unitGhtk?.fee?.fee ? unitGhtk?.fee?.fee : 0);
        break
    }
  } 

  const getFeeGhtk = async () => {
    const districtAndCity = await getLocation(
      cartInfomation.cityCode,
      cartInfomation.districtCode
    );
    const ghtk = await shipApis.calculatorFeeGhtk({
      pick_province: "Hà Nội",
      pick_district: "Hai Bà Trưng",
      province: districtAndCity.city,
      district: districtAndCity.district,
      address: "P.503 tòa nhà Auu Việt, số 1 Lê Đức Thọ",
      value: totalPrice,
      token: TOKEN_API.GIAO_HANG_TIET_KIEM,
    });

    setUnitGhtk(ghtk);
  }

  const getFeeGhn = async () => {
    const districtAndCity = await getLocation(
      cartInfomation.cityCode,
      cartInfomation.districtCode
    );
    setValue("deliveryMethod", "1");
    const fetchCity = await shipApis.getCity();
    const provideId = fetchCity.data.find(
      (city) => city.ProvinceName === districtAndCity.city
    ).ProvinceID;

    const fetchDistrict = await shipApis.getDistrict({
      province_id: provideId,
    });

    const districtId = fetchDistrict.data.find(
      (district) =>
        !!district.NameExtension.find(
          (e) => e.toLowerCase() === districtAndCity.district.toLowerCase()
        )
    ).DistrictID;

    const serviceAvailable = await shipApis.getService({
      from_district: 1488,
      to_district: districtId,
      shop_id: 1,
    });
  
    const calculatorFee = await shipApis.calculatorFeeGhn({
      from_district_id: 1488,
      service_id: serviceAvailable.data[0].service_id,
      to_district_id: districtId,
      insurance_value: totalPrice,
      weight: 200,
    });
    setUnitGhn(calculatorFee?.data);
    setFee(calculatorFee?.data?.total ? calculatorFee?.data?.total : 0);
    setLoading(false);
  };
  const getListCommission = async () => {
    const listCommission = await commissionApis.getListCommissionLevel({
      idLevel: userInfo ? userInfo.level : 0,
      type: COMMISSION_TYPE.AUTOMATION,
    });
    setCommission(userInfo ? listCommission[0]?.commissionConfig?.percent : null);
  }

  return (
    <Container title="Thanh toán">
      <div className="cart-page">
        <div className="container">
          {cartItems.length === 0 && <CartEmpty />}

          {cartItems.length !== 0 && (
            <>
              <TopNavCart />
              <form onSubmit={handleSubmit(onSubmit)} className="form-submit">
                <div className="cart">
                  <div className="w-75">
                    <div className="field mb-3">
                      <div className="card">
                        <div className="card-header">Phương thức giao hàng</div>
                        <div className="card-body">
                          <div
                            className="bank-list"
                            {...register("deliveryMethod")}
                            onChange={changeDeliveryMethod}
                          >
                            {" "}
                            <div className="bank-item">
                              <label className="d-flex bank-item__wrap">
                                <div className="align-self-center">
                                  <input
                                    className="form-check-input"
                                    name="ship"
                                    type="radio"
                                    value={1}
                                  />
                                </div>
                                <div className="bank-item__image">
                                  <img
                                    width={75}
                                    height={75}
                                    srcSet="https://play-lh.googleusercontent.com/Q874CkbeX3wp72FaPE-MxGhvkiPOVrpQwNSlYA4za6_WmftSHi4arWI--s5zHF7oejE"
                                    src="https://play-lh.googleusercontent.com/Q874CkbeX3wp72FaPE-MxGhvkiPOVrpQwNSlYA4za6_WmftSHi4arWI--s5zHF7oejE"
                                  />
                                </div>
                                <div
                                  className="bank-item__info"
                                  style={{ alignSelf: "center" }}
                                >
                                  <strong>Giao hàng nhanh&nbsp;</strong>
                                  <br />
                                  {unitGhn?.code_message_value}
                                </div>
                              </label>
                            </div>{" "}
                            <div>
                              <label className="d-flex bank-item__wrap">
                                <div className="align-self-center">
                                  <input
                                    className="form-check-input"
                                    id="bank-W5cb6f2d0d84cb"
                                    name="ship"
                                    disabled={loading}
                                    type="radio"
                                    value={2}
                                  />
                                </div>
                                <div className="bank-item__image">
                                  <img
                                    width={75}
                                    height={75}
                                    srcSet="https://static.topcv.vn/company_logos/eqTzkhv8IhtY7tMlX37OPyR5nUd8aH9l_1645580354____9f59e16ae214913e68c3b66a9e2fc0f0.jpg"
                                    src="https://static.topcv.vn/company_logos/eqTzkhv8IhtY7tMlX37OPyR5nUd8aH9l_1645580354____9f59e16ae214913e68c3b66a9e2fc0f0.jpg"
                                  />
                                </div>
                                <div
                                  className="bank-item__info"
                                  style={{ alignSelf: "center" }}
                                >
                                  <strong>Giao hàng tiết kiệm</strong>
                                </div>
                              </label>
                            </div>{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="field mb-3">
                      <div className="card">
                        <div className="card-header">
                          Phương thức thanh toán
                        </div>
                        <div className="card-body">
                          <div className="form-check">
                            <label className="form-check-label">
                              <input
                                {...register("paymentMethod")}
                                className="form-check-input"
                                name="paymentMethod"
                                type="radio"
                                value={0}
                                checked={selectedMethodPayment == 0}
                                onChange={handlePaymentMethodChange}
                              />
                              Nhận hàng trả tiền
                            </label>
                          </div>

                          <div className="form-check">
                            <label className="form-check-label">
                              <input
                                {...register("paymentMethod")}
                                className="form-check-input"
                                name="paymentMethod"
                                type="radio"
                                value={1}
                                checked={selectedMethodPayment == 1}
                                onChange={handlePaymentMethodChange}
                              />
                              Chuyển khoản
                            </label>
                          </div>

                          {errors.paymentMethod && (
                            <div className="text-error">
                              {errors.paymentMethod.message}
                            </div>
                          )}

                          {selectedMethodPayment == 1 && (
                            <div className="bank-list">
                              {" "}
                              <div className="bank-item">
                                <label className="d-flex bank-item__wrap">
                                  <div className="align-self-center">
                                    <input
                                      className="form-check-input"
                                      name="bank"
                                      type="radio"
                                      checked={selectedBank == 1}
                                      onChange={handleBankChange}
                                      value={1}
                                    />
                                  </div>
                                  <div className="bank-item__image">
                                    <img
                                      width={75}
                                      height={75}
                                      srcSet="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                                      src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                                    />
                                  </div>
                                  <div className="bank-item__info">
                                    <p>
                                      <strong>MOMO&nbsp;</strong>
                                      <br />
                                      Tên: Sheshi Shop&nbsp;
                                      <br />
                                    </p>
                                  </div>
                                </label>
                              </div>{" "}
                              <div className="bank-item">
                                <label className="d-flex bank-item__wrap">
                                  <div className="align-self-center">
                                    <input
                                      className="form-check-input"
                                      id="bank-W5cb6f2d0d84cb"
                                      name="bank"
                                      type="radio"
                                      checked={selectedBank == 2}
                                      onChange={handleBankChange}
                                      value={2}
                                    />
                                  </div>
                                  <div className="bank-item__image">
                                    <img
                                      width={75}
                                      height={75}
                                      srcSet="https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBd2w2SHc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--998573548f2a95e4b349ffbf42cfb623613039fd/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNIYVFJc0FXa0NMQUU9IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0=--ee4e4854f68df0a745312d63f6c2782b5da346cd/logo%20VNPAY-02.png"
                                      src="https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBd2w2SHc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--998573548f2a95e4b349ffbf42cfb623613039fd/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNIYVFJc0FXa0NMQUU9IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0=--ee4e4854f68df0a745312d63f6c2782b5da346cd/logo%20VNPAY-02.png"
                                    />
                                  </div>
                                  <div className="bank-item__info">
                                    <p>
                                      <strong>VNPAY&nbsp;</strong>
                                      <br />
                                      Tên: Sheshi Shop&nbsp;
                                      <br />
                                    </p>
                                  </div>
                                </label>
                              </div>{" "}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="field mb-3">
                      <label>{t("notes_for_orders")}</label>
                      <Textarea
                        className={classNames("form-control-lg", {
                          "is-invalid": errors.notes,
                        })}
                        {...register("notes")}
                        autoComplete="off"
                      />

                      {errors.notes && (
                        <div className="text-error">{errors.notes.message}</div>
                      )}
                    </div>
                  </div>

                  <div className="cart__info">
                    <div className="cart__info__txt">
                      <p>Bạn đang có {totalProducts} sản phẩm trong giỏ hàng</p>
                      <div className="cart__info__txt__price">
                        <span>Thành tiền :</span>{" "}
                        <span>{numberWithCommas(Number(totalPrice))}đ</span>
                      </div>
                      <div className="cart__info__txt__price">
                        <span>Phí giao hàng :</span>{" "}
                        <span>{numberWithCommas(Number(fee))}đ</span>
                      </div>
                      {commission && (
                        <>
                          <div className="cart__info__txt__price">
                            <span>Hoa hồng cấp ({commission}%) :</span>{" "}
                            <span>
                              {numberWithCommas(
                                Number((totalPrice * commission) / 100)
                              )}
                              đ
                            </span>
                          </div>
                          <div className="cart__info__txt__price">
                            <span>Tổng : </span>{" "}
                            <span>
                              {numberWithCommas(
                                Number(
                                  totalPrice +
                                    fee -
                                    (totalPrice * commission) / 100
                                )
                              )}
                              đ
                            </span>
                          </div>
                        </>
                      )}
                      {!commission && (
                        <div className="cart__info__txt__price">
                          <span>Tổng : </span>{" "}
                          <span>
                            {numberWithCommas(Number(totalPrice + fee))}đ
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="cart__info__btn">
                      <Link to="/payment-confirm">
                        <Button className="btn-outline-primary" size="block">
                          Trở về nhập địa chỉ
                        </Button>
                      </Link>
                      <Button
                        className="btn btn-primary"
                        type="submit"
                        disabled={loading}
                        loading={loadingSelectPayment}
                      >
                        {t("make_a_payment")}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Payment;
