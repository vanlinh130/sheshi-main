import React, { useEffect, useState } from "react";
import Container from "@/components/container";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import orderApis from "@/apis/orderApis";
import numberWithCommas from "@/utils/number-with-commas";
import configDataApis from "@/apis/configDataApis";
import { MASTER_DATA_NAME } from "@/constants";

const MyOrders = (props) => {
  const { t } = useTranslation();
  const [orderList, setOrderList] = useState([]);
  const [masterOrderStatus, setMasterOrderStatus] = useState();

  const fetchMasterData = async () => {
    const masterOrder = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.STATUS_ORDER,
    });
    setMasterOrderStatus(masterOrder)
  };

  const fetchOrderList = async () => {
    const orderUser = await orderApis.getOrderUser()
    setOrderList(orderUser)
  }

  useEffect(() => {
    fetchMasterData()
    fetchOrderList()
  }, [])

  return (
    <Container title={t("my_order")}>
      <div className="orders-page">
        <h3 className="title--sub">{t("my_order")}</h3>

        <div className="order-list">

          {orderList.length !== 0 &&
            orderList.map((order) => (

              <div key={order.id} className="order-item">

                <div className="order-item__text">
                  <h3>Đơn hàng #{order.orderCode}</h3>
                  <p>
                    Tổng giá trị:{" "}
                    {numberWithCommas(order.total)}đ
                  </p>
                  <div className="order-item__text__act">
                    <div className="order-item__text__act__status">
                      Tình trạng:{" "}
                      <span className="done">
                        {
                          masterOrderStatus?.find(
                            (e) => e.id === order.orderStatus
                          )?.name
                        }
                      </span>
                    </div>
                    <Link to={`/my-order/${order.orderCode}`}>
                      <button className="btn btn-link">
                        Xem chi tiết
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

            ))}



        </div>
      </div>
    </Container>
  );
};

export default MyOrders;
