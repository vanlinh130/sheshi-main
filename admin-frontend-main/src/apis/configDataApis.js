import axiosClient from './axiosClient'

const configDataApis = {
    getListPagingConfigData: (params) => axiosClient.get('/api/master/', { params }),
    createConfigData: (payload) => axiosClient.post('/api/master/new-master', payload),
    getAllConfigData: (params) => axiosClient.get("/api/master/get-master", { params }),
    updateConfigData: (payload) => axiosClient.put("/api/master/update-master", payload),
    deleteConfigData: (payload) => axiosClient.put("/api/master/update-master", payload),
}

export default configDataApis
