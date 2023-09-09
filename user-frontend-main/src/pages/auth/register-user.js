import AuthApis from "@/apis/authApis";
import Button from "@/components/button";
import Input from "@/components/input";
import InputPassword from "@/components/input-password";
import errorHelper from "@/utils/error-helper";
import successHelper from "@/utils/success-helper";
import yup from "@/utils/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import classNames from "classnames";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import Container from "@/components/container";
const SignUpUser = () => {
  const { t } = useTranslation();
  const { referralCode } = useParams();
  const refCountdownOtp = useRef();
  const navigate = useNavigate();

  const schema = useMemo(
    () =>
      yup.object().shape({
        referralCode: yup
          .string()
          .notRequired()
          .nullable()
          .matches(
            /(^\s*$|(^SS)[0-9]{6}$)/,
            t("validations:referral_not_in_correct_format")
          ),
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
        fullName: yup.string().required().min(3).max(50).trim(),
        password: yup.string().required().min(6).max(30).trim(),
        confirmPass: yup
          .string()
          .when("password", {
            is: (val) => (val && val.length > 0 ? true : false),
            then: yup
              .string()
              .oneOf(
                [yup.ref("password")],
                t("validations:password_not_match")
              ),
          })
          .required()
          .trim(),
      }),
    [t]
  );

  useEffect(() => {
    setValue('referralCode', referralCode)
  }, [])

  const {
    trigger,
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = (values) => {
    const { email, password, username, fullName, referralCode } = values;

    setLoading(true);
    AuthApis.signUpUser({
      email,
      password,
      username,
      fullName,
      referralCode,
    })
      .then(() => {
        successHelper(t("sign_up_success"));
        navigate("/login");
      })
      .catch((err) => {
        errorHelper(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container title={t("sign_up")}>
      <div className="sign-up-page">
        <div className="container">
          <div className="row justify-content-center">
            {/* <div className="col col-12 col-lg-7 col-xl-7 p-0 d-none d-lg-block">
            </div> */}
            <div className="col-lg-5">
              <form onSubmit={handleSubmit(onSubmit)} className="form-submit">
                <div className="field mb-3">
                  <h3 className="title">{t("sign_up")}</h3>
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
                  />

                  {errors.email && (
                    <div className="text-error">{errors.email.message}</div>
                  )}
                </div>

                <div className="field mb-3">
                  <label>{t("password")}</label>
                  <InputPassword
                    placeholder={t("password")}
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
                    <div className="text-error">{errors.password.message}</div>
                  )}
                </div>
                <div className="field mb-3">
                  <label>{t("confirm_password")}</label>
                  <InputPassword
                    placeholder={t("confirm_password")}
                    {...register("confirmPass")}
                    className={classNames("form-control form-control-lg", {
                      "is-invalid": errors.confirmPass,
                    })}
                    autoComplete="off"
                    type="password"
                    onChange={(e) =>
                      setValue(
                        "confirmPass",
                        (e.target.value || "").replace(" ", ""),
                        {
                          shouldValidate: true,
                          shouldDirty: true,
                        }
                      )
                    }
                  />
                  {errors.confirmPass && (
                    <div className="text-error">
                      {errors.confirmPass.message}
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

                <div className="d-flex justify-content-center mt-5">
                  <Button
                    className="btn btn-submit"
                    type="submit"
                    loading={loading}
                  >
                    {t("sign_up")}
                  </Button>
                </div>

                <div className="mt-3 text-center">
                  <label>
                    <small>{t("already_account")} </small>
                    <Link to="/login" className="forgot-pass">
                      {t("login")}
                    </Link>
                  </label>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SignUpUser;
