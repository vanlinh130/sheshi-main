import Container from '@/components/container';
import Page from '@/components/page';
import { STORAGE_KEY } from '@/constants/storage-key';
import { changeTheme } from '@/store/slices/commonSlice';
import { MODE_THEME } from '@/constants';
import { setInfoAndTokenAccount, setProfileAuth, setToken } from '@/store/slices/accountSlice';
import LocalStorage from '@/utils/storage';
import yup from '@/utils/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Menu, Button, Dropdown, Input, Switch } from 'antd';
import React, { useState } from 'react';
import { SettingOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LogoIcon from '@/resources/images/logo/logo_icon.png';
import LogoText from '@/resources/images/logo/logo_text.svg';
import accountApis from '@/apis/accountApis';
import errorHelper from '@/utils/error-helper';
import axiosClient from '@/apis/axiosClient';
import LogoFull from '@/resources/images/logo/logosheshi.png';

const Login = () => {
    const { t } = useTranslation();
    const { theme } = useSelector((state) => state.common);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onChangeTheme = () => {
        const newTheme = theme === MODE_THEME.LIGHT ? MODE_THEME.DARK : MODE_THEME.LIGHT;
        dispatch(changeTheme(newTheme));
    };

    const schema = yup.object({
        email: yup
            .string()
            .email()
            .max(255)
            .required()
            .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, t('validations:email'))
            .trim(),
        password: yup.string().min(6).max(30).required().trim(),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [loading, setLoading] = useState(false);

    const onSubmit = (values) => {
        setLoading(true);

        accountApis
            .login({
                email: values.email,
                password: values.password,
            })
            .then(({ user, token }) => {
                axiosClient.defaults.headers.common = {
                    Authorization: `Bearer ${token}`,
                };

                LocalStorage.set(STORAGE_KEY.INFO, user);
                LocalStorage.set(STORAGE_KEY.TOKEN, token);
                dispatch(setToken(token));
                navigate('/');
                // return accountApis.getProfile()
            })
            // .then((res) => {
            //   dispatch(setProfileAuth(res))
            //   navigate('/')
            // })
            .catch((err) => {
                errorHelper(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Container title="Administration Control Panel - Login" className="login-container">
            <header className="login-header">
                <div className="login-header__left">
                    <div className="logo">
                        <div className="logo__icon">
                            <img src={LogoIcon} alt="logo icon" />
                        </div>
                        <div className="logo__text logo__text--light">
                            <img src={LogoText} alt="logo text" />
                        </div>
                    </div>
                </div>
                <div className="login-header__right">
                    <ul className="nav">
                        <li>
                            <Switch
                                checkedChildren={t('light')}
                                unCheckedChildren={t('dark')}
                                checked={theme === MODE_THEME.LIGHT}
                                onChange={onChangeTheme}
                            />
                        </li>
                    </ul>
                </div>
            </header>
            <Page className="login-page">
                <div className="login-page__col-left">
                    <div className="login-page__col-left__content">
                        <img className="login-page__logofull" src={LogoFull} alt="logo icon" />
                        {/* <h2 className="text-24">{t("slogan_text_1")}</h2>
            <p className="text-16">{t("slogan_text_2")}</p> */}
                    </div>
                </div>

                <div className="login-page__col-right justify-center py-50">
                    <form onSubmit={handleSubmit(onSubmit)} className="form-submit">
                        <div className="heading mb-5">
                            <h2 className="text-24">
                                {' '}
                                <UserOutlined /> <strong>{t('login_now')}</strong>
                            </h2>
                            <p className="text-15">{t('enter_your_credentials_to_login')}</p>
                        </div>

                        <div className="field mb-3">
                            <h4>{t('email')}</h4>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        prefix={<UserOutlined />}
                                        placeholder={t('email')}
                                        status={errors?.email?.message ? 'error' : null}
                                    />
                                )}
                            />
                            {errors?.email?.message && <p className="text-error">{errors?.email?.message}</p>}
                        </div>
                        <div className="field mb-3">
                            <h4>{t('password')}</h4>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <Input.Password
                                        {...field}
                                        prefix={<LockOutlined />}
                                        placeholder={t('password')}
                                        status={errors?.password?.message ? 'error' : null}
                                    />
                                )}
                            />
                            {errors?.password?.message && <p className="text-error">{errors?.password?.message}</p>}
                        </div>

                        <div className="d-block justify-content-center mt-5">
                            <Button
                                loading={loading}
                                htmlType="submit"
                                type="primary"
                                shape="round"
                                className="btn btn-primary btn-submit"
                            >
                                {t('login')}
                            </Button>
                        </div>
                    </form>
                </div>
            </Page>
        </Container>
    );
};

export default Login;
