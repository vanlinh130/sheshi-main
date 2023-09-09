import errorHelper from "@/utils/error-helper";
import successHelper from "@/utils/success-helper";
import yup from "@/utils/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Modal, Input, Select, Tooltip, Spin, Image, Radio, Space } from "antd";
import commissionApis from "@/apis/commissionApis";
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { COMMISSION_TYPE_MAP, MASTER_DATA_NAME } from "@/constants";
import configDataApis from "@/apis/configDataApis";

const schema = yup.object({
  commissionName: yup.string().required().max(255).nullable(),
  percent: yup.number().nullable(),
  conditions: yup.string().trim().max(255).nullable(),
  note: yup.string().trim().max(255).nullable(),
});

const ModalConfigCommissionCreate = ({ onSubmit, onAfterCreate }, ref) => {
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [valueCommission, setValueCommission] = useState(1);

  const onChangeTypeCommission = (e) => {
    setValueCommission(e.target.value);
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onOpen = () => {
    setVisible(true);
  };

  useImperativeHandle(ref, () => ({
    onOpen,
  }));

  const onClose = () => {
    setVisible(false);
    reset({
      commissionName: null,
      percent: null,
      conditions: null,
      note: null,
    });
    setValueCommission(1)
    setLoading(false);
  };

  const submitConfigDataCreate = async (values) => {
    setLoading(true);

    return commissionApis
      .createConfigCommission({ ...values, type: valueCommission })
      .then(() => {
        successHelper(t("create_success"));
        onClose();
        onAfterCreate();
      })
      .catch((err) => {
        errorHelper(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      footer={null}
      visible={visible}
      onCancel={onClose}
      maskClosable={false}
      destroyOnClose
    >
      <h3>{t("config_data_add")}</h3>
      <form onSubmit={handleSubmit(submitConfigDataCreate)}>
        <div className="field mb-3">
          <label>Hoa hồng</label>
          <Controller
            name="commissionName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                maxLength={255}
                status={errors?.commissionName?.message ? "error" : null}
                placeholder="Tên hoa hồng"
              />
            )}
          />
          {errors?.commissionName?.message && (
            <p className="text-error">{errors?.commissionName?.message}</p>
          )}
        </div>

        <div className="field mb-3">
          <Radio.Group
            onChange={onChangeTypeCommission}
            value={valueCommission}
            optionType="button"
            buttonStyle="solid"
          >
            {COMMISSION_TYPE_MAP.map((e) => {
              return (
                <Radio
                  value={e.value}
                  key={e.value}
                  style={{
                    marginRight: "15px",
                  }}
                >
                  {e.label}
                </Radio>
              );
            })}
          </Radio.Group>
        </div>
        {valueCommission === 1 && (
          <div className="field mb-3">
            <label>Phần trăm</label>
            <Controller
              name="percent"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  status={errors?.percent?.message ? "error" : null}
                  placeholder="Tỷ lệ phần trăm"
                />
              )}
            />
            {errors?.percent?.message && (
              <p className="text-error">{errors?.percent?.message}</p>
            )}
          </div>
        )}
        {valueCommission === 2 && (
          <div className="field mb-3">
            <label>Điều kiện</label>
            <Controller
              name="conditions"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  status={errors?.conditions?.message ? "error" : null}
                  placeholder="Điều kiện để đạt được hoa hồng"
                />
              )}
            />
            {errors?.conditions?.message && (
              <p className="text-error">{errors?.conditions?.message}</p>
            )}
          </div>
        )}

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
            {t("create")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default forwardRef(ModalConfigCommissionCreate);
