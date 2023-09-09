import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Table, Typography, Collapse, Row, Col, Space, Input, Button, Pagination, Tooltip, Switch, Select, Card } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import errorHelper from '@/utils/error-helper'
import configDataApis from "@/apis/configDataApis";
import { GLOBAL_STATUS, MASTER_DATA, MASTER_DATA_NAME } from "@/constants";
import { DeleteOutlined, EditOutlined, InfoOutlined } from "@ant-design/icons";
import ModalConfigDataUpdate from '@/pages/config-data/modal-config-data-update';
import CreateOrigin from './origin-create'

const { Title } = Typography

const LIMIT = 100
const ProductOrigin = () => {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [listConfigData, setListConfigData] = useState([]);
  const [countListConfigData, setCountListConfigData] = useState([]);
  const [loading, setLoading] = useState(true);
  const refModalConfigDataUpdate = useRef();

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

  const onGetListConfigData = useCallback(async () => {
    const params = {
      idMaster: [MASTER_DATA_NAME.ORIGIN],
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
          setListConfigData(rows);
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
  }, [page]);

  useEffect(() => {
    onGetListConfigData();
  }, [onGetListConfigData]);

  return (
    <>
      <Row gutter={[24, 12]} className="mb-3">
        <Col md={12} sm={12} xs={24}>
          <Title level={3}>{t("product_origin")}</Title>
        </Col>
      </Row>
      <Row gutter={[24, 12]} className="mb-3">
        <Col xs={24} sm={24} md={12} xl={12}>
          <Card title="Thêm nhà sản xuất">
            <CreateOrigin fetchList={onGetListConfigData} />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} xl={12}>
          <Table
            columns={columns}
            dataSource={listConfigData}
            rowKey="id"
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

export default ProductOrigin;
