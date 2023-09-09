import axiosClient from './axiosClient'

const contactApis = {
    getListContacts: (params) => axiosClient.get("/api/contract/", { params }),
    updateStatusContact: (payload) => axiosClient.put("/api/contract/update-contract", payload),
};

export default contactApis
