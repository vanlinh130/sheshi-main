import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Tabs, Card } from 'antd';
import { MASTER_DATA_NAME } from '@/constants';
import configDataApis from '@/apis/configDataApis';
import DetailRole from './detail-role';

const { Title } = Typography;

const ConfigRole = () => {
    const [masterRoleUser, setMasterRoleUser] = useState();
    const { t } = useTranslation();
    const { TabPane } = Tabs;

    const fetchMasterData = async () => {
        const masterRole = await configDataApis.getAllConfigData({
            idMaster: MASTER_DATA_NAME.ROLE,
        });
        setMasterRoleUser(masterRole);
    };

    useEffect(() => {
        fetchMasterData();
    }, []);

    return (
        <>
            <Title level={3}>{t('config_role')}</Title>
            <Card style={{ backgroundColor: '#fff2e8' }}>
                <Tabs defaultActiveKey="1">
                    {masterRoleUser &&
                        masterRoleUser.map((role) => (
                            <TabPane tab={role.name} key={role.id}>
                                <DetailRole role={role} />
                            </TabPane>
                        ))}
                </Tabs>
            </Card>
        </>
    );
};

export default ConfigRole;
