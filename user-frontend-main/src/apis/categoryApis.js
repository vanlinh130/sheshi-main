import axiosClient from "./axiosClient";
const categoryApis = {
  getAllCategory: () => axiosClient.get("/api/product/get-list-category"),
};
export default categoryApis;
