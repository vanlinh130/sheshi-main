import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Divider, List, Avatar } from 'antd';
import { ShoppingCartOutlined, TeamOutlined, PercentageOutlined, ScanOutlined } from '@ant-design/icons';
const { Meta } = Card;
import userApis from '@/apis/userApis';
import configDataApis from '@/apis/configDataApis';
import { MASTER_DATA_NAME, STATUS_ORDER } from '@/constants';
import { numberDecimalWithCommas } from '@/utils/funcs';

import { Bar, Line } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
import orderApis from '@/apis/orderApis';
import moment from 'moment';
import chartBarUser from './chartBarUser';
import chartLineSumYear from './chartLineSumYear';
import chartLineSumThisMonth from './chartLineSumThisMonth';
import errorHelper from '@/utils/error-helper';
import VirtualList from 'rc-virtual-list';
import { Link } from 'react-router-dom';

Chart.register(CategoryScale);

const Home = () => {
    const [data, setData] = useState([]);
    console.log(data);

    const appendData = async () => {
        const topReferrer = await userApis.getTopReferrer();
        setData(topReferrer);
    };

    useEffect(() => {
        appendData();
    }, []);

    const onScroll = (e) => {
        if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === ContainerHeight) {
            appendData();
        }
    };

    const ContainerHeight = 400;
    const [masterLevelUser, setMasterLevelUser] = useState();
    const [listLevelUser, setListLevelUser] = useState([]);
    const [listOrderThisMonth, setListOrderThisMonth] = useState([]);
    const [listOrderLastMonth, setListOrderLastMonth] = useState([]);
    const [listOrderThisYear, setListOrderThisYear] = useState([]);
    const [totalThisMonth, setTotalThisMonth] = useState();
    const [totalLastMonth, setTotaLastMonth] = useState();
    const [totalThisYear, setTotalThisYear] = useState();
    const [inactiveHome, setInactiveHome] = useState(false);

    const fetchMasterData = async () => {
        const masterLevel = await configDataApis.getAllConfigData({
            idMaster: MASTER_DATA_NAME.LEVEL_USER,
        });
        setMasterLevelUser(masterLevel);
    };

    const fetchListUser = async () => {
        const getListLevel = [];
        const setListLevel = [];
        try {
            const fetchUser = await userApis.getListUsers({ size: 10000 });

            masterLevelUser?.map((master) => {
                fetchUser?.rows.map((user) => {
                    if (master.id === user.level) {
                        getListLevel.push({
                            id: master.id,
                        });
                    }
                });
            });
            masterLevelUser?.map((master) => {
                const countLevel = getListLevel.filter((level) => level.id === master.id);
                setListLevel.push({
                    type: master.name,
                    value: countLevel.length,
                });
            });
            setListLevelUser(setListLevel);
        } catch (e) {
            setInactiveHome(true);
        }
    };

    const fetchOrderListSuccess = async () => {
        var date = new Date();
        var firstDayOfThisMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDayOfThisMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        var firstDayOfLastMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        var lastDayOfLastMonth = new Date(date.getFullYear(), date.getMonth(), 0);
        var firstDayOfThisYear = new Date(date.getFullYear(), 0, 1);
        var lastDayOfThisYear = new Date(date.getFullYear(), 11, 31);

        try {
            const orderThisMonth = await orderApis.getListOrder({
                status: STATUS_ORDER.DELIVERED,
                startDate: moment(firstDayOfThisMonth).format('YYYY-MM-DD HH:mm:ss'),
                endDate: moment(lastDayOfThisMonth).format('YYYY-MM-DD HH:mm:ss'),
            });
            const orderThisLastMonth = await orderApis.getListOrder({
                status: STATUS_ORDER.DELIVERED,
                startDate: moment(firstDayOfLastMonth).format('YYYY-MM-DD HH:mm:ss'),
                endDate: moment(lastDayOfLastMonth).format('YYYY-MM-DD HH:mm:ss'),
            });
            const orderThisYear = await orderApis.getListOrder({
                status: STATUS_ORDER.DELIVERED,
                startDate: moment(firstDayOfThisYear).format('YYYY-MM-DD HH:mm:ss'),
                endDate: moment(lastDayOfThisYear).format('YYYY-MM-DD HH:mm:ss'),
            });
            setListOrderThisMonth(orderThisMonth);
            setListOrderLastMonth(orderThisLastMonth);
            setListOrderThisYear(orderThisYear);
            setTotalThisYear(orderThisYear?.reduce((sum, order) => (sum = +sum + +order.total), 0));
            setTotaLastMonth(orderThisLastMonth?.reduce((sum, order) => (sum = +sum + +order.total), 0));
            setTotalThisMonth(orderThisMonth?.reduce((sum, order) => (sum = +sum + +order.total), 0));
        } catch (e) {
            setInactiveHome(true);
        }
    };

    useEffect(() => {
        fetchMasterData();
    }, []);

    useEffect(() => {
        fetchListUser();
        fetchOrderListSuccess();
    }, [masterLevelUser]);

    return (
        <div className="home-page">
            {!inactiveHome && (
                <>
                    <Row gutter={24}>
                        <Col className="gutter-row mb-3" xs={24} sm={12} md={12} lg={8}>
                            <Card bordered={false} style={{ backgroundColor: '#ffc53d', borderRadius: '20px' }}>
                                <Meta
                                    avatar={<ShoppingCartOutlined />}
                                    title={
                                        totalLastMonth !== undefined && `${numberDecimalWithCommas(totalLastMonth)}đ`
                                    }
                                    description="Tổng doanh thu tháng trước"
                                />
                            </Card>
                        </Col>
                        <Col className="gutter-row mb-3" xs={24} sm={12} md={12} lg={8}>
                            <Card bordered={false} style={{ backgroundColor: '#bae637', borderRadius: '20px' }}>
                                <Meta
                                    avatar={<ScanOutlined />}
                                    title={
                                        totalThisMonth !== undefined && `${numberDecimalWithCommas(totalThisMonth)}đ`
                                    }
                                    description="Tổng doanh thu tháng này"
                                />
                            </Card>
                        </Col>

                        <Col className="gutter-row mb-3" xs={24} sm={12} md={12} lg={8}>
                            <Card bordered={false} style={{ backgroundColor: '#36cfc9', borderRadius: '20px' }}>
                                <Meta
                                    avatar={<TeamOutlined />}
                                    title={totalThisYear !== undefined && `${numberDecimalWithCommas(totalThisYear)}đ`}
                                    description="Tổng doanh thu cả năm"
                                />
                            </Card>
                        </Col>
                    </Row>
                    <Row gutter={24} className="mb-3">
                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
                            <Card bordered={false} style={{ borderRadius: '20px' }}>
                                <Divider>
                                    <Meta
                                        title="Sơ đồ thống kê doanh thu trong tháng"
                                        style={{ textAlign: 'center' }}
                                    />
                                </Divider>
                                {chartLineSumThisMonth(listOrderThisMonth)}
                            </Card>
                        </Col>
                    </Row>
                    <Row gutter={24} className="mb-3">
                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
                            <Card
                                bordered={false}
                                style={{ borderRadius: '20px' }}
                                title="TOP 10 User có lượng giới thiệu lớn nhất"
                            >
                                <List>
                                    <VirtualList
                                        data={data}
                                        height={ContainerHeight}
                                        itemHeight={47}
                                        itemKey="email"
                                        onScroll={onScroll}
                                    >
                                        {(item) => (
                                            <List.Item key={item.email}>
                                                <List.Item.Meta
                                                    avatar={
                                                        <Avatar
                                                            src={
                                                                item.userInformation.avatar
                                                                    ? item.userInformation.avatar
                                                                    : 'avatar.jpg'
                                                            }
                                                        />
                                                    }
                                                    title={
                                                        <Link
                                                            to={`/user?email=${item.email}`}
                                                            query={`?email=${item.email}`}
                                                        >
                                                            {item.userInformation.fullName}
                                                        </Link>
                                                    }
                                                    description={item.email}
                                                />
                                                <div style={{ marginRight: '13px' }}>
                                                    <div>Tổng giới thiệu: {item.userReferrer.length} người</div>
                                                </div>
                                            </List.Item>
                                        )}
                                    </VirtualList>
                                </List>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={24} className="mb-3">
                        <Col className="gutter-row mb-3" xs={24} sm={12} md={12} lg={12}>
                            <Card bordered={false} style={{ borderRadius: '20px' }}>
                                <Divider>
                                    <Meta title="Danh sách cấp bậc người dùng" style={{ textAlign: 'center' }} />
                                </Divider>
                                {listLevelUser.length > 0 && chartBarUser(listLevelUser)}
                            </Card>
                        </Col>
                        <Col className="gutter-row" xs={24} sm={12} md={12} lg={12}>
                            <Card bordered={false} style={{ borderRadius: '20px' }}>
                                <Divider>
                                    <Meta title="Sơ đồ thống kê tổng doanh thu" style={{ textAlign: 'center' }} />
                                </Divider>
                                {chartLineSumYear(listOrderThisYear)}
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
};

export default Home;
