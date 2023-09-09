import axiosClient from "./axiosClient";
const orderApis = {
  createOrder: (body) => axiosClient.post("/api/order/new-order", body),
  createPaymentVnpay: (body) =>
    axiosClient.post("/api/order/create_payment_vnpay", body),
  updateOrder: (id, payload) =>
    axiosClient.put(`/api/order/update-order/${id}`, payload),
  createPaymentMomo: (body) =>
    axiosClient.post("/api/order/create_payment_momo", body),
  getOrderByOrderCode: (params) =>
    axiosClient.get("/api/order/search-order", { params }),
  getOrderUser: () => axiosClient.get("/api/order/my-order"),
  getOrderRef: () => axiosClient.get("/api/order/refs-order"),
  cancelOrder: (id, payload) =>
    axiosClient.put(`/api/order/cancel-order/${id}`, payload),
};
export default orderApis;
