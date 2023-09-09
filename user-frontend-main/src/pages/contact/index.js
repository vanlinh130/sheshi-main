import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/button";
import Input from "@/components/input";
import Textarea from "@/components/textarea";
import errorHelper from "@/utils/error-helper";
import successHelper from "@/utils/success-helper";
import yup from "@/utils/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Container from "@/components/container";
import { useForm, useWatch } from "react-hook-form";
import classNames from "classnames";
import contractApis from "@/apis/contractApis";
import { formatNumber } from '@/utils/funcs'
import { CONTACT_PAGE } from "@/constants";
import configPageApis from "@/apis/configPageApis";
const Contact = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const schema = useMemo(
    () =>
      yup.object().shape({
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
        phoneNumber: yup.string().min(9).max(11).required().matches(
          /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
          "Không đúng số điện thoại"
        )
        //phoneNumber: yup.number().min(9).max(11).required().nullable(true),
      }),
    [t]
  );

  const {
    trigger,
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);
  const [infomationContact, setInfomationContact] = useState();

  const fetchContact = async () => {
    const contact = await configPageApis.getListConfigPageContact();
    setInfomationContact(
      contact.find((ct) => ct.type === CONTACT_PAGE.CONTRACT)
    );
  }

  useEffect(() => {
    fetchContact();
  }, []);
  const onSubmit = (values) => {
    contractApis.createContractData(values)
      .then(() => {
        reset({
          email: "",
          fullName: "",
          phoneNumber: "",
          content: "",
        });
        successHelper(t("save_contract_success"));
      })
      .catch((err) => {
        errorHelper(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container title={t("contact")}>
      <div className="pages">
        <section className="title--page text-center">
          <div className="container">
            <h3>{t("contact")}</h3>
          </div>
        </section>
        <div className="contact">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 spacing_lager">
                <div className="contact__info">
                  <p>
                    Nếu bạn có thắc mắc hãy liên hệ với chúng tôi qua địa chỉ
                  </p>

                  {infomationContact && (
                    <div className="contact__info__list">
                      <div className="row mb-3">
                        <div className="col-lg-4">Điện thoại:</div>
                        <div className="col-lg-8">
                          {infomationContact.telephone}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-lg-4">Địa chỉ:</div>
                        <div className="col-lg-8">
                          {infomationContact.address}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-lg-4">Email:</div>
                        <div className="col-lg-8">
                          {infomationContact.email}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-lg-4">Thời gian làm việc:</div>
                        <div className="col-lg-8">
                          {infomationContact.timeWorking}
                        </div>
                      </div>
                      {/* <div className="row mb-3">
                      <div className="col-lg-4">Mạng xã hội:</div>
                      <div className="col-lg-8">
                        <ul className="social-icons">
                          <li>
                            <a
                              rel="noopener noreferrer nofollow"
                              target="_blank"
                              href="https://www.facebook.com/sheshipharma/"
                            >
                              <i className="bi bi-facebook"></i>
                            </a>
                          </li>
                          <li>
                            <a
                              rel="noopener noreferrer nofollow"
                              target="_blank"
                              href="https://www.facebook.com/sheshipharma/"
                            >
                              <i className="bi bi-twitter" />
                            </a>
                          </li>
                          <li>
                            <a
                              rel="noopener noreferrer nofollow"
                              target="_blank"
                              href="https://www.facebook.com/sheshipharma/"
                            >
                              <i className="bi bi-instagram" />
                            </a>
                          </li>
                          <li>
                            <a
                              rel="noopener noreferrer nofollow"
                              target="_blank"
                              href="https://www.facebook.com/sheshipharma/"
                            >
                              <i className="bi bi-youtube" />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div> */}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-lg-6 spacing_lager">
                <h3 className="mb-3">Gửi thắc mắc cho chúng tôi</h3>
                <p>
                  Nếu bạn có thắc mắc gì, có thể gửi yêu cầu cho chúng tôi và
                  chúng tôi sẽ liên lạc với bạn sớm nhất có thể
                </p>

                <div className="contact__form">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="form-submit"
                  >
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-6  field mb-3">
                        <Input
                          placeholder={t("display_name")}
                          {...register("fullName")}
                          className={classNames(
                            "form-control form-control-lg",
                            {
                              "is-invalid": errors.fullName,
                            }
                          )}
                          autoComplete="off"
                        />
                        {errors.fullName && (
                          <div className="text-error">
                            {errors.fullName.message}
                          </div>
                        )}
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6  field mb-3">
                        <Input
                          placeholder={t("enter_your_email")}
                          {...register("email")}
                          className={classNames(
                            "form-control form-control-lg",
                            {
                              "is-invalid": errors.email,
                            }
                          )}
                          autoComplete="off"
                        />

                        {errors.email && (
                          <div className="text-error">
                            {errors.email.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="field mb-3">
                      <Input
                        placeholder={t("phone")}
                        {...register("phoneNumber")}
                        onChange={(e) => formatNumber(e.target.value)}
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
                      <Textarea
                        placeholder={t("content")}
                        className={classNames("form-control-lg", {
                          "is-invalid": errors.notes,
                        })}
                        {...register("content")}
                        autoComplete="off"
                      />
                      {errors.notes && (
                        <div className="text-error">{errors.notes.message}</div>
                      )}
                    </div>
                    <div className="field mb-3">
                      {/* <Button
                        className="btn-primary"
                        type="submit"
                        loading={loading}
                        onClick={handleSubmit(onSubmit)}
                      >
                        {t("sent_us")}
                      </Button> */}

                      <Button
                        className="btn-primary"
                        type="submit"
                        loading={loading}
                      >
                        {t("sent_us")}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="gap--30"></div>
              <div className="col-lg-12 spacing_lager">
                <div className="contact__map">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.543608006403!2d105.75323921514045!3d20.970835586029768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134531e3271472f%3A0x2651fde14e086a84!2zMzQ2IFAuIFThu5EgSOG7r3UsIExhIEtow6osIEjDoCDEkMO0bmcsIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1654590253047!5m2!1svi!2s"
                    width={600}
                    height={450}
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
export default Contact;
