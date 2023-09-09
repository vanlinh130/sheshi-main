import configPageApis from "@/apis/configPageApis";
import { CONTACT_PAGE } from "@/constants";
import errorHelper from "@/utils/error-helper";
import successHelper from "@/utils/success-helper";
import yup from "@/utils/yup";
import { CheckOutlined } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, Col, Input, PageHeader, Row } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const schema = yup.object({
  telephoneContact: yup.string().required(),
  addressContact: yup.string().required(),
  emailContact: yup.string().required(),
  timeWorkingContact: yup.string().required(),
  businessLicense: yup.string().required(),
  address: yup.string().required(),
  telephone: yup.string().required(),
  email: yup.string().required(),
});

const ContactPage = () => {

  const fetchListContactPage = async () => {
    const contact = await configPageApis.getListConfigPageContact();
    const infomationContact = contact.find(
      (ct) => ct.type === CONTACT_PAGE.CONTRACT
    );
    const addressFooter = contact.find(
      (ct) => ct.type === CONTACT_PAGE.ADDRESS_FOOTER
    );
    setValue("telephoneContact", infomationContact?.telephone);
    setValue("addressContact", infomationContact?.address);
    setValue("emailContact", infomationContact?.email);
    setValue("timeWorkingContact", infomationContact?.timeWorking);
    setValue("businessLicense", addressFooter?.businessLicense);
    setValue("telephone", addressFooter?.telephone);
    setValue("address", addressFooter?.address);
    setValue("email", addressFooter?.email);
  }

  useEffect(() => {
    fetchListContactPage()
  }, [])

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitUpdate = async (value) => {
    const infomationContact = {
      telephone: value.telephoneContact,
      address: value.addressContact,
      email: value.emailContact,
      timeWorking: value.timeWorkingContact,
      type: CONTACT_PAGE.CONTRACT
    };
    const infomationAddressFooter = {
      businessLicense: value.businessLicense,
      telephone: value.telephone,
      address: value.address,
      email: value.email,
      type: CONTACT_PAGE.ADDRESS_FOOTER
    };
    return configPageApis
      .updateConfigPageContact({ infomationContact, infomationAddressFooter })
      .then(() => {
        successHelper(t("update_success"));
      })
      .catch((err) => {
        errorHelper(err);
      });
  };

  const { t } = useTranslation();

  return (
    <>
      <form onSubmit={handleSubmit(submitUpdate)}>
        <PageHeader
          className="site-page-header-responsive"
          extra={[
            <Button
              icon={<CheckOutlined />}
              key="1"
              htmlType="submit"
              type="primary"
            >
              {t("update")}
            </Button>,
          ]}
        >
          <Row gutter={[24, 12]} align="top">
            <Col xs={24} sm={24} md={12} xl={12}>
              <Card className="mb-3" title="Thông tin liên hệ" bordered={false}>
                <div className="field mb-3">
                  <label>Số điện thoại</label>
                  <Controller
                    name="telephoneContact"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        maxLength={25}
                        status={errors?.telephoneContact?.message}
                        placeholder="Số điện thoại"
                      />
                    )}
                  />
                  {errors?.telephoneContact?.message && (
                    <p className="text-error">{errors?.telephoneContact?.message}</p>
                  )}
                </div>
                <div className="field mb-3">
                  <label>Địa chỉ</label>
                  <Controller
                    name="addressContact"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        maxLength={255}
                        status={errors?.addressContact?.message}
                        placeholder="Tên tiếng Việt"
                      />
                    )}
                  />
                  {errors?.addressContact?.message && (
                    <p className="text-error">{errors?.addressContact?.message}</p>
                  )}
                </div>
                <div className="field mb-3">
                  <label>Email</label>
                  <Controller
                    name="emailContact"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        maxLength={255}
                        status={errors?.emailContact?.message}
                        placeholder="email"
                      />
                    )}
                  />
                  {errors?.emailContact?.message && (
                    <p className="text-error">{errors?.emailContact?.message}</p>
                  )}
                </div>
                <div className="field mb-3">
                  <label>Thời gian làm việc</label>
                  <Controller
                    name="timeWorkingContact"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        maxLength={255}
                        status={errors?.timeWorkingContact?.message}
                        placeholder="Thời gian làm việc"
                      />
                    )}
                  />
                  {errors?.timeWorkingContact?.message && (
                    <p className="text-error">{errors?.timeWorkingContact?.message}</p>
                  )}
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} xl={12}>
              <Card className="mb-3" title="Địa chỉ shop" bordered={false}>
                <div className="field mb-3">
                  <label>Số giấy phép kinh doanh</label>
                  <Controller
                    name="businessLicense"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        maxLength={25}
                        status={errors?.businessLicense?.message}
                        placeholder="Giấy phép kinh doanh"
                      />
                    )}
                  />
                  {errors?.businessLicense?.message && (
                    <p className="text-error">{errors?.businessLicense?.message}</p>
                  )}
                </div>
                <div className="field mb-3">
                  <label>Số điện thoại</label>
                  <Controller
                    name="telephone"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        maxLength={25}
                        status={errors?.telephone?.message}
                        placeholder="Số điện thoại"
                      />
                    )}
                  />
                  {errors?.telephone?.message && (
                    <p className="text-error">{errors?.telephone?.message}</p>
                  )}
                </div>
                <div className="field mb-3">
                  <label>Địa chỉ</label>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        maxLength={255}
                        status={errors?.address?.message}
                        placeholder="Tên tiếng Việt"
                      />
                    )}
                  />
                  {errors?.address?.message && (
                    <p className="text-error">{errors?.address?.message}</p>
                  )}
                </div>
                <div className="field mb-3">
                  <label>Email</label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        maxLength={255}
                        status={errors?.email?.message}
                        placeholder="email"
                      />
                    )}
                  />
                  {errors?.email?.message && (
                    <p className="text-error">{errors?.email?.message}</p>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </PageHeader>
      </form>
    </>
  );
};

export default ContactPage;