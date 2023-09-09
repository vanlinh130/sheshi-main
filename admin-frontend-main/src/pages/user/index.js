import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckOutlined, InfoOutlined, CloseOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Table,
  Typography,
  Switch,
  Popconfirm,
  Collapse,
  Row,
  Col,
  Input,
  Select,
  Button,
  Pagination,
  Tooltip,
  Space,
  DatePicker,
} from "antd";
import { ACCOUNT_STATUS, MASTER_DATA_NAME } from "@/constants";
import { Controller, useForm } from "react-hook-form";
import yup from "@/utils/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import userApis from "@/apis/userApis";
import errorHelper from "@/utils/error-helper";
import moment from "moment";
import ModalDetailAccountUser from "@/components/modal-detail-account-user";
import configDataApis from "@/apis/configDataApis";
import ModalUserChangeStatus from "./modal-user-change-status";
import { useLocation, useParams } from "react-router";

const { Title } = Typography;

const LIMIT = 1000000;

const filter_option = [
  { value: "createdAt", label: "Tạo ngày" },
  { value: "referral", label: "Tổng giới thiệu" },
];
const User = () => {
  const { search } = useLocation(); 
  
  const { t } = useTranslation();
  const refModalAccountDetail = useRef();
  const [typeFilter, setTypeFilter] = useState();
  const schema = yup.object({
    search: yup.string().max(255).nullable(),
  });

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      search: new URLSearchParams(search).get("email"),
    },
    resolver: yupResolver(schema),
  });

  const [page, setPage] = useState(1);
  const [listUsers, setListUsers] = useState([]);
  const [countListUsers, setCountListUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [masterLevelUser, setMasterLevelUser] = useState();
  const [masterRoleUser, setMasterRoleUser] = useState();
  const refModalUserChangeStatus = useRef();
  
  const fetchMasterData = async () => {
    const masterLevel = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.LEVEL_USER,
    });
    const masterRole = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.ROLE,
    });
    setMasterRoleUser(masterRole);
    setMasterLevelUser(masterLevel)
  };

  useEffect(() => {
      fetchMasterData();
  }, [])

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 100,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 80,
            }}
          >
            Làm lại
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) => text,
  });

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setRowKeySelect(selectedRowKeys)
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };

  const onSubmit = (values) => {
    const params = {
      ...values,
      // typeFilter,
      size: LIMIT,
    };

    setPage(1);
    return onGetListUsers(params);
  };

  const Filter = (field) => {
    if (!typeFilter) return;
    if (typeFilter === "createdAt") {
      return <DatePicker.RangePicker {...field} />;
    } else {
      return <Input {...field} />;
    }
  };

  const columns = [
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
      width: 200,
      sorter: (a, b) => a.email?.localeCompare(b.email),
      ...getColumnSearchProps("email"),
    },
    {
      title: t("full_name"),
      key: "fullName",
      dataIndex: "fullName",
      render: (item, record) => record?.userInformation?.fullName,
      width: 200,
      align: "center",
      sorter: (a, b) => a.fullName?.localeCompare(b.fullName),
      ...getColumnSearchProps("fullName"),
    },
    {
      title: t("user_code"),
      key: "userCode",
      dataIndex: "userCode",
      width: 200,
      align: "center",
      sorter: (a, b) => a.userCode?.localeCompare(b.userCode),
      ...getColumnSearchProps("userCode"),
    },
    {
      title: "Mã người giới thiệu",
      key: "referralCode",
      dataIndex: "referralCode",
      width: 200,
      align: "center",
      sorter: (a, b) => a.referralCode?.localeCompare(b.referralCode),
      ...getColumnSearchProps("referralCode"),
    },
    {
      title: "Số người giới thiệu",
      key: "countReferral",
      dataIndex: "countReferral",
      width: 200,
      align: "center",
      sorter: (a, b) => a.countReferral - b.countReferral,
      ...getColumnSearchProps("countReferral"),
    },
    {
      title: t("phone"),
      key: "phone",
      dataIndex: "phone",
      width: 200,
      align: "center",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
      ...getColumnSearchProps("phone"),
    },
    {
      title: t("active"),
      dataIndex: "status",
      key: "status",
      render: (item) => (
        <div className="d-flex justify-content-center">
          <Switch checked={item === ACCOUNT_STATUS.ACTIVATE} disabled />
        </div>
      ),
      align: "center",
      width: 200,
      sorter: (a, b) => a.status - b.status,
    },
    {
      title: "Cấp bậc",
      key: "level",
      dataIndex: "level",
      sorter: (a, b) => a.level - b.level,
      render: (item, record) =>
        masterLevelUser?.find((e) => e.id === item)?.name,
      // <Select
      //   showSearch
      //   status={errors?.level?.message}
      //   name="orderStatus"
      //   onChange={(e) =>
      //     refModalUserChangeStatus.current.onOpen(record.id, e, MASTER_DATA_NAME.STATUS_ORDER)
      //   }
      //   allowClear={true}
      //   defaultValue={masterLevelUser?.find((e) => e.id === item)?.name}
      //   optionFilterProp="children"
      //   filterOption={(input, option) => option.children.includes(input)}
      // >
      //   {masterLevelUser?.map((e) => {
      //     return (
      //       <Select.Option value={e.id} key={e.id}>
      //         {e.name}
      //       </Select.Option>
      //     );
      //   })}
      // </Select>
      align: "center",
      width: 200,
    },
    {
      title: "Quyền",
      key: "role",
      dataIndex: "role",
      sorter: (a, b) => a.role - b.role,
      render: (item, record) => (
        <Select
          showSearch
          status={errors?.role?.message}
          name="orderStatus"
          onChange={(e) =>
            refModalUserChangeStatus.current.onOpen(
              record.id,
              e,
              MASTER_DATA_NAME.ROLE
            )
          }
          defaultValue={masterRoleUser?.find((e) => e.id === item)?.name}
          optionFilterProp="children"
          filterOption={(input, option) => option.children.includes(input)}
        >
          {masterRoleUser?.map((e) => {
            return (
              <Select.Option value={e.id} key={e.id}>
                {e.name}
              </Select.Option>
            );
          })}
        </Select>
      ),
      align: "center",
      width: 200,
    },
    {
      title: t("created_at"),
      dataIndex: "createdAt",
      key: "created_at",
      render: (item) => moment(item).format("YYYY-MM-DD HH:mm:ss"),
      width: 200,
      sorter: (a, b) => a.createdAt?.localeCompare(b.createdAt),
    },
    {
      title: t("action"),
      key: "action",
      render: (item, record) => (
        <div className="d-flex justify-content-center flex-column">
          <div className="d-flex justify-content-center">
            <Tooltip title={t("account_detail")}>
              <Button
                shape="round"
                className="mx-1"
                size="small"
                onClick={() =>
                  refModalAccountDetail.current.onOpen({
                    id: record?.id,
                    record,
                  })
                }
                icon={<InfoOutlined />}
              />
            </Tooltip>
          </div>
        </div>
      ),
      fixed: "right",
      align: "center",
    },
  ];


  const onGetListUsers = (values) => {
    const params = {
      ...values,
      size: LIMIT,
    };

    setLoading(true);

    userApis
      .getListUsers(params)
      .then(({ rows, count }) => {
        setCountListUsers(count);
        let result = rows
          .map((row) => ({
            ...row,
            phone: row.phoneCode ? `+${row.phoneCode}${row.phoneNumber}` : "",
            fullName: row.userInformation?.fullName,
            referralCode: row.userReferral?.referrerCode,
            countReferral: row.userReferrer?.length,
          }))
          .sort((a, b) => b.countReferral - a.countReferral);

        if (typeFilter === "referral" && values.filter) {
          result = result.filter((rs) => rs.countReferral >= +values.filter);
        }
        setListUsers(result);

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
    onGetListUsers(getValues());
  }, []);

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
            <Col xs={24} sm={12} md={12} xl={4}>
              <Controller
                name="level"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    showSearch
                    status={errors?.categoryId?.message}
                    control={control}
                    name="level"
                    placeholder="Cấp bậc user"
                    allowClear={true}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {masterLevelUser?.map((e) => {
                      return (
                        <Option value={e.id} key={e.id}>
                          {e.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              />
            </Col>
            <Col xs={24} sm={12} md={12} xl={4}>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    showSearch
                    control={control}
                    name="role"
                    placeholder="Quyền"
                    allowClear={true}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {masterRoleUser?.map((e) => {
                      return (
                        <Option value={e.id} key={e.id}>
                          {e.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              />
            </Col>
            <Col
              xs={24}
              sm={12}
              md={12}
              xl={8}
              className="d-flex justify-content-end"
            >
              <Input.Group>
                <Row>
                  <Col xs={8} sm={8} md={8} xl={8}>
                    <Select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e)}
                    >
                      {filter_option.map((item) => (
                        <Option value={item.value} key={item.value}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col xs={16} sm={16} md={16} xl={16}>
                    <Controller
                      name="filter"
                      control={control}
                      render={({ field }) => <Filter {...field} />}
                    />
                  </Col>
                </Row>
              </Input.Group>
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

  const handleTableChange = (pagination, filters, sorter) => {
    setPage(pagination.current);
  }

  return (
    <>
      {renderSearch()}
      <Title className="mb-3" level={3}>
        {t("list_users")}
      </Title>
      {masterRoleUser && (
        <Table
          columns={columns}
          dataSource={listUsers}
          rowKey="id"
          scroll={{ x: "max-content" }}
          pagination={{
            current: page,
            position: ["bottomCenter"],
          }}
          loading={loading}
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          onChange={handleTableChange}
        />
      )}
      <ModalDetailAccountUser ref={refModalAccountDetail} />

      <ModalUserChangeStatus
        ref={refModalUserChangeStatus}
        onAfterChangeStatus={() => {
          onGetListUsers(getValues());
        }}
      />
    </>
  );
};

export default User;
