import { TYPE_ADMIN } from '@/utils/constants';
import {
    DashboardOutlined,
    HomeOutlined,
    CalendarOutlined,
    DownOutlined,
    UpOutlined,
    UserOutlined,
    FileTextOutlined,
    UserSwitchOutlined,
    ShoppingOutlined,
    SettingOutlined,
    ProjectOutlined,
    BgColorsOutlined,
    LaptopOutlined,
    ExceptionOutlined,
    ContainerOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LogoIcon from '@/resources/images/logo/logo_icon.png';
import LogoText from '@/resources/images/logo/logo_text.svg';
import { MODULE } from '@/constants';
import aclApis from '@/apis/aclApis';

const SideBar = ({ pushToggle, isSideBarOpen, isShown }) => {
    const { t } = useTranslation();
    const [menus, setMenus] = useState([]);
    console.log(menus);
    const [openMenu, setOpenMenu] = useState('');
    const [activeMenu, setActiveMenu] = useState('');
    const account = JSON.parse(localStorage.getItem('info'));

    const fetchAclOfUser = async () => {
        const listAclGroup = await aclApis.getAclGroup({ groupId: account.role });
        const listMenu = [];
        listAclGroup.map((acl) =>
            menu.map((mn) => {
                if (
                    acl.actions.moduleId === mn.module &&
                    mn.module &&
                    !listMenu.find((e) => e.module === acl.actions.moduleId)
                ) {
                    listMenu.push(mn);
                }
            }),
        );
        setMenus(listMenu);
    };
    useEffect(() => {
        fetchAclOfUser();
    }, []);

    const menu = [
        {
            name: t('dashboard'),
            icon: <HomeOutlined />,
            // module: MODULE.DASHBOARD,
            link: '/',
            menu: [],
        },
        {
            name: t('product_management'),
            icon: <ShoppingOutlined />,
            module: MODULE.PRODUCT,
            menu: [
                {
                    link: '/product/create',
                    title: t('product_create'),
                },
                {
                    link: '/product',
                    title: t('product_all'),
                },
                {
                    link: '/product-category',
                    title: t('product_category'),
                },
                {
                    link: '/product-origin',
                    title: t('product_origin'),
                },
                {
                    link: '/product-attribute',
                    title: t('product_attribute'),
                },
            ],
        },
        {
            name: t('sale_management'),
            icon: <ProjectOutlined />,
            module: MODULE.ORDER,
            menu: [
                {
                    link: '/order-new',
                    title: t('order_new'),
                },
                {
                    link: '/order',
                    title: t('order_list'),
                },
                {
                    link: '/sales-statistics',
                    title: t('sales_statistics'),
                },
            ],
        },
        {
            name: t('user'),
            icon: <UserOutlined />,
            module: MODULE.USER,
            menu: [
                {
                    link: '/user',
                    title: t('user'),
                },
                {
                    link: '/user-bonus',
                    title: 'Phần thưởng',
                },
                {
                    link: '/contact',
                    title: 'Liên hệ',
                },
            ],
        },
        {
            name: t('news_management'),
            icon: <ContainerOutlined />,
            module: MODULE.NEWS,
            menu: [
                {
                    link: '/news/create',
                    title: t('news_create'),
                },
                {
                    link: '/news',
                    title: t('news_all'),
                },
            ],
        },
        {
            name: t('config'),
            icon: <SettingOutlined />,
            module: MODULE.CONFIG,
            menu: [
                {
                    link: '/config-data',
                    title: t('config_data'),
                },
                {
                    link: '/config-page',
                    title: t('config_page'),
                },
                {
                    link: '/config-role',
                    title: t('config_role'),
                },
                {
                    link: '/config-level',
                    title: t('config_level'),
                },
                {
                    link: '/config-commission',
                    title: t('config_commission'),
                },
            ],
        },
        {
            name: t('contact'),
            module: MODULE.CONTACT,
            icon: <UserSwitchOutlined />,
            link: '/contact',
            menu: [],
        },
    ];

    useEffect(() => {
        menus.forEach((e) => {
            if (e.menu?.length) {
                const activeChild = e.menu.find((i) => i.link === window.location.pathname);
                if (activeChild) {
                    setOpenMenu(e.name);
                    setActiveMenu(activeChild.link);
                }
            }
        });
    }, [window.location.pathname]);

    return (
        <div
            className={classNames('page-sidebar absolute', {
                'collapseit close-sidebar': !isSideBarOpen && !isShown,
            })}
        >
            <div className="page-sidebar__wrapper" id="main-menu-wrapper">
                <div className="logo-area">
                    <div className="logo">
                        <div className="logo__icon">
                            <img src={LogoIcon} alt="logo icon" />
                        </div>
                        <div className="logo__text">
                            <img src={LogoText} alt="logo text" />
                        </div>
                    </div>
                </div>
                <ul className="wraplist">
                    {menus.map((item, index) => (
                        <li className="wraplist__item" key={index}>
                            {item.name && (
                                <ul
                                    className="navbar-nav"
                                    onClick={() => setOpenMenu(item.name === openMenu ? '' : item.name)}
                                >
                                    <li className="nav-item">
                                        {item.menu.length == 0 || item.link == '/' ? (
                                            <Link to={item.link} key={item.title}>
                                                <i className="nav-item__img">{item.icon}</i>
                                                <span className="nav-item__title">{item.name}</span>
                                            </Link>
                                        ) : (
                                            <>
                                                <i className="nav-item__img">{item.icon}</i>
                                                <span className="nav-item__title">{item.name}</span>
                                            </>
                                        )}

                                        {item.menu.length > 0 ? (
                                            openMenu === item.name ? (
                                                <i className="nav-item__arrow">
                                                    <UpOutlined />
                                                </i>
                                            ) : (
                                                <i className="nav-item__arrow">
                                                    <DownOutlined />
                                                </i>
                                            )
                                        ) : (
                                            ''
                                        )}
                                    </li>

                                    <ul
                                        className={classNames('nav-item__sub', {
                                            'is-open-menu': openMenu === item.name,
                                        })}
                                        style={{
                                            height:
                                                openMenu === item.name || !item.name
                                                    ? `${item.menu.length * 45}px`
                                                    : '0',
                                        }}
                                    >
                                        {item.menu.map((e, i) => {
                                            return (
                                                e && (
                                                    <li
                                                        key={i}
                                                        className={classNames({
                                                            open: activeMenu === e.link,
                                                        })}
                                                        onClick={() => setActiveMenu(e.link)}
                                                    >
                                                        <Link
                                                            to={e.link || '/'}
                                                            key={e.title}
                                                            onClick={() => setActiveMenu(e.link)}
                                                        >
                                                            <span className="title">{e.title}</span>
                                                        </Link>
                                                    </li>
                                                )
                                            );
                                        })}
                                    </ul>
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
export default SideBar;
