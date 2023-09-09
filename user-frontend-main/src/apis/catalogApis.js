import axiosClient from "./axiosClient";
const CatalogApis = {
  getAllCatalog: () => axiosClient.get("/api/product/get-list-category"),
};
export default CatalogApis;
