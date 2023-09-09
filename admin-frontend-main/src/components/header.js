import Storage from "@/utils/storage";
import { MenuOutlined } from "@ant-design/icons";
import React from "react";
import classNames from "classnames";
import { MODE_THEME } from "@/constants";
import { Dropdown, Menu, Switch, Avatar } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/accountSlice";
import { changeTheme } from "@/store/slices/commonSlice";
import LocalStorage from "@/utils/storage";
import { STORAGE_KEY } from "@/constants/storage-key";

const Header = ({ pushToggle, isSideBarOpen, isShown }) => {
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.common);
  const dispatch = useDispatch();

  const onChangeTheme = () => {
    const newTheme =
      theme === MODE_THEME.LIGHT ? MODE_THEME.DARK : MODE_THEME.LIGHT;
    dispatch(changeTheme(newTheme));
  };

  const onClickMenu = (e) => {
    if (e.key === "logout") {
      onLogout();
    }
  };

  const renderMenuHeader = (
    <Menu
      onClick={onClickMenu}
      items={[
        {
          label: t("logout"),
          key: "logout",
          icon: <LogoutOutlined />,
        },
      ]}
    />
  );

  const onLogout = () => {
    LocalStorage.remove(STORAGE_KEY.TOKEN);
    LocalStorage.remove(STORAGE_KEY.INFO);
    dispatch(logout());
  };

  const handleToggle = () => {
    pushToggle(!isSideBarOpen);
  };
  

  return (
    <div
      className={classNames("page-topbar", {
        sidebar_shift: !isSideBarOpen && !isShown,
      })}
    >
      <div className="quick-area">
        <div className="pull-left">
          <a
            onClick={handleToggle}
            data-toggle="sidebar"
            className="sidebar_toggle"
          >
            <MenuOutlined />
          </a>
        </div>
        <div className="pull-right">
          <ul className="nav">
            <li>
              <Switch
                checkedChildren={t("light")}
                unCheckedChildren={t("dark")}
                checked={theme === MODE_THEME.LIGHT}
                onChange={onChangeTheme}
              />
            </li>

            <li>
              <Dropdown
                overlay={renderMenuHeader}
                placement="bottomRight"
                onClick={(e) => e.preventDefault()}
              >
                <Avatar
                  style={{ backgroundColor: "#888888" }}
                  icon={<UserOutlined />}
                />
              </Dropdown>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Header;
