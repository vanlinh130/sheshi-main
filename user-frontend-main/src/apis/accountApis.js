import axiosClient from "./axiosClient";

const accountApis = {
  getMyReferrer: (id) =>
    axiosClient.get(`/api/user/user-info/my-referrer/${id}`),
  getUserWithUserCode: (params) =>
    axiosClient.get(`/api/user/user-info/user-with-user-code/`, { params }),
  countTotalBonus: (params) =>
    axiosClient.get(`/api/user/user-info/count-total-bonus/`, { params }),
  getListBonus: (params) =>
    axiosClient.get(`/api/user/user-info/list-bonus/`, { params }),
  getMyBonus: () => axiosClient.get(`/api/user/user-info/my-bonus/`),
  setLevelUser: (body) =>
    axiosClient.put("/api/user/user-info/set-level-user/level", body),
  withdrawBonus: (body) =>
    axiosClient.post(`/api/user/user-info/withdraw-bonus/`, body),
};

export default accountApis;
