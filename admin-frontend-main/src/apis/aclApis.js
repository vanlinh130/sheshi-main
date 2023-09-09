import axiosClient from "./axiosClient";

const aclApis = {
  getAclGroup: (params) => axiosClient.get("/api/acl/", { params }),
  getAclActionWithModuleId: (moduleId) =>
    axiosClient.get(`/api/acl/get-acl-with-module/${moduleId}`),
  deleteRoleModule: (body) =>
    axiosClient.put("/api/acl/delete-role-module/", body),
  createRoleModule: (body) =>
    axiosClient.post("/api/acl/create-role-module/", body),
};

export default aclApis;
