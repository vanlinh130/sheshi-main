import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Table, Typography, Collapse, Row, Col, Space, Input, Button, Pagination, Tooltip, Switch, Select, Card } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import errorHelper from '@/utils/error-helper'
import configDataApis from "@/apis/configDataApis";
import { GLOBAL_STATUS, MASTER_DATA, MASTER_DATA_NAME } from "@/constants";
import { DeleteOutlined, EditOutlined, InfoOutlined } from "@ant-design/icons";
import ModalConfigDataUpdate from '@/pages/config-data/modal-config-data-update';
import ModalConfigDataCreate from '@/pages/config-data/modal-config-data-create';
import ModalConfigDataDelete from '@/pages/config-data/modal-config-data-delete';
import { Meta } from 'antd/lib/list/Item'
import yup from '@/utils/yup'
import { yupResolver } from '@hookform/resolvers/yup'
import successHelper from '@/utils/success-helper'
import CreateElement from './element-create'

const { Title } = Typography

const LIMIT = 100
const ProductElement = () => {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [listConfigData, setListConfigData] = useState([]);
  const [countListConfigData, setCountListConfigData] = useState([]);
  const [loading, setLoading] = useState(true);
  const refModalConfigDataUpdate = useRef();

  const expandedRowRender = (row) => {
    const columns = [
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
        dataSource={row.childrenMaster.sort((a, b) => b.name - a.name)}
        pagination={false}
        rowKey="id"
      />
    );
  };

  const columns = [
    {
      title: t("product_attribute"),
      dataIndex: "nameMaster",
      key: "nameMaster",
    },
  ];

  const onGetListConfigData = useCallback(
    async (values) => {
      const params = {
        idMaster: [
          MASTER_DATA_NAME.CAPACITY_PRODUCT,
          MASTER_DATA_NAME.UNIT_PRODUCT,
        ],
        page,
        size: LIMIT,
      };

      setLoading(true);

      return configDataApis
        .getListPagingConfigData(params)
        .then(({ rows, count }) => {
          if (page > 1 && rows.length === 0) {
            setPage(1);
          } else {
            setCountListConfigData(count);
            setListConfigData(
              MASTER_DATA.map((md) => {
                if (
                  rows.filter((row) => row.idMaster === md.value).length > 0
                ) {
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
    },
    [page]
  );

  useEffect(() => {
    onGetListConfigData();
  }, [onGetListConfigData]);

  return (
    <>
      <Row gutter={[24, 12]} className="mb-3">
        <Col md={12} sm={12} xs={24}>
          <Title level={3}>{t("product_attribute")}</Title>
        </Col>
        {/* 
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
        </Col> */}
      </Row>
      <Row gutter={[24, 12]} className="mb-3">
        <Col xs={24} sm={24} md={12} xl={12}>
          <Card title="Thêm thuộc tính">
            <CreateElement fetchList={onGetListConfigData} />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} xl={12}>
          <Table
            columns={columns}
            dataSource={listConfigData}
            rowKey="idMaster"
            expandable={{
              defaultExpandedRowKeys: [
                MASTER_DATA_NAME.UNIT_PRODUCT,
                MASTER_DATA_NAME.CAPACITY_PRODUCT,
              ],
              expandedRowRender,
              expandRowByClick: true,
            }}
            scroll={{ x: "max-content" }}
            pagination={false}
            loading={loading}
          />
        </Col>
      </Row>
      <ModalConfigDataUpdate
        ref={refModalConfigDataUpdate}
        onAfterUpdate={() => {
          onGetListConfigData();
        }}
      />
    </>
  );
};

export default ProductElement;
