import errorHelper from "@/utils/error-helper";
import successHelper from "@/utils/success-helper";
import yup from "@/utils/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Modal, Input, Select, Tooltip, Spin, Image, Checkbox, Row, Col } from "antd";
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
import { CONDITIONS_OPTIONS_MAP, MASTER_DATA, MASTER_DATA_NAME } from "@/constants";
import levelConditionsApis from "@/apis/levelConditionsApis";
import configDataApis from "@/apis/configDataApis";

const schema = yup.object({
  idLevel: yup.number().required().max(255).nullable(),
  conditions: yup.array().required().min(1).nullable(),
});

const ModalConfigLevelConditionsCreate = ({ onSubmit, onAfterCreate }, ref) => {
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const [errorConditions, setErrorConditions] = useState();
  const [loading, setLoading] = useState(false);
  const [conditions, setConditions] = useState([]);
  const [userLevelOptions, setUserLevelOptions] = useState([]);
  const [conditionsOptions, setConditionsOptions] = useState([]);

  const fetchLevelUser = async () => {
    const getLevelUser = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.LEVEL_USER,
    });
    const getConditionOptions = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.CONDITIONS_LEVEL,
    });
    setUserLevelOptions(getLevelUser);
    setConditionsOptions(
      getConditionOptions.map((e) => ({
        label: e.name,
        value: e.id,
      }))
    );
  };

  const onChangeConditions = (values) => {
    setErrorConditions();
    reset({
      ...getValues()
    });
    setValue("conditions", values.length === 0 ? null : values);
    setConditions(values);
  };
  useEffect(() => {
    fetchLevelUser();
  }, []);
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
  const onOpen = () => {
    setVisible(true);
  };

  useImperativeHandle(ref, () => ({
    onOpen,
  }));

  const onClose = () => {
    setVisible(false);
    reset({
      idLevel: null,
      valueSales: null,
      amountMonthSales: null,
      valueIntroduce: null,
      unitIntroduce: null,
      valueLevel: null,
      conditions: null,
      note: null,
    });
    setConditions([]);
    setLoading(false);
  };

  const submitLevelConditionsCreate = async (values) => {
    let isReturn = false;
    const body = [];
    values.conditions.map((condition) => {
      if (condition === 1) {
        if (!values?.valueSales || !values?.amountMonthSales) {
          setErrorConditions("Cần nhập trường bắt buộc");
          isReturn = true;
        } else {
          body.push({
            idLevel: values.idLevel,
            value: +values.valueSales,
            amountMonth: +values.amountMonthSales,
            note: values.noteSales,
            type: 1,
          });
        }
      }
      if (condition === 2) {
        if (!values?.unitIntroduce || !values?.valueIntroduce) {
          setErrorConditions("Cần nhập trường bắt buộc");
          isReturn = true;
        } else {
          body.push({
            idLevel: values.idLevel,
            value: +values.valueIntroduce,
            masterUnit: MASTER_DATA_NAME.LEVEL_USER,
            unit: +values.unitIntroduce,
            note: values.noteIntroduce,
            type: 2,
          });
        }
      }
      if (condition === 3) {
        if (!values?.valueLevel) {
          setErrorConditions("Cần nhập trường bắt buộc");
          isReturn = true;
        } else {
          body.push({
            idLevel: values.idLevel,
            value: +values.valueLevel,
            note: values.noteLevel,
            type: 3,
          });
        }
      }
    });
    if (isReturn) return;
    setLoading(true);
    try {
      await Promise.all(
        body.map(async (e) => {
          await levelConditionsApis.createLevelConditions(e);
        })
      );
    } catch (err) {
      errorHelper(err);
    } finally {
      onClose();
      onAfterCreate();
      setErrorConditions(false);
      setLoading(false);
    }
  };;

  return (
    <Modal
      footer={null}
      visible={visible}
      onCancel={onClose}
      maskClosable={false}
      destroyOnClose
    >
      <h3>{t("config_data_add")}</h3>
      <form onSubmit={handleSubmit(submitLevelConditionsCreate)}>
        <div className="field mb-3">
          <label>Cấp bậc người dùng</label>
          <Controller
            name="idLevel"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                showSearch
                status={errors?.idLevel?.message}
                control={control}
                name="idLevel"
                placeholder="Chọn cấp bậc người dùng"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {userLevelOptions.map((e) => {
                  return (
                    <Option value={e.id} key={e.id}>
                      {e.name}
                    </Option>
                  );
                })}
              </Select>
            )}
          />
          {errors?.idLevel?.message && (
            <p className="text-error">{errors?.idLevel?.message}</p>
          )}
        </div>
        <div className="field mb-3">
          <label>Điều kiện đạt cấp</label>
          <div>
            <Checkbox.Group
              name="conditions"
              options={conditionsOptions}
              onChange={onChangeConditions}
            />
            {errors?.conditions?.message && (
              <p className="text-error">{errors?.conditions?.message}</p>
            )}
          </div>
        </div>
        {conditions.find((e) => e === 1) && (
          <Row className="mb-3" gutter={[24, 12]}>
            <Col xs={24} sm={24} md={24} xl={24}>
              <label> Doanh số </label>
            </Col>
            <Col xs={24} sm={12} md={12} xl={12}>
              <Controller
                name="valueSales"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      {...field}
                      addonAfter="VNĐ"
                      status={errors?.valueSales?.message ? "error" : null}
                      placeholder="Số tiền"
                    />
                  </>
                )}
              />
              {errors?.valueSales?.message && (
                <p className="text-error">{errors?.valueSales?.message}</p>
              )}
            </Col>
            <Col xs={24} sm={12} md={12} xl={12}>
              <Controller
                name="amountMonthSales"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      {...field}
                      addonAfter="tháng"
                      status={
                        errors?.amountMonthSales?.message ? "error" : null
                      }
                      placeholder="Số tháng"
                    />
                  </>
                )}
              />
              {errors?.amountMonthSales?.message && (
                <p className="text-error">
                  {errors?.amountMonthSales?.message}
                </p>
              )}
            </Col>
            <Col xs={24} sm={12} md={24} xl={24}>
              <Controller
                name="noteSales"
                control={control}
                render={({ field }) => (
                  <Input.TextArea
                    {...field}
                    status={errors?.note?.message ? "error" : null}
                    placeholder={t("note")}
                  />
                )}
              />
            </Col>
          </Row>
        )}
        {conditions.find((e) => e === 2) && (
          <Row className="mb-3" gutter={[24, 12]}>
            <Col xs={24} sm={24} md={24} xl={24}>
              <label> Giới thiệu </label>
            </Col>
            <Col xs={24} sm={12} md={12} xl={12}>
              <Controller
                name="valueIntroduce"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      {...field}
                      status={errors?.valueIntroduce?.message ? "error" : null}
                      placeholder="Số người"
                    />
                  </>
                )}
              />
              {errors?.valueIntroduce?.message && (
                <p className="text-error">{errors?.valueIntroduce?.message}</p>
              )}
            </Col>
            <Col xs={24} sm={12} md={12} xl={12}>
              <Controller
                name="unitIntroduce"
                control={control}
                render={({ field }) => (
                  <>
                    <Select
                      {...field}
                      showSearch
                      status={errors?.valueLevel?.message}
                      control={control}
                      name="unitIntroduce"
                      placeholder="Chọn cấp bậc"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {userLevelOptions.map((e) => {
                        return (
                          <Option value={e.id} key={e.id}>
                            {e.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </>
                )}
              />
              {errors?.unitIntroduce?.message && (
                <p className="text-error">{errors?.unitIntroduce?.message}</p>
              )}
            </Col>
            <Col xs={24} sm={12} md={24} xl={24}>
              <Controller
                name="noteIntroduce"
                control={control}
                render={({ field }) => (
                  <Input.TextArea
                    {...field}
                    status={errors?.note?.message ? "error" : null}
                    placeholder={t("note")}
                  />
                )}
              />
            </Col>
          </Row>
        )}
        {conditions.find((e) => e === 3) && (
          <Row className="mb-3" gutter={[24, 12]}>
            <Col xs={24} sm={24} md={24} xl={24}>
              <label> Đạt cấp </label>
            </Col>
            <Col xs={24} sm={12} md={24} xl={24}>
              <Controller
                name="valueLevel"
                control={control}
                render={({ field }) => (
                  <>
                    <Select
                      {...field}
                      showSearch
                      status={errors?.valueLevel?.message}
                      control={control}
                      name="valueLevel"
                      placeholder="Chọn cấp bậc"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {userLevelOptions.map((e) => {
                        return (
                          <Option value={e.id} key={e.id}>
                            {e.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </>
                )}
              />
              {errors?.valueLevel?.message && (
                <p className="text-error">{errors?.valueLevel?.message}</p>
              )}
            </Col>
            <Col xs={24} sm={12} md={24} xl={24}>
              <Controller
                name="noteLevel"
                control={control}
                render={({ field }) => (
                  <Input.TextArea
                    {...field}
                    status={errors?.note?.message ? "error" : null}
                    placeholder={t("note")}
                  />
                )}
              />
            </Col>
          </Row>
        )}
        {errorConditions && <p className="text-error">{errorConditions}</p>}
        <div className="d-flex justify-content-center">
          <Button htmlType="submit" type="primary" loading={loading}>
            {t("create")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default forwardRef(ModalConfigLevelConditionsCreate);
