import errorHelper from '@/utils/error-helper';
import successHelper from '@/utils/success-helper';
import yup from '@/utils/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal, Input, Select, Tooltip, Spin, Image } from "antd";
import React, { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import configDataApis from "@/apis/configDataApis";
import {
  CameraOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import commonApis from '@/apis/commonApis';
import { convertToSlug } from '@/utils/funcs';
import { MASTER_DATA } from '@/constants';

const schema = yup.object({
  name: yup.string().trim().required().max(255),
  nameMaster: yup.string().trim().required().max(255)
})

const ModalContactDetail = ({ onSubmit, onAfterUpdate }, ref) => {
  const { t } = useTranslation()

  const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    resolver: yupResolver(schema),
  })

  const [visible, setVisible] = useState(false)

  const onOpen = (record) => {
    setVisible(true)

    setValue("fullName", record.fullName);
    setValue("email", record.email);
    setValue("phoneNumber", record.phoneNumber);
    setValue("content", record.content);
  }

  useImperativeHandle(ref, () => ({
    onOpen
  }))

  const onClose = () => {
    setVisible(false)
    reset()
  }

  return (
    <Modal
      footer={null}
      visible={visible}
      onCancel={onClose}
      maskClosable={false}
      destroyOnClose
    >
      <h3>Chi tiết liên hệ</h3>
      <div className="field mb-3">
        <label>{t("email")}</label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input {...field} disabled placeholder={t("email")} />
          )}
        />
      </div>

      <div className="field mb-3">
        <label>{t("full_name")}</label>
        <Controller
          name="fullName"
          control={control}
          render={({ field }) => (
            <Input {...field} disabled placeholder={t("fullName")} />
          )}
        />
      </div>

      <div className="field mb-3">
        <label>{t("phone")}</label>
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <Input {...field} disabled placeholder={t("phoneNumber")} />
          )}
        />
      </div>
      <div className="field mb-3">
        <label>{t("content")}</label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <Input.TextArea
              {...field}
              disabled
              placeholder={t("note")}
              style={{ height: "200px" }}
            />
          )}
        />
      </div>
    </Modal>
  );
};

export default forwardRef(ModalContactDetail)
