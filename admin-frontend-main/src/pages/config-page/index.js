import React from "react";
import { useTranslation } from "react-i18next";
import { Typography, Tabs, Card } from "antd";
import SchoolPage from "./school-page";
import IntroducePage from "./introduce-page";
import ContactPage from "./contact-page";
import HomePage from "./home-page";
import PolicyPage from "./policy-page";

const { Title } = Typography;

const ConfigPage = () => {
  const { t } = useTranslation();

  const { TabPane } = Tabs;
  return (
    <>
      <Title level={3}>{t("config_page")}</Title>
      <Card style={{ backgroundColor: "#fff2e8" }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Trang chủ" key="1">
            <HomePage />
          </TabPane>
          <TabPane tab="Trang giới thiệu" key="2">
            <IntroducePage />
          </TabPane>
          <TabPane tab="Trang học viện" key="3">
            <SchoolPage />
          </TabPane>
          <TabPane tab="Thông tin liên hệ và địa chỉ shop" key="4">
            <ContactPage />
          </TabPane>
          <TabPane tab="Chính sách" key="5">
            <PolicyPage />
          </TabPane>
        </Tabs>
      </Card>
    </>
  );
};

export default ConfigPage;
