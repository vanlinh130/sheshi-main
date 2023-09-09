import AuthApis from "@/apis/authApis";
import axiosClient from "@/apis/axiosClient";
import Button from "@/components/button";
import Input from "@/components/input";
import InputPassword from "@/components/input-password";
import { LOGIN_TYPE } from "@/constants";
import { STORAGE_KEY } from "@/constants/storage-key";
import { setProfileAuth, setToken } from "@/store/slices/accountSlice";
import errorHelper from "@/utils/error-helper";
import LocalStorage from "@/utils/storage";
import successHelper from "@/utils/success-helper";
import yup from "@/utils/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import classNames from "classnames";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Container from "@/components/container";
import { checkConditionLevelUp } from "@/utils/funcs";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    password: yup.string().required().min(6).max(30).trim(),
    type: yup.number().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: LOGIN_TYPE.USER,
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = (values) => {
    const { type, email, password } = values;

    setLoading(true);
    AuthApis.login({ type, email, password })
      .then(({ token }) => {
        axiosClient.defaults.headers.common = {
          Authorization: `Bearer ${token}`,
        };

        LocalStorage.set(STORAGE_KEY.TOKEN, token);
        dispatch(setToken(token));

        return AuthApis.getProfile();
      })
      .then((res) => {
        checkConditionLevelUp(res)
        dispatch(setProfileAuth(res));
        navigate("/");
      })
      .catch((err) => {
        errorHelper(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container title={t("login")}>
      <div className="login-page">
        <div className="container">
          <div className="row justify-content-center">
            {/* <div className="col col-12 col-lg-8 col-xl-8 p-0 d-none d-lg-block">

            </div> */}
            <div className="col-lg-4">
              <form onSubmit={handleSubmit(onSubmit)} className="form-submit">
                <div className="field mb-3">
                  <h3 className="title">{t("login")}</h3>
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
                    <div className="text-error">{errors.password.message}</div>
                  )}
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <label>
                    <Link to="/forgot-password" className="forgot-pass">
                      {t("forgot_password")}
                    </Link>
                  </label>
                </div>

                <div className="d-flex justify-content-center mt-4">
                  <Button
                    className="btn btn-submit"
                    type="submit"
                    loading={loading}
                  >
                    {t("login")}
                  </Button>
                </div>
                <div className="mt-3 text-center">
                  <label>
                    <small>{t("already_account")} </small>
                    <Link to="/sign-up" className="forgot-pass">
                      {t("sign_up")}
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

export default Login;
