import AuthApis from "@/apis/authApis";
import Button from "@/components/button";
import Input from "@/components/input";
import InputOtp from "@/components/input-otp";
import InputPassword from "@/components/input-password";
import { OTP_CODE_TYPE } from "@/constants";
import errorHelper from "@/utils/error-helper";
import successHelper from "@/utils/success-helper";
import yup from "@/utils/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import Container from "@/components/container";
const ForgotPassword = () => {
  const { t } = useTranslation();
  const refCountdownOtp = useRef();
  const navigate = useNavigate();

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
    emailVerified: yup.bool().required().default(false),
    otpCode: yup.string().when("emailVerified", {
      is: true,
      then: yup.string().length(6).required().trim(),
    }),
    password: yup.string().when("emailVerified", {
      is: true,
      then: yup.string().required().min(6).max(30).trim(),
    }),
    rePassword: yup.string().when("password", {
      is: (val) => (val && val.length > 0 ? true : false),
      then: yup
        .string()
        .oneOf([yup.ref("password")], t("validations:password_not_match")),
    }),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      emailVerified: false,
    },
  });

  const { emailVerified, email, otpCode } = useWatch({
    control,
  });

  const [loading, setLoading] = useState(false);
  const [loadingSentCodeEmail, setLoadingSentCodeEmail] = useState(false);
  const [countdownEmail, setCountdownEmail] = useState(60);

  const onSendEmailOTP = () => {
    setLoadingSentCodeEmail(true);
    AuthApis.sendOTP({
      email: (email || "").trim(),
      type: OTP_CODE_TYPE.FORGOT_PASSWORD,
    })
      .then(() => {
        setCountdownEmail((preCount) => preCount - 1);
        clearInterval(refCountdownOtp.current);
        refCountdownOtp.current = setInterval(() => {
          setCountdownEmail((preCount) => preCount - 1);
        }, 1000);
      })
      .catch((err) => {
        errorHelper(err);
      })
      .finally(() => {
        setLoadingSentCodeEmail(false);
      });
  };

  const onSubmit = (values) => {
    const { email, otpCode, password, rePassword } = values;

    setLoading(true);
    setLoadingSentCodeEmail(true);
    if (!values?.emailVerified) {
      AuthApis.sendOTP({
        email: values.email,
        type: OTP_CODE_TYPE.FORGOT_PASSWORD,
      })
        .then(() => {
          setCountdownEmail((preCount) => preCount - 1);
          clearInterval(refCountdownOtp.current);
          refCountdownOtp.current = setInterval(() => {
            setCountdownEmail((preCount) => preCount - 1);
          }, 1000);
          setValue("emailVerified", true, { shouldValidate: true });
        })
        .catch((err) => {
          errorHelper(err);
        })
        .finally(() => {
          setLoadingSentCodeEmail(false);
          setLoading(false);
        });
    } else {
      AuthApis.resetPassword({
        email,
        otpCode,
        password,
        rePassword,
      })
        .then(() => {
          successHelper(t("reset_password_success"));
          navigate("/login");
        })
        .catch((err) => {
          errorHelper(err);
        })
        .finally(() => {
          setLoadingSentCodeEmail(false);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (countdownEmail === 0) {
      clearInterval(refCountdownOtp.current);
      setCountdownEmail(60);
    }
  }, [countdownEmail]);

  return (
    <Container title={t("forgot_password")}>
      <div className="forgot-password-page">
        <div className="container">
          <div className="row justify-content-center">
            {/* <div className="col col-12 col-lg-8 col-xl-8 p-0 d-none d-lg-block"></div> */}
            <div className="col-lg-4">
              <form onSubmit={handleSubmit(onSubmit)} className="form-submit">
                <div className="field mb-3">
                  <h3 className="title">{t("forgot_password")}</h3>
                </div>
                {emailVerified && (
                  <div className="field mb-3">
                    <label>{t("email_otp")}</label>
                    <InputOtp
                      {...register("otpCode")}
                      onChange={(value) =>
                        setValue("otpCode", value, { shouldValidate: true })
                      }
                      value={otpCode || ""}
                      placeholder={t("email_otp")}
                      className={classNames({ "is-invalid": errors.otpCode })}
                      autoComplete="off"
                      countdown={countdownEmail}
                      onSendOTP={async () => {
                        const isValidEmail = await trigger("email");

                        if (isValidEmail) {
                          onSendEmailOTP();
                        }
                      }}
                      loading={loadingSentCodeEmail}
                      disabledSend={errors?.email}
                    />

                    {errors.otpCode && (
                      <div className="text-error">{errors.otpCode.message}</div>
                    )}
                  </div>
                )}
                <div className="field mb-3">
                  <label>{t("email")}</label>
                  <Input
                    placeholder={t("enter_your_email")}
                    {...register("email")}
                    className={classNames("form-control form-control-lg", {
                      "is-invalid": errors.email,
                    })}
                    autoComplete="off"
                    disabled={emailVerified}
                  />

                  {errors.email && (
                    <div className="text-error">{errors.email.message}</div>
                  )}
                </div>

                {emailVerified && (
                  <div className="field mb-3">
                    <label>{t("password")}</label>
                    <InputPassword
                      placeholder={t("enter_your_password")}
                      {...register("password")}
                      className={classNames("form-control form-control-lg", {
                        "is-invalid": errors.password,
                      })}
                      autoComplete="off"
                      type="password"
                      onChange={(e) =>
                        setValue(
                          "password",
                          (e.target.value || "").replace(" ", ""),
                          {
                            shouldValidate: true,
                            shouldDirty: true,
                          }
                        )
                      }
                    />
                    {errors.password && (
                      <div className="text-error">
                        {errors.password.message}
                      </div>
                    )}
                  </div>
                )}
                {emailVerified && (
                  <div className="field mb-3">
                    <label>{t("confirm_password")}</label>
                    <InputPassword
                      placeholder={t("confirm_password")}
                      {...register("rePassword")}
                      className={classNames("form-control form-control-lg", {
                        "is-invalid": errors.rePassword,
                      })}
                      autoComplete="off"
                      type="password"
                      onChange={(e) =>
                        setValue(
                          "rePassword",
                          (e.target.value || "").replace(" ", ""),
                          {
                            shouldValidate: true,
                            shouldDirty: true,
                          }
                        )
                      }
                    />
                    {errors.rePassword && (
                      <div className="text-error">
                        {errors.rePassword.message}
                      </div>
                    )}
                  </div>
                )}
                <div className="d-flex justify-content-center mt-5 mb-3">
                  <Button
                    className="btn btn-submit"
                    type="submit"
                    loading={loading}
                  >
                    {emailVerified ? t("submit") : t("continue")}
                  </Button>
                </div>
                <div className="field">
                  <Link to="/login" className="py-3">
                    <i className="bi bi-arrow-return-left me-2"></i>
                    <small>{t("back_to_login")}</small>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ForgotPassword;
