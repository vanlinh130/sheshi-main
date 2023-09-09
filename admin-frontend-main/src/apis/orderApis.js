import axiosClient from './axiosClient'

const orderApis = {
    updateOrder: (id, payload) => axiosClient.put(`/api/order/update-order/${id}`, payload),
    getListOrder: (params) => axiosClient.get('/api/order/list-order-with-conditions', { params }),
    getListPagingOrder: (params) => axiosClient.get('/api/order/list-order', { params }),
    getDetailOrder: (params) => axiosClient.get("/api/order/search-order", { params }),
}

export default orderApis
