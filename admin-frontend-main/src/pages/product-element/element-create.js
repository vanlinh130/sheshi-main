import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  Typography,
  Collapse,
  Row,
  Col,
  Space,
  Input,
  Button,
  Pagination,
  Tooltip,
  Switch,
  Select,
  Card,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import errorHelper from "@/utils/error-helper";
import configDataApis from "@/apis/configDataApis";
import { GLOBAL_STATUS, MASTER_DATA, MASTER_DATA_NAME } from "@/constants";
import { DeleteOutlined, EditOutlined, InfoOutlined } from "@ant-design/icons";
import ModalConfigDataUpdate from "@/pages/config-data/modal-config-data-update";
import ModalConfigDataCreate from "@/pages/config-data/modal-config-data-create";
import ModalConfigDataDelete from "@/pages/config-data/modal-config-data-delete";
import { Meta } from "antd/lib/list/Item";
import yup from "@/utils/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import successHelper from "@/utils/success-helper";

const CreateElement = ({ fetchList }) => {
  const schema = yup.object({
    name: yup.string().trim().required().max(255),
    nameMaster: yup.string().trim().required().max(255).nullable(),
  });

  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const submitConfigDataCreate = async (values) => {
    const { name, nameMaster, note } = values;

    const payload = {
      name: name,
      nameMaster: MASTER_DATA.find((e) => e.value === +nameMaster)?.nameMaster,
      note: note,
    };

    setLoading(true);
    return configDataApis
      .createConfigData(payload)
      .then(() => {
        successHelper(t("create_success"));
        fetchList();
        reset();
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
          <label>{"Loại thuộc tính"}</label>

          <Controller
            name="nameMaster"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                showSearch
                status={errors?.nameMaster?.message}
                control={control}
                name="nameMaster"
                placeholder={t("select_a_config_data")}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {MASTER_DATA.filter(
                  (mt) =>
                    mt.value === MASTER_DATA_NAME.UNIT_PRODUCT ||
                    mt.value === MASTER_DATA_NAME.CAPACITY_PRODUCT
                ).map((e) => {
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
            {t("create")}
          </Button>
        </div>
      </form>
    </>
  );
};

export default CreateElement;