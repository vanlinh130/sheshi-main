import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Table, Typography, Collapse, Row, Col, Space, Input, Button, Pagination, Tooltip, Switch, Select, Tag } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import errorHelper from '@/utils/error-helper'
import { BONUS_TYPE, BONUS_TYPE_MAP, GLOBAL_STATUS, MASTER_DATA } from "@/constants";
import { CheckOutlined, CloseOutlined, DeleteOutlined, DollarOutlined, EditOutlined, InfoOutlined } from "@ant-design/icons";
import ModalListUserUpdate from '@/pages/config-data/modal-config-data-update';
import { Meta } from 'antd/lib/list/Item'
import userApis from '@/apis/userApis'
import { numberDecimalWithCommas } from '@/utils/funcs'
import accountApis from '@/apis/accountApis'
import ModalWithdrawBonus from './modal-withdraw-bonus'
import { Link } from 'react-router-dom'

const { Title } = Typography

const LIMIT = 2000000
const UserBonus = () => {
  const { t } = useTranslation()

  const { control, handleSubmit, getValues, formState: { errors } } = useForm()

  const [page, setPage] = useState(1)
  const [listUser, setListUser] = useState([])
  const [loading, setLoading] = useState(true)
  const refModalListUserWithdraw = useRef()


  const onSubmit = (values) => {
    const params = {
      ...values,
      size: LIMIT,
    };

    setPage(1);
    return onGetListUser(params);
  };


  const expandedRowRender = (row) => {
    const data = row.userBonus.map((bonus) => ({
      ...bonus,
      fullName: bonus?.order?.fullName,
      email: bonus?.order?.email,
      orderCode: bonus?.order?.orderCode
    }))
    const columns = [
      {
        title: "Người giới thiệu",
        dataIndex: "fullName",
        key: "fullName",
        width: 100,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: 50,
      },
      {
        title: "Mã đơn hàng",
        dataIndex: "orderCode",
        key: "orderCode",
        render: (item) => <Link to={`/order-detail/${item}`}>{item}</Link>,
        width: 100,
      },
      {
        title: "Hoa hồng",
        dataIndex: "priceBonus",
        key: "priceBonus",
        render: (item, index) => (
          <Tag key={index}>
            {item ? `${numberDecimalWithCommas(item)}đ` : 0}
          </Tag>
        ),
        width: 100,
      },
      {
        title: "Loại",
        key: "type",
        dataIndex: "type",
        render: (item, index) => (
          <Tag
            key={index}
            color={
              item === BONUS_TYPE.RECEIVER
                ? "#108ee9"
                : item === BONUS_TYPE.WITHDRAW
                ? "#faad14"
                : item === BONUS_TYPE.REQUEST
                ? "#a0d911"
                : "#fa541c"
            }
          >
            {BONUS_TYPE_MAP.find((e) => e.value === item).label}
          </Tag>
        ),
        width: 50,
      },
      {
        title: t("action"),
        key: "action",
        render: (item, record) => (
          <Space>
            <Tooltip title="Chấp nhận">
              <Button
                color="primary"
                shape="round"
                className="mx-1"
                disabled={item.type !== BONUS_TYPE.REQUEST}
                size="small"
                onClick={() => refModalListUserWithdraw.current.onOpen(record, 1)}
                icon={<CheckOutlined />}
                type="primary"
              />
            </Tooltip>
            <Tooltip title="Từ chối">
              <Button
                color="primary"
                shape="round"
                className="mx-1"
                disabled={item.type !== BONUS_TYPE.REQUEST}
                size="small"
                onClick={() => refModalListUserWithdraw.current.onOpen(record, 2)}
                icon={<CloseOutlined />}
                type="primary"
              />
            </Tooltip>
          </Space>
        ),
        fixed: "right",
        align: "center",
        width: 50,
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="id"
      />
    );
  };

  const columns = [
    {
      title: t("full_name"),
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("user_code"),
      dataIndex: "userCode",
      key: "userCode",
    },
    {
      title: t("phone"),
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: t("user_code"),
      dataIndex: "userCode",
      key: "userCode",
    },
    {
      title: "Thưởng",
      dataIndex: "bonus",
      key: "bonus",
      render: (item, index) => (
        <Tag color="green" key={index}>
          {item ? `${numberDecimalWithCommas(item)}đ` : 0}
        </Tag>
      ),
    },
  ];

  const onGetListUser = useCallback(async (values) => {
    const params = {
      ...values,
      size: LIMIT,
    };

    setLoading(true)

    return userApis.getListUsers(params)
      .then(({ rows }) => {
        setListUser(
          rows
            .filter((row) => row.userBonus.length > 0)
            .map((row) => ({
              ...row,
              phone: row.phoneCode ? `+${row.phoneCode}${row.phoneNumber}` : "",
              fullName: row.userInformation.fullName,
              referralCode: row.userReferral?.referrerCode,
              bonus:
                row.userBonus
                  .filter((bonus) => bonus.type === BONUS_TYPE.RECEIVER)
                  .reduce((sum, bonus) => (sum = sum + bonus?.priceBonus), 0) -
                row.userBonus
                  .filter((bonus) => bonus.type === BONUS_TYPE.WITHDRAW)
                  .reduce((sum, bonus) => (sum = sum + bonus?.priceBonus), 0) -
                row.userBonus
                  .filter((bonus) => bonus.type === BONUS_TYPE.REQUEST)
                  .reduce((sum, bonus) => (sum = sum + bonus?.priceBonus), 0),
            }))
        );

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
    onGetListUser(getValues())
  }, [onGetListUser])

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
                    <div className="label-field">{t("search")}</div>
                    <Input {...field} placeholder={t("search_dot3")} />
                  </>
                )}
              />
              {errors?.search?.message && (
                <p className="text-error">{errors?.search?.message}</p>
              )}
            </Col>
            <Col xs={24} sm={8} md={6} className="d-flex justify-content-end">
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
          <Title level={3}>Phần thưởng người dùng</Title>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={listUser}
        rowKey="id"
        expandable={{
          expandedRowRender,
          expandRowByClick: true,
        }}
        scroll={{ x: "max-content" }}
        pagination={false}
        loading={loading}
      />
      <ModalWithdrawBonus
        ref={refModalListUserWithdraw}
        onAfterUpdate={() => {
          onGetListUser(getValues());
        }}
      />
    </>
  );
}

export default UserBonus;
