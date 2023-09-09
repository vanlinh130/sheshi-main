import React, { useEffect, useState } from "react";
import Container from "@/components/container";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import orderApis from "@/apis/orderApis";
import { getLocation } from "@/components/location-vn";
import numberWithCommas from "@/utils/number-with-commas";
import configDataApis from "@/apis/configDataApis";
import { DELIVERY_METHOD_MAP, MASTER_DATA_NAME, PAYMENT_METHOD_MAP, STATUS_ORDER } from "@/constants";
import productsApis from "@/apis/productApis";
import moment from "moment";
import Button from "@/components/button";
import ModalConfirm from "@/components/modals/modal-confirm";
import { useSelector } from "react-redux";
import errorHelper from "@/utils/error-helper";
import { Col, Row } from "react-bootstrap";
import successHelper from "@/utils/success-helper";

const OrderSearchDetails = (props) => {
  const { t } = useTranslation();
  const locationUrl = useLocation();
  const [location, setLocation] = useState();
  const [orderDetail, setOrderDetail] = useState();
  const [masterOrderStatus, setMasterOrderStatus] = useState();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [masterUnit, setMasterUnit] = useState([])
  const [masterCapacity, setMasterCapacity] = useState([])
  const [productDetailOption, setProductDetailOption] = useState([])
  const params = locationUrl.search.split(/[?&]+/)

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

  const getLocationUser = async () => {
    if (!!orderDetail) {
      setLocation(await getLocation(orderDetail.cityCode, orderDetail.districtCode, orderDetail.wardCode))
    }
  }

  const cancelOrder = async () => {
    const body = {
      status: STATUS_ORDER.REJECT,
      productDetail: orderDetail.orderItem,
    };
    return orderApis
      .cancelOrder(orderDetail.id, body)
      .then(() => {
        successHelper("Bạn đã huỷ đơn hàng thành công");
      })
      .catch((err) => {
        errorHelper(err);
      })
      .finally(() => {
        fetchOrderDetail();
        setShow(false);
      });
  }

  const fetchOrderDetail = async () => {
    const orderUser = await orderApis.getOrderByOrderCode({
      orderCode: params[2].split("=")[1],
      email: params[1].split("=")[1]
    });
    if (orderUser?.data === null) {
      setOrderDetail();
      return;
    }
    setOrderDetail(orderUser)
    const listProductDetail = []
    await Promise.all(orderUser.orderItem.map(async (e) => {
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

  useEffect(() => {
    fetchMasterData()
  }, [])

  useEffect(() => {
    fetchOrderDetail();
  }, [masterUnit, locationUrl]);

  useEffect(() => {
    getLocationUser();
  }, [orderDetail]);

  return (
    <Container title={t("order")}>
      <div className="search-page">
        <div className="container">
          <h3 className="title">Tìm kiếm</h3>
          {orderDetail && (
            <p className="subtext-result mb-4">
              Kết quả tìm kiếm cho <strong>{params[1]}</strong> và{" "}
              <strong>{params[2]}</strong>
            </p>
          )}
          {!orderDetail && (
            <p className="subtext-result mb-4">
              Không tìm thấy đơn hàng nào nào với <strong>{params[1]}</strong>{" "}
              và <strong>{params[2]}</strong>
            </p>
          )}
        </div>
      </div>
      {!!orderDetail && (
        <div className="orders-page d-flex justify-content-center">
          <div className="w-75">
            <div className="order-list">
              <div className="d-flex justify-content-between">
                <div className="order-summary">
                  <p>
                    Hóa đơn:&nbsp;
                    <span className="orderid highlight">
                      #{orderDetail.orderCode}
                    </span>
                  </p>
                  <p>
                    Đặt ngày{" "}
                    {orderDetail?.orderDate &&
                      moment(orderDetail?.orderDate).format(
                        "DD-MM-YYYY HH:mm:ss"
                      )}
                  </p>
                  <p>
                    Trạng thái đơn hàng:{" "}
                    {
                      masterOrderStatus?.find(
                        (e) => e.id === orderDetail?.orderStatus
                      )?.name
                    }
                  </p>
                </div>
                <div>
                  <Button
                    className="btn-primary ml-1"
                    onClick={handleShow}
                    disabled={
                      orderDetail?.orderStatus !== STATUS_ORDER.WAITTING_CONFIRM
                    }
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    Huỷ đơn hàng
                  </Button>
                </div>
              </div>
              <div className="order-content-profile">
                <div className="order-content-profile__detail">
                  <div className="customer-details row">
                    <div className="customer-details-item col-md-3 mb-4 text-center">
                      <h3 className="customer-details-item-header">
                        Địa chỉ nhận hàng
                      </h3>
                      {orderDetail?.address}
                      <br /> {location?.ward},&nbsp;{location?.district}
                      <br /> {location?.city}
                      <br /> {orderDetail?.telephone?.replace("+84", "0")}
                    </div>
                    <div className="customer-details-item col-md-3 mb-4 text-center">
                      <h3 className="customer-details-item-header">
                        Đơn vị giao hàng
                      </h3>
                      {
                        DELIVERY_METHOD_MAP.find(
                          (e) => e.value === orderDetail?.shipId
                        )?.label
                      }
                    </div>
                    <div className="customer-details-item col-md-3 mb-4 text-center">
                      <div>
                        <h3 className="customer-details-item-header">
                          Phương thức thanh toán
                        </h3>
                        {
                          PAYMENT_METHOD_MAP.find(
                            (e) =>
                              e.value ===
                              orderDetail?.orderPayment?.paymentMethod
                          )?.label
                        }
                      </div>
                    </div>
                    <div className="customer-details-item col-md-3 mb-4 text-center">
                      <div>
                        <h3 className="customer-details-item-header">
                          Ghi chú
                        </h3>
                        <span>{orderDetail?.note}</span>
                      </div>
                    </div>
                  </div>
                  <div className="order-details clearfix">
                    <div className="order-details-table">
                      <div className="order-details-row clearfix">
                        <div className="order-details-th order-details-col1">
                          Hình
                        </div>
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
                      {orderDetail?.orderItem?.map((item) => (
                        <div
                          key={item.id}
                          className="order-details-row clearfix"
                        >
                          <div className="order-details-td order-details-col1">
                            <img
                              width={60}
                              height={60}
                              src={item.product?.productImage[0]?.image}
                            />
                          </div>
                          <div className="order-details-td order-details-col2">
                            <div className="order-detail-order-info">
                              <div className="product-image d-none">
                                <Link
                                  to={`/san-pham/${item.product?.productSlug}`}
                                >
                                  <img
                                    width={60}
                                    height={60}
                                    src={item.product?.productImage[0]?.image}
                                  />
                                </Link>
                              </div>
                              <div className="product-name">
                                <div className="name">
                                  <Link
                                    to={`/san-pham/${item.product?.productSlug}`}
                                  >
                                    {item.product?.name}
                                  </Link>
                                </div>
                                {/* <div className="order-detail-price-item d-none">
                                Giá: 590,000đ
                              </div> */}
                                <div className="size-color">
                                  <div>
                                    Kích cỡ:{" "}
                                    {
                                      productDetailOption.find(
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
                            <span>
                              {item?.price && numberWithCommas(item.price)}đ
                            </span>
                          </div>
                          <div className="order-details-td order-details-col5">
                            {item?.price &&
                              numberWithCommas(item.price * item.quantity)}
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
                          {orderDetail?.totalBeforeFee &&
                            numberWithCommas(orderDetail?.totalBeforeFee)}{" "}
                          đ
                        </div>
                      </div>

                      {orderDetail?.commission && (
                        <div className="order-details-row order-details-totalrow shipping clearfix">
                          <div className="order-details-td order-details-total-col1">
                            &nbsp;
                          </div>
                          <div className="order-details-td order-details-total-col2">
                            Hoa hồng cấp đại lý
                          </div>
                          <div className="order-details-td order-details-total-col3">
                            {numberWithCommas(orderDetail?.commission)} đ
                          </div>
                        </div>
                      )}
                      {orderDetail !== 0 && orderDetail?.shipId && (
                        <div className="order-details-row order-details-totalrow shipping clearfix">
                          <div className="order-details-td order-details-total-col1">
                            &nbsp;
                          </div>
                          <div className="order-details-td order-details-total-col2">
                            Phí vận chuyển
                          </div>
                          <div className="order-details-td order-details-total-col3">
                            {numberWithCommas(
                              orderDetail?.total -
                                orderDetail?.totalBeforeFee +
                                (orderDetail?.commission
                                  ? orderDetail?.commission
                                  : 0)
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
                          {orderDetail?.total &&
                            numberWithCommas(orderDetail?.total)}{" "}
                          đ
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {show && (
        <ModalConfirm
          show={show}
          handleClose={handleClose}
          handleAction={cancelOrder}
          header="Huỷ đơn hàng"
          content="Bạn có chắc chắn muốn huỷ đơn hàng không ?"
          button="Có"
        />
      )}
    </Container>
  );
};

export default OrderSearchDetails;
