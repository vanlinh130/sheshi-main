import axiosClient from './axiosClient'

const userApis = {
  getListUsers: (params) => axiosClient.get("/api/user/user-info/", { params }),
  getTopReferrer: () => axiosClient.get("/api/user/user-info/top-user-referrer"),
  setLevelUser: (body) =>
    axiosClient.put("/api/user/user-info/set-level-user/level", body),
  getAccountInfoUser: ({ id }) =>
    axiosClient.get(`/api/user/user-info/detail/${id}`),
};

export default userApis
