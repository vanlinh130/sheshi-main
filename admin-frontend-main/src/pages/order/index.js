import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Typography, Collapse, Row, Col, Input, Button, Pagination, Tooltip, Space, Select } from 'antd';
import { DeleteOutlined, EditOutlined, InfoOutlined, SearchOutlined } from '@ant-design/icons';
import { Controller, useForm } from 'react-hook-form';
import errorHelper from '@/utils/error-helper';
import orderApis from '@/apis/orderApis';
import { MASTER_DATA_NAME, STATUS_ORDER } from '@/constants';
import moment from 'moment';
import { numberDecimalWithCommas } from '@/utils/funcs';
import ModalOrderDelete from '@/pages/order/modal-order-delete';
import ModalOrderChangeStatus from '@/pages/order/modal-order-change-status';
import { Link } from 'react-router-dom';
import configDataApis from '@/apis/configDataApis';

const Order = () => {
    const { t } = useTranslation();
    const { Title } = Typography;
    const LIMIT = 10000000;
    const {
        control,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm();

    const [page, setPage] = useState(1);
    const [listOrder, setListOrder] = useState([]);
    const [countListOrder, setCountListOrder] = useState([]);
    const [loading, setLoading] = useState(true);
    const refModalOrderDelete = useRef();
    const refModalOrderChangeStatus = useRef();
    const [masterOrderStatus, setMasterOrderStatus] = useState();

    const fetchMasterData = async () => {
        const masterOrder = await configDataApis.getAllConfigData({
            idMaster: MASTER_DATA_NAME.STATUS_ORDER,
        });
        setMasterOrderStatus(masterOrder);
    };

    useEffect(() => {
        fetchMasterData();
        onGetListOrder(getValues());
    }, []);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Tìm kiếm ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
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
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    const onSubmit = (values) => {
        const params = {
            fullName: values.search,
            orderStatus: values.orderStatus,
            size: LIMIT,
        };

        setPage(1);
        return onGetListOrder(params);
    };

    const columns = [
        {
            title: t('order_code'),
            key: 'orderCode',
            dataIndex: 'orderCode',
            width: 200,
            ...getColumnSearchProps('orderCode'),
            sorter: (a, b) => a.orderCode?.localeCompare(b.orderCode),
        },
        {
            title: t('full_name'),
            dataIndex: 'fullName',
            key: 'fullName',
            width: 200,
            ...getColumnSearchProps('fullName'),
            sorter: (a, b) => a.fullName?.localeCompare(b.fullName),
        },
        {
            title: t('email'),
            dataIndex: 'email',
            key: 'email',
            width: 200,
            sorter: (a, b) => a.email?.localeCompare(b.email),
            ...getColumnSearchProps('email'),
        },
        {
            title: t('order_total'),
            dataIndex: 'total',
            key: 'price',
            render: (total) => numberDecimalWithCommas(total) + ' đ',
            width: 200,
            sorter: (a, b) => a.total - b.total,
        },
        {
            title: t('status'),
            key: 'orderStatus',
            dataIndex: 'orderStatus',
            sorter: (a, b) => a.orderStatus - b.orderStatus,
            render: (item, record) => (
                <Select
                    status={errors?.status?.message}
                    name="orderStatus"
                    onChange={(e) => refModalOrderChangeStatus.current.onOpen(record.id, e, record)}
                    defaultValue={masterOrderStatus?.find((e) => e.id === item)?.name}
                    optionFilterProp="children"
                    filterOption={(input, option) => option.children.includes(input)}
                    disabled={item === STATUS_ORDER.DELIVERED || item === STATUS_ORDER.REJECT}
                >
                    {masterOrderStatus?.map((e) => {
                        return (
                            <Select.Option value={e.id} key={e.id}>
                                {e.name}
                            </Select.Option>
                        );
                    })}
                </Select>
            ),
            align: 'center',
            width: 200,
        },
        {
            title: t('created_at'),
            dataIndex: 'createdAt',
            key: 'created_at',
            render: (item) => moment(item).format('DD-MM-YYYY HH:mm:ss'),
            width: 200,
            sorter: (a, b) => a.createdAt?.localeCompare(b.createdAt),
        },
        {
            title: t('action'),
            key: 'action',
            render: (item, record) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Link to={`/order-detail/${record.orderCode}`}>
                            <Button shape="round" className="mx-1" size="small" icon={<InfoOutlined />} />
                        </Link>
                    </Tooltip>
                </Space>
            ),
            fixed: 'right',
            align: 'center',
            width: 100,
        },
    ];

    const onGetListOrder = async (values) => {
        const params = {
            ...values,
            size: LIMIT,
        };

        setLoading(true);

        return orderApis
            .getListPagingOrder(params)
            .then(({ rows, count }) => {
                setCountListOrder(count);
                setListOrder(rows);

                window.scroll({
                    top: 0,
                    behavior: 'smooth',
                });
            })
            .catch((err) => {
                errorHelper(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const renderSearch = () => (
        <Collapse defaultActiveKey={['1']} className="collapse-custom-style mb-5">
            <Collapse.Panel header={t('search')} key="1">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Row gutter={[24, 12]} align="bottom">
                        <Col xs={24} sm={12} md={12} xl={8}>
                            <Controller
                                name="search"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <div className="label-field">{t('search')}</div>
                                        <Input {...field} placeholder={t('search_dot3')} />
                                    </>
                                )}
                            />
                            {errors?.search?.message && <p className="text-error">{errors?.search?.message}</p>}
                        </Col>

                        <Col xs={24} sm={12} md={12} xl={8}>
                            <Controller
                                name="orderStatus"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        showSearch
                                        status={errors?.categoryId?.message}
                                        control={control}
                                        allowClear={true}
                                        name="orderStatus"
                                        placeholder="Trạng thái đơn hàng"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().includes(input.toLowerCase())
                                        }
                                    >
                                        {masterOrderStatus?.map((e) => {
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
                        <Col xs={24} sm={8} md={6}>
                            <Button loading={loading} htmlType="submit" type="primary">
                                {t('search')}
                            </Button>
                        </Col>
                    </Row>
                </form>
            </Collapse.Panel>
        </Collapse>
    );

    const handleTableChange = (pagination, filters, sorter) => {
        setPage(pagination.current);
    };
    return (
        <>
            {renderSearch()}
            <Title className="mb-3" level={3}>
                {t('order_list')}
            </Title>
            <Table
                columns={columns}
                dataSource={listOrder}
                rowKey="id"
                scroll={{ x: 'max-content' }}
                pagination={{
                    current: page,
                    position: ['bottomCenter'],
                }}
                loading={loading}
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                onChange={handleTableChange}
            />
            <ModalOrderDelete
                ref={refModalOrderDelete}
                onSubmit={(id) => orderApis.deleteOrder(id)}
                onAfterDelete={() => {
                    onGetListOrder(getValues());
                }}
            />
            <ModalOrderChangeStatus
                ref={refModalOrderChangeStatus}
                onAfterChangeStatus={() => {
                    onGetListOrder(getValues());
                }}
            />
        </>
    );
};
export default Order;
