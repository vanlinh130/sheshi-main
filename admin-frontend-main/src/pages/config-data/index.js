import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Table, Typography, Collapse, Row, Col, Space, Input, Button, Pagination, Tooltip, Switch, Select } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import errorHelper from '@/utils/error-helper'
import configDataApis from "@/apis/configDataApis";
import { GLOBAL_STATUS, MASTER_DATA } from "@/constants";
import { DeleteOutlined, EditOutlined, InfoOutlined } from "@ant-design/icons";
import ModalConfigDataUpdate from '@/pages/config-data/modal-config-data-update';
import ModalConfigDataCreate from '@/pages/config-data/modal-config-data-create';
import ModalConfigDataDelete from '@/pages/config-data/modal-config-data-delete';
import { Meta } from 'antd/lib/list/Item'

const { Title } = Typography

const LIMIT = 100
const ConfigData = () => {
  const { t } = useTranslation()

  const { control, handleSubmit, getValues, formState: { errors } } = useForm()

  const [page, setPage] = useState(1)
  const [listConfigData, setListConfigData] = useState([])
  const [countListConfigData, setCountListConfigData] = useState([])
  const [loading, setLoading] = useState(true)
  const refModalConfigDataCreate = useRef()
  const refModalConfigDataUpdate = useRef()
  const refModalConfigDataChangeStatus = useRef()
  const refModalConfigDataDelete = useRef()

  const onSubmit = (values) => {
    const params = {
      search: values.search,
      page,
      size: LIMIT
    }

    setPage(1)
    return onGetListConfigData(params)
  }

  const expandedRowRender = (row) => {
    const columns = [
      {
        title: t("config_code"),
        dataIndex: "nameMaster",
        key: "nameMaster",
        width: 100,
      },
      {
        title: t("name"),
        key: "name",
        dataIndex: "name",
        render: (text, record) => (
          <Tooltip title={t("update") + ": " + text}>{text}</Tooltip>
        ),
        width: 200,
      },
      {
        title: t("note"),
        key: "note",
        dataIndex: "note",
        render: (text, record) => <Tooltip title={text}>{text}</Tooltip>,
        width: 200,
      },
      // {
      //   title: t("status"),
      //   key: "status",
      //   dataIndex: "status",
      //   render: (item, record) => (
      //     <div className="d-flex justify-content-center">
      //       <Switch
      //         checked={item === GLOBAL_STATUS.ACTIVE}
      //         onChange={() =>
      //           refModalConfigDataChangeStatus.current.onOpen(record.id, record)
      //         }
      //       />
      //     </div>
      //   ),
      //   align: "center",
      //   width: 200,
      // },
      {
        title: t("action"),
        key: "action",
        render: (item, record) => (
          <Space>
            <Tooltip title={t("update")}>
              <Button
                shape="round"
                className="mx-1"
                size="small"
                onClick={() => refModalConfigDataUpdate.current.onOpen(record)}
                icon={<EditOutlined />}
              />
            </Tooltip>
          </Space>
        ),
        fixed: "right",
        align: "center",
        width: 100,
      },
    ];


    return (
      <Table
        columns={columns}
        dataSource={row.childrenMaster}
        pagination={false}
        rowKey="id"
      />
    );
  };

  const columns = [
    {
      title: t("config_code"),
      dataIndex: "nameMaster",
      key: "nameMaster",
    },
  ];

  const onGetListConfigData = useCallback(async (values) => {
    const params = {
      idMaster: values.search,
      page,
      size: LIMIT
    }

    setLoading(true)

    return configDataApis.getListPagingConfigData(params)
      .then(({ rows, count }) => {
        if (page > 1 && rows.length === 0) {
          setPage(1)
        } else {
          setCountListConfigData(count);
          setListConfigData(
            MASTER_DATA.map((md) => {
              if (rows.filter((row) => row.idMaster === md.value).length > 0) {
                return {
                  idMaster: md.value,
                  nameMaster: md.nameMaster,
                  childrenMaster: rows.filter(
                    (row) => row.idMaster === md.value
                  ),
                };
              }
            }).filter((e) => e)
          );
        }

        window.scroll({
          top: 0, behavior: 'smooth'
        })
      })
      .catch(err => {
        errorHelper(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page])

  useEffect(() => {
    onGetListConfigData(getValues())
  }, [onGetListConfigData])

  const renderSearch = () => (
    <Collapse defaultActiveKey={["1"]} className="collapse-custom-style mb-5">
      <Collapse.Panel header={t("search")} key="1">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[24, 12]} align="bottom">
            <Col xs={24} sm={12} md={12} xl={8}>
              <Controller
                name="search"
                control={control}
                render={({ field }) => (
                  <>
                    <label>{t("code")}</label>
                    <Select
                      {...field}
                      showSearch
                      control={control}
                      allowClear
                      name="nameMaster"
                      placeholder={t("select_a_config_data")}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
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
      {renderSearch()}
      <Row gutter={[24, 12]} className="mb-3">
        <Col md={12} sm={12} xs={24}>
          <Title level={3}>{t("config_data")}</Title>
        </Col>

        <Col md={12} sm={12} xs={24} className="button_create" flex={"end"}>
          <Button
            style={{ float: "right", marginBottom: "0.5em" }}
            htmlType="submit"
            type="primary"
            className="w-20"
            onClick={() => refModalConfigDataCreate.current.onOpen()}
          >
            {t("config_data_add")}
          </Button>
        </Col>
      </Row>
      {/* {listConfigData.length > 0 && ( */}
      <Table
        columns={columns}
        dataSource={listConfigData}
        rowKey="idMaster"
        expandable={{
          // defaultExpandedRowKeys: listConfigData.map((o) => o.idMaster),
          expandedRowRender,
          expandRowByClick: true,
        }}
        scroll={{ x: "max-content" }}
        pagination={false}
        loading={loading}
      />
      {/* )} */}
      <ModalConfigDataCreate
        ref={refModalConfigDataCreate}
        onSubmit={(payload) => configDataApis.createConfigData(payload)}
        onAfterCreate={() => {
          onGetListConfigData(getValues());
        }}
      />
      <ModalConfigDataUpdate
        ref={refModalConfigDataUpdate}
        onAfterUpdate={() => {
          onGetListConfigData(getValues());
        }}
      />
      <ModalConfigDataDelete
        ref={refModalConfigDataDelete}
        onSubmit={(id) => configDataApis.deleteConfigData(id)}
        onAfterDelete={() => {
          onGetListConfigData(getValues());
        }}
      />
    </>
  );
}

export default ConfigData
