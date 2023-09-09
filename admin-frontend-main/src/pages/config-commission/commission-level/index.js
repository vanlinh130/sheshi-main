import { Button, Card, Col, Row, Table, Tabs, Tooltip, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import configDataApis from "@/apis/configDataApis";
import { MASTER_DATA_NAME } from "@/constants";
import CommissionLevelCreate from "../commission-level-create";

const CommissionLevel = () => {
  const { t } = useTranslation();

  const { TabPane } = Tabs;
  const [userLevelOptions, setUserLevelOptions] = useState([]);
  const [changeTab, setChangeTab] = useState(false);

  const fetchLevelUser = async () => {
    const getLevelUser = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.LEVEL_USER,
    });
    setUserLevelOptions(getLevelUser);
  };
  useEffect(() => {
    fetchLevelUser();
  }, []);

  return (
    <>
      <Card>
        <Tabs
          defaultActiveKey="1"
          onChange={() => {
            setChangeTab((prev) => !prev);
          }}
        >
          {userLevelOptions.map((e) => (
            <TabPane key={e.id} tab={e.name}>
              <CommissionLevelCreate idLevel={e.id} changeTab={changeTab} />
            </TabPane>
          ))}
        </Tabs>
      </Card>
    </>
  );
};

export default CommissionLevel;
