import React, { useEffect, useState } from "react";
import classNames from "classnames";
import yup from "@/utils/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/button";
import Input from "@/components/input";
import PhoneInput from "@/components/phone-input";
import Select from "@/components/select";
import Container from "@/components/container";
import TopNavCart from "@/components/top-nav-cart";
import CartEmpty from "@/components/cart-empty";
import { getCartItemsInfo } from "@/apis/productApis";
import numberWithCommas from "@/utils/number-with-commas";
import useLocationForm from "@/components/location-vn";
import { addInfomation } from "@/store/slices/cartItemsSlide";
import accountApis from "@/apis/accountApis";
import { toast } from "react-toastify";
const ConfirmPayment = () => {
  const { t } = useTranslation();
  const { info } = useSelector((state) => state.account);
  const cartItems = useSelector((state) => state.cartItems.value);
  const infomation = useSelector((state) => state.cartItems.infomation);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [referralCode, setReferralCode] = useState(0);

  const [loadingUpdateConfirmPayment, setloadingUpdateConfirmPayment] =
    useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { state, onCitySelect, onDistrictSelect, onWardSelect } =
    useLocationForm(info || infomation ? true : false, infomation ? infomation : info?.userInformation);

  const {
    cityOptions,
    districtOptions,
    wardOptions,
    selectedCity,
    selectedDistrict,
    selectedWard,
  } = state;

  const schema = yup.object({
    email: yup
      .string()
      .email()
      .required()
      .max(255)
      .matches(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        t("validations:email")
      )
      .trim(),
    referralCode: yup
      .string()
      .notRequired()
      .nullable()
      .matches(
        /(^\s*$|(^SS)[0-9]{6}$)/,
        t("validations:referral_not_in_correct_format")
      ),
    fullName: yup.string().required().min(2).max(50).trim(),
    phoneCode: yup.string().max(5).trim().required().nullable(),
    phoneNumber: yup.string().min(9).max(20).trim().required().nullable(),
    address: yup.string().max(255).trim().required().nullable(),
    cityCode: yup.number().integer().required().nullable(),
    districtCode: yup.number().integer().required().nullable(),
    wardCode: yup.number().integer().required().nullable(),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    getValues,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: info?.email,
      fullName: info?.userInformation?.fullName,
      phoneCode: info?.phoneCode || "84",
      phoneNumber: info?.phoneNumber,
      address: info?.userInformation?.address,
      cityCode: info?.userInformation?.cityCode,
      districtCode: info?.userInformation?.districtCode,
      wardCode: info?.userInformation?.wardCode,
      referralCode: info?.userReferral?.referrerCode,
    },
    mode: "onChange",
  });

  const { phoneCode, phoneNumber } = useWatch({
    control,
  });

  const onSubmit = async (values) => {
    if (values.referralCode) {
      const checkExists = await accountApis.getUserWithUserCode({
        userCode: values.referralCode,
      });
      if (checkExists?.data === null) {
        return toast.error("Không tồn tại mã giới thiệu này")
      }
      if (info?.userCode === values.referralCode)
        return toast.error("Bạn không thể giới thiệu chính bạn");
    }
    setloadingUpdateConfirmPayment(true);
    dispatch(addInfomation(values));
    navigate("/payment");
  };

  useEffect(() => {
    setReferralCode(info?.userReferral?.referrerCode);
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
    if (infomation) {
      setValue("email", infomation.email)
      setValue("fullName", infomation.fullName)
      setValue("phoneCode", infomation.phoneCode)
      setValue("phoneNumber", infomation.phoneNumber)
      setValue("address", infomation.address)
      setValue("cityCode", infomation.cityCode)
      setValue("districtCode", infomation.districtCode)
      setValue("wardCode", infomation.wardCode)
      setValue("referralCode", infomation.referralCode)
    }
  }, [cartItems]);

  const getCartInfo = async () => {
    const cartItemInfo = await getCartItemsInfo(cartItems)
  }

  return (
    <Container title="Giỏ hàng">
      <div className="cart-page">
        <div className="container">
          {cartItems.length === 0 && <CartEmpty />}

          {cartItems.length !== 0 && (
            <>
              <TopNavCart />
              <form onSubmit={handleSubmit(onSubmit)} className="form-submit">
                <div className="cart">
                  <div className="cart__profile">
                    <div className="field mb-3">
                      <label>{t("display_name")}</label>
                      <Input
                        placeholder={t("display_name")}
                        {...register("fullName")}
                        className={classNames("form-control form-control-lg", {
                          "is-invalid": errors.fullName,
                        })}
                        autoComplete="off"
                      />
                      {errors.fullName && (
                        <div className="text-error">
                          {errors.fullName.message}
                        </div>
                      )}
                    </div>
                    <div className="field mb-3">
                      <label>{t("email")}</label>
                      <Input
                        placeholder={t("enter_your_email")}
                        {...register("email")}
                        className={classNames("form-control form-control-lg", {
                          "is-invalid": errors.email,
                        })}
                        autoComplete="off"
                      />

                      {errors.email && (
                        <div className="text-error">{errors.email.message}</div>
                      )}
                    </div>
                    <div className="field mb-3">
                      <label>{t("phone")}</label>
                      <PhoneInput
                        phoneCode={phoneCode.toString() || "84"}
                        phoneNumber={phoneNumber}
                        onChangePhoneNumber={(newValue) =>
                          setValue("phoneNumber", +newValue, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        onChangePhoneCode={(newValue) =>
                          setValue("phoneCode", newValue, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        namePhoneCode="phoneCode"
                        namePhoneNumber="phoneNumber"
                        register={register}
                        className={classNames("form-control form-control-lg", {
                          "is-invalid": errors.phoneNumber,
                        })}
                        autoComplete="off"
                      />
                      {errors.phoneNumber && (
                        <div className="text-error">
                          {errors.phoneNumber.message}
                        </div>
                      )}
                    </div>
                    <div className="field mb-3">
                      <label>{t("address")}</label>
                      <Input
                        placeholder={t("address")}
                        {...register("address")}
                        className={classNames("form-control form-control-lg", {
                          "is-invalid": errors.address,
                        })}
                        autoComplete="off"
                      />

                      {errors.address && (
                        <div className="text-error">
                          {errors.address.message}
                        </div>
                      )}
                    </div>
                    <div className="field mb-3">
                      <label>{t("city")}</label>
                      <Select
                        {...register("cityCode")}
                        key={`cityCode_${selectedCity?.value}`}
                        isDisabled={cityOptions.length === 0}
                        options={cityOptions}
                        onChange={(option) => {
                          option.value !== selectedCity?.value &&
                            onCitySelect(option);
                          option.value === 0 &&
                            setValue("cityCode", null, {
                              shouldDirty: true,
                            });
                          setValue("wardCode", null);
                          setValue("districtCode", null);
                          option.value !== 0 &&
                            setValue("cityCode", option.value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                        }}
                        placeholder={t("city")}
                        defaultValue={selectedCity}
                      />
                      {errors.cityCode && (
                        <div className="text-error">
                          {errors.cityCode.message}
                        </div>
                      )}
                    </div>
                    <div className="field mb-3">
                      <label>{t("district")}</label>
                      <Select
                        {...register("districtCode")}
                        key={`districtCode_${selectedDistrict?.value}`}
                        isDisabled={districtOptions.length === 0}
                        options={districtOptions}
                        onChange={(option) => {
                          option.value !== selectedDistrict?.value &&
                            onDistrictSelect(option);
                          setValue("districtCode", option.value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                        placeholder={t("district")}
                        defaultValue={selectedDistrict}
                      />
                      {errors.districtCode && (
                        <div className="text-error">
                          {errors.districtCode.message}
                        </div>
                      )}
                    </div>
                    <div className="field mb-3">
                      <label>{t("ward")}</label>
                      <Select
                        {...register("wardCode")}
                        key={`wardCode_${selectedWard?.value}`}
                        isDisabled={wardOptions.length === 0}
                        options={wardOptions}
                        placeholder={t("ward")}
                        onChange={(option) => {
                          onWardSelect(option);
                          setValue("wardCode", option.value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                        defaultValue={selectedWard}
                      />
                      {errors.wardCode && (
                        <div className="text-error">
                          {errors.wardCode.message}
                        </div>
                      )}
                    </div>
                    <div className="field mb-3">
                      <label>{t("referral_id")}</label>
                      <Input
                        placeholder={t("referral_id")}
                        disabled={referralCode}
                        {...register("referralCode")}
                        className={classNames("form-control form-control-lg", {
                          "is-invalid": errors.referralCode,
                        })}
                        autoComplete="off"
                      />

                      {errors.referralCode && (
                        <div className="text-error">
                          {errors.referralCode.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="cart__info">
                    <div className="cart__info__txt">
                      <p>Bạn đang có {totalProducts} sản phẩm trong giỏ hàng</p>
                      <div className="cart__info__txt__price">
                        <span>Thành tiền:</span>{" "}
                        <span>{numberWithCommas(Number(totalPrice))}đ</span>
                      </div>
                    </div>
                    <div className="cart__info__btn">
                      <Link to="/cart">
                        <Button className="btn-outline-primary" size="block">
                          Trở về giỏ hàng
                        </Button>
                      </Link>

                      <Button
                        className="btn btn-primary"
                        type="submit"
                        loading={loadingUpdateConfirmPayment}
                        // disabled={!isDirty}
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

export default ConfirmPayment;
