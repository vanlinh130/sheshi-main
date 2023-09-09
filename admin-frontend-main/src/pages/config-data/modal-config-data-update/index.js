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

const ModalConfigDataUpdate = ({ onSubmit, onAfterUpdate }, ref) => {
  const { t } = useTranslation()

  const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    resolver: yupResolver(schema),
  })

  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dataConfigData, setDataConfigData] = useState()
  const [errorConfigData, setErrorConfigData] = useState('')

  const onOpen = (record) => {
    setVisible(true)
    setLoading(true)
    setDataConfigData(record)
    configDataApis
      .getAllConfigData({ id: record.id, idMaster: record.idMaster })
      .then((res) => {
        const { name, idMaster, note } = res[0];
        setValue("name", name, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("nameMaster", idMaster, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("note", note, {
          shouldValidate: true,
          shouldDirty: true,
        });
      })
      .catch((err) => {
        errorHelper(err.message);
      })
      .finally(() => setLoading(false));
  }



  useImperativeHandle(ref, () => ({
    onOpen
  }))

  const onClose = () => {
    setVisible(false)
    setLoading(false)
    reset()
    setDataConfigData(null)
    setErrorConfigData('')
  }

  const submitUpdateConfigData = (values) => {
    const { name, nameMaster, note } = values
    const payload = {
      id: dataConfigData.id,
      idMaster: +nameMaster,
      name: name,
      nameMaster: MASTER_DATA.find(e => e.value === +nameMaster)?.nameMaster,
      note: note,
    }

    return configDataApis
      .updateConfigData(payload)
      .then(() => {
        successHelper(t("update_success"));
        onClose();
        onAfterUpdate();
      })
      .catch((err) => {
        console.log(err)
        errorHelper(err);
      })
      .finally(() => setLoading(false));
  }

  return (
    <Modal
      footer={null}
      visible={visible}
      onCancel={onClose}
      maskClosable={false}
      destroyOnClose
    >
      <h3>{t("config_data_update")}</h3>
      <form onSubmit={handleSubmit(submitUpdateConfigData)}>
        <div className="field mb-3">
          <label>{t("code")}</label>

          <Controller
            name="nameMaster"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                showSearch
                disabled
                status={errors?.nameMaster?.message}
                control={control}
                name="nameMaster"
                placeholder={t("select_a_config_data")}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {MASTER_DATA.map((e) => {
                  return (
                    <Option value={e.value} key={e.value}>
                      {e.nameMaster}
                    </Option>
                  );
                })}
              </Select>
            )}
          />
          {errors?.nameMaster?.message && (
            <p className="text-error">{errors?.nameMaster?.message}</p>
          )}
        </div>
        <div className="field mb-3">
          <label>{t("name")}</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                status={errors?.name?.message ? "error" : null}
                placeholder={t("name")}
              />
            )}
          />
          {errors?.name?.message && (
            <p className="text-error">{errors?.name?.message}</p>
          )}
        </div>

        <div className="field mb-3">
          <label>{t("note")}</label>
          <Controller
            name="note"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                status={errors?.note?.message ? "error" : null}
                placeholder={t("note")}
              />
            )}
          />
          {errors?.note?.message && (
            <p className="text-error">{errors?.note?.message}</p>
          )}
        </div>
        <div className="d-flex justify-content-center">
          <Button htmlType="submit" type="primary" loading={loading}>
            {t("update")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default forwardRef(ModalConfigDataUpdate)
