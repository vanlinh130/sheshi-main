import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Container from "@/components/container";
import Button from "@/components/button";
import productsApis, { getCartItemsInfo } from "@/apis/productApis";
import numberWithCommas from "@/utils/number-with-commas";
import orderApis from "@/apis/orderApis";
import { getLocation } from "@/components/location-vn";
import configDataApis from "@/apis/configDataApis";
import { DELIVERY_METHOD_MAP, MASTER_DATA_NAME, PAYMENT_METHOD_MAP, STATUS_ORDER } from "@/constants";
import successHelper from "@/utils/success-helper";
import errorHelper from "@/utils/error-helper";
import { useTranslation } from "react-i18next";
import ModalConfirm from "@/components/modals/modal-confirm";

const PaymentSuccess = () => {
  const { t } = useTranslation();
  const [order, setOrder] = useState([]);
  const [location, setLocation] = useState();
  const { orderCode } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [renderTime, setRenderTime] = useState(0)
  const [masterUnit, setMasterUnit] = useState([])
  const [masterCapacity, setMasterCapacity] = useState([])
  const [productDetailOption, setProductDetailOption] = useState([])

  const [searchParams, setSearchParams] = useSearchParams();

  const statusPayment = searchParams.get("resultCode")
    ? searchParams.get("resultCode")
    : searchParams.get("vnp_ResponseCode")
    ? searchParams.get("vnp_ResponseCode")
    : null;

  const fetchMasterData = async () => {
      const fetchMasterCapacity = await configDataApis.getAllConfigData({
        idMaster: MASTER_DATA_NAME.CAPACITY_PRODUCT,
      });
      const fetchMasterUnit = await configDataApis.getAllConfigData({
        idMaster: MASTER_DATA_NAME.UNIT_PRODUCT,
      });
      setMasterCapacity(fetchMasterCapacity)
      setMasterUnit(fetchMasterUnit)
  };

  const getOrderByCode = async () => {
    const orderDetail = await orderApis.getOrderByOrderCode({ orderCode })
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

  const getLocationUser = async () => {
    if (order.length !== 0) {
      setLocation(await getLocation(order.cityCode, order.districtCode, order.wardCode))
    }
  }

  const cancelOrder = async () => {
    const body = {
      status: STATUS_ORDER.REJECT,
      productDetail: order.orderItem,
    };
    return orderApis
      .cancelOrder(order.id, body)
      .then(() => {
        successHelper("Bạn đã huỷ đơn hàng thành công");
      })
      .catch((err) => {
        errorHelper(err);
      })
      .finally(() => {
        getOrderByCode();
        setShow(false)
      });
  }

  const paymentOrder = async (id) => {
    const body = {};
    if (
      order.orderStatus === STATUS_ORDER.CONFIRMED ||
      order.orderStatus === STATUS_ORDER.REJECT ||
      renderTime !== 0
    )
      return;
    setRenderTime(1);
    if (statusPayment === "0" || statusPayment === "00") {
      body.status = STATUS_ORDER.CONFIRMED;
    } else {
      body.status = STATUS_ORDER.REJECT;
      body.productDetail = order.orderItem;
    }
    return orderApis
      .updateOrder(id, body)
      .catch((err) => {
        errorHelper(err);
      })
  };

  useEffect(() => {
    fetchMasterData()
  }, [])

  useEffect(() => {
    getOrderByCode()
  }, [masterUnit])

  useEffect(() => {
    getLocationUser();
    if (order.length !== 0 && statusPayment) {
      paymentOrder(order.id);
    }
  }, [order])
  return (
    <Container title="Thanh toán">
      <div className="cart-page">
        <div className="container">
          <>
            <div className="cart d-block">
              <div className="payment-success-body mb-5">
                <div className="order-success-status text-center">
                  <div className="success-icon">
                    <i className="bi bi-check2"></i>
                  </div>
                </div>
                <div className="order-summary text-center">
                  <div>
                    <h3>THANK YOU</h3>
                    <p>Đơn đặt hàng của bạn đã hoàn tất.</p>
                  </div>
                  <div>
                    ORDER:&nbsp;
                    <span className="orderid highlight">{orderCode}</span>
                  </div>
                  <div>Chúng tôi đã xác nhận đơn hàng của bạn.</div>
                  <div>
                    Nếu có bất kỳ thắc mắc về đơn hàng của bạn, vui lòng liên hệ
                    với chúng tôi hoặc dùng chức năng theo dõi đơn hàng
                  </div>
                </div>
                <div className="order-content-profile">
                  <div className="order-content-profile__title text-center">
                    <h4>Chi tiết đơn hàng</h4>
                  </div>
                  <div className="order-content-profile__detail">
                    <div className="customer-details row">
                      <div className="customer-details-item col-md-3 mb-4 text-center">
                        <h3 className="customer-details-item-header">
                          Địa chỉ nhận hàng
                        </h3>
                        {order?.address}
                        <br /> {location?.ward},&nbsp;{location?.district}
                        <br /> {location?.city}
                        <br /> {order?.telephone?.replace("+84", "0")}
                      </div>
                      <div className="customer-details-item col-md-3 mb-4 text-center">
                        <h3 className="customer-details-item-header">
                          Đơn vị giao hàng
                        </h3>
                        {
                          DELIVERY_METHOD_MAP.find(
                            (e) => e.value === order?.shipId
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
                                e.value === order?.orderPayment?.paymentMethod
                            )?.label
                          }
                        </div>
                      </div>
                      <div className="customer-details-item col-md-3 mb-4 text-center">
                        <div>
                          <h3 className="customer-details-item-header">
                            Ghi chú
                          </h3>
                          <span>{order?.note}</span>
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
                            <span className="label-product-mobile">
                              Sản phẩm
                            </span>
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
                                  <img
                                    width={60}
                                    height={60}
                                    src={item.product?.productImage[0]?.image}
                                  />
                                </div>
                                <div className="product-name">
                                  <div className="name">
                                    <a
                                      href={`/san-pham/${item.product?.productSlug}`}
                                      target="_blank"
                                    >
                                      {item.product?.name}
                                    </a>
                                  </div>
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
                              <span>{numberWithCommas(item.price)}đ</span>
                            </div>
                            <div className="order-details-td order-details-col5">
                              {numberWithCommas(item.price * item.quantity)}đ
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
                              numberWithCommas(order?.totalBeforeFee)}
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
                              {numberWithCommas(order?.commission)}đ
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
                              {numberWithCommas(
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
                              numberWithCommas(order?.total)}
                            đ
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-block text-center">
                <Link to="/">
                  <Button className="btn-primary ml-1">
                    Quay trở lại trang chủ
                  </Button>
                </Link>
                <Button
                  className="btn-primary ml-1"
                  onClick={handleShow}
                  disabled={
                    order?.orderStatus !== STATUS_ORDER.WAITTING_CONFIRM ||
                    statusPayment
                  }
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Huỷ đơn hàng
                </Button>
              </div>
            </div>
          </>
        </div>
      </div>
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

export default PaymentSuccess;
