import axiosClient from "./axiosClient";

const productApis = {
  getListProduct: (params) => axiosClient.get("/api/product", { params }),
  getDetailProduct: (id) => axiosClient.get(`/api/product/detail-product/${id}`),
  createProduct: (payload) => axiosClient.post("/api/product/new-product", payload),
  updateProduct: (payload) => axiosClient.put("/api/product/update-product", payload),
  getCapacityProducts: (params) => axiosClient.get("/api/product/get-capacity-product", { params }),
  changeStatusProduct: (payload) => axiosClient.put("/api/product/change-status-product", payload),
};

export default productApis;
