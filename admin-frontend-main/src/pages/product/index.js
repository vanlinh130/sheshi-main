import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Table, Typography, Switch, Collapse, Row, Col, Input, Button, Pagination, Tooltip, Space, Select } from 'antd';
import { GLOBAL_STATUS, IMAGE_TYPE, MASTER_DATA_NAME } from '@/constants';
import { Controller, useForm } from 'react-hook-form';
import yup from '@/utils/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import productApis from '@/apis/productApis';
import errorHelper from '@/utils/error-helper';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import ModalProductChangeStatus from './modal-product-change-status';
import { numberDecimalWithCommas } from '@/utils/funcs';
import configDataApis from '@/apis/configDataApis';
import { Meta } from 'antd/lib/list/Item';
import productCategoryApis from '@/apis/productCategoryApis';

const LIMIT = 1000000;

const Product = () => {
    const { t } = useTranslation();
    const { Title } = Typography;
    const refModalAccountDetail = useRef();
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

    const navigate = useNavigate();
    const [listProducts, setListProducts] = useState([]);
    console.log(listProducts);
    const [listDetailProducts, setListDetailProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [rowKeySelect, setRowKeySelect] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const [masterUnit, setMasterUnit] = useState([]);
    const [masterCapacity, setMasterCapacity] = useState([]);

    const [listCategory, setListCategory] = useState([]);

    const getListCategory = async () => {
        const categoryId = await productCategoryApis.getAllCategory();
        setListCategory(categoryId);
    };

    const fetchMasterData = async () => {
        const fetchMasterCapacity = await configDataApis.getAllConfigData({
            idMaster: MASTER_DATA_NAME.CAPACITY_PRODUCT,
        });
        const fetchMasterUnit = await configDataApis.getAllConfigData({
            idMaster: MASTER_DATA_NAME.UNIT_PRODUCT,
        });
        setMasterCapacity(fetchMasterCapacity);
        setMasterUnit(fetchMasterUnit);
    };

    useEffect(() => {
        fetchMasterData();
        onGetListProducts();
        getListCategory();
    }, []);

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

    const expandedRowRender = (row) => {
        const productDetail = listDetailProducts
            .filter((ft) => ft.productId === row.id)
            .map((e) => {
                const capacity =
                    masterCapacity?.find((cap) => cap.id === e.capacityId).name +
                    ' ' +
                    masterUnit?.find((cap) => cap.id === e.unitId).name;
                return {
                    name: row.name + ' ' + capacity,
                    id: e.id,
                    capacity,
                    productId: e.productId,
                    price: e.price,
                    quantity: row.productInventory.find(
                        (pi) => pi.productId === e.productId && pi.subProductId === e.id,
                    ).quantity,
                };
            });
        console.log(productDetail);
        const columns = [
            {
                title: t('name'),
                key: 'name',
                dataIndex: 'name',
                align: 'center',
            },
            {
                title: t('capacity'),
                key: 'capacity',
                dataIndex: 'capacity',
                align: 'center',
            },
            {
                title: t('price'),
                key: 'price',
                dataIndex: 'price',
                align: 'center',
                render: (item) => `${numberDecimalWithCommas(item)}đ`,
            },
            {
                title: t('quantity'),
                key: 'quantity',
                dataIndex: 'quantity',
                align: 'center',
            },
        ];

        return <Table columns={columns} dataSource={productDetail} pagination={false} rowKey="id" />;
    };

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

    const handleEditProduct = (id) => {
        navigate(`/product/update/${id}`);
    };
    const onSubmit = (values) => {
        const params = {
            categoryId: values?.categoryId,
            name: values?.name,
            size: LIMIT,
        };
        setPage(1);
        return onGetListProducts(params);
    };

    const columns = [
        Table.SELECTION_COLUMN,
        {
            title: t('image'),
            key: 'productImage',
            dataIndex: 'productImage',
            width: 200,
            align: 'center',
            render: (item) => <img width={100} src={item} />,
        },
        {
            title: t('name'),
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
            render: (text, record) => <Tooltip title={text}>{text}</Tooltip>,
            width: 300,
            sorter: (a, b) => a.name?.localeCompare(b.name),
        },
        {
            title: t('product_category'),
            dataIndex: 'productCategoryName',
            key: 'productCategoryName',
            width: 300,
            sorter: (a, b) => a.productCategoryName?.localeCompare(b.productCategoryName),
        },
        {
            title: 'Nổi bật',
            key: 'outstanding',
            dataIndex: 'outstanding',
            width: 200,
            align: 'center',
            render: (item) => (item === 0 ? 'Bình thường' : 'Nổi bật'),
            sorter: (a, b) => a.outstanding - b.outstanding,
        },
        {
            title: t('active'),
            dataIndex: 'status',
            key: 'status',
            with: 50,
            render: (item, record) => (
                <div className="d-flex justify-content-center">
                    <Switch
                        checked={item === GLOBAL_STATUS.ACTIVE}
                        onChange={() => refModalAccountDetail.current.onOpen(record.id, record)}
                    />
                </div>
            ),
            align: 'center',
            sorter: (a, b) => a.status - b.status,
        },
        {
            title: t('created_at'),
            dataIndex: 'createdAt',
            key: 'created_at',
            render: (item) => moment(item).format('YYYY-MM-DD HH:mm:ss'),
            width: 200,
            sorter: (a, b) => a.createdAt?.localeCompare(b.createdAt),
        },
        {
            title: t('action'),
            key: 'action',
            render: (item, record) => (
                <div className="d-flex justify-content-center flex-column">
                    <div className="d-flex justify-content-center">
                        <Tooltip title={t('update')}>
                            <Button
                                shape="round"
                                className="mx-1"
                                size="small"
                                onClick={(e) => handleEditProduct(record.id)}
                                icon={<EditOutlined />}
                                type="primary"
                            />
                        </Tooltip>
                    </div>
                </div>
            ),
            fixed: 'right',
            align: 'center',
        },
    ];

    const onGetListProducts = (values) => {
        const params = {
            ...values,
            admin: true,
            size: LIMIT,
        };

        setLoading(true);

        productApis
            .getListProduct(params)
            .then(({ rows }) => {
                const detailProducts = [];
                setListProducts(
                    rows.map((e) => {
                        e.productDetail.map((a) => detailProducts.push(a));
                        return {
                            ...e,
                            productCategoryName: e.productCategory.name,
                            productImage: e.productImage.find((e) => e.isMain === IMAGE_TYPE.MAIN)?.image,
                        };
                    }),
                );
                setListDetailProducts(detailProducts);

                window.scroll({
                    top: 0,
                    behavior: 'smooth',
                });
            })
            .catch((err) => {
                console.log(err);
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
                                name="name"
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
                                name="categoryId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        showSearch
                                        status={errors?.categoryId?.message}
                                        control={control}
                                        allowClear={true}
                                        name="categoryId"
                                        placeholder={t('select_a_category')}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().includes(input.toLowerCase())
                                        }
                                    >
                                        {listCategory?.map((e) => {
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

            <Row gutter={[24, 12]} className="mb-3">
                <Col md={12} sm={12} xs={24}>
                    <Title level={3}>{t('product_management')}</Title>
                </Col>

                <Col md={12} sm={12} xs={24} className="button_create" flex={'end'}>
                    <Link to={'/product/create'}>
                        <Button style={{ float: 'right', marginBottom: '0.5em' }} type="primary" className="w-20">
                            {t('product_add')}
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Table
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={listProducts}
                rowKey="id"
                expandable={{
                    expandedRowRender,
                    expandIcon: () => <div />,
                    expandRowByClick: true,
                }}
                scroll={{ x: 'max-content' }}
                loading={loading}
                pagination={{
                    current: page,
                    position: ['bottomCenter'],
                }}
                onChange={handleTableChange}
            />

            <ModalProductChangeStatus
                ref={refModalAccountDetail}
                onAfterChangeStatus={() => {
                    onGetListProducts(getValues());
                }}
            />
        </>
    );
};

export default Product;
