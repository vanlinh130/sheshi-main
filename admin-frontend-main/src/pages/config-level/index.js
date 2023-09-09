import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Typography, Collapse, Row, Col, Space, Input, Button, Pagination, Tooltip, Switch, Select } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import errorHelper from '@/utils/error-helper';
import configDataApis from '@/apis/configDataApis';
import { CONDITIONS_OPTIONS_MAP, GLOBAL_STATUS, MASTER_DATA, MASTER_DATA_NAME } from '@/constants';
import { EditOutlined } from '@ant-design/icons';
import levelConditions from '@/apis/levelConditionsApis';
import ModalConfigLevelConditionsCreate from './modal-config-level-conditions-create';
import ModalConfigLevelConditionsUpdate from './modal-config-level-conditions-update';
import { numberDecimalWithCommas } from '@/utils/funcs';

const { Title } = Typography;

const ConfigLevel = () => {
    const { t } = useTranslation();

    const {
        control,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm();

    const [listLevelConditions, setListLevelConditions] = useState([]);
    const [userLevelOptions, setUserLevelOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const refModalLevelConditionsCreate = useRef();
    const refModalLevelConditionsUpdate = useRef();

    const onSubmit = (values) => {
        return onGetListLevelConditions(values);
    };

    const expandedRowRender = (row) => {
        const dataChildrenLevelConditions = row.childrenLevelConditions.map((children) => {
            if (children.type === 1) {
                return {
                    ...children,
                    conditionsLevel: CONDITIONS_OPTIONS_MAP.find((cdt) => cdt.value === children.type).label,
                    amountMonth: children.amountMonth + ' ' + 'tháng',
                    value: numberDecimalWithCommas(children.value) + ' ' + 'đ',
                };
            }
            if (children.type === 2) {
                return {
                    ...children,
                    conditionsLevel: CONDITIONS_OPTIONS_MAP.find((cdt) => cdt.value === children.type).label,
                    value: children.value + ' ' + userLevelOptions.find((user) => user.id === children.unit).name,
                };
            }
            if (children.type === 3) {
                return {
                    ...children,
                    conditionsLevel: CONDITIONS_OPTIONS_MAP.find((cdt) => cdt.value === children.type).label,
                    value: userLevelOptions.find((user) => user.id === children.value).name,
                };
            }
        });

        const columns = [
            {
                title: 'Điều kiện cấp',
                dataIndex: 'conditionsLevel',
                key: 'conditionsLevel',
                width: 100,
            },
            {
                title: 'Đạt giá trị',
                dataIndex: 'value',
                key: 'value',
                width: 100,
            },
            {
                title: 'Trong khoảng',
                dataIndex: 'amountMonth',
                key: 'amountMonth',
                width: 100,
            },
            {
                title: t('note'),
                key: 'note',
                dataIndex: 'note',
                render: (text, record) => <Tooltip title={text}>{text}</Tooltip>,
                width: 200,
            },
        ];

        return (
            <Table
                columns={columns}
                dataSource={dataChildrenLevelConditions}
                pagination={false}
                scroll={{ x: 'max-content' }}
                rowKey="id"
            />
        );
    };

    const columns = [
        {
            title: 'Cấp bậc người dùng',
            dataIndex: 'nameLevel',
            key: 'nameLevel',
        },
        {
            title: t('action'),
            key: 'action',
            render: (item, record) => (
                <Space>
                    <Tooltip title={t('update')}>
                        <Button
                            shape="round"
                            className="mx-1"
                            size="small"
                            onClick={() => refModalLevelConditionsUpdate.current.onOpen(record)}
                            icon={<EditOutlined />}
                        />
                    </Tooltip>
                </Space>
            ),
            fixed: 'right',
            align: 'center',
            width: 100,
        },
    ];

    const onGetListLevelConditions = async (values) => {
        const params = {
            idLevel: values.userLevel,
        };
        setLoading(true);
        return levelConditions
            .getListLevelConditions(params)
            .then((rows) => {
                setListLevelConditions(
                    userLevelOptions
                        .map((userLevel) => {
                            if (rows.filter((row) => row.idLevel === userLevel.id).length > 0) {
                                return {
                                    id: userLevel.id,
                                    idLevel: userLevel.id,
                                    nameLevel: userLevel.name,
                                    childrenLevelConditions: rows.filter((row) => row.idLevel === userLevel.id),
                                };
                            }
                        })
                        .filter((e) => e),
                );

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

    const fetchLevelUserAndCommission = async () => {
        const getLevelUser = await configDataApis.getAllConfigData({
            idMaster: MASTER_DATA_NAME.LEVEL_USER,
        });
        setUserLevelOptions(getLevelUser);
    };

    useEffect(() => {
        onGetListLevelConditions(getValues());
    }, [userLevelOptions]);

    useEffect(() => {
        fetchLevelUserAndCommission();
    }, []);

    const renderSearch = () => (
        <Collapse defaultActiveKey={['1']} className="collapse-custom-style mb-5">
            <Collapse.Panel header={t('search')} key="1">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Row gutter={[24, 12]} align="bottom">
                        <Col xs={24} sm={12} md={12} xl={8}>
                            <Controller
                                name="userLevel"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <label>Cấp người dùng</label>
                                        <Select
                                            {...field}
                                            showSearch
                                            control={control}
                                            allowClear
                                            name="userLevel"
                                            placeholder="Vui lòng chọn cấp bậc người dùng"
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().includes(input.toLowerCase())
                                            }
                                        >
                                            {userLevelOptions.map((e) => {
                                                return (
                                                    <Option value={e.id} key={e.id}>
                                                        {e.name}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
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

    return (
        <>
            {renderSearch()}
            <Row gutter={[24, 12]} className="mb-3">
                <Col md={12} sm={12} xs={24}>
                    <Title level={3}>{t('config_level')}</Title>
                </Col>

                <Col md={12} sm={12} xs={24} className="button_create" flex={'end'}>
                    <Button
                        style={{ float: 'right', marginBottom: '0.5em' }}
                        htmlType="submit"
                        type="primary"
                        className="w-20"
                        onClick={() => refModalLevelConditionsCreate.current.onOpen()}
                    >
                        {t('config_data_add')}
                    </Button>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={listLevelConditions}
                rowKey="id"
                expandable={{
                    expandedRowRender,
                    expandRowByClick: true,
                }}
                scroll={{ x: 'max-content' }}
                pagination={false}
                loading={loading}
            />
            <ModalConfigLevelConditionsCreate
                ref={refModalLevelConditionsCreate}
                onAfterCreate={() => {
                    onGetListLevelConditions(getValues());
                }}
            />
            <ModalConfigLevelConditionsUpdate
                ref={refModalLevelConditionsUpdate}
                onAfterUpdate={() => {
                    onGetListLevelConditions(getValues());
                }}
            />
        </>
    );
};

export default ConfigLevel;
