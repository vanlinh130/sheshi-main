import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    CheckOutlined,
    InfoOutlined,
    CloseOutlined,
    DeleteOutlined,
    SearchOutlined,
    EditOutlined,
} from "@ant-design/icons";
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
} from "antd";
import { useForm } from "react-hook-form";
import yup from "@/utils/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import contactApis from "@/apis/contactApis";
import errorHelper from "@/utils/error-helper";
import moment from "moment";
import { GLOBAL_STATUS } from "@/constants";
import ModalContactChangeStatus from '@/pages/contact/modal-contact-change-status';
import ModalContactDetail from './modal-contact-view'

const { Title } = Typography;

const LIMIT = 1000000;

const Contact = () => {
    const { t } = useTranslation();
    const schema = yup.object({
        search: yup.string().max(255),
    });

    const {
        control,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [page, setPage] = useState(1);
    const [listContacts, setListContacts] = useState([]);
    const [countListContacts, setCountListContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const refModalContactChangeStatus = useRef()
    const refModalContactDetailStatus = useRef()
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
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
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) => text,
    });

    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setRowKeySelect(selectedRowKeys);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled Contact",
            name: record.name,
        }),
    };

    const onSubmit = (values) => {
        const params = {
            ...values,
            page,
            size: LIMIT,
        };

        setPage(1);
        return onGetListContacts(params);
    };

    const columns = [
      {
        title: t("full_name"),
        key: "fullName",
        dataIndex: "fullName",
        width: 200,
        sorter: (a, b) => a.fullName?.localeCompare(b?.fullName),
        ...getColumnSearchProps("fullName"),
      },
      {
        title: t("email"),
        dataIndex: "email",
        key: "email",
        width: 200,
        sorter: (a, b) => a.email?.localeCompare(b?.email),
        ...getColumnSearchProps("email"),
      },
      {
        title: t("phone"),
        key: "phone",
        dataIndex: "phoneNumber",
        width: 150,
        sorter: (a, b) => a?.phoneNumber.localeCompare(b?.phoneNumber),
        ...getColumnSearchProps("phoneNumber"),
      },
      {
        title: t("content"),
        key: "content",
        dataIndex: "content",
        width: 300,
      },
      {
        title: t("status"),
        key: "status",
        dataIndex: "status",
        render: (item, record) => (
          <div className="d-flex justify-content-center">
            <Switch
              checked={item === GLOBAL_STATUS.ACTIVE}
              onChange={() =>
                refModalContactChangeStatus.current.onOpen(record.id, record)
              }
            />
          </div>
        ),
        align: "center",
        width: 200,
        sorter: (a, b) => a.status - b.status,
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
          <Space>
            <Tooltip title={t("detail")}>
              <Button
                shape="round"
                className="mx-1"
                size="small"
                onClick={() =>
                  refModalContactDetailStatus.current.onOpen(record)
                }
                icon={<EditOutlined />}
              />
            </Tooltip>
          </Space>
        ),
      },
    ];

    const onGetListContacts = useCallback(
        (values) => {
            const params = {
                ...values,
                page,
                size: LIMIT,
            };

            setLoading(true);

            contactApis
                .getListContacts(params)
                .then(({ rows, count }) => {
                    if (page > 1 && rows.length === 0) {
                        setPage(1);
                    } else {
                        setCountListContacts(count);
                        setListContacts(rows);
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
        onGetListContacts(getValues());
    }, [onGetListContacts]);

    return (
      <>
        <Title className="mb-3" level={3}>
          {t("contact_list")}
        </Title>
        <Table
          columns={columns}
          dataSource={listContacts}
          rowKey="id"
          scroll={{ x: "max-content" }}
          pagination={{
            position: ["bottomCenter"],
          }}
          loading={loading}
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
        />
        <ModalContactChangeStatus
          ref={refModalContactChangeStatus}
          onAfterChangeStatus={() => {
            onGetListContacts(getValues());
          }}
        />
        <ModalContactDetail ref={refModalContactDetailStatus} />
      </>
    );
};

export default Contact;
