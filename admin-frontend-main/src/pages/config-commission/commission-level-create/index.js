import {
  Button,
  Card,
  Col,
  Row,
  Select,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import commissionApis from "@/apis/commissionApis";
import configDataApis from "@/apis/configDataApis";
import { COMMISSION_TYPE, COMMISSION_TYPE_MAP, MASTER_DATA_NAME } from "@/constants";
import yup from "@/utils/yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import errorHelper from "@/utils/error-helper";
import successHelper from "@/utils/success-helper";

const CommissionLevelCreate = (props) => {
  const { t } = useTranslation();
  const schema = yup.object({
    idCommissions: yup
      .array()
      .min(1, "Cần nhập ít nhất 1 hoa hồng")
      .required("Cần nhập ít nhất 1 hoa hồng"),
  });

  const { Option, OptGroup } = Select;

  const [loading, setLoading] = useState(false);
  const [listCommission, setListCommission] = useState([]);

  const fetchLevelUserAndCommission = async () => {
    const fetchListCommission = await commissionApis.getListConfigCommission();
    const fetchListCommissionLevel =
      await commissionApis.getListCommissionLevel({ idLevel: props.idLevel });
    setValue(
      "idCommissions",
      fetchListCommissionLevel.map((e) => e.idCommission)
    );
    setListCommission(
      fetchListCommission.map((e) => ({
        label: e.commissionName,
        value: e.id,
        type: e.type,
      }))
    );
  };
  useEffect(() => {
    fetchLevelUserAndCommission();
    reset();
  }, [props]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitConfigDataCreate = async (values) => {
    setLoading(true);

    return commissionApis
      .createCommissionLevel({ ...values, idLevel: props.idLevel })
      .then(() => {
        successHelper(t("create_success"));
      })
      .catch((err) => {
        errorHelper(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <form onSubmit={handleSubmit(submitConfigDataCreate)}>
        <div className="field mb-3">
          <label>Hoa Hồng</label>
          <Controller
            name="idCommissions"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                mode="multiple"
                showArrow
                tagRender={(e) =>
                  tagRender(
                    e,
                    listCommission.find((cms) => cms.value === e.value).type
                  )
                }
                onChange={(value, record) => {
                  if (
                    record.filter(
                      (rc) => rc.type === COMMISSION_TYPE.AUTOMATION
                    ).length > 1
                  )
                    return;
                  setValue("idCommissions", value);
                }}
                size="large"
                style={{
                  width: "100%",
                }}
              >
                {COMMISSION_TYPE_MAP.map((commissionType) => (
                  <OptGroup
                    label={commissionType.label}
                    key={commissionType.value}
                  >
                    {listCommission
                      .filter((e) => e.type === commissionType.value)
                      .map((commission) => (
                        <Option
                          value={commission.value}
                          key={commission.value}
                          type={commission.type}
                        >
                          {commission.label}
                        </Option>
                      ))}
                  </OptGroup>
                ))}
              </Select>
            )}
          />
          {errors?.idCommissions?.message && (
            <p className="text-error">{errors?.idCommissions?.message}</p>
          )}
        </div>
        <div className="d-flex justify-content-center">
          <Button htmlType="submit" type="primary" loading={loading}>
            {t("update")}
          </Button>
        </div>
      </form>
    </>
  );
};

const tagRender = (props, type) => {
  const { label, value, closable, onClose } = props;

  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color={type === COMMISSION_TYPE.AUTOMATION ? "gold" : "cyan"}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{
        marginRight: 10,
      }}
    >
      {type === COMMISSION_TYPE.AUTOMATION ? "Tự động : " : "Tuỳ chỉnh : "}
      {label}
    </Tag>
  );
};

export default CommissionLevelCreate;
