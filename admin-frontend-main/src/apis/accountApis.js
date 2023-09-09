import axiosClient from "./axiosClient";

const accountApis = {
  login: (payload) => axiosClient.post("/api/admin/auth/sign-in", payload),
  getProfile: () => axiosClient.get("/api/admin/auth/information"),
  countTotalBonus: (params) =>
    axiosClient.get(`/api/user/user-info/count-total-bonus/`, { params }),
  getListBonus: (params) =>
    axiosClient.get(`/api/user/user-info/list-bonus/`, { params }),
  withdrawBonus: (body) =>
    axiosClient.post(`/api/user/user-info/withdraw-bonus/`, body),
  updateTypeBonus: (id, body) =>
    axiosClient.put(`/api/user/user-info/update-type-bonus/${id}`, body),
  getMyReferrer: (id) =>
    axiosClient.get(`/api/user/user-info/my-referrer/${id}`),
};

export default accountApis;
