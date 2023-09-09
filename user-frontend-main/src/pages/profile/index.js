import AuthApis from "@/apis/authApis";
import Button from "@/components/button";
import Input from "@/components/input";
import InputCopy from "@/components/input-copy";
import PhoneInput from "@/components/phone-input";
import { setProfileAuth } from "@/store/slices/accountSlice";
import errorHelper from "@/utils/error-helper";
import successHelper from "@/utils/success-helper";
import yup from "@/utils/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import Select from "@/components/select";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import useLocationForm from "@/components/location-vn";
import Container from "@/components/container";
import { MASTER_DATA_NAME, STATUS_ORDER } from "@/constants";
import accountApis from "@/apis/accountApis";
import { list } from "postcss";
import orderApis from "@/apis/orderApis";
import numberWithCommas from "@/utils/number-with-commas";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import configDataApis from "@/apis/configDataApis";

const renderTooltip = (props) => {
  return (
    <Tooltip id="button-tooltip">
      {props.map((prop) => {
        if (prop.amount > 0) {
          return (
            <div key={prop.level}>
              {prop.level} : {prop.amount}
            </div>
          );
        }
      })}
    </Tooltip>
  );
}
const Profile = () => {
  const { t } = useTranslation();
  const { info } = useSelector((state) => state.account);
  const dispatch = useDispatch();
  const [listReferrer, setListReferrer] = useState([])
  const [listReferrerWithLevel, setListReferrerWithLevel] = useState([])
  const [myBuyOfMonth, setMyBuyOfMonth] = useState(0)
  const [refBuyOfMonth, setRefBuyOfMonth] = useState(0)
  const { state, onCitySelect, onDistrictSelect, onWardSelect } =
  useLocationForm(true, info?.userInformation);

  const getListReferrer = async () => {
    const accounts = await accountApis.getMyReferrer(info.id)
    setListReferrer(accounts)
    const listLevel = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.LEVEL_USER,
    });
    const referrerWithLevel = [];
    listLevel.map((level) => {
      const userWithLevel = accounts.filter((a) => a.register.level === level.id);
      const quest = accounts.filter((a) => a.register.level === 0);
      referrerWithLevel.push({
        level: level.name,
        amount: userWithLevel.length,
      });
    })
    setListReferrerWithLevel(referrerWithLevel)
  }

  const getOrder = async () => {
    const myOrders = await orderApis.getOrderUser(info.id)
    const refsOrders = await orderApis.getOrderRef()
    let thisMonth = new Date().getMonth() + 1;

    setMyBuyOfMonth(
      myOrders
        .filter(
          (e) =>
            new Date(e.orderDate).getMonth() + 1 === thisMonth &&
            e.orderStatus === STATUS_ORDER.DELIVERED
        )
        .reduce((sum, order) => (sum = sum + order.totalBeforeFee), 0)
    );

    setRefBuyOfMonth(
      refsOrders
        .filter((e) => new Date(e.orderDate).getMonth() + 1 === thisMonth)
        .reduce((sum, order) => (sum = sum + order.totalBeforeFee), 0)
    );

  }

  useEffect(() => {
    getListReferrer()
  }, [])

  useEffect(() => {
    getOrder()
  }, [listReferrer])

  const {
    cityOptions,
    districtOptions,
    wardOptions,
    selectedCity,
    selectedDistrict,
    selectedWard,
  } = state;

  const schema = yup.object({
    fullName: yup.string().required().min(3).max(50).trim(),
    phoneCode: yup.string().max(5).trim().required().nullable(),
    phoneNumber: yup.string().min(9).max(20).trim().required().nullable(),
    address: yup.string().max(255).trim().required().nullable(),
    userCode: yup.string(),
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
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: info?.email,
      fullName: info?.userInformation?.fullName,
      phoneCode: info?.phoneCode || "84",
      phoneNumber: info?.phoneNumber,
      address: info?.userInformation?.address,
      userCode: info?.userCode,
      cityCode: info?.userInformation?.cityCode,
      districtCode: info?.userInformation?.districtCode,
      wardCode: info?.userInformation?.wardCode,
    },
    mode: "onChange",
  });

  const { phoneCode, phoneNumber, userCode, cityCode, districtCode, wardCode } =
    useWatch({
      control,
    });

  const [loadingUpdateProfile, setLoadingUpdateProfile] = useState(false);

  const onSubmit = (values) => {
    const {
      fullName,
      phoneCode,
      phoneNumber,
      address,
      cityCode,
      districtCode,
      wardCode,
    } = values;
    setLoadingUpdateProfile(true);
    AuthApis.updateProfileUser({
      id: info?.id,
      fullName,
      phoneNumber: `${+phoneNumber}`,
      phoneCode: +phoneCode,
      address,
      cityCode: +cityCode,
      districtCode: +districtCode,
      wardCode: +wardCode,
    })
      .then(() => {
        return AuthApis.getProfile();
      })
      .then((res) => {
        successHelper(t("update_profile_success"));
        dispatch(setProfileAuth(res));
        reset({
          fullName,
          phoneNumber: +phoneNumber,
          phoneCode: +phoneCode,
          address,
          cityCode: +cityCode,
          districtCode: +districtCode,
          wardCode: +wardCode,
        });
      })
      .catch((err) => {
        errorHelper(err);
      })
      .finally(() => {
        setLoadingUpdateProfile(false);
      });
  };

  useEffect(() => {
    AuthApis.getProfile()
      .then((res) => {
        dispatch(setProfileAuth(res));
      })
      .catch((err) => {
        errorHelper(err);
      })
      .finally(() => { });
  }, []);

  return (
    <Container title={t("profile")}>
      <div className="profile-user">
        <div className="row">
          <div className="col-lg-4">
            <div className="card card-profile">
              <div className="card-body">
                <div className="card-top text-primary">
                  <div className="card-left">
                    {numberWithCommas(myBuyOfMonth ? myBuyOfMonth : 0)}đ
                  </div>
                  <div className="card-right">
                    <i className="bi bi-currency-dollar"></i>
                  </div>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{ width: `${(myBuyOfMonth / 15000000) * 100}%` }}
                    aria-valuenow={50}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <p className="card-text">Doanh số trong tháng</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card card-profile">
              <div className="card-body">
                <div className="card-top text-info">
                  <div className="card-left ">
                    {numberWithCommas(refBuyOfMonth ? refBuyOfMonth : 0)}đ
                  </div>
                  <div className="card-right">
                    <i className="bi bi-graph-up-arrow"></i>
                  </div>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar bg-info"
                    role="progressbar"
                    style={{ width: `${(refBuyOfMonth / 15000000) * 100}%` }}
                    aria-valuenow={50}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <p className="card-text">
                  Doanh số người giới thiệu trong tháng
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card card-profile">
              <div className="card-body">
                <div className="card-top text-warning">
                  <div className="card-left">{listReferrer.length}</div>
                  {listReferrer.length > 0 && (
                    <div className="card-right">
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip(listReferrerWithLevel)}
                      >
                        <i className="bi bi-people"></i>
                      </OverlayTrigger>
                    </div>
                  )}
                  {listReferrer.length === 0 && (
                    <div className="card-right">
                      <i className="bi bi-people"></i>
                    </div>
                  )}
                </div>
                <div className="progress">
                  <div
                    className="progress-bar bg-warning"
                    style={{ width: `${(listReferrer.length / 20) * 100}%` }}
                    role="progressbar"
                    aria-valuenow={listReferrer.length}
                    aria-valuemin={0}
                    aria-valuemax={20}
                  />
                </div>

                <p className="card-text">Số lượng người giới thiệu</p>
              </div>
            </div>
          </div>
        </div>

        <div className="gap--30"></div>
        <h3 className="title--sub">Thông tin cá nhân</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="form-submit">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="field mb-3">
                <label>{t("referral_id")}</label>
                <InputCopy
                  value={userCode}
                  disabled
                  className={classNames("form-control form-control-lg", {
                    "is-invalid": errors.userCode,
                  })}
                  autoComplete="off"
                />
              </div>

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
                  <div className="text-error">{errors.fullName.message}</div>
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
                  disabled
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
                  <div className="text-error">{errors.phoneNumber.message}</div>
                )}
              </div>
            </div>
            <div className="col-lg-6">
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
                  <div className="text-error">{errors.address.message}</div>
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
                  <div className="text-error">{errors.cityCode.message}</div>
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
                    setValue("wardCode", null);
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
                  <div className="text-error">{errors.wardCode.message}</div>
                )}
              </div>

              <div className="d-flex justify-content-end mt-5">
                <Button
                  className="btn btn-primary"
                  type="submit"
                  loading={loadingUpdateProfile}
                  disabled={!isDirty}
                >
                  Cập nhật thông tin
                </Button>
              </div>
            </div>
          </div>
        </form>

        <div className="gap--30"></div>
      </div>
    </Container>
  );
};

export default Profile;
