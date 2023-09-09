import aclApis from '@/apis/aclApis';
import { ACTION, MODULE, MODULE_MAP } from '@/constants';
import errorHelper from '@/utils/error-helper';
import successHelper from '@/utils/success-helper';
import yup from '@/utils/yup';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Checkbox, Col, Form, Input, Row, Select, Table, Tag, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ModalConfigRoleDelete from '../modal-config-role-delete';

const DetailRole = ({ role }) => {
    const { t } = useTranslation();
    const [detailGroup, setDetailGroup] = useState([]);
    const [chooseModule, setChooseModule] = useState();
    const [checkActions, setCheckActions] = useState([]);
    const [reloadTable, setReloadTable] = useState(false);
    const refModalDeleteRoleModule = useRef();

    const schema = yup.object({
        groupId: yup.number().required(),
        actions: yup.array().required(),
    });
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
    } = useForm({
        resolver: yupResolver(schema),
    });
    const onChange_Radio = () => {
        setValue('groupId', role.id);
    };

    const onSubmit = async (value) => {
        const body = {
            groupId: value.groupId,
            actionsId: value.actions,
        };
        try {
            await aclApis.createRoleModule(body);
            successHelper('Đã thêm quyền thành công');
        } catch (e) {
            console.log(e);
            errorHelper(e);
        } finally {
            setReloadTable((prv) => !prv);
            setChooseModule();
            setCheckActions([]);
            setValue('actions');
        }
    };
    const onChangeAction = (value) => {
        setValue('actions', value);
    };

    const onChangeModule = async (moduleId) => {
        setChooseModule(moduleId);
        const listActions = await aclApis.getAclActionWithModuleId(moduleId);
        setCheckActions(
            listActions.map((action) => ({
                label: action.name,
                value: action.id,
            })),
        );
        setValue('actions', [listActions[0].id]);
    };

    const CreateGroupRoleForm = () => {
        return (
            <Card bordered={false} className="mb-3" title="Tạo quyền truy cập">
                <form name="advanced_search" className="ant-advanced-search-form" onSubmit={handleSubmit(onSubmit)}>
                    <Row gutter={24} align="middle">
                        <Col xs={24} sm={24} md={6} xl={6}>
                            <div className="field mb-3">
                                <label> Chức năng </label>
                                <Select
                                    showSearch
                                    style={{ marginTop: '5px' }}
                                    status={errors?.categoryId?.message}
                                    name="moduleId"
                                    placeholder="Vui lòng chức năng"
                                    optionFilterProp="children"
                                    onChange={onChangeModule}
                                    value={chooseModule}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {MODULE_MAP?.map((e) => {
                                        return (
                                            <Option value={e.id} key={e.id}>
                                                {e.name}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                            {errors?.name?.message && <p className="text-error">{errors?.name?.message}</p>}
                        </Col>
                        <Col xs={24} sm={24} md={1} xl={1} />
                        <Col xs={24} sm={24} md={10} xl={10}>
                            {/* {checkActions.length > 0 && (
                <div className="field">
                  <Controller
                    name="actions"
                    control={control}
                    render={() => (
                      <Checkbox.Group
                        onChange={onChangeAction}
                        options={checkActions}
                      />
                    )}
                  />
                </div>
              )}
              {errors?.actions?.message && (
                <p className="text-error">{errors?.actions?.message}</p>
              )} */}
                        </Col>
                        <Col xs={24} sm={24} md={3} xl={3} />
                        <Col xs={8} sm={8} md={4} xl={4}>
                            <Button htmlType="submit" type="primary" disabled={!chooseModule} onClick={onChange_Radio}>
                                Thêm quyền
                            </Button>
                        </Col>
                    </Row>
                </form>
            </Card>
        );
    };

    const fetchAcl = async () => {
        const aclDetailGroup = await aclApis.getAclGroup({ groupId: role.id });
        const mapAclDetailGroup = [];
        MODULE_MAP.map((mm) => {
            aclDetailGroup.map((dg) => {
                if (
                    dg.actions.moduleId === mm.id &&
                    !mapAclDetailGroup.find((e) => e.moduleId === dg.actions.moduleId)
                ) {
                    mapAclDetailGroup.push({
                        id: mm.id,
                        moduleId: mm.id,
                        moduleName: mm.name,
                        description: dg.actions?.modules?.description,
                        groupId: role.id,
                        actions: aclDetailGroup
                            .map((aclDetail) => {
                                if (aclDetail.actions.moduleId === mm.id) {
                                    return aclDetail.actions;
                                }
                            })
                            .filter((e) => e),
                    });
                }
            });
        });

        setDetailGroup(mapAclDetailGroup);
    };
    useEffect(() => {
        fetchAcl();
    }, [reloadTable]);

    const columns = [
        {
            title: 'Chức năng',
            dataIndex: 'moduleName',
            key: 'moduleName',
            width: 400,
            align: 'center',
            sorter: (a, b) => a.moduleName?.localeCompare(b.moduleName),
        },
        {
            title: 'Mô tả chức năng',
            dataIndex: 'description',
            key: 'description',
            width: 400,
            align: 'center',
            sorter: (a, b) => a.description?.localeCompare(b.description),
        },
        // {
        //   title: "Hành động",
        //   key: "actions",
        //   dataIndex: "tags",
        //   align: "center",
        //   width: 400,
        //   render: (_, { actions }) => (
        //     <>
        //       {actions.map((action) => {
        //         let color;
        //         if (action.name === ACTION.CREATE) {
        //           color = "green";
        //         } else if (action.name === ACTION.READ) {
        //           color = "gold";
        //         } else if (action.name === ACTION.DELETE) {
        //           color = "red";
        //         } else if (action.name === ACTION.UPDATE) {
        //           color = "geekblue";
        //         }
        //         return (
        //           <Tag color={color} key={action.id} style={{ marginLeft: "15px" }}>
        //             {action.name}
        //           </Tag>
        //         );
        //       })}
        //     </>
        //   ),
        // },
        {
            title: t('action'),
            key: 'action',
            align: 'center',
            width: 200,
            render: (item, record) => (
                <div className="d-flex justify-content-center flex-row">
                    {/* <div
            className="d-flex justify-content-center"
            style={{ marginRight: "10px" }}
          >
            <Tooltip title={t("update")}>
              <Button
                shape="round"
                className="mx-1"
                size="small"
                // onClick={() => refModalUpdateBonusWallet.current.onOpen(record.id)}
                icon={<EditOutlined />}
              />
            </Tooltip>
          </div> */}
                    <div className="d-flex justify-content-center">
                        <Tooltip title={t('delete')}>
                            <Button
                                shape="round"
                                className="mx-1"
                                size="small"
                                onClick={() => refModalDeleteRoleModule.current.onOpen(record)}
                                icon={<DeleteOutlined />}
                                type="danger"
                            />
                        </Tooltip>
                    </div>
                </div>
            ),
        },
    ];
    return (
        <>
            <CreateGroupRoleForm />
            <Table
                columns={columns}
                dataSource={detailGroup}
                rowKey="id"
                bordered
                pagination={false}
                scroll={{ x: 'max-content' }}
            />
            {refModalDeleteRoleModule && (
                <ModalConfigRoleDelete
                    ref={refModalDeleteRoleModule}
                    onSubmit={(body) => aclApis.deleteRoleModule(body)}
                    onAfterDelete={() => {
                        setReloadTable((prv) => !prv);
                    }}
                />
            )}
        </>
    );
};

export default DetailRole;
