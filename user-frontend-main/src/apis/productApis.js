import axiosClient from "./axiosClient";
const productsApis = {
  getAllProducts: (params) => axiosClient.get("/api/product", { params }),
  getProducts: (params) => axiosClient.get("/api/product/get-by-slug", { params }),
  getCapacityProducts: (params) => axiosClient.get("/api/product/get-capacity-product", { params }),
};

export const getCartItemsInfo = async (cartItems) => {
  let res = [];
  if (cartItems.length > 0) {
    await Promise.all(cartItems.map(async (e) => {
      const params = {
        productSlug: e.slug,
        getMainImage: true
      }
      try {
        const product = await productsApis.getProducts(params);
        res.push({ ...e, product });
      } catch (e) {
      }
    }))
  }
  return res.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
};

export default productsApis;
