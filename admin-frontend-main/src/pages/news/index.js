import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Table, Typography, Switch, Collapse, Row, Col, Input, Button, Tooltip, Space, Select } from 'antd';
import { GLOBAL_STATUS } from '@/constants';
import { Controller, useForm } from 'react-hook-form';
import yup from '@/utils/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import newsApis from '@/apis/newsApis';
import errorHelper from '@/utils/error-helper';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import ModalNewsChangeStatus from './news-change-status';

const LIMIT = 1000000;

const News = () => {
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
    const [listNews, setListNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [rowKeySelect, setRowKeySelect] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    useEffect(() => {
        onGetListNews();
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

    const handleEditNews = (id) => {
        navigate(`/news/update/${id}`);
    };
    const onSubmit = (values) => {
        const params = {
            search: values?.name,
            size: LIMIT,
        };
        setPage(1);
        return onGetListNews(params);
    };

    const columns = [
        Table.SELECTION_COLUMN,
        {
            title: t('image'),
            key: 'thumbnail',
            dataIndex: 'thumbnail',
            width: 200,
            align: 'center',
            render: (item) => <img width={100} src={item} />,
        },
        {
            title: 'Tên bài viết',
            dataIndex: 'nameNews',
            key: 'nameNews',
            ...getColumnSearchProps('nameNews'),
            render: (text, record) => <Tooltip title={text}>{text}</Tooltip>,
            width: 300,
            sorter: (a, b) => a.nameNews?.localeCompare(b.nameNews),
        },
        {
            title: 'Mô tả bài viết',
            dataIndex: 'description',
            key: 'description',
            width: 300,
            sorter: (a, b) => a.description?.localeCompare(b.description),
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
                                onClick={(e) => handleEditNews(record.id)}
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

    const onGetListNews = (values) => {
        const params = {
            ...values,
            isAdmin: true,
            size: LIMIT,
        };

        setLoading(true);

        newsApis
            .getNews(params)
            .then(({ rows }) => {
                setListNews(rows);

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
                    <Title level={3}>{t('news_management')}</Title>
                </Col>

                <Col md={12} sm={12} xs={24} className="button_create" flex={'end'}>
                    <Link to={'/news/create'}>
                        <Button style={{ float: 'right', marginBottom: '0.5em' }} type="primary" className="w-20">
                            Thêm tin tức
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
                dataSource={listNews}
                rowKey="id"
                scroll={{ x: 'max-content' }}
                loading={loading}
                pagination={{
                    current: page,
                    position: ['bottomCenter'],
                }}
                onChange={handleTableChange}
            />

            <ModalNewsChangeStatus
                ref={refModalAccountDetail}
                onAfterChangeStatus={() => {
                    onGetListNews(getValues());
                }}
            />
        </>
    );
};

export default News;
