import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Table, Typography, Collapse, Row, Col, Space, Input, Button, Pagination, Tooltip, TabPane, Select, Tabs, Card } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import errorHelper from '@/utils/error-helper'
import ModalConfigCommissionCreate from './modal-config-commission-create'
import commissionApis from '@/apis/commissionApis'
import ModalConfigCommissionUpdate from './modal-config-commission-update'
import { COMMISSION_TYPE_MAP } from '@/constants'
import { EditOutlined } from '@ant-design/icons'
import CommissionLevel from './commission-level'

const { Title } = Typography

const ConfigCommission = () => {
  const { t } = useTranslation()

  const { control, handleSubmit, getValues, formState: { errors } } = useForm()

  const [listConfigCommission, setListConfigCommission] = useState([])
  const [loading, setLoading] = useState(true)
  const refModalConfigCommissionCreate = useRef()
  const refModalConfigCommissionUpdate = useRef();

  const onSubmit = (values) => {
    return onGetListConfigCommission(values);
  }

  const { TabPane } = Tabs;
  const columns = [
    {
      title: "Tên hoa hồng",
      dataIndex: "commissionName",
      key: "commissionName",
      width: 500,
      render: (item, record) => <Tooltip title={item}>{item}</Tooltip>,
    },
    {
      title: "Cách thưởng hoa hồng",
      dataIndex: "type",
      key: "type",
      render: (item, record) =>
        COMMISSION_TYPE_MAP.find((e) => e.value === item).label,
    },
    {
      title: "Phần trăm",
      dataIndex: "percent",
      key: "percent",
      render: (item, record) => item && item + "%",
    },
    {
      title: "Điều kiện",
      dataIndex: "conditions",
      key: "conditions",
      width: 500,
      render: (item, record) => <Tooltip title={item}>{item}</Tooltip>,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 500,
      render: (item, record) => <Tooltip title={item}>{item}</Tooltip>,
    },
    {
      title: t("action"),
      key: "action",
      render: (item, record) => (
        <div className="d-flex justify-content-center flex-column">
          <div className="d-flex justify-content-center">
            <Tooltip title={t("update")}>
              <Button
                shape="round"
                className="mx-1"
                size="small"
                onClick={(e) =>
                  refModalConfigCommissionUpdate.current.onOpen(record)
                }
                icon={<EditOutlined />}
                type="primary"
              />
            </Tooltip>
          </div>
        </div>
      ),
      fixed: "right",
      align: "center",
    },
  ];

  const onGetListConfigCommission = async (values) => {
    setLoading(true);
    return commissionApis
      .getListConfigCommission(values)
      .then((rows) => {
        setListConfigCommission(rows)

        window.scroll({
          top: 0,
          behavior: "smooth",
        });
      })
      .catch((err) => {
        errorHelper(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    onGetListConfigCommission(getValues());
  }, []);

  const renderSearch = () => (
    <Collapse defaultActiveKey={["1"]} className="collapse-custom-style mb-5">
      <Collapse.Panel header={t("search")} key="1">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[24, 12]} align="bottom">
            <Col xs={24} sm={12} md={12} xl={8}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <>
                    <label>Cách thưởng hoa hồng</label>
                    <Select
                      {...field}
                      showSearch
                      control={control}
                      allowClear
                      name="type"
                      placeholder="Vui lòng chọn cách thưởng hoa hồng"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {COMMISSION_TYPE_MAP.map((e) => {
                        return (
                          <Option value={e.value} key={e.value}>
                            {e.label}
                          </Option>
                        );
                      })}
                    </Select>
                  </>
                )}
              />
              {errors?.search?.message && (
                <p className="text-error">{errors?.search?.message}</p>
              )}
            </Col>

            <Col xs={24} sm={8} md={6}>
              <Button loading={loading} htmlType="submit" type="primary">
                {t("search")}
              </Button>
            </Col>
          </Row>
        </form>
      </Collapse.Panel>
    </Collapse>
  );

  return (
    <>
      <Title level={3}>{t("config_commission")}</Title>
      <Card style={{ backgroundColor: "#fff2e8" }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Danh sách hoa hồng" key={1}>
            {/* {renderSearch()} */}

            <Row gutter={[24, 12]} className="mb-3">
              <Col md={12} sm={12} xs={24}>
              </Col>

              <Col
                md={12}
                sm={12}
                xs={24}
                className="button_create"
                flex={"end"}
              >
                <Button
                  style={{ float: "right", marginBottom: "0.5em" }}
                  htmlType="submit"
                  type="primary"
                  className="w-20"
                  onClick={() =>
                    refModalConfigCommissionCreate.current.onOpen()
                  }
                >
                  {t("config_data_add")}
                </Button>
              </Col>
            </Row>

            <Table
              columns={columns}
              dataSource={listConfigCommission}
              rowKey="id"
              scroll={{ x: "max-content" }}
              pagination={false}
              loading={loading}
            />
            <ModalConfigCommissionCreate
              ref={refModalConfigCommissionCreate}
              onAfterCreate={() => {
                onGetListConfigCommission(getValues());
              }}
            />
            <ModalConfigCommissionUpdate
              ref={refModalConfigCommissionUpdate}
              onAfterUpdate={() => {
                onGetListConfigCommission(getValues());
              }}
            />
          </TabPane>
          <TabPane tab="Hoa hồng từng cấp" key={2}>
            <CommissionLevel />
          </TabPane>
        </Tabs>
      </Card>
    </>
  );
}

export default ConfigCommission
