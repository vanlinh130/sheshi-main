import axiosClient from './axiosClient'

const levelConditionsApis = {
  getListLevelConditions: (params) =>
    axiosClient.get("/api/level-conditions", { params }),
  createLevelConditions: (payload) =>
    axiosClient.post("/api/level-conditions/new-level-conditions", payload),
  updateLevelConditions: (payload) =>
    axiosClient.put("/api/level-conditions/update-level-conditions", payload),
  totalPriceOfUser: (params) =>
    axiosClient.get("/api/order/total-price-with-month", { params }),
  totalReferrerWithLevel: (params) =>
    axiosClient.get("/api/user/user-info/count-referrer-with-level", {
      params,
    }),
};

export default levelConditionsApis