import axiosClient from './axiosClient'

const commissionApis = {
  getListConfigCommission: (params) =>
    axiosClient.get("/api/commission", { params }),
  getListCommissionLevel: (params) =>
    axiosClient.get("/api/commission/get-commission-level", { params }),
  createConfigCommission: (payload) =>
    axiosClient.post("/api/commission/new-commission", payload),
  createCommissionLevel: (payload) =>
    axiosClient.post("/api/commission/new-commission-level", payload),
  updateConfigCommission: (payload) =>
    axiosClient.put("/api/commission/update-commission", payload),
};

export default commissionApis