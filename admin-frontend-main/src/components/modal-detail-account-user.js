import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { Modal, Row, Col, Image, Spin } from "antd";
import { useTranslation } from "react-i18next";
import userApis from "@/apis/userApis";
import errorHelper from "@/utils/error-helper";
import { getLocation } from "@/components/location-vn";
import configDataApis from "@/apis/configDataApis";
import { MASTER_DATA_NAME } from "@/constants";
import { numberDecimalWithCommas } from "@/utils/funcs";
import levelConditionsApis from "@/apis/levelConditionsApis";
import accountApis from "@/apis/accountApis";

const ProfileTab = ({ info }) => {
  const { t } = useTranslation();
  const [location, setLocation] = useState();
  const [masterLevelUser, setMasterLevelUser] = useState();
  const [totalInMonth, setTotalInMonth] = useState(0);
  const [totalInYear, setTotalInYear] = useState(0);

  const [listReferrerWithLevel, setListReferrerWithLevel] = useState([])

  const getListReferrer = async () => {
    const accounts = await accountApis.getMyReferrer(info.id)
    const listLevel = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.LEVEL_USER,
    });
    const referrerWithLevel = [];
    listLevel.map((level) => {
      const userWithLevel = accounts.filter((a) => a.register.level === level.id);
      referrerWithLevel.push({
        level: level.name,
        amount: userWithLevel.length,
      });
    })
    setListReferrerWithLevel(referrerWithLevel.map((e) => e.level + ": " + e.amount))
  }

  const fetchMasterData = async () => {
    const now = new Date();
    const masterLevel = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.LEVEL_USER,
    });
    setMasterLevelUser(masterLevel);
    const startTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );
    const startYear = new Date(now.getFullYear(), 0, 1);
    const endTime = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const totalPriceOfUser = await levelConditionsApis.totalPriceOfUser({
      userId: info.id,
      startTime,
      endTime,
    });
    const totalPriceOfUserInYear = await levelConditionsApis.totalPriceOfUser({
      userId: info.id,
      startYear,
      endTime,
    });
    setTotalInMonth(totalPriceOfUser?.data === null ? 0 : totalPriceOfUser);
    setTotalInYear(totalPriceOfUserInYear?.data === null ? 0 : totalPriceOfUserInYear);
  };

  useEffect(() => {
      fetchMasterData();
      getListReferrer();
      getLocationUser();
  }, [info])

  const getLocationUser = async () => {
    let cityCode = info?.userInformation?.cityCode;
    let districtCode = info?.userInformation?.districtCode;
    let wardCode = info?.userInformation?.wardCode;
    setLocation(
      await getLocation(
        cityCode,
        districtCode,
        wardCode
      )
    );
  };

  return (
    <div className="box__profile">
      <Row gutter={16} align="middle">
        <Col span={6}>
          <div className="box__avatar">
            <Image src={info?.userInformation?.avatar || "/ddf-logo.png"} />
          </div>
        </Col>
        <Col span={18}>
          <Row gutter={[12, 16]} align="middle">
            <Col span={24}>
              <Row gutter={16} align="middle">
                <Col span={10}>
                  <div className="text-end">
                    <b>{t("referral_id")}</b>
                  </div>
                </Col>
                <Col span={14}>
                  <div className="detail-info">{info?.userCode}</div>
                </Col>
              </Row>
            </Col>

            <Col span={24}>
              <Row gutter={16} align="middle">
                <Col span={10}>
                  <div className="text-end">
                    <b>{t("full_name")}</b>
                  </div>
                </Col>
                <Col span={14}>
                  <div className="detail-info">
                    {info?.userInformation?.fullName}
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={16} align="middle">
                <Col span={10}>
                  <div className="text-end">
                    <b>{t("email")}</b>
                  </div>
                </Col>
                <Col span={14}>
                  <div className="detail-info">{info?.email}</div>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={16} align="middle">
                <Col span={10}>
                  <div className="text-end">
                    <b>Cấp bậc</b>
                  </div>
                </Col>
                <Col span={14}>
                  <div className="detail-info">
                    {masterLevelUser?.find((e) => e.id === info?.level).name}
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={16} align="middle">
                <Col span={10}>
                  <div className="text-end">
                    <b>Tổng doanh số trong tháng</b>
                  </div>
                </Col>
                <Col span={14}>
                  <div className="detail-info">
                    {numberDecimalWithCommas(totalInMonth)} đ
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={16} align="middle">
                <Col span={10}>
                  <div className="text-end">
                    <b>Tổng doanh số trong năm</b>
                  </div>
                </Col>
                <Col span={14}>
                  <div className="detail-info">
                    {numberDecimalWithCommas(totalInYear)} đ
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={16} align="middle">
                <Col span={10}>
                  <div className="text-end">
                    <b>{t("phone")}</b>
                  </div>
                </Col>
                <Col span={14}>
                  <div className="detail-info">
                    {info?.phoneCode &&
                      info?.phoneNumber &&
                      `+${info?.phoneCode}${info?.phoneNumber}`}
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={16} align="middle">
                <Col span={10}>
                  <div className="text-end">
                    <b>{t("address")}</b>
                  </div>
                </Col>
                <Col span={14}>
                  <div className="detail-info">
                    {info?.userInformation?.address}
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={16} align="middle">
                <Col span={10}>
                  <div className="text-end">
                    <b>{t("ward")}</b>
                  </div>
                </Col>
                <Col span={14}>
                  <div className="detail-info">{location?.ward}</div>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={16} align="middle">
                <Col span={10}>
                  <div className="text-end">
                    <b>{t("district")}</b>
                  </div>
                </Col>
                <Col span={14}>
                  <div className="detail-info">{location?.district}</div>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={16} align="middle">
                <Col span={10}>
                  <div className="text-end">
                    <b>{t("city")}</b>
                  </div>
                </Col>
                <Col span={14}>
                  <div className="detail-info">{location?.city}</div>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={16} align="middle">
                <Col span={10}>
                  <div className="text-end">
                    <b>Tổng người giới thiệu</b>
                  </div>
                </Col>
                <Col span={14}>
                  <div className="detail-info">
                    {listReferrerWithLevel.map((e) => {
                      return <div key={e}>{e}</div>;
                    })}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

const ModalDetailAccountUser = ({ }, ref) => {
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);

  const onGetAccountInfo = ({ id }) => {
    setLoading(true);
    userApis
      .getAccountInfoUser({ id })
      .then((res) => {
        setAccountInfo(res);
      })
      .catch((err) => {
        errorHelper(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onOpen = (data) => {
    const { id } = data;
    setVisible(true);
    onGetAccountInfo({ id });
  };

  useImperativeHandle(ref, () => ({
    onOpen,
  }));

  const onClose = () => {
    setVisible(false);
    setLoading(false);
    setAccountInfo(null);
  };

  return (
    <Modal
      footer={null}
      visible={visible}
      onCancel={onClose}
      maskClosable={false}
      destroyOnClose
      className="modal__detail-account"
      width={655}
    >
      <h3>{t("account_detail")}</h3>
      <Spin spinning={loading}>
        {accountInfo && <ProfileTab info={accountInfo} />}
      </Spin>
    </Modal>
  );
};

export default forwardRef(ModalDetailAccountUser);
