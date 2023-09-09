import axiosClient from './axiosClient'

const levelConditionsApis = {
  getListLevelConditions: (params) =>
    axiosClient.get("/api/level-conditions", { params }),
  totalPriceOfUser: (params) =>
    axiosClient.get("/api/order/total-price-with-month", { params }),
  totalReferrerWithLevel: (params) =>
    axiosClient.get("/api/user/user-info/count-referrer-with-level", { params }),
};

export default levelConditionsApis