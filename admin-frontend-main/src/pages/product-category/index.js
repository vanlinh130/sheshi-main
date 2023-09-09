import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Typography, Collapse, Row, Col, Input, Button, Pagination, Tooltip, Switch, Space } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import errorHelper from '@/utils/error-helper';
import productCategoryApis from '@/apis/productCategoryApis';
import { GLOBAL_STATUS } from '@/constants';
import { DeleteOutlined, EditOutlined, InfoOutlined, SearchOutlined } from '@ant-design/icons';
import ModalProductCategoryUpdate from '@/pages/product-category/modal-product-category-update';
import ModalProductCategoryCreate from '@/pages/product-category/modal-product-category-create';
import ModalProductCategoryDelete from '@/pages/product-category/modal-product-category-delete';
import ModalProductCategoryChangeStatus from '@/pages/product-category/modal-product-category-change-status';
import { Meta } from 'antd/lib/list/Item';

const { Title } = Typography;

const LIMIT = 1000000;

const ProductCategory = () => {
    const { t } = useTranslation();

    const {
        control,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm();

    const [listProductCategory, setListProductCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const refModalProductCategoryCreate = useRef();
    const refModalProductCategoryUpdate = useRef();
    const refModalProductCategoryChangeStatus = useRef();

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
            name: values.search,
            size: LIMIT,
        };
        setPage(1);
        return onGetListProductCategory(params);
    };

    const columns = [
        {
            title: t('image'),
            key: 'image',
            dataIndex: 'image',
            width: 150,
            align: 'center',
            render: (item) => <img width={100} src={item} />,
        },
        {
            title: t('name'),
            key: 'name',
            dataIndex: 'name',
            ...getColumnSearchProps('name'),
            width: 300,
            render: (text, record) => <Tooltip title={text}>{text}</Tooltip>,
            sorter: (a, b) => a.name?.localeCompare(b.name),
        },
        {
            title: t('slug'),
            dataIndex: 'categorySlug',
            key: 'slug',
            render: (text, record) => (
                <Tooltip placement="topLeft" title={text}>
                    {text}
                </Tooltip>
            ),
            width: 200,
            sorter: (a, b) => a.categorySlug?.localeCompare(b.categorySlug),
        },
        {
            title: t('description'),
            key: 'description',
            dataIndex: 'description',
            width: 200,
            render: (text, record) => (
                <Tooltip placement="topLeft" title={text}>
                    {text}
                </Tooltip>
            ),
            sorter: (a, b) => a.description?.localeCompare(b.description),
        },
        {
            title: t('status'),
            key: 'status',
            dataIndex: 'status',
            render: (item, record) => (
                <div className="d-flex justify-content-center">
                    <Switch
                        checked={item === GLOBAL_STATUS.ACTIVE}
                        onChange={() => refModalProductCategoryChangeStatus.current.onOpen(record.id, record)}
                    />
                </div>
            ),
            align: 'center',
            width: 200,
            sorter: (a, b) => a.status - b.status,
        },
        {
            title: t('action'),
            key: 'action',
            render: (item, record) => (
                <Tooltip title={t('update')}>
                    <Button
                        shape="round"
                        className="mx-1"
                        size="small"
                        onClick={() => refModalProductCategoryUpdate.current.onOpen(record.id)}
                        icon={<EditOutlined />}
                        type="primary"
                    />
                </Tooltip>
            ),
            fixed: 'right',
            align: 'center',
            width: 100,
        },
    ];

    const onGetListProductCategory = async (values) => {
        const params = {
            ...values,
            size: LIMIT,
        };

        setLoading(true);

        return productCategoryApis
            .getListPagingProductCategory(params)
            .then(({ rows }) => {
                setListProductCategory(rows);

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

    useEffect(() => {
        onGetListProductCategory(getValues());
    }, []);

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
            <Row gutter={[24, 12]} className="mb-3">
                <Col md={12} sm={12} xs={24}>
                    <Title level={3}>{t('product_category')}</Title>
                </Col>

                <Col md={12} sm={12} xs={24} className="button_create" flex={'end'}>
                    <Button
                        style={{ float: 'right', marginBottom: '0.5em' }}
                        htmlType="submit"
                        type="primary"
                        className="w-20"
                        onClick={() => refModalProductCategoryCreate.current.onOpen()}
                    >
                        {t('category_add')}
                    </Button>
                </Col>
            </Row>
            <Table
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={listProductCategory}
                rowKey="id"
                scroll={{ x: 'max-content' }}
                pagination={{
                    current: page,
                    position: ['bottomCenter'],
                }}
                onChange={handleTableChange}
                loading={loading}
            />
            <ModalProductCategoryCreate
                ref={refModalProductCategoryCreate}
                onSubmit={(payload) => productCategoryApis.createProductCategory(payload)}
                onAfterCreate={() => {
                    onGetListProductCategory(getValues());
                }}
            />
            <ModalProductCategoryUpdate
                ref={refModalProductCategoryUpdate}
                onAfterUpdate={() => {
                    onGetListProductCategory(getValues());
                }}
            />
            <ModalProductCategoryChangeStatus
                ref={refModalProductCategoryChangeStatus}
                onAfterChangeStatus={() => {
                    onGetListProductCategory(getValues());
                }}
            />
        </>
    );
};

export default ProductCategory;
