import axiosClient from './axiosClient'

const productCategoryApis = {
  getListPagingProductCategory: (params) => axiosClient.get('/api/product/get-list-category-with-paging', { params }),
  createProductCategory: (payload) => axiosClient.post('/api/product/new-category', payload),
  getAllCategory: () => axiosClient.get("/api/product/get-list-category"),
  updateCategory: (payload) => axiosClient.put("/api/product/update-category", payload),
  updateStatusCategory: (payload) => axiosClient.put("/api/product/change-status-product-category", payload),
  getDetailCategory: (id) => axiosClient.get(`/api/product/detail-category/${id}`),

  // updateProductCategory: (id, payload) => axiosClient.put(`/api/admin/product-category/${id}`, payload),
  // deleteProductCategory: (id) => axiosClient.delete(`/api/admin/product-category/${id}`),
}

export default productCategoryApis
