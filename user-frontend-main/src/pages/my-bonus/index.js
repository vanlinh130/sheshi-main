import React, { useEffect, useState } from "react";
import Container from "@/components/container";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import orderApis from "@/apis/orderApis";
import { useSelector } from "react-redux";
import numberWithCommas from "@/utils/number-with-commas";
import configDataApis from "@/apis/configDataApis";
import { BONUS_TYPE, BONUS_TYPE_MAP, MASTER_DATA_NAME } from "@/constants";
import accountApis from "@/apis/accountApis";
import { Badge, Button, Table } from "react-bootstrap";
import ModalWithdraw from "./modalWithdraw";

const MyBonus = (props) => {
  const { t } = useTranslation();
  const { info } = useSelector((state) => state.account);
  const [bonusList, setBonusList] = useState([]);
  const [totalBonus, setTotalBonus] = useState(0);
  const [masterOrderStatus, setMasterOrderStatus] = useState();

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    fetchBonusList();
  };
  const handleShow = () => setShow(true);

  const fetchMasterData = async () => {
    const masterOrder = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.STATUS_ORDER,
    });
    setMasterOrderStatus(masterOrder)
  };

  const fetchBonusList = async () => {
    const bonus = await accountApis.getMyBonus();
    const total = await accountApis.countTotalBonus({ userId: info.id });
    setBonusList(bonus)
    setTotalBonus(total.data === 0 ? 0 : total)
  }

  useEffect(() => {
    fetchMasterData()
    fetchBonusList()
  }, [])

  return (
    <Container title="Lịch sử thưởng">
      <div className="orders-page">
        <h3 className="title--sub">Lịch sử thưởng</h3>

        <Table striped bordered>
          <thead>
            <tr className="table-success">
              <th>#</th>
              <th>Người bạn giới thiệu</th>
              <th>Mã người bạn giới thiệu</th>
              <th>Đơn hàng</th>
              <th>Hoa hồng</th>
              <th>Loại</th>
            </tr>
          </thead>
          <tbody>
            {bonusList.map((bonus, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{bonus.order?.fullName ? bonus.order?.fullName : "-"}</td>
                <td>
                  {bonus.type !== BONUS_TYPE.RECEIVER
                    ? "-"
                    : bonus.order?.user
                    ? bonus.order?.user.userCode
                    : "GUEST"}
                </td>
                <td>
                  {bonus.order?.orderCode ? (
                    <Link
                      to={`/search-order?email=${bonus.order?.email}&orderCode=${bonus.order?.orderCode}`}
                    >
                      {bonus.order?.orderCode}
                    </Link>
                  ) : (
                    "-"
                  )}
                </td>
                <td>{numberWithCommas(bonus.priceBonus)} đ</td>
                <td>
                  <Badge
                    pill
                    bg={
                      bonus.type === BONUS_TYPE.RECEIVER
                        ? "success"
                        : bonus.type === BONUS_TYPE.WITHDRAW
                        ? "info"
                        : bonus.type === BONUS_TYPE.REQUEST
                        ? "warning"
                        : "danger"
                    }
                  >
                    {BONUS_TYPE_MAP.find((e) => e.value === bonus.type)?.label}
                  </Badge>{" "}
                </td>
              </tr>
            ))}

            <tr
              className="table-success"
              style={{ verticalAlign: "middle", fontWeight: "bold" }}
            >
              <td>Tổng thưởng</td>
              <td colSpan={4}>{numberWithCommas(totalBonus)} đ</td>
              <td colSpan={1}>
                <Button
                  as="input"
                  size="sm"
                  disabled={totalBonus === 0}
                  type="submit"
                  onClick={handleShow}
                  value="Yêu cầu rút tiền thưởng"
                />
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
      {show && (
        <ModalWithdraw
          show={show}
          handleClose={handleClose}
          totalBonus={totalBonus}
          userId={info.id}
        />
      )}
    </Container>
  );
};

export default MyBonus;
