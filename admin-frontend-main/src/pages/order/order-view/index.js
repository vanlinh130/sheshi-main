import React, { forwardRef, useState, useRef, useEffect } from "react";
import {
  PlusOutlined,
  ArrowLeftOutlined,
  CameraOutlined,
  LoadingOutlined,
  ReloadOutlined,
  CheckOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import {
  Button,
  Table,
  Tag,
  Tooltip,
  Input,
  Radio,
  Space,
  Spin,
  Image,
  Card,
  Col,
  Row,
  PageHeader,
  Upload,
  Modal,
} from "antd";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import orderApis from "@/apis/orderApis";
import { getLocation } from "@/components/location-vn";
import { numberDecimalWithCommas } from "@/utils/funcs";
import configDataApis from "@/apis/configDataApis";
import productsApis from "@/apis/productApis";
import { DELIVERY_METHOD_MAP, MASTER_DATA_NAME, PAYMENT_METHOD_MAP } from "@/constants";
import moment from "moment";


const OrderViews = () => {
  const { t } = useTranslation();
  const [order, setOrder] = useState([]);
  const [location, setLocation] = useState();
  const { orderCode } = useParams();
  const navigate = useNavigate();

  const [masterOrderStatus, setMasterOrderStatus] = useState();

  const [masterUnit, setMasterUnit] = useState([])
  const [masterCapacity, setMasterCapacity] = useState([])
  const [productDetailOption, setProductDetailOption] = useState([])

  const fetchMasterData = async () => {
    const masterOrder = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.STATUS_ORDER,
    });
    const fetchMasterCapacity = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.CAPACITY_PRODUCT,
    });
    const fetchMasterUnit = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.UNIT_PRODUCT,
    });
    setMasterCapacity(fetchMasterCapacity)
    setMasterUnit(fetchMasterUnit)
    setMasterOrderStatus(masterOrder)

  };

  const getOrderByCode = async () => {
    const orderDetail = await orderApis.getDetailOrder({ orderCode })
    if (orderDetail.data === null) {
      navigate(`/not-found`);
    }
    setOrder(orderDetail)

    const listProductDetail = []
    await Promise.all(orderDetail.orderItem.map(async (e) => {
      const productDetail = await productsApis.getCapacityProducts({
        productId: e?.productId,
        id: e?.subProductId,
      })
      listProductDetail.push({
        id: productDetail.id,
        productId: productDetail.productId,
        name:
          masterCapacity.find((e) => e.id === productDetail.capacityId)?.name +
          " " +
          masterUnit.find((e) => e.id === productDetail.unitId)?.name,
      });
    }))
    setProductDetailOption(listProductDetail)
  }

  const goBackListOrder = () => {
    navigate(`/order`);
  }

  const getLocationUser = async () => {
    if (order.length !== 0) {
      setLocation(await getLocation(order.cityCode, order.districtCode, order.wardCode))
    }
  }

  useEffect(() => {
    fetchMasterData()
  }, [])

  useEffect(() => {
    getOrderByCode()
  }, [masterUnit])

  useEffect(() => {
    getLocationUser()
  }, [order])
  return (
    <Row gutter={[24, 12]} justify="center" align="top">
      <Col xs={24} sm={24} md={17} xl={17}>
        <PageHeader
          onBack={() => goBackListOrder()}
          className="site-page-header-responsive"
          title={t("order") + ": "}
          subTitle={"#" + orderCode}
          // extra={[
          //   <Button
          //     icon={<PrinterOutlined />}
          //     key="1"
          //     htmlType="submit"
          //     type="primary"
          //     loading={loading}
          //   >
          //     {t("order_print")}
          //   </Button>,
          // ]}
        >
          <Card bordered={false} className="mb-3">
            <div className="order-summary">
              <p>
                Hóa đơn:&nbsp;
                <span className="orderid highlight">#{order?.orderCode}</span>
              </p>
              <p>
                Đặt ngày{" "}
                {order?.orderDate &&
                  moment(order?.orderDate).format("DD-MM-YYYY HH:mm:ss")}
              </p>
              <p>
                Trạng thái đơn hàng:{" "}
                {
                  masterOrderStatus?.find((e) => e.id === order?.orderStatus)
                    ?.name
                }
              </p>
            </div>

            <div className="order-content-profile">
              <div className="order-content-profile__title text-center">
                <h2>Chi tiết đơn hàng</h2>
              </div>
              <div className="order-content-profile__detail text-center">
                <Row className="customer-details mb-5" justify="center">
                  <Col xs={24} sm={24} md={6} xl={6}>
                    <div className="customer-details-item mb-3">
                      <h3 className="customer-details-item-header">
                        Địa chỉ nhận hàng
                      </h3>
                      {order?.address}
                      <br /> {location?.ward},&nbsp;{location?.district}
                      <br /> {location?.city}
                      <br /> Số điện thoại :{" "}
                      {order?.telephone?.replace("+84", "0")}
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={6} xl={6}>
                    <div className="customer-details-item mb-3">
                      <h3 className="customer-details-item-header">
                        Đơn vị giao hàng
                      </h3>
                      <span>
                        {
                          DELIVERY_METHOD_MAP.find(
                            (e) => e.value === order?.shipId
                          )?.label
                        }
                      </span>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={6} xl={6}>
                    <div className="customer-details-item mb-3">
                      <div>
                        <h3 className="customer-details-item-header">
                          Phương thức thanh toán
                        </h3>

                        {
                          PAYMENT_METHOD_MAP.find(
                            (e) =>
                              e.value === order?.orderPayment?.paymentMethod
                          )?.label
                        }
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={6} xl={6}>
                    <div className="customer-details-item mb-3">
                      <div>
                        <h3 className="customer-details-item-header">
                          Ghi chú
                        </h3>
                        <span>{order?.note}</span>
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className="order-details clearfix">
                  <div className="order-details-table">
                    <div className="order-details-row clearfix">
                      <div className="order-details-th order-details-col2">
                        <span className="label-product-mobile">Sản phẩm</span>
                        &nbsp;
                      </div>
                      <div className="order-details-th order-details-col3">
                        SL
                      </div>
                      <div className="order-details-th order-details-col4">
                        Giá
                      </div>
                      <div className="order-details-th order-details-col5">
                        Tạm tính
                      </div>
                    </div>
                    {order?.orderItem?.map((item) => (
                      <div key={item.id} className="order-details-row clearfix">
                        <div className="order-details-td order-details-col2">
                          <div className="order-detail-order-info">
                            <div className="product-image d-none">
                              <img
                                width={60}
                                height={60}
                                src={item.product?.productImage[0]?.image}
                              />
                            </div>
                            <div className="product-name">
                              <div className="name">
                                <p>{item.product?.name}</p>
                              </div>
                              <div className="size-color">
                                <div>
                                  Kích cỡ:{" "}
                                  {
                                    productDetailOption?.find(
                                      (opt) =>
                                        opt.id === item.subProductId &&
                                        opt.productId === item.productId
                                    )?.name
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="order-details-td order-details-col3">
                          <span>{item.quantity}</span>
                        </div>
                        <div className="order-details-td order-details-col4">
                          <span>{numberDecimalWithCommas(item.price)} đ</span>
                        </div>
                        <div className="order-details-td order-details-col5">
                          {numberDecimalWithCommas(item.price * item.quantity)}{" "}
                          đ
                        </div>
                      </div>
                    ))}
                    <div className="order-details-row order-details-totalrow subtotal clearfix">
                      <div className="order-details-td order-details-total-col1">
                        &nbsp;
                      </div>
                      <div className="order-details-td order-details-total-col2">
                        Tạm tính
                      </div>
                      <div className="order-details-td order-details-total-col3">
                        {order.length !== 0 &&
                          numberDecimalWithCommas(order?.totalBeforeFee)}{" "}
                        đ
                      </div>
                    </div>
                    {order.length !== 0 && order?.commission && (
                      <div className="order-details-row order-details-totalrow shipping clearfix">
                        <div className="order-details-td order-details-total-col1">
                          &nbsp;
                        </div>
                        <div className="order-details-td order-details-total-col2">
                          Hoa hồng cấp đại lý
                        </div>
                        <div className="order-details-td order-details-total-col3">
                          {numberDecimalWithCommas(order?.commission)}đ
                        </div>
                      </div>
                    )}
                    {order.length !== 0 && order?.shipId && (
                      <div className="order-details-row order-details-totalrow shipping clearfix">
                        <div className="order-details-td order-details-total-col1">
                          &nbsp;
                        </div>
                        <div className="order-details-td order-details-total-col2">
                          Phí vận chuyển
                        </div>
                        <div className="order-details-td order-details-total-col3">
                          {numberDecimalWithCommas(
                            order?.total -
                              order?.totalBeforeFee +
                              (order?.commission ? order?.commission : 0)
                          )}
                          đ
                        </div>
                      </div>
                    )}
                    <div className="order-details-row order-details-totalrow total clearfix">
                      <div className="order-details-td order-details-total-col1">
                        &nbsp;
                      </div>
                      <div className="order-details-td order-details-total-col2">
                        Thành tiền
                      </div>
                      <div className="order-details-td order-details-total-col3">
                        {order.length !== 0 &&
                          numberDecimalWithCommas(order?.total)}{" "}
                        đ
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </PageHeader>
      </Col>
    </Row>
  );
};

export default OrderViews;
